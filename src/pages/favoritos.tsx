import Layout from '@/components/Layout'
import { useEffect, useState, ChangeEvent, MouseEvent } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import Image from 'next/image'
import type { User } from '@supabase/supabase-js'

// Definir los tipos
interface Lugar {
  id: string
  nombre: string
  descripcion: string
  municipio: string
  url_imagen: string
}

interface FavoritosProps {
  user: User | null
  isAuthenticated: boolean
  showUserMenu: boolean
  setShowUserMenu: (value: boolean) => void
  handleLogout: () => void
}

export default function Favoritos(props: FavoritosProps) {
  const { user } = props
  const [lugares, setLugares] = useState<Lugar[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [filtro, setFiltro] = useState<string>('')
  const [sortBy, setSortBy] = useState<'nombre' | 'municipio'>('nombre')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchFavoritos = async (): Promise<void> => {
      setLoading(true)
      
      try {
        console.log('=== INICIANDO FETCH DE FAVORITOS ===')
        console.log('Usuario ID:', user.id)
        
        // MÉTODO SIMPLIFICADO - Igual que en tu API de recomendaciones
        
        // 1. Primero obtenemos los IDs de los lugares favoritos
        const { data: favoritosData, error: favoritosError } = await supabase
          .from('favoritos')
          .select('lugar_id')
          .eq('usuario_id', user.id)

        console.log('Paso 1 - Favoritos obtenidos:', favoritosData)
        console.log('Error en favoritos:', favoritosError)

        if (favoritosError) {
          console.error('Error al obtener favoritos:', favoritosError)
          setLugares([])
          return
        }

        // Si no hay favoritos, establecer array vacío
        if (!favoritosData || favoritosData.length === 0) {
          console.log('No se encontraron favoritos para este usuario')
          setLugares([])
          return
        }

        // 2. Extraer los IDs de los lugares
        const lugarIds = favoritosData.map(fav => fav.lugar_id)
        console.log('Paso 2 - IDs de lugares:', lugarIds)

        // 3. Obtener la información completa de los lugares
        const { data: lugaresData, error: lugaresError } = await supabase
          .from('lugares')
          .select('id, nombre, descripcion, municipio, url_imagen')
          .in('id', lugarIds)

        console.log('Paso 3 - Lugares obtenidos:', lugaresData)
        console.log('Error en lugares:', lugaresError)

        if (lugaresError) {
          console.error('Error al obtener lugares:', lugaresError)
          setLugares([])
          return
        }

        // 4. Establecer los lugares en el estado
        if (lugaresData) {
          console.log('Paso 4 - Estableciendo lugares en estado:', lugaresData.length, 'lugares')
          setLugares(lugaresData)
        } else {
          console.log('No se obtuvieron datos de lugares')
          setLugares([])
        }

      } catch (err) {
        console.error('Error general al cargar favoritos:', err)
        setLugares([])
      } finally {
        setLoading(false)
        console.log('=== FETCH DE FAVORITOS COMPLETADO ===')
      }
    }

    fetchFavoritos()
  }, [user])

  const removeFavorito = async (lugarId: string): Promise<void> => {
    if (!user) return
    
    try {
      console.log('Eliminando favorito - Usuario:', user.id, 'Lugar:', lugarId)
      
      const { error } = await supabase
        .from('favoritos')
        .delete()
        .eq('usuario_id', user.id)
        .eq('lugar_id', lugarId)

      if (error) {
        console.error('Error al eliminar favorito:', error)
        alert('Error al eliminar el favorito. Inténtalo de nuevo.')
      } else {
        console.log('Favorito eliminado exitosamente')
        // Actualizar el estado local eliminando el lugar
        setLugares(prevLugares => prevLugares.filter(lugar => lugar.id !== lugarId))
      }
    } catch (err) {
      console.error('Error al eliminar favorito:', err)
      alert('Error de conexión. Inténtalo de nuevo.')
    }
  }

  // Filtrar y ordenar lugares
  const lugaresFiltrados = lugares
    .filter(lugar => 
      lugar.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      lugar.municipio?.toLowerCase().includes(filtro.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'nombre') return a.nombre.localeCompare(b.nombre)
      if (sortBy === 'municipio') return (a.municipio || '').localeCompare(b.municipio || '')
      return 0
    })

  console.log('Renderizando componente - Lugares:', lugares.length, 'Filtrados:', lugaresFiltrados.length)

  if (!user) {
    return (
      <Layout {...props}>
        <div style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
          borderRadius: '2rem',
          margin: '2rem',
          padding: '3rem'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ 
            color: '#004e92', 
            marginBottom: '1rem',
            fontSize: '1.8rem',
            fontWeight: 'bold'
          }}>
            Acceso Requerido
          </h2>
          <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1.1rem' }}>
            Debes iniciar sesión para ver tus lugares favoritos
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            style={{
              background: 'linear-gradient(135deg, #004e92, #00a86b)',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '2rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(0,78,146,0.3)'
            }}
            onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,78,146,0.4)'
            }}
            onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.transform = 'translateY(0px)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,78,146,0.3)'
            }}
          >
            Iniciar Sesión
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout {...props}>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header de la página */}
        <div style={{
          background: 'linear-gradient(135deg, #004e92, #00a86b)',
          borderRadius: '2rem',
          padding: '2.5rem',
          marginBottom: '2rem',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-5%',
            width: '150px',
            height: '150px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%'
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❤️</div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              margin: 0
            }}>
              Mis Lugares Favoritos
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              opacity: 0.9,
              margin: '0.5rem 0 0 0'
            }}>
              {lugares.length === 0 ? 'Aún no tienes lugares guardados' : `${lugares.length} lugar${lugares.length !== 1 ? 'es' : ''} guardado${lugares.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            color: '#666'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '5px solid #f3f3f3',
              borderTop: '5px solid #004e92',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1.5rem'
            }}></div>
            <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>Cargando tus lugares favoritos...</p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : lugares.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
            borderRadius: '2rem',
            color: '#666'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🗺️</div>
            <h3 style={{ 
              color: '#004e92', 
              marginBottom: '1rem',
              fontSize: '1.8rem',
              fontWeight: 'bold'
            }}>
              ¡Empieza a explorar!
            </h3>
            <p style={{ marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Descubre lugares increíbles en la Sierra Gorda Queretana<br />
              y guárdalos como favoritos para verlos aquí
            </p>
            <button
              onClick={() => router.push('/recomendaciones')}
              style={{
                background: 'linear-gradient(135deg, #004e92, #00a86b)',
                color: 'white',
                padding: '1rem 2rem',
                border: 'none',
                borderRadius: '2rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(0,78,146,0.3)'
              }}
              onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,78,146,0.4)'
              }}
              onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.transform = 'translateY(0px)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,78,146,0.3)'
              }}
            >
              Explorar Lugares
            </button>
          </div>
        ) : (
          <>
            {/* Controles de filtro y vista */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2rem',
              padding: '1.5rem',
              background: 'white',
              borderRadius: '1.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
                  <input
                    type="text"
                    placeholder="Buscar lugares..."
                    value={filtro}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFiltro(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem 0.8rem 2.5rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '2rem',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.style.borderColor = '#004e92'}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.style.borderColor = '#e9ecef'}
                  />
                  <span style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#666',
                    fontSize: '1.1rem'
                  }}>
                    🔍
                  </span>
                </div>

                <select
                  value={sortBy}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as 'nombre' | 'municipio')}
                  style={{
                    padding: '0.8rem 1rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '1rem',
                    fontSize: '1rem',
                    outline: 'none',
                    cursor: 'pointer',
                    background: 'white'
                  }}
                >
                  <option value="nombre">Ordenar por nombre</option>
                  <option value="municipio">Ordenar por municipio</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '0.8rem',
                    border: 'none',
                    borderRadius: '1rem',
                    cursor: 'pointer',
                    background: viewMode === 'grid' ? '#004e92' : '#f8f9fa',
                    color: viewMode === 'grid' ? 'white' : '#666',
                    transition: 'all 0.3s ease'
                  }}
                  title="Vista en cuadrícula"
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '0.8rem',
                    border: 'none',
                    borderRadius: '1rem',
                    cursor: 'pointer',
                    background: viewMode === 'list' ? '#004e92' : '#f8f9fa',
                    color: viewMode === 'list' ? 'white' : '#666',
                    transition: 'all 0.3s ease'
                  }}
                  title="Vista en lista"
                >
                  ☰
                </button>
              </div>
            </div>

            {/* Grid o Lista de lugares */}
            <div style={{
              display: viewMode === 'grid' ? 'grid' : 'flex',
              flexDirection: viewMode === 'list' ? 'column' : undefined,
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fit, minmax(320px, 1fr))' : undefined,
              gap: '1.5rem'
            }}>
              {lugaresFiltrados.map(lugar => (
                <div 
                  key={lugar.id} 
                  style={{
                    background: 'white',
                    borderRadius: '1.5rem',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    display: viewMode === 'list' ? 'flex' : 'block'
                  }}
                  onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.style.transform = 'translateY(-8px)'
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)'
                  }}
                  onMouseLeave={(e: MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.style.transform = 'translateY(0px)'
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)'
                  }}
                >
                  {/* Botón de eliminar favorito */}
                  <button
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation()
                      removeFavorito(lugar.id)
                    }}
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'rgba(220, 53, 69, 0.9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      fontSize: '1.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10,
                      transition: 'all 0.3s ease',
                      opacity: 0.9,
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                      e.currentTarget.style.opacity = '1'
                      e.currentTarget.style.transform = 'scale(1.1)'
                      e.currentTarget.style.background = 'rgba(220, 53, 69, 1)'
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                      e.currentTarget.style.opacity = '0.9'
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.background = 'rgba(220, 53, 69, 0.9)'
                    }}
                    title="Eliminar de favoritos"
                  >
                    ×
                  </button>

                  <div 
                    onClick={() => router.push(`/lugares/${lugar.id}`)}
                    style={{ 
                      display: 'flex',
                      flexDirection: viewMode === 'list' ? 'row' : 'column',
                      height: '100%'
                    }}
                  >
                    <div style={{
                      width: viewMode === 'list' ? '250px' : '100%',
                      height: viewMode === 'list' ? '180px' : '220px',
                      flexShrink: 0,
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <Image
                        src={lugar.url_imagen} 
                        alt={lugar.nombre} 
                        fill
                        style={{ 
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLImageElement>) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e: React.MouseEvent<HTMLImageElement>) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      
                      {/* Badge de favorito */}
                      <div style={{
                        position: 'absolute',
                        bottom: '0.8rem',
                        left: '0.8rem',
                        background: 'rgba(255, 71, 87, 0.9)',
                        color: 'white',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '1rem',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}>
                        ❤️ Favorito
                      </div>

                      {/* Badge del municipio */}
                      {lugar.municipio && (
                        <div style={{
                          position: 'absolute',
                          top: '0.8rem',
                          left: '0.8rem',
                          background: 'rgba(0, 168, 107, 0.9)',
                          color: 'white',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '1rem',
                          fontSize: '0.85rem',
                          fontWeight: 'bold',
                          backdropFilter: 'blur(10px)'
                        }}>
                          📍 {lugar.municipio}
                        </div>
                      )}
                    </div>

                    <div style={{ 
                      padding: '1.5rem',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <h3 style={{ 
                          marginBottom: '0.8rem', 
                          color: '#004e92',
                          fontSize: '1.4rem',
                          fontWeight: 'bold',
                          lineHeight: '1.3'
                        }}>
                          {lugar.nombre}
                        </h3>
                        <p style={{ 
                          fontSize: '1rem', 
                          color: '#666',
                          lineHeight: '1.6',
                          margin: 0
                        }}>
                          {lugar.descripcion?.length > 120 
                            ? `${lugar.descripcion.substring(0, 120)}...` 
                            : lugar.descripcion
                          }
                        </p>
                      </div>
                      
                      <div style={{
                        marginTop: '1rem',
                        padding: '0.5rem 0',
                        borderTop: '1px solid #f0f0f0',
                        color: '#00a86b',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span>👁️</span>
                        Ver detalles
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {lugaresFiltrados.length === 0 && filtro && (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#666',
                background: 'white',
                borderRadius: '1.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
                <h3 style={{ color: '#004e92', marginBottom: '0.5rem', fontSize: '1.3rem' }}>
                  No se encontraron resultados
                </h3>
                <p style={{ fontSize: '1rem' }}>
                  No hay lugares favoritos que coincidan con &quot;<strong>{filtro}</strong>&quot;
                </p>
                <button
                  onClick={() => setFiltro('')}
                  style={{
                    marginTop: '1rem',
                    background: '#004e92',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '1rem',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Limpiar filtro
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}