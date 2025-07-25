import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'

const places = [
  // Jalpan de Serra
  {
    id: '1',
    url: '/jalpan.jpg',
    name: 'Misión de Santiago de Jalpan de Serra',
    description: 'Patrimonio Mundial UNESCO y centro histórico de la Sierra Gorda.',
    municipio: 'Jalpan de Serra'
  },
  {
    id: '2',
    url: '/museo_historico.jpg',
    name: 'Museo Histórico de la Sierra Gorda',
    description: 'Exhibiciones culturales e históricas de la región.',
    municipio: 'Jalpan de Serra'
  },
  {
    id: '3',
    url: '/tancama.jpg',
    name: 'Zona Arqueológica de Tancama',
    description: 'Sitio arqueológico con vestigios de culturas prehispánicas.',
    municipio: 'Jalpan de Serra'
  },
  {
    id: '4',
    url: '/puentede_dios.jpeg',
    name: 'Puente de Dios / Presa Río Adentro',
    description: 'Paraje natural con pozas cristalinas y cascadas escondidas.',
    municipio: 'Jalpan de Serra'
  },
  
  // Arroyo Seco
  {
    id: '5',
    url: '/las_adjuntas.jpg',
    name: 'Paraje Las Adjuntas (Ayutla)',
    description: 'Paisaje natural espectacular con ríos y montañas.',
    municipio: 'Arroyo Seco'
  },
  {
    id: '6',
    url: '/conca.jpg',
    name: 'Misión de San Miguel Concá',
    description: 'Arquitectura barroca en un entorno cultural y natural.',
    municipio: 'Arroyo Seco'
  },
  {
    id: '7',
    url: '/rio_santa_maria.jpg',
    name: 'Río Santa María en kayak',
    description: 'Aventura acuática navegando por aguas cristalinas.',
    municipio: 'Arroyo Seco'
  },
  {
    id: '8',
    url: '/sotano_barro.jpg',
    name: 'Sótano del Barro',
    description: 'Hábitat de guacamayas verdes y aventura para exploradores.',
    municipio: 'Arroyo Seco'
  },
  
  // Landa de Matamoros
  {
    id: '9',
    url: '/landa_agua.jpg',
    name: 'Misión de Santa María del Agua de Landa de Matamoros',
    description: 'Misión franciscana con arquitectura colonial excepcional.',
    municipio: 'Landa de Matamoros'
  },
  {
    id: '10',
    url: '/tilaco.jpg',
    name: 'Misión de San Francisco de Tilaco',
    description: 'Joya arquitectónica con fachada barroca única.',
    municipio: 'Landa de Matamoros'
  },
  {
    id: '11',
    url: '/fosiles.webp',
    name: 'Zona de fósiles',
    description: 'Sitio paleontológico con vestigios de vida prehistórica.',
    municipio: 'Landa de Matamoros'
  },
  
  // Pinal de Amoles
  {
    id: '12',
    url: '/cuatro_palos.webp',
    name: 'Mirador Cuatro Palos',
    description: 'Vista épica entre montañas y nubes en Pinal de Amoles.',
    municipio: 'Pinal de Amoles'
  },
  {
    id: '13',
    url: '/rio_escanela.webp',
    name: 'Río Escanela y Puente de Dios',
    description: 'Sendero con ríos, puentes colgantes y cascadas.',
    municipio: 'Pinal de Amoles'
  },
  {
    id: '14',
    url: '/bucareli.jpeg',
    name: 'Exconvento / Misión de Bucareli',
    description: 'Ruinas históricas con arquitectura colonial y vistas panorámicas.',
    municipio: 'Pinal de Amoles'
  },
  {
    id: '15',
    url: '/sanjosepinal.jpg',
    name: 'Templo de San José',
    description: 'Templo colonial con arte sacro y arquitectura tradicional.',
    municipio: 'Pinal de Amoles'
  },
  {
    id: '16',
    url: '/mirador_cristal.jpeg',
    name: 'Mirador de Cristal',
    description: 'Plataforma de cristal con vistas espectaculares de la sierra.',
    municipio: 'Pinal de Amoles'
  }
]

