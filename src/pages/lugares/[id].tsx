import { useRouter } from 'next/router'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'
import type { User } from '@supabase/supabase-js'
import Head from 'next/head'

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
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null)

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    const target = e.target as HTMLImageElement
    target.style.background = 'linear-gradient(135deg, #004e92, #00a86b)'
    target.style.display = 'flex'
    target.style.alignItems = 'center'
    target.style.justifyContent = 'center'
    target.style.color = 'white'
    target.style.fontSize = '2rem'
    target.innerHTML = '📸'
  }

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    const img = e.target as HTMLImageElement
    img.style.display = 'none'
    const parent = img.parentElement
    if (parent) {
      const fallback = parent.querySelector('.avatar-fallback') as HTMLElement
      if (fallback) {
        fallback.style.display = 'flex'
      }
    }
  }

  const buildProfileImageUrl = (foto_url: string | null | undefined): string | null => {
    if (!foto_url) return null
    
    if (foto_url.startsWith('http')) {
      return foto_url
    } else {
      return supabase.storage
        .from('imagenes-perfil')
        .getPublicUrl(foto_url).data.publicUrl
    }
  }

  const fetchUserProfileImage = useCallback(async (userId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('perfil_usuario')
        .select('foto_url')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile image:', error)
        return
      }

      if (data?.foto_url) {
        const imageUrl = buildProfileImageUrl(data.foto_url)
        setUserProfileImage(imageUrl)
      } else {
        setUserProfileImage(null)
      }
    } catch (err) {
      console.error('Error fetching profile image:', err)
      setUserProfileImage(null)
    }
  }, [])

  useEffect(() => {
    const obtenerUsuario = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        fetchUserProfileImage(session.user.id)
      }
    }
    obtenerUsuario()
  }, [fetchUserProfileImage])

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

        if (error) {
          console.error("Error al obtener comentarios:", error)
        } else {
          setComentarios(data || [])
        }
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
    <>
      {/* 🎯 SEO específico de este lugar */}
      <Head>
        <title>{lugar.nombre} - {lugar.municipio} | Cultour</title>
        <meta name="description" content={`Descubre ${lugar.nombre} en ${lugar.municipio}, Sierra Gorda, Querétaro. ${lugar.descripcion.substring(0, 150)}...`} />
        <meta name="keywords" content={`${lugar.nombre}, ${lugar.municipio}, Sierra Gorda, Querétaro, turismo, ecoturismo`} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://cultour-web-fpd3.vercel.app/lugares/${id}`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${lugar.nombre} - ${lugar.municipio} | Cultour`} />
        <meta property="og:description" content={lugar.descripcion} />
        <meta property="og:url" content={`https://cultour-web-fpd3.vercel.app/lugares/${id}`} />
        <meta property="og:image" content={lugar.url_imagen} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${lugar.nombre} en ${lugar.municipio}, Sierra Gorda Querétaro`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${lugar.nombre} - ${lugar.municipio}`} />
        <meta name="twitter:description" content={lugar.descripcion} />
        <meta name="twitter:image" content={lugar.url_imagen} />
        
        {/* Geo tags */}
        <meta name="geo.region" content="MX-QUE" />
        <meta name="geo.placename" content={`${lugar.nombre}, ${lugar.municipio}`} />
        {lugar.latitud && lugar.longitud && (
          <meta name="geo.position" content={`${lugar.latitud};${lugar.longitud}`} />
        )}
        
        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Inicio',
                  item: 'https://cultour-web-fpd3.vercel.app',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Lugares',
                  item: 'https://cultour-web-fpd3.vercel.app/#lugares',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: lugar.nombre,
                  item: `https://cultour-web-fpd3.vercel.app/lugares/${id}`,
                },
              ],
            }),
          }}
        />
        
        {/* TouristAttraction Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TouristAttraction',
              name: lugar.nombre,
              description: lugar.descripcion,
              image: lugar.url_imagen,
              address: {
                '@type': 'PostalAddress',
                addressLocality: lugar.municipio,
                addressRegion: 'Querétaro',
                addressCountry: 'MX',
              },
              ...(lugar.latitud && lugar.longitud && {
                geo: {
                  '@type': 'GeoCoordinates',
                  latitude: lugar.latitud,
                  longitude: lugar.longitud,
                },
              }),
              touristType: ['Eco-turista', 'Aventurero', 'Familia'],
              isAccessibleForFree: true,
            }),
          }}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 transition-all duration-700">
        <div className="max-w-5xl mx-auto px-4 py-8">
          
          {/* Header del lugar */}
          <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden mb-8 border border-white/20 dark:border-slate-700/50 hover:shadow-3xl transition-all duration-700">
            <div className="relative overflow-hidden">
              <Image
                src={lugar.url_imagen} 
                alt={lugar.nombre}
                width={1200}
                height={400}
                className="w-full h-72 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-2xl">
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
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg">¿Cómo llegar?</span>
                </a>
              )}
            </div>
          </div>

          {/* Sección de comentarios */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
            
            <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-teal-500/10 p-8 border-b border-slate-200/50">
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
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-full font-bold text-lg shadow-lg">
                  {comentarios.length}
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="space-y-6 mb-8">
                {comentarios.length > 0 ? (
                  comentarios.map((c) => {
                    const avatarUrl = buildProfileImageUrl(c.perfil_usuario?.foto_url)
                    
                    return (
                      <div 
                        key={c.id} 
                        className="bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-700/50 dark:to-slate-600/30 rounded-2xl p-6 border border-slate-200/50"
                      >
                        <div className="flex items-start gap-5">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                            {avatarUrl ? (
                              <Image
                                src={avatarUrl}
                                alt="avatar"
                                width={56}
                                height={56}
                                className="w-full h-full object-cover"
                                onError={handleAvatarError}
                              />
                            ) : (
                              <div className="text-blue-600 dark:text-blue-400 text-xl font-bold">
                                👤
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                                {c.perfil_usuario?.nombre?.trim() || 'Viajero Anónimo'}
                              </h4>
                              <span className="text-sm text-slate-600 dark:text-slate-300">
                                {new Date(c.fecha).toLocaleDateString('es-MX')}
                              </span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300">
                              {c.comentario}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-16">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      Aún no hay comentarios
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      ¡Sé el primero en compartir tu experiencia!
                    </p>
                  </div>
                )}
              </div>

              {user ? (
                <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-slate-700/30 dark:to-slate-600/30 rounded-2xl p-6">
                  <div className="flex items-start gap-4 mb-4">
                    {/* 👤 AVATAR DEL USUARIO LOGUEADO */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center flex-shrink-0">
                      {userProfileImage ? (
                        <Image
                          src={userProfileImage}
                          alt="Tu foto de perfil"
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          onError={handleAvatarError}
                        />
                      ) : (
                        <div className="text-blue-600 dark:text-blue-400 text-lg font-bold">
                          👤
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={nuevoComentario}
                        onChange={e => setNuevoComentario(e.target.value)}
                        placeholder="Comparte tu experiencia..."
                        className="w-full px-5 py-4 border-2 border-slate-200 dark:border-slate-600 bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white rounded-2xl resize-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={enviarComentario}
                      disabled={!nuevoComentario.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg disabled:cursor-not-allowed"
                    >
                      Publicar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    ¡Únete a la conversación!
                  </p>
                  <button
                    onClick={() => router.push('/auth/login')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl"
                  >
                    Iniciar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}