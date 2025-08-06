import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'

export default function AdminDashboard() {
  const [usuarios, setUsuarios] = useState([])
  const [lugares, setLugares] = useState([])
  const [adminInfo, setAdminInfo] = useState(null)
  const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/') // o a "/login" si prefieres
}
  const [visitasTotales, setVisitasTotales] = useState(0)
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalLugares: 0,
    usuariosActivos: 0,
    lugaresDestacados: 0,
    visitasTotales: 0
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
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

        // Obtener usuarios usando la función RPC (igual que en el otro componente)
        const { data: usuariosData, error: usuariosError } = await supabase.rpc('obtener_todos_los_usuarios')
        
        if (usuariosError) {
          console.error('Error al obtener usuarios:', usuariosError)
        } else {
          // Normalizar datos igual que en UsuariosAdmin
          const usuariosNormalizados = (usuariosData || []).map(u => ({
            ...u,
            rol: u.rol || 'usuario',
            nombre: u.nombre || '',
            telefono: u.telefono || '',
            foto_url: u.avatar_url || u.foto_url || '',
          }))
          setUsuarios(usuariosNormalizados)
        }

        // Obtener lugares
        const { data: lugaresData, error: lugaresError } = await supabase
          .from('lugares')
          .select('*')
        
        if (lugaresError) {
          console.error('Error al obtener lugares:', lugaresError)
        } else {
          setLugares(lugaresData || [])
        }

        // Obtener visitas totales del sitio
        const { data: visitasData, error: visitasError } = await supabase
          .from('contador_visitas')
          .select('total_visitas')
          .eq('id', 1)
          .single()

        if (visitasError) {
          console.error('Error al obtener visitas:', visitasError)
        } else {
          setVisitasTotales(visitasData?.total_visitas || 0)
        }

        // Calcular estadísticas
        if (usuariosData && lugaresData) {
          const usuariosNormalizados = (usuariosData || []).map(u => ({
            ...u,
            rol: u.rol || 'usuario'
          }))

          setStats({
            totalUsuarios: usuariosNormalizados.length,
            totalLugares: lugaresData.length,
            usuariosActivos: usuariosNormalizados.filter(u => u.rol === 'usuario').length,
            lugaresDestacados: lugaresData.filter(l => l.destacado === true).length,
            visitasTotales: visitasData?.total_visitas || 0
          })
        }

      } catch (error) {
        console.error('Error general:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const cambiarRol = async (id, nuevoRol) => {
    const { error } = await supabase
      .from('perfil_usuario')
      .update({ rol: nuevoRol })
      .eq('id', id)

    if (error) {
      alert('Error al cambiar rol: ' + error.message)
    } else {
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, rol: nuevoRol } : u))
      )
      // Actualizar stats
      const nuevosUsuarios = usuarios.map((u) => (u.id === id ? { ...u, rol: nuevoRol } : u))
      setStats(prev => ({
        ...prev,
        usuariosActivos: nuevosUsuarios.filter(u => u.rol === 'usuario').length
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
            Cargando dashboard...
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
          <img 
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
              <a href="/admin" style={linkActiveStyle}>
                📊 Resumen General
              </a>
            </li>
            <li>
              <a href="/admin/usuarios" style={linkStyle}>
                👥 Gestión de Usuarios
              </a>
            </li>
            <li>
              <a href="/admin/lugares" style={linkStyle}>
                📍 Gestión de Lugares
              </a>
            </li>
            <li style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem' }}>
              <a href="/" style={linkStyle}>
                🏠 Ir al Sitio Web
              </a>
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
        {/* Header de bienvenida */}
        <div style={welcomeHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              {adminInfo?.foto_url ? (
                <img 
                  src={adminInfo.foto_url} 
                  alt="Admin" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    borderRadius: '50%', 
                    objectFit: 'cover' 
                  }}
                />
              ) : (
                <span style={{ fontSize: '1.5rem', color: 'white' }}>👤</span>
              )}
            </div>
            <div>
              <h1 style={{ 
                margin: 0, 
                color: 'white', 
                fontSize: '2rem', 
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                ¡Bienvenido, {adminInfo?.nombre || 'Administrador'}!
              </h1>
              <p style={{ 
                margin: '0.2rem 0 0 0', 
                color: 'rgba(255,255,255,0.9)', 
                fontSize: '1rem' 
              }}>
                Panel de control - Cultour Sierra Gorda
              </p>
            </div>
          </div>
          <div style={{ 
            color: 'rgba(255,255,255,0.8)', 
            fontSize: '0.9rem',
            textAlign: 'right'
          }}>
            {new Date().toLocaleDateString('es-MX', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* Cards de estadísticas - AHORA CON VISITAS TOTALES */}
        <div style={statsGridStyle}>
          <div style={{...statsCardStyle, borderLeft: '4px solid #004e92'}}>
            <div style={statsIconStyle}>👥</div>
            <div>
              <h3 style={statsNumberStyle}>{stats.totalUsuarios}</h3>
              <p style={statsLabelStyle}>Total de Usuarios</p>
            </div>
          </div>
          
          <div style={{...statsCardStyle, borderLeft: '4px solid #00a86b'}}>
            <div style={{...statsIconStyle, backgroundColor: '#e6ffe9', color: '#00a86b'}}>📍</div>
            <div>
              <h3 style={statsNumberStyle}>{stats.totalLugares}</h3>
              <p style={statsLabelStyle}>Lugares Registrados</p>
            </div>
          </div>
          
          <div style={{...statsCardStyle, borderLeft: '4px solid #ff6b35'}}>
            <div style={{...statsIconStyle, backgroundColor: '#fff4f0', color: '#ff6b35'}}>👁️</div>
            <div>
              <h3 style={statsNumberStyle}>{stats.visitasTotales.toLocaleString()}</h3>
              <p style={statsLabelStyle}>Visitas Totales</p>
            </div>
          </div>
          
          <div style={{...statsCardStyle, borderLeft: '4px solid #ffa726'}}>
            <div style={{...statsIconStyle, backgroundColor: '#fff8e1', color: '#ffa726'}}>⭐</div>
            <div>
              <h3 style={statsNumberStyle}>{stats.lugaresDestacados}</h3>
              <p style={statsLabelStyle}>Lugares Destacados</p>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div style={quickActionsStyle}>
          <h2 style={{ color: '#004e92', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
            Acciones Rápidas
          </h2>
          <div style={actionsGridStyle}>
            <button 
              onClick={() => router.push('/admin/usuarios')}
              style={actionButtonStyle}
            >
              <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</span>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#004e92' }}>Gestionar Usuarios</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                Ver, editar y administrar roles de usuarios
              </p>
            </button>
            
            <button 
              onClick={() => router.push('/admin/lugares')}
              style={actionButtonStyle}
            >
              <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📍</span>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#00a86b' }}>Gestionar Lugares</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                Agregar, editar y destacar lugares turísticos
              </p>
            </button>
            
            <button 
              onClick={() => router.push('/')}
              style={actionButtonStyle}
            >
              <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌐</span>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#ffa726' }}>Ver Sitio Web</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                Visitar la página principal como usuario
              </p>
            </button>

            <button 
              onClick={() => window.open('/admin/usuarios', '_blank')}
              style={actionButtonStyle}
            >
              <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>➕</span>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#9c27b0' }}>Crear Usuario</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                Registrar nuevos usuarios al sistema
              </p>
            </button>
          </div>
        </div>

        {/* Resumen de usuarios recientes - MEJORADO */}
        <div style={recentUsersStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#004e92', margin: 0, fontSize: '1.5rem' }}>
              Usuarios Recientes
            </h2>
            <span style={{ 
              background: '#e3f2fd', 
              color: '#1976d2', 
              padding: '0.5rem 1rem', 
              borderRadius: '1rem',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Total: {usuarios.length}
            </span>
          </div>
          <div style={usersTableStyle}>
            <div style={usersHeaderStyle}>
              <span style={{ fontWeight: 'bold', color: '#004e92' }}>Usuario</span>
              <span style={{ fontWeight: 'bold', color: '#004e92' }}>Rol</span>
              <span style={{ fontWeight: 'bold', color: '#004e92' }}>Fecha</span>
              <span style={{ fontWeight: 'bold', color: '#004e92' }}>Acciones</span>
            </div>
            {usuarios.slice(0, 6).map((usuario) => (
              <div key={usuario.id} style={userRowStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <img 
                    src={usuario.foto_url || '/default-avatar.png'} 
                    alt="foto" 
                    style={{ 
                      width: '35px', 
                      height: '35px', 
                      borderRadius: '50%', 
                      objectFit: 'cover',
                      border: '2px solid #e0e0e0'
                    }} 
                    onError={(e) => {
                      e.target.src = '/logo.jpg'
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: '500', color: '#333' }}>
                      {usuario.nombre || 'Usuario'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      {usuario.email || usuario.id}
                    </div>
                  </div>
                </div>
                <span style={{
                  padding: '0.3rem 0.8rem',
                  borderRadius: '1rem',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  backgroundColor: usuario.rol === 'admin' ? '#fff3e0' : '#e8f5e8',
                  color: usuario.rol === 'admin' ? '#f57c00' : '#2e7d32'
                }}>
                  {usuario.rol === 'admin' ? '👑 Admin' : '👤 Usuario'}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                  {usuario.fecha_registro
                    ? new Date(usuario.fecha_registro).toLocaleDateString('es-MX')
                    : 'N/A'}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => cambiarRol(usuario.id, usuario.rol === 'admin' ? 'usuario' : 'admin')}
                    style={{
                      ...miniButtonStyle,
                      backgroundColor: usuario.rol === 'admin' ? '#ff5722' : '#4caf50',
                    }}
                  >
                    {usuario.rol === 'admin' ? '⬇️' : '⬆️'}
                  </button>
                  <button
                    onClick={() => router.push(`/perfil/${usuario.id}`)}
                    style={{
                      ...miniButtonStyle,
                      backgroundColor: '#2196f3',
                    }}
                  >
                    👁️
                  </button>
                </div>
              </div>
            ))}
            {usuarios.length > 6 && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                  onClick={() => router.push('/admin/usuarios')}
                  style={viewAllButtonStyle}
                >
                  Ver todos los usuarios ({usuarios.length})
                </button>
              </div>
            )}
          </div>
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

// Estilos actualizados
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

const welcomeHeaderStyle = {
  background: 'linear-gradient(135deg, #004e92, #00a86b)',
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
  backgroundColor: '#e3f2fd',
  color: '#004e92',
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

const quickActionsStyle = {
  background: 'white',
  borderRadius: '1.5rem',
  padding: '2rem',
  marginBottom: '2rem',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
}

const actionsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '1.5rem'
}

const actionButtonStyle = {
  background: 'white',
  border: '2px solid #e0e0e0',
  borderRadius: '1rem',
  padding: '1.5rem',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}

const recentUsersStyle = {
  background: 'white',
  borderRadius: '1.5rem',
  padding: '2rem',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
}

const usersTableStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
}

const usersHeaderStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr auto auto auto',
  gap: '1rem',
  padding: '1rem',
  borderBottom: '2px solid #e0e0e0',
  marginBottom: '0.5rem'
}

const userRowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr auto auto auto',
  gap: '1rem',
  padding: '1rem',
  borderRadius: '0.8rem',
  background: '#f8f9fa',
  alignItems: 'center'
}

const miniButtonStyle = {
  padding: '0.3rem 0.6rem',
  borderRadius: '0.4rem',
  border: 'none',
  color: 'white',
  fontSize: '0.8rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
}

const viewAllButtonStyle = {
  background: 'linear-gradient(135deg, #004e92, #00a86b)',
  color: 'white',
  border: 'none',
  padding: '0.8rem 1.5rem',
  borderRadius: '0.8rem',
  cursor: 'pointer',
  fontWeight: '500',
  transition: 'all 0.3s ease'
}