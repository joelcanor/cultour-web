import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

type HeaderProps = {
  user: any
  isAuthenticated: boolean
  showUserMenu: boolean
  setShowUserMenu: (value: boolean) => void
  handleLogout: () => void
}

export default function Header({
  user,
  isAuthenticated,
  showUserMenu,
  setShowUserMenu,
  handleLogout
}: HeaderProps) {
  const router = useRouter()
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // ✅ Función para cargar imagen de perfil del usuario
  const fetchUserProfileImage = async (userId: string) => {
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
        setUserProfileImage(data.foto_url)
      } else {
        setUserProfileImage(null)
      }
    } catch (err) {
      console.error('Error fetching profile image:', err)
      setUserProfileImage(null)
    }
  }

  // ✅ Cargar imagen de perfil cuando cambia el usuario
  useEffect(() => {
    if (user?.id) {
      fetchUserProfileImage(user.id)
    } else {
      setUserProfileImage(null)
    }
  }, [user])

  const navItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Recomendaciones', href: '/recomendaciones' },
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Contacto', href: '/contacto' }
  ]

  return (
    <>
      <header style={{ 
        background: 'linear-gradient(135deg, #004e92, #00a86b)', 
        padding: '1rem 1.5rem', 
        color: 'white', 
        position: 'relative',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ 
              width: '45px', 
              height: '45px', 
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
            <h2 style={{ 
              margin: 0, 
              fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', 
              fontWeight: 'bold', 
              letterSpacing: '1px' 
            }}>
              CULTOUR
            </h2>
          </div>

          {/* Desktop Navigation */}
          <nav style={{ display: 'none' }} className="desktop-nav">
            <ul style={{
              display: 'flex',
              gap: '2rem',
              listStyle: 'none',
              margin: 0,
              padding: 0
            }}>
              {navItems.map(item => (
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
                    onMouseEnter={e => (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={e => (e.target as HTMLElement).style.background = 'transparent'}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right side - User menu and hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* User Authentication */}
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
                  fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
              >
                Iniciar sesión
              </button>
            ) : (
              <div style={{ position: 'relative' }}>
                {/* ✅ Avatar del usuario con imagen de perfil real */}
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
                    overflow: 'hidden',
                    border: '2px solid rgba(255,255,255,0.3)'
                  }}>
                    {/* ✅ Mostrar imagen de perfil o emoji por defecto */}
                    {userProfileImage ? (
                      <img 
                        src={`${userProfileImage}?t=${Date.now()}`} 
                        alt="Perfil" 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          borderRadius: '50%'
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          ((e.target as HTMLImageElement).nextSibling as HTMLElement).style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div style={{ 
                      display: userProfileImage ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                      color: '#004e92',
                      fontSize: '1.2rem'
                    }}>
                      👤
                    </div>
                  </div>
                  <span style={{ 
                    fontWeight: '500', 
                    fontSize: '0.9rem',
                    display: 'none'
                  }} className="desktop-only">
                    {user?.email?.split('@')[0] || user?.name || 'Usuario'}
                  </span>
                  <span style={{ fontSize: '0.8rem', display: 'none' }} className="desktop-only">
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
                      <div style={{ 
                        fontWeight: 'bold', 
                        fontSize: '0.9rem' 
                      }}>
                        {user?.name || 'Usuario'}
                      </div>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: '#666' 
                      }}>
                        {user?.email}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setShowUserMenu(false)
                        router.push('/perfil')
                      }} 
                      style={{ 
                        width: '100%', 
                        padding: '0.8rem 1rem', 
                        border: 'none', 
                        background: 'transparent', 
                        color: '#333', 
                        textAlign: 'left', 
                        cursor: 'pointer',
                        fontSize: '0.9rem',
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
                        router.push('/favoritos')
                      }} 
                      style={{ 
                        width: '100%', 
                        padding: '0.8rem 1rem', 
                        border: 'none', 
                        background: 'transparent', 
                        color: '#333', 
                        textAlign: 'left', 
                        cursor: 'pointer',
                        fontSize: '0.9rem',
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
                          textAlign: 'left', 
                          cursor: 'pointer',
                          fontSize: '0.9rem',
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

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                transition: 'all 0.3s ease',
                display: 'block'
              }}
              className="hamburger-btn"
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'linear-gradient(135deg, #004e92, #00a86b)',
            padding: '1rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            zIndex: 999
          }}>
            <nav>
              <ul style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {navItems.map(item => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        color: 'white',
                        textDecoration: 'none',
                        fontWeight: '500',
                        padding: '1rem',
                        display: 'block',
                        borderRadius: '0.5rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={e => (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.2)'}
                      onMouseLeave={e => (e.target as HTMLElement).style.background = 'transparent'}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </header>

      {/* CSS Styles */}
      <style jsx global>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: block !important;
          }
          .hamburger-btn {
            display: none !important;
          }
          .desktop-only {
            display: inline !important;
          }
        }
        
        @media (max-width: 767px) {
          .desktop-nav {
            display: none !important;
          }
          .hamburger-btn {
            display: block !important;
          }
          .desktop-only {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}