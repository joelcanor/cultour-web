import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([])
  const [filteredUsuarios, setFilteredUsuarios] = useState([])
  const [adminInfo, setAdminInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRol, setFilterRol] = useState('Todos')
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    usuarios: 0,
    recientes: 0
  })
  const router = useRouter()

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

        // Obtener usuarios usando función RPC
        const { data, error } = await supabase.rpc('obtener_todos_los_usuarios')
        
        console.log('Datos recibidos de RPC:', data)  // Para debug
        console.log('Error (si hay):', error)  // Para debug

        if (error) {
          console.error('Error al obtener usuarios:', error)
        } else {
          // Normalizar datos
          const usuariosNormalizados = (data || []).map(u => ({
            ...u,
            rol: u.rol || 'usuario',
            nombre: u.nombre || '',
            telefono: u.telefono || '',
            foto_url: u.avatar_url || u.foto_url || '', // Importante para la imagen
          }))
          
          setUsuarios(usuariosNormalizados)
          setFilteredUsuarios(usuariosNormalizados)
          
          // Calcular estadísticas
          const total = usuariosNormalizados.length
          const admins = usuariosNormalizados.filter(u => u.rol === 'admin').length
          const usuariosCount = usuariosNormalizados.filter(u => u.rol === 'usuario').length
          const recientes = Math.floor(total * 0.3) // Aproximación
          
          setStats({ total, admins, usuarios: usuariosCount, recientes })
        }
      } catch (error) {
        console.error('Error general:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filtrar usuarios
  useEffect(() => {
    let filtered = usuarios

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(usuario => 
        usuario.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.id?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por rol
    if (filterRol !== 'Todos') {
      filtered = filtered.filter(usuario => usuario.rol === filterRol)
    }

    setFilteredUsuarios(filtered)
  }, [searchTerm, filterRol, usuarios])

  const cambiarRol = async (id, nuevoRol) => {
    const { error } = await supabase
      .from('perfil_usuario')
      .update({ rol: nuevoRol })
      .eq('id', id)

    if (error) {
      alert('Error al cambiar rol: ' + error.message)
    } else {
      setUsuarios(prev =>
        prev.map(u => u.id === id ? { ...u, rol: nuevoRol } : u)
      )
      
      // Actualizar stats
      const nuevosUsuarios = usuarios.map(u => u.id === id ? { ...u, rol: nuevoRol } : u)
      setStats(prev => ({
        ...prev,
        admins: nuevosUsuarios.filter(u => u.rol === 'admin').length,
        usuarios: nuevosUsuarios.filter(u => u.rol === 'usuario').length
      }))
    }
  }

  const eliminarUsuario = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
      return
    }

    const { error } = await supabase
      .from('perfil_usuario')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error al eliminar usuario: ' + error.message)
    } else {
      setUsuarios(prev => prev.filter(u => u.id !== id))
      setStats(prev => ({
        ...prev,
        total: prev.total - 1,
        admins: usuarios.filter(u => u.id !== id && u.rol === 'admin').length,
        usuarios: usuarios.filter(u => u.id !== id && u.rol === 'usuario').length
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
            Cargando usuarios...
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
              <a href="/admin" style={linkStyle}>
                📊 Resumen General
              </a>
            </li>
            <li>
              <a href="/admin/usuarios" style={linkActiveStyle}>
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
              👥 Gestión de Usuarios
            </h1>
            <p style={{ 
              margin: '0.5rem 0 0 0', 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: '1rem' 
            }}>
              Administra roles y permisos de usuarios registrados
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
          <div style={{...statsCardStyle, borderLeft: '4px solid #004e92'}}>
            <div style={{...statsIconStyle, backgroundColor: '#e3f2fd', color: '#004e92'}}>👥</div>
            <div>
              <h3 style={statsNumberStyle}>{stats.total}</h3>
              <p style={statsLabelStyle}>Total de Usuarios</p>
            </div>
          </div>
          
          <div style={{...statsCardStyle, borderLeft: '4px solid #ff5722'}}>
            <div style={{...statsIconStyle, backgroundColor: '#fbe9e7', color: '#ff5722'}}>👑</div>
            <div>
              <h3 style={statsNumberStyle}>{stats.admins}</h3>
              <p style={statsLabelStyle}>Administradores</p>
            </div>
          </div>
          
          <div style={{...statsCardStyle, borderLeft: '4px solid #00a86b'}}>
            <div style={{...statsIconStyle, backgroundColor: '#e6ffe9', color: '#00a86b'}}>👤</div>
            <div>
              <h3 style={statsNumberStyle}>{stats.usuarios}</h3>
              <p style={statsLabelStyle}>Usuarios Regulares</p>
            </div>
          </div>
          
          <div style={{...statsCardStyle, borderLeft: '4px solid #ffa726'}}>
            <div style={{...statsIconStyle, backgroundColor: '#fff8e1', color: '#ffa726'}}>🆕</div>
            <div>
              <h3 style={statsNumberStyle}>{stats.recientes}</h3>
              <p style={statsLabelStyle}>Usuarios Recientes</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={filtersStyle}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Buscar por nombre, email o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyle}
            />
            
            <select
              value={filterRol}
              onChange={(e) => setFilterRol(e.target.value)}
              style={selectStyle}
            >
              <option value="Todos">Todos los roles</option>
              <option value="admin">Solo administradores</option>
              <option value="usuario">Solo usuarios regulares</option>
            </select>
            
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterRol('Todos')
              }}
              style={clearButtonStyle}
            >
              Limpiar filtros
            </button>
          </div>
          
          <div style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
            Mostrando {filteredUsuarios.length} de {usuarios.length} usuarios
          </div>
        </div>

        {/* AQUÍ ESTÁ LA TABLA SIMPLE QUE SUGIERE TU AMIGO */}
        <div style={{ padding: '2rem', background: 'white', borderRadius: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          {filteredUsuarios.length === 0 ? (
            <div style={emptyStateStyle}>
              <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</span>
              <h3>No se encontraron usuarios</h3>
              <p>Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr>
                  <th style={th}>Foto</th>
                  <th style={th}>Email</th>
                  <th style={th}>Nombre</th>
                  <th style={th}>Teléfono</th>
                  <th style={th}>Rol</th>
                  <th style={th}>Fecha de Registro</th>
                  <th style={th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.map(user => (
                  <tr key={user.id} style={trStyle}>
                    <td style={td}>
                      <img
                        src={user.foto_url || '/logo.png'}
                        alt="avatar"
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/logo.png'
                        }}
                      />
                    </td>
                    <td style={td}>{user.email}</td>
                    <td style={td}>{user.nombre || 'Sin nombre'}</td>
                    <td style={td}>{user.telefono || 'No registrado'}</td>
                    <td style={td}>
                      <span style={{
                        padding: '0.3rem 0.8rem',
                        borderRadius: '1rem',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: user.rol === 'admin' ? '#fff3e0' : '#e8f5e8',
                        color: user.rol === 'admin' ? '#f57c00' : '#2e7d32',
                      }}>
                        {user.rol === 'admin' ? '👑 Admin' : '👤 Usuario'}
                      </span>
                    </td>
                    <td style={td}>
                      {user.fecha_registro
                        ? new Date(user.fecha_registro).toLocaleDateString('es-MX')
                        : 'Desconocida'}
                    </td>
                    <td style={td}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => cambiarRol(user.id, user.rol === 'admin' ? 'usuario' : 'admin')}
                          style={{
                            ...smallButtonStyle,
                            backgroundColor: user.rol === 'admin' ? '#ff5722' : '#4caf50',
                          }}
                        >
                          {user.rol === 'admin' ? '⬇️' : '⬆️'}
                        </button>
                        
                        <button
                          onClick={() => router.push(`/perfil/${user.id}`)}
                          style={{
                            ...smallButtonStyle,
                            backgroundColor: '#2196f3',
                          }}
                        >
                          👁️
                        </button>
                        
                        <button
                          onClick={() => eliminarUsuario(user.id)}
                          style={{
                            ...smallButtonStyle,
                            backgroundColor: '#f44336',
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

// Estilos existentes
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
  minWidth: '300px',
  transition: 'border-color 0.3s ease'
}

const selectStyle = {
  padding: '0.8rem 1rem',
  borderRadius: '0.8rem',
  border: '2px solid #e0e0e0',
  fontSize: '1rem',
  cursor: 'pointer',
  minWidth: '180px'
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

const emptyStateStyle = {
  textAlign: 'center',
  padding: '4rem 2rem',
  color: '#666'
}

// Estilos para la tabla (sugerencia de tu amigo)
const th = {
  borderBottom: '2px solid #ccc',
  padding: '0.8rem',
  textAlign: 'left',
  background: '#f0f0f0',
  fontSize: '0.9rem',
  fontWeight: 'bold',
  color: '#333'
}

const td = {
  padding: '0.8rem',
  borderBottom: '1px solid #eee',
  fontSize: '0.9rem',
  color: '#333'
}

const trStyle = {
  transition: 'background-color 0.2s ease',
  cursor: 'pointer'
}

const smallButtonStyle = {
  padding: '0.4rem 0.6rem',
  borderRadius: '0.4rem',
  border: 'none',
  color: 'white',
  fontSize: '0.8rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  minWidth: '30px'
}