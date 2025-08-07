import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'
import type { User } from '@supabase/supabase-js'

interface Lugar {
  id: string
  nombre: string
  descripcion: string
  municipio: string
  url_imagen: string
  latitud?: number
  longitud?: number
}

interface PerfilUsuario {
  nombre?: string
  foto_url?: string
}

interface Comentario {
  id: string
  lugar_id: string
  usuario_id: string
  comentario: string
  fecha: string
  perfil_usuario?: PerfilUsuario
}

export default function LugarDetalle() {
  const router = useRouter()
  const { id } = router.query

  const [lugar, setLugar] = useState<Lugar | null>(null)
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const obtenerUsuario = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) setUser(session.user)
    }
    obtenerUsuario()
  }, [])

  useEffect(() => {
    if (id && typeof id === 'string') {
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
    if (!nuevoComentario.trim() || !user || !id) return
    
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
          perfil_usuario:perfil_usuario!fk_usuario_perfil (
            nombre,
            foto_url
          )
        `)
        .eq('lugar_id', id)
        .order('fecha', { ascending: false })
      setComentarios(nuevos || [])
    }
  }

  if (!lugar) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-xl text-slate-600 dark:text-slate-300 font-medium">Cargando lugar...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 transition-all duration-700">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Header del lugar con diseño más moderno */}
        <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden mb-8 border border-white/20 dark:border-slate-700/50 hover:shadow-3xl transition-all duration-700">
          <div className="relative overflow-hidden">
            <Image
              src={lugar.url_imagen} 
              alt={lugar.nombre}
              width={1200}
              height={400}
              className="w-full h-72 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-2xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {lugar.nombre}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/30">
                  <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white font-semibold text-sm">
                    {lugar.municipio}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed font-medium">
                {lugar.descripcion}
              </p>
            </div>

            {lugar.latitud && lugar.longitud && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${lugar.latitud},${lugar.longitud}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-400 dark:hover:to-teal-400 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
              >
                <div className="p-2 bg-white/20 rounded-xl group-hover/btn:bg-white/30 transition-colors duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg">¿Cómo llegar?</span>
                <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Sección de comentarios rediseñada */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white