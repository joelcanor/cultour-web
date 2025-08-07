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
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden transition-all duration-500">
          
          {/* Header de comentarios */}
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-teal-500/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-teal-500/5 p-8 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                  Comentarios
                </h3>
                <p className="text-slate-600 dark:text-slate-400">Experiencias compartidas por viajeros</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-full font-bold text-lg shadow-lg">
                  {comentarios.length}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Lista de comentarios mejorada */}
            <div className="space-y-6 mb-8">
              {comentarios.length > 0 ? (
                comentarios.map((c, index) => (
                  <div 
                    key={c.id} 
                    className="group bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-700/50 dark:to-slate-600/30 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-600/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-500"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    <div className="flex items-start gap-5">
                      <div className="relative">
                        <Image
                          src={c.perfil_usuario?.foto_url || '/default-avatar.png'}
                          alt="avatar"
                          width={56}
                          height={56}
                          className="w-14 h-14 rounded-2xl object-cover border-3 border-gradient-to-r from-blue-400 to-purple-500 shadow-lg group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-700 shadow-sm"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="font-bold text-lg text-slate-900 dark:text-white truncate">
                            {c.perfil_usuario?.nombre?.trim()
                              ? c.perfil_usuario.nombre
                              : c.usuario_id?.substring(0, 8) || 'Viajero Anónimo'}
                          </h4>
                          <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-600/60 rounded-full px-3 py-1 backdrop-blur-sm">
                            <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                              {new Date(c.fecha).toLocaleDateString('es-MX', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="bg-white/50 dark:bg-slate-600/30 rounded-xl p-4 backdrop-blur-sm">
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            {c.comentario}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="relative mx-auto mb-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-slate-700 dark:to-slate-600 rounded-3xl flex items-center justify-center shadow-xl">
                      <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Aún no hay comentarios
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">
                    ¡Sé el primero en compartir tu experiencia en este increíble lugar!
                  </p>
                </div>
              )}
            </div>

            {/* Input para nuevo comentario mejorado */}
            {user ? (
              <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-slate-700/30 dark:to-slate-600/30 rounded-2xl p-6 border-t-2 border-gradient-to-r from-blue-200 to-purple-200 dark:border-slate-600">
                <div className="flex gap-5">
                  <div className="relative">
                    <Image
                      src="/default-avatar.png"
                      alt="Tu avatar"
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-300 dark:border-blue-500 shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-700"></div>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={nuevoComentario}
                      onChange={e => setNuevoComentario(e.target.value)}
                      placeholder="Comparte tu experiencia en este increíble lugar... ✨"
                      className="w-full px-5 py-4 border-2 border-slate-200 dark:border-slate-600 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-900 dark:text-white rounded-2xl resize-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-lg placeholder-slate-500 dark:placeholder-slate-400 font-medium"
                      rows={4}
                    />
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {nuevoComentario.length}/500 caracteres
                      </span>
                      <button
                        onClick={enviarComentario}
                        disabled={!nuevoComentario.trim()}
                        className="group/btn inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 dark:disabled:from-slate-600 dark:disabled:to-slate-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:hover:transform-none"
                      >
                        <div className="p-1 bg-white/20 rounded-lg group-hover/btn:bg-white/30 transition-colors duration-300">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                          </svg>
                        </div>
                        Publicar Comentario
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-slate-700/30 dark:to-slate-600/30 rounded-2xl p-8 text-center border-t-2 border-gradient-to-r from-blue-200 to-purple-200 dark:border-slate-600">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    ¡Únete a la conversación!
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">
                    Inicia sesión para compartir tu experiencia y conectar con otros viajeros
                  </p>
                </div>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="group/btn inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
                >
                  <div className="p-2 bg-white/20 rounded-xl group-hover/btn:bg-white/30 transition-colors duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg">Iniciar Sesión</span>
                  <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}