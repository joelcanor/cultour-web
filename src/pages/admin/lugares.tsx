import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'

export default function LugaresAdmin() {
  const [lugares, setLugares] = useState([])
  const [filteredLugares, setFilteredLugares] = useState([])
  const [adminInfo, setAdminInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMunicipio, setFilterMunicipio] = useState('Todos')
  const [filterDestacado, setFilterDestacado] = useState('Todos')
  
  const [stats, setStats] = useState({
    total: 0,
    destacados: 0,
    porMunicipio: {}
  })
  const router = useRouter()

  const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/') // o '/login', como prefieras
}

  const municipios = ['Todos', 'Jalpan de Serra', 'Landa de Matamoros', 'Arroyo Seco', 'Pinal de Amoles']

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Obtener información del admin actual
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: adminData } = await supabase
            .from('perfil_usuario')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setAdminInfo(adminData)
        }

        // Obtener lugares
        const { data, error } = await supabase.from('lugares').select('*')
        if (error) {
          console.error('Error al obtener lugares:', error)
        } else {
          setLugares(data || [])
          setFilteredLugares(data || [])
          
          // Calcular estadísticas
          const total = data?.length || 0
          const destacados = data?.filter(l => l.destacado === true).length || 0
          const porMunicipio = {}
          
          data?.forEach(lugar => {
            porMunicipio[lugar.municipio] = (porMunicipio[lugar.municipio] || 0) + 1
          })
          
          setStats({ total, destacados, porMunicipio })
        }
      } catch (error) {
        console.error('Error general:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filtrar lugares
  useEffect(() => {
    let filtered = lugares

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(lugar => 
        lugar.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lugar.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por municipio
    if (filterMunicipio !== 'Todos') {
      filtered = filtered.filter(lugar => lugar.municipio === filterMunicipio)
    }

    // Filtro por destacado
    if (filterDestacado === 'Destacados') {
      filtered = filtered.filter(lugar => lugar.destacado === true)
    } else if (filterDestacado === 'No destacados') {
      filtered = filtered.filter(lugar => lugar.destacado === false)
    }

    setFilteredLugares(filtered)
  }, [searchTerm, filterMunicipio, filterDestacado, lugares])

  const toggleDestacado = async (id, currentStatus) => {
    const { error } = await supabase
      .from('lugares')
      .update({ destacado: !currentStatus })
      .eq('id', id)

    if (error) {
      alert('Error al cambiar estado: ' + error.message)
    } else {
      setLugares(prev =>
        prev.map(lugar => 
          lugar.id === id ? { ...lugar, destacado: !currentStatus } : lugar
        )
      )
      
      // Actualizar stats
      setStats(prev => ({
        ...prev,
        destacados: prev.destacados + (!currentStatus ? 1 : -1)
      }))
    }
  }

  if (loading) {
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
          <p style={{ color: '#004e92', fontSize: '1.2rem' }}>
            Cargando lugares...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(to bottom, #e0f7fa, #e6ffe9)' }}>
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Image 
            src="/logo.jpg" 
            alt="Cultour Logo" 
            style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              marginBottom: '0.5rem',
              border: '3px solid rgba(255,255,255,0.3)',
              objectFit: 'cover'
            }} 
          />
          <h2 style={{ 
            color: '#fff', 
            margin: 0, 
            fontSize: '1.4rem', 
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}>
            CULTOUR
          </h2>
          <p style={{ 
            color: 'rgba(255,255,255,0.8)', 
            margin: '0.2rem 0 0 0', 
            fontSize: '0.8rem' 
          }}>
            Panel de Administración
          </p>
        </div>
        
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>
              <Link href="/admin" style={linkStyle}>
                📊 Resumen General
              </Link>
            </li>
            <li>
              <Link href="/admin/usuarios" style={linkStyle}>
                👥 Gestión de Usuarios
              </Link>
            </li>
            <li>
              <Link href="/admin/lugares" style={linkActiveStyle}>
                📍 Gestión de Lugares
              </Link>
            </li>
            <li style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem' }}>
              <Link href="/" style={linkStyle}>
                🏠 Ir al Sitio Web
              </Link>
            </li>
             
             <li style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem' }}>
  <button onClick={handleLogout} style={{ ...linkStyle, color: '#ffdddd' }}>
    🔒 Cerrar Sesión
  </button>
</li>
          </ul>
  
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem' }}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <h1 style={{ 
              margin: 0, 
              color: 'white', 
              fontSize: '2rem', 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              📍 Gestión de Lugares Turísticos
            </h1>
            <p style={{ 
              margin: '0.5rem 0 0 0', 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: '1rem' 
            }}>
              Administra y supervisa todos los destinos de la Sierra Gorda
            </p>
          </div>
          <div style={{ 
            color: 'rgba(255,255,255,0.8)', 
            fontSize: '0.9rem',
            textAlign: 'right'
          }}>
            Hola, {adminInfo?.nombre || 'Administrador'}
          </div>
        </div>

        {/* Stats Cards */}
        <div style={statsGridStyle}>
          <div style={{...statsCardStyle, borderLeft: '4px solid #00a86b'}}>
            <div style={{...statsIconStyle, backgroundColor: '#e6ffe9', color: '#00a86b'}}>📍</div>
            <div>
              <h3 style={statsNumberStyle}>{stats.total}</h3>
              <p style={statsLabelStyle}>Total de Lugares</p>
            </div>
          </div>
          
          <div style={{...statsCardStyle, borderLeft: '4px solid #ffa726'}}>
            <div style={{...statsIconStyle, backgroundColor: '#fff8e1', color: '#ffa726'}}>⭐</div>
            <div>
              <h3 style={statsNumberStyle}>{stats.destacados}</h3>
              <p style={statsLabelStyle}>Lugares Destacados</p>
            </div>
          </div>
          
          <div style={{...statsCardStyle, borderLeft: '4px solid #004e92'}}>
            <div style={{...statsIconStyle, backgroundColor: '#e3f2fd', color: '#004e92'}}>🏛️</div>
            <div>
              <h3 style={statsNumberStyle}>{Object.keys(stats.porMunicipio).length}</h3>
              <p style={statsLabelStyle}>Municipios Activos</p>
            </div>
          </div>
          
          <div style={{...statsCardStyle, borderLeft: '4px solid #28a745'}}>
            <div style={{...statsIconStyle, backgroundColor: '#e8f5e8', color: '#28a745'}}>🎯</div>
            <div>
              <h3 style={statsNumberStyle}>{filteredLugares.length}</h3>
              <p style={statsLabelStyle}>Lugares Filtrados</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={filtersStyle}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyle}
            />
            
            <select
              value={filterMunicipio}
              onChange={(e) => setFilterMunicipio(e.target.value)}
              style={selectStyle}
            >
              {municipios.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            
            <select
              value={filterDestacado}
              onChange={(e) => setFilterDestacado(e.target.value)}
              style={selectStyle}
            >
              <option value="Todos">Todos los lugares</option>
              <option value="Destacados">Solo destacados</option>
              <option value="No destacados">No destacados</option>
            </select>
            
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterMunicipio('Todos')
                setFilterDestacado('Todos')
              }}
              style={clearButtonStyle}
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Places Grid */}
        <div style={placesContainerStyle}>
          {filteredLugares.length === 0 ? (
            <div style={emptyStateStyle}>
              <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</span>
              <h3>No se encontraron lugares</h3>
              <p>Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            <div style={placesGridStyle}>
              {filteredLugares.map((lugar) => (
                <div key={lugar.id} style={placeCardStyle}>
                  <div style={{ position: 'relative' }}>
                    <Image 
                      src={lugar.url_imagen} 
                      alt={lugar.nombre} 
                      style={placeImageStyle}
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
                    
                    {/* Badge de municipio */}
                    <div style={municipioBadgeStyle}>
                      {lugar.municipio}
                    </div>
                    
                    {/* Badge de destacado */}
                    {lugar.destacado && (
                      <div style={destacadoBadgeStyle}>
                        ⭐ Destacado
                      </div>
                    )}
                  </div>
                  
                  <div style={cardContentStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={placeTitleStyle}>{lugar.nombre}</h3>
                      <span style={placeIdStyle}>#{lugar.id}</span>
                    </div>
                    
                    <p style={placeDescriptionStyle}>
                      {lugar.descripcion?.length > 100 
                        ? `${lugar.descripcion.substring(0, 100)}...` 
                        : lugar.descripcion
                      }
                    </p>
                    
                    <div style={cardActionsStyle}>
                      <button
                        onClick={() => toggleDestacado(lugar.id, lugar.destacado)}
                        style={{
                          ...actionButtonStyle,
                          backgroundColor: lugar.destacado ? '#ff5722' : '#4caf50',
                        }}
                      >
                        {lugar.destacado ? '⭐ Quitar destacado' : '⭐ Destacar'}
                      </button>
                      
                      <button
                        onClick={() => router.push(`/lugares/${lugar.id}`)}
                        style={{
                          ...actionButtonStyle,
                          backgroundColor: '#2196f3',
                        }}
                      >
                        👁️ Ver detalle
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// Estilos
const sidebarStyle = {
  width: '280px',
  background: 'linear-gradient(180deg, #004e92 0%, #003d75 100%)',
  color: 'white',
  padding: '2rem 1.5rem',
  boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
  position: 'relative'
}

const linkStyle = {
  color: 'rgba(255,255,255,0.8)',
  textDecoration: 'none',
  fontSize: '1rem',
  fontWeight: '500',
  padding: '0.8rem 1rem',
  borderRadius: '0.8rem',
  transition: 'all 0.3s ease',
  background: 'transparent',
  display: 'block',
  border: 'none',
  cursor: 'pointer'
}

const linkActiveStyle = {
  ...linkStyle,
  color: 'white',
  background: 'rgba(255,255,255,0.15)',
  backdropFilter: 'blur(10px)'
}

const headerStyle = {
  background: 'linear-gradient(135deg, #00a86b, #004e92)',
  borderRadius: '1.5rem',
  padding: '2rem',
  marginBottom: '2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
}

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '1.5rem',
  marginBottom: '2rem'
}

const statsCardStyle = {
  background: 'white',
  borderRadius: '1rem',
  padding: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'transform 0.3s ease'
}

const statsIconStyle = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem'
}

const statsNumberStyle = {
  margin: 0,
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#333'
}

const statsLabelStyle = {
  margin: '0.2rem 0 0 0',
  color: '#666',
  fontSize: '0.9rem'
}

const filtersStyle = {
  background: 'white',
  borderRadius: '1rem',
  padding: '1.5rem',
  marginBottom: '2rem',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
}

const searchInputStyle = {
  padding: '0.8rem 1rem',
  borderRadius: '0.8rem',
  border: '2px solid #e0e0e0',
  fontSize: '1rem',
  minWidth: '250px',
  transition: 'border-color 0.3s ease'
}

const selectStyle = {
  padding: '0.8rem 1rem',
  borderRadius: '0.8rem',
  border: '2px solid #e0e0e0',
  fontSize: '1rem',
  cursor: 'pointer',
  minWidth: '150px'
}

const clearButtonStyle = {
  padding: '0.8rem 1.5rem',
  borderRadius: '0.8rem',
  border: 'none',
  background: '#f5f5f5',
  color: '#666',
  cursor: 'pointer',
  fontSize: '0.9rem',
  transition: 'all 0.3s ease'
}

const placesContainerStyle = {
  background: 'white',
  borderRadius: '1.5rem',
  padding: '2rem',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
}

const placesGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '2rem'
}

const placeCardStyle = {
  background: 'white',
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  border: '1px solid #e0e0e0'
}

const placeImageStyle = {
  width: '100%',
  height: '200px',
  objectFit: 'cover'
}

const municipioBadgeStyle = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  background: 'rgba(0,78,146,0.9)',
  color: 'white',
  padding: '0.4rem 0.8rem',
  borderRadius: '1rem',
  fontSize: '0.8rem',
  fontWeight: '500'
}

const destacadoBadgeStyle = {
  position: 'absolute',
  top: '1rem',
  left: '1rem',
  background: 'rgba(255,167,38,0.9)',
  color: 'white',
  padding: '0.4rem 0.8rem',
  borderRadius: '1rem',
  fontSize: '0.8rem',
  fontWeight: '500'
}

const cardContentStyle = {
  padding: '1.5rem'
}

const placeTitleStyle = {
  margin: 0,
  fontSize: '1.3rem',
  fontWeight: 'bold',
  color: '#004e92',
  flex: 1
}

const placeIdStyle = {
  fontSize: '0.8rem',
  color: '#999',
  fontWeight: '500'
}

const placeDescriptionStyle = {
  margin: '0.5rem 0 1rem 0',
  color: '#666',
  fontSize: '0.9rem',
  lineHeight: '1.5'
}

const cardActionsStyle = {
  display: 'flex',
  gap: '0.8rem',
  flexWrap: 'wrap'
}

const actionButtonStyle = {
  padding: '0.6rem 1rem',
  borderRadius: '0.5rem',
  border: 'none',
  color: 'white',
  fontSize: '0.85rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  flex: 1
}

const emptyStateStyle = {
  textAlign: 'center',
  padding: '4rem 2rem',
  color: '#666'
}