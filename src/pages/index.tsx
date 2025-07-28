import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'

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
              console.log('Clicked on:', place.nombre)
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
              src={place.url_imagen}
              alt={place.nombre}
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
                {place.nombre}
              </h3>
              <p style={{
                margin: '0.3rem 0 0 0',
                fontSize: '0.85rem',
                opacity: '0.9',
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
              }}>
                {place.descripcion}
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
  const [places, setPlaces] = useState([]) // Estado para los lugares
  const [isLoading, setIsLoading] = useState(true) // Estado de carga

  // Cargar lugares desde Supabase
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from('lugares')
          .select('id, nombre, descripcion, municipio, url_imagen, destacado')
        
        if (error) {
          console.error('Error al obtener lugares:', error)
          console.error('Detalles del error:', error.message)
        } else {
          console.log('Datos obtenidos:', data) // Para debug
          setPlaces(data || [])
        }
      } catch (error) {
        console.error('Error al conectar con Supabase:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlaces()
  }, [])

  // Verificar autenticación al cargar el componente
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

  // Filtrar lugares
  const filtered = places.filter(p => {
    const searchText = `${p.nombre || ''} ${p.descripcion || ''}`.toLowerCase()
    const matchesSearch = searchText.includes(search.toLowerCase())
    const matchesMunicipio = selectedMunicipio === 'Todos' || p.municipio === selectedMunicipio
    return matchesSearch && matchesMunicipio
  })

  const destacados = places.filter(p => p.destacado === true)
  const noDestacados = places.filter(p => p.destacado === false)

  const firstRowPlaces = destacados
  const secondRowPlaces = noDestacados

  // Mostrar loading mientras se cargan los lugares
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, #e0f7fa, #e6ffe9)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #004e92',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#004e92', fontSize: '1.2rem' }}>Cargando lugares...</p>
        </div>
      </div>
    )
  }

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
              { name: 'Nosotros', href: '/nosotros' },
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
                  {user?.email?.split('@')[0] || user?.name || 'Usuario'}
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
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
          {places.length > 0 && (
            <section style={{ marginBottom: '4rem' }}>
              {firstRowPlaces.length > 0 && (
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
              )}
              
              {secondRowPlaces.length > 0 && (
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
              )}
            </section>
          )}

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
                          src={place.url_imagen}
                          alt={place.nombre}
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
                          {place.nombre}
                        </h3>
                        <p style={{
                          color: '#666',
                          margin: 0,
                          fontSize: '1rem',
                          lineHeight: '1.5'
                        }}>
                          {place.descripcion}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}

          {/* Mensaje cuando no hay lugares */}
          {places.length === 0 && !isLoading && (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#666'
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                No se encontraron lugares
              </h3>
              <p>Verifica tu conexión a Supabase o contacta al administrador.</p>
              <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: '#999' }}>
                Revisa la consola del navegador para más detalles del error.
              </p>
            </div>
          )}

          {/* Mensaje cuando hay lugares pero no coinciden con el filtro */}
          {places.length > 0 && filtered.length === 0 && !isLoading && (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#666'
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                No se encontraron lugares que coincidan con tu búsqueda
              </h3>
              <p>Intenta con otros términos de búsqueda o selecciona "Todos" los municipios.</p>
            </div>
          )}
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

      {/* CSS para la animación de loading */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}