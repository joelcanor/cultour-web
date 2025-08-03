import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LugarDetalle() {
  const router = useRouter()
  const { id } = router.query

  const [lugar, setLugar] = useState(null)
  const [comentarios, setComentarios] = useState([])
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const obtenerUsuario = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) setUser(session.user)
    }
    obtenerUsuario()
  }, [])

  useEffect(() => {
    if (id) {
      const fetchLugar = async () => {
        const { data } = await supabase
          .from('lugares')
          .select('*')
          .eq('id', id)
          .single()
        setLugar(data)
      }

      const fetchComentarios = async () => {
        const { data, error } = await supabase
          .from('comentarios')
         .select(`
  *,
  perfil_usuario:perfil_usuario!fk_usuario_perfil (
    nombre,
    foto_url
  )
`)

          .eq('lugar_id', id)
          .order('fecha', { ascending: false })

        if (error) console.error("Error al obtener comentarios:", error)
        setComentarios(data || [])
      }

      fetchLugar()
      fetchComentarios()
    }
  }, [id])

  const enviarComentario = async () => {
    if (!nuevoComentario.trim()) return
    const { error } = await supabase.from('comentarios').insert({
      lugar_id: id,
      usuario_id: user.id,
      comentario: nuevoComentario
    })
    if (!error) {
      setNuevoComentario('')
      const { data: nuevos } = await supabase
        .from('comentarios')
        .select(`
          *,
          perfil_usuario (
            nombre,
            foto_url
          )
        `)
        .eq('lugar_id', id)
        .order('fecha', { ascending: false })
      setComentarios(nuevos || [])
    }
  }

  if (!lugar) return <p>Cargando...</p>

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h1>{lugar.nombre}</h1>
      <img src={lugar.url_imagen} alt={lugar.nombre} style={{ width: '100%', borderRadius: '1rem' }} />
      <p style={{ marginTop: '1rem' }}>{lugar.descripcion}</p>
      <p><strong>Municipio:</strong> {lugar.municipio}</p>

      {lugar.latitud && lugar.longitud && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${lugar.latitud},${lugar.longitud}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: '1rem',
            backgroundColor: '#00a86b',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            textDecoration: 'none'
          }}
        >
          ¿Cómo llegar?
        </a>
      )}

      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ color: '#004e92' }}>💬 Comentarios</h3>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {comentarios.map(c => (
            <li key={c.id} style={{
              background: '#f9f9f9',
              borderRadius: '1rem',
              padding: '1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <img
                src={c.perfil_usuario?.foto_url || '/default-avatar.png'}
                alt="avatar"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #00a86b'
                }}
              />
              <div>
                <p style={{ margin: 0, fontWeight: 'bold' }}>
                  {c.perfil_usuario?.nombre?.trim()
                    ? c.perfil_usuario.nombre
                    : c.usuario_id?.substring(0, 8) || 'Usuario'}
                </p>
                <p style={{ margin: '0.3rem 0' }}>{c.comentario}</p>
                <span style={{ fontSize: '0.75rem', color: '#666' }}>
                  {new Date(c.fecha).toLocaleString()}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '1.5rem'
          }}>
            <input
              type="text"
              value={nuevoComentario}
              onChange={e => setNuevoComentario(e.target.value)}
              placeholder="Escribe tu comentario..."
              style={{
                flex: 1,
                padding: '0.7rem 1rem',
                borderRadius: '2rem',
                border: '1px solid #ccc',
                outline: 'none'
              }}
            />
            <button
              onClick={enviarComentario}
              style={{
                backgroundColor: '#00a86b',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                color: 'white',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
              title="Enviar"
            >
              ➤
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