const municipios = ['Todos', 'Jalpan de Serra', 'Landa de Matamoros', 'Arroyo Seco', 'Pinal de Amoles']

// Componente de carrusel infinito verdadero
const InfiniteCarousel = ({ places, speed = 30 }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [currentX, setCurrentX] = useState(0)
  const carouselRef = useRef(null)
  const animationRef = useRef(null)
  
  // Crear múltiples copias para efecto infinito real
  const itemWidth = 300 // 280px + 20px gap
  const duplicatedPlaces = [...places, ...places, ...places, ...places]
  
  useEffect(() => {
    const animate = () => {
      if (!isHovered) {
        setCurrentX(prev => {
          const newX = prev - 2 // Velocidad de desplazamiento
          const resetPoint = -itemWidth * places.length
          
          // Resetear cuando hayamos movido exactamente el ancho de un conjunto
          if (newX <= resetPoint) {
            return 0
          }
          return newX
        })
      }
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isHovered, places.length, itemWidth])
  
  return (
    <div 
      ref={carouselRef}
      style={{ 
        overflow: 'hidden', 
        marginBottom: '2rem',
        position: 'relative'
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          transform: `translateX(${currentX}px)`,
          transition: 'none' // Sin transición para movimiento suave
        }}
      >
        {duplicatedPlaces.map((place, index) => (
          <div
            key={`${place.id}-${index}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
              console.log('Clicked on:', place.name)
            }}
            style={{
              minWidth: '280px',
              height: '200px',
              background: '#fff',
              borderRadius: '1rem',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
              flexShrink: 0,
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.3s ease',
              zIndex: isHovered ? 10 : 1
            }}
          >
            <img
              src={place.url}
              alt={place.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #004e92, #00a86b)'
                e.target.style.display = 'flex'
                e.target.style.alignItems = 'center'
                e.target.style.justifyContent = 'center'
                e.target.style.color = 'white'
                e.target.style.fontSize = '1.2rem'
                e.target.innerHTML = '📸'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              padding: '2rem 1rem 1rem',
              color: 'white'
            }}>
              <div style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'rgba(0,168,107,0.9)',
                color: 'white',
                padding: '0.3rem 0.7rem',
                borderRadius: '0.5rem',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                {place.municipio}
              </div>
              <h3 style={{
                margin: 0,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
              }}>
                {place.name}
              </h3>
              <p style={{
                margin: '0.3rem 0 0 0',
                fontSize: '0.85rem',
                opacity: '0.9',
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
              }}>
                {place.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [selectedMunicipio, setSelectedMunicipio] = useState('Todos')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Verificar autenticación al cargar el componente
 // Asegúrate de tener esta línea al inicio

useEffect(() => {
  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      setIsAuthenticated(true)
      setUser(session.user)
    }
  }

  checkAuth()

  // Suscribirse a cambios en sesión
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    setIsAuthenticated(!!session?.user)
    setUser(session?.user ?? null)
  })

  return () => {
    listener.subscription.unsubscribe()
  }
}, [])


const handleLogout = async () => {
  await supabase.auth.signOut()
  setIsAuthenticated(false)
  setUser(null)
  setShowUserMenu(false)
}


  const filtered = places.filter(p => {
    const matchesSearch = `${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase())
    const matchesMunicipio = selectedMunicipio === 'Todos' || p.municipio === selectedMunicipio
    return matchesSearch && matchesMunicipio
  })

  // Dividir lugares para diferentes carruseles
  const firstRowPlaces = places.slice(0, 10)
  const secondRowPlaces = places.slice(10, 16)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header mejorado */}
      <header style={{ 
        background: 'linear-gradient(135deg, #004e92, #00a86b)', 
        padding: '1rem 2rem',
        color: 'white', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            borderRadius: '50%', 
            overflow: 'hidden',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img 
              src="logo.jpg" 
              alt="Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', letterSpacing: '2px' }}>CULTOUR</h2>
        </div>

        <nav>
          <ul style={{
            display: 'flex',
            gap: '2rem',
            listStyle: 'none',
            margin: 0,
            padding: 0
          }}>
            {[
              { name: 'Inicio', href: '/' },
              { name: 'Recomendaciones', href: '/Recomendaciones' },
              { name: 'Nosotros', href: '/osotros' },
              { name: 'Contacto', href: '/contacto' }
            ].map(item => (
              <li key={item.name}>
                <a
                  href={item.href}
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem'
                  }}
                  onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sección de autenticación */}
        <div style={{ position: 'relative' }}>
          {!isAuthenticated ? (
            <button
              onClick={() => router.push('/auth/login')}
              style={{
                backgroundColor: 'white',
                color: '#004e92',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginLeft: '1rem'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
            >
              Iniciar sesión
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Avatar del usuario */}
              <div
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  background: 'rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                <div style={{
                  width: '35px',
                  height: '35px',
                  borderRadius: '50%',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>
                  👤
                </div>
                <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                  {user?.email?.split('@')[0] || 'Usuario'}{user?.name || 'Usuario'}
                  
                </span>
                <span style={{ fontSize: '0.8rem' }}>
                  {showUserMenu ? '▲' : '▼'}
                </span>
              </div>

              {/* Menú desplegable del usuario */}
              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  background: 'white',
                  borderRadius: '0.8rem',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  minWidth: '200px',
                  overflow: 'hidden',
                  zIndex: 1000
                }}>
                  <div style={{
                    padding: '1rem',
                    borderBottom: '1px solid #eee',
                    color: '#333'
                  }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                      {user?.name || 'Usuario'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      {user?.email || 'usuario@email.com'}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      // Aquí puedes agregar navegación al perfil
                      console.log('Ir al perfil')
                    }}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      border: 'none',
                      background: 'transparent',
                      color: '#333',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    👤 Mi Perfil
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      // Aquí puedes agregar navegación a favoritos
                      console.log('Ir a favoritos')
                    }}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      border: 'none',
                      background: 'transparent',
                      color: '#333',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    ❤️ Mis Favoritos
                  </button>
                  
                  <div style={{ borderTop: '1px solid #eee' }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        border: 'none',
                        background: 'transparent',
                        color: '#dc3545',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      🚪 Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <main style={{ 
        flex: 1,
        padding: '1.5rem 1rem', 
        background: 'linear-gradient(to bottom, #e0f7fa, #e6ffe9)',
        minHeight: '100vh'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{ textAlign: 'center', marginBottom: '2rem' }}
          >
            <h1 style={{ 
              fontSize: '2.8rem', 
              color: '#004e92', 
              margin: '0 0 0.5rem 0',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              lineHeight: '1.2'
            }}>
              Descubre la Sierra Gorda
            </h1>
            <h2 style={{ 
              fontSize: '1.6rem', 
              color: '#00a86b', 
              margin: '0 0 1rem 0',
              fontWeight: '300',
              letterSpacing: '1px'
            }}>
              Queretana
            </h2>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#555', 
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Vive la cultura, descubre la sierra y conecta con la naturaleza más espectacular de México
            </p>
          </div>

          {/* Buscador mejorado y responsive */}
          <div style={{ 
            textAlign: 'center', 
            margin: '1.5rem auto 2.5rem auto', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: '1rem'
          }}>
            <input
              type="text"
              placeholder="Ej: Pinal de Amoles, Jalpan, Mirador Cuatro Palos…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ 
                background: 'white',
                color: '#333',
                padding: '1rem 1.2rem', 
                width: '90%',
                maxWidth: '400px',
                borderRadius: '2rem',
                border: '2px solid #ddd',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease'
              }}
              onFocus={e => {
                e.target.style.borderColor = '#004e92'
                e.target.style.boxShadow = '0 4px 20px rgba(0,78,146,0.2)'
              }}
              onBlur={e => {
                e.target.style.borderColor = '#ddd'
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'
              }}
            />
            <select
              value={selectedMunicipio}
              onChange={e => setSelectedMunicipio(e.target.value)}
              style={{ 
                width: '90%',
                maxWidth: '300px',
                padding: '0.8rem 1.2rem', 
                borderRadius: '1rem',
                border: '2px solid #ddd',
                fontSize: '1rem',
                background: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}
            >
              {municipios.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Carruseles infinitos mejorados */}
          <section style={{ marginBottom: '4rem' }}>
            <div>
              <h2 style={{ 
                fontSize: '2rem', 
                color: '#004e92', 
                margin: '0 0 1.5rem 0',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                🏛️ Lugares Destacados
              </h2>
              <InfiniteCarousel places={firstRowPlaces} speed={60} />
            </div>
            
            <div>
              <h2 style={{ 
                fontSize: '2rem', 
                color: '#00a86b', 
                margin: '2rem 0 1.5rem 0',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                🌿 Naturaleza y Aventura
              </h2>
              <InfiniteCarousel places={secondRowPlaces} speed={50} />
            </div>
          </section>

          {/* Agrupación por municipio */}
          {municipios.filter(m => m !== 'Todos').map(muni => {
            const lugaresMunicipio = filtered.filter(p => p.municipio === muni)

            if (lugaresMunicipio.length === 0) return null

            return (
              <section key={muni} style={{ marginBottom: '4rem' }}>
                <h2
                  style={{
                    fontSize: '1.8rem',
                    color: '#004e92',
                    marginBottom: '1rem',
                    borderBottom: '3px solid #00a86b',
                    paddingBottom: '0.5rem'
                  }}
                >
                  {muni}
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '2rem'
                }}>
                  {lugaresMunicipio.map(place => (
                    <div
                      key={place.id}
                      style={{
                        background: '#fff',
                        borderRadius: '1.5rem',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1) translateY(0px)'
                      }}
                    >
                      <div style={{ position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={place.url}
                          alt={place.name}
                          style={{
                            width: '100%',
                            height: '220px',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                          }}
                          onError={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #004e92, #00a86b)'
                            e.target.style.display = 'flex'
                            e.target.style.alignItems = 'center'
                            e.target.style.justifyContent = 'center'
                            e.target.style.color = 'white'
                            e.target.style.fontSize = '2rem'
                            e.target.innerHTML = '📸'
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: 'rgba(0,78,146,0.8)',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '1rem',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}>
                          {place.municipio}
                        </div>
                      </div>
                      <div style={{ padding: '1.5rem 2rem' }}>
                        <h3 style={{
                          color: '#004e92',
                          margin: '0 0 0.5rem 0',
                          fontSize: '1.4rem',
                          fontWeight: 'bold'
                        }}>
                          {place.name}
                        </h3>
                        <p style={{
                          color: '#666',
                          margin: 0,
                          fontSize: '1rem',
                          lineHeight: '1.5'
                        }}>
                          {place.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </main>

      <footer style={{ 
        background: 'linear-gradient(135deg, #004e92, #00a86b)', 
        color: 'white', 
        textAlign: 'center', 
        padding: '2rem',
        marginTop: 'auto'
      }}>
        <p style={{ 
          margin: 0, 
          fontSize: '1.1rem',
          fontWeight: '300'
        }}>
          © 2025 Cultour. Todos los derechos reservados.
        </p>
        <p style={{ 
          margin: '0.5rem 0 0 0', 
          fontSize: '0.9rem',
          opacity: '0.8'
        }}>
          Vive la cultura, descubre la sierra
        </p>
      </footer>
    </div>
  )
}