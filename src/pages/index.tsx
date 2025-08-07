import { useState, useEffect, useRef, MouseEvent } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'

// Tipos TypeScript
interface Lugar {
  id: string
  nombre: string
  descripcion: string
  municipio: string
  url_imagen: string
  destacado: boolean
}

interface User {
  id: string
  email?: string
  name?: string
}

interface NavItem {
  name: string
  href: string
}

interface CarouselProps {
  places: Lugar[]
  favoritos: string[]
  toggleFavorito: (lugarId: string, e?: MouseEvent<HTMLDivElement>) => Promise<void>
}

const municipios: string[] = ['Todos', 'Jalpan de Serra', 'Landa de Matamoros', 'Arroyo Seco', 'Pinal de Amoles']

// Componente de carrusel infinito responsive
const InfiniteCarousel = ({ places, favoritos, toggleFavorito }: CarouselProps) => {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [currentX, setCurrentX] = useState<number>(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  
  // Crear múltiples copias para efecto infinito real
  const itemWidth: number = typeof window !== 'undefined' && window.innerWidth < 768 ? 250 : 300
  const duplicatedPlaces: Lugar[] = [...places, ...places, ...places, ...places]
  
  useEffect(() => {
    const animate = () => {
      if (!isHovered) {
        setCurrentX(prev => {
          const newX = prev - 1.5
          const resetPoint = -itemWidth * places.length
          
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    const target = e.target as HTMLImageElement
    target.style.background = 'linear-gradient(135deg, #004e92, #00a86b)'
    target.style.display = 'flex'
    target.style.alignItems = 'center'
    target.style.justifyContent = 'center'
    target.style.color = 'white'
    target.style.fontSize = 'clamp(1rem, 3vw, 1.2rem)'
    target.innerHTML = '📸'
  }

  const handleTouchStart = (): void => setIsHovered(true)
  const handleTouchEnd = (): void => setIsHovered(false)
  const handleMouseEnter = (): void => setIsHovered(true)
  const handleMouseLeave = (): void => setIsHovered(false)
  
  return (
    <div 
      ref={carouselRef}
      style={{ 
        overflow: 'hidden', 
        marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
        position: 'relative'
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 'clamp(0.5rem, 2vw, 1rem)',
          transform: `translateX(${currentX}px)`,
          transition: 'none'
        }}
      >
        {duplicatedPlaces.map((place, index) => (
          <div
            key={`${place.id}-${index}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => router.push(`/lugares/${place.id}`)}
            style={{
              minWidth: 'clamp(220px, 45vw, 280px)',
              height: 'clamp(160px, 35vw, 200px)',
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
            <Image
            src={place.url_imagen}
              alt={place.nombre}
              width={280}
              height={200}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={handleImageError}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              padding: 'clamp(1rem, 3vw, 2rem) clamp(0.5rem, 2vw, 1rem) clamp(0.5rem, 2vw, 1rem)',
              color: 'white'
            }}>
              {/* Botón de favorito */}
              <div
                onClick={(e: MouseEvent<HTMLDivElement>) => toggleFavorito(place.id, e)}
                style={{
                  position: 'absolute',
                  top: 'clamp(-2rem, -5vw, -3rem)',
                  left: 'clamp(0.5rem, 2vw, 1rem)',
                  fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
                  cursor: 'pointer',
                  textShadow: '2px 2px 6px rgba(0,0,0,0.8)',
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)',
                  zIndex: 20
                }}
                onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                  const target = e.currentTarget
                  target.style.transform = 'scale(1.2)'
                  target.style.filter = 'brightness(1.2)'
                }}
                onMouseLeave={(e: MouseEvent<HTMLDivElement>) => {
                  const target = e.currentTarget
                  target.style.transform = 'scale(1)'
                  target.style.filter = 'brightness(1)'
                }}
              >
                {favoritos.includes(place.id) ? (
                  <span style={{ color: '#ff4757', filter: 'drop-shadow(0 0 8px rgba(255,71,87,0.6))' }}>❤️</span>
                ) : (
                  <span style={{ color: 'white', filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.8))' }}>🤍</span>
                )}
              </div>
              
              <div style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'rgba(0,168,107,0.9)',
                color: 'white',
                padding: 'clamp(0.2rem, 1vw, 0.3rem) clamp(0.4rem, 1.5vw, 0.7rem)',
                borderRadius: '0.5rem',
                fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)',
                fontWeight: 'bold'
              }}>
                {place.municipio}
              </div>
              <h3 style={{
                margin: 0,
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
              }}>
                {place.nombre}
              </h3>
              <p style={{
                margin: '0.3rem 0 0 0',
                fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                opacity: '0.9',
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
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
  const [search, setSearch] = useState<string>('')
  const [selectedMunicipio, setSelectedMunicipio] = useState<string>('Todos')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false)
  const [places, setPlaces] = useState<Lugar[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [favoritos, setFavoritos] = useState<string[]>([])
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [totalVisitas, setTotalVisitas] = useState<number>(0)
  const [showCookieModal, setShowCookieModal] = useState<boolean>(false)

  // Verificar si se deben mostrar las cookies al cargar la página
  useEffect(() => {
    const cookiesAccepted = localStorage.getItem('cookies-accepted')
    if (!cookiesAccepted) {
      setShowCookieModal(true)
    }
  }, [])

  // Función para aceptar cookies
  const acceptCookies = () => {
    localStorage.setItem('cookies-accepted', 'true')
    setShowCookieModal(false)
  }

  // Función para cargar imagen de perfil del usuario
const fetchUserProfileImage = async (userId: string): Promise<void> => {
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
      // Verificar si foto_url ya es una URL completa o solo el path
      let imageUrl: string
      
      if (data.foto_url.startsWith('http')) {
        // Si ya es una URL completa, usarla directamente
        imageUrl = data.foto_url
      } else {
        // Si es solo el path, construir la URL completa
        imageUrl = supabase.storage
          .from('imagenes-perfil')
          .getPublicUrl(data.foto_url).data.publicUrl
      }
      
      console.log('Image URL construida:', imageUrl) // Para debugging
      setUserProfileImage(imageUrl)
    } else {
      setUserProfileImage(null)
    }
  } catch (err) {
    console.error('Error fetching profile image:', err)
    setUserProfileImage(null)
  }
}

  // Función para verificar si el usuario es administrador
  const checkAdminRole = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('perfil_usuario')
        .select('rol')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin role:', error)
        return false
      }

      return data?.rol === 'admin'
    } catch (err) {
      console.error('Error checking admin role:', err)
      return false
    }
  }

  // Función para agregar/quitar favoritos
  const toggleFavorito = async (lugarId: string, e?: MouseEvent<HTMLDivElement>): Promise<void> => {
    if (e) {
      e.stopPropagation()
    }
    
    if (!user) {
      router.push('/auth/login')
      return
    }

    const yaEsta = favoritos.includes(lugarId)
    
    try {
      if (yaEsta) {
        const { error } = await supabase
          .from('favoritos')
          .delete()
          .eq('usuario_id', user.id)
          .eq('lugar_id', lugarId)
        
        if (error) {
          console.error('Error al quitar favorito:', error)
          return
        }
      } else {
        const { error } = await supabase
          .from('favoritos')
          .insert({ 
            usuario_id: user.id, 
            lugar_id: lugarId 
          })
        
        if (error) {
          console.error('Error al agregar favorito:', error)
          return
        }
      }

      const { data, error } = await supabase
        .from('favoritos')
        .select('lugar_id')
        .eq('usuario_id', user.id)
      
      if (error) {
        console.error('Error al actualizar favoritos:', error)
      } else {
        setFavoritos(data ? data.map(f => f.lugar_id) : [])
      }
    } catch (error) {
      console.error('Error en toggleFavorito:', error)
    }
  }

  // Cargar lugares desde Supabase
  useEffect(() => {
    const fetchPlaces = async (): Promise<void> => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from('lugares')
          .select('id, nombre, descripcion, municipio, url_imagen, destacado')

        if (error) {
          console.error('Error al obtener lugares:', error)
          console.error('Detalles del error:', error.message)
        } else {
          console.log('Datos obtenidos:', data)
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

  // Verificar autenticación y suscripción
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | undefined

    const checkAuth = async (): Promise<void> => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setIsAuthenticated(true)
        setUser(session.user as User)
        fetchUserProfileImage(session.user.id)
        const adminStatus = await checkAdminRole(session.user.id)
        setIsAdmin(adminStatus)
      }

      const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setIsAuthenticated(!!session?.user)
        setUser(session?.user as User ?? null)

        if (session?.user) {
          fetchUserProfileImage(session.user.id)
          const adminStatus = await checkAdminRole(session.user.id)
          setIsAdmin(adminStatus)
        } else {
          setUserProfileImage(null)
          setIsAdmin(false)
        }
      })

      subscription = data.subscription
    }

    checkAuth()

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Contador de visitas
  useEffect(() => {
    const fetchVisitas = async (): Promise<void> => {
      try {
        const { data, error } = await supabase
          .from('contador_visitas')
          .select('total_visitas')
          .eq('id', 1)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching visits:', error)
          return
        }

        const visitasActuales = data?.total_visitas || 0
        setTotalVisitas(visitasActuales + 1)

        await supabase
          .from('contador_visitas')
          .upsert({
            id: 1,
            total_visitas: visitasActuales + 1
          })
      } catch (err) {
        console.error('Error with visit counter:', err)
      }
    }

    fetchVisitas()
  }, [])

  // Cargar favoritos del usuario
  useEffect(() => {
    const fetchFavoritos = async (): Promise<void> => {
      if (!user) {
        setFavoritos([])
        return
      }
      
      try {
        const { data, error } = await supabase
          .from('favoritos')
          .select('lugar_id')
          .eq('usuario_id', user.id)
        
        if (error) {
          console.error('Error al obtener favoritos:', error)
        } else {
          setFavoritos(data ? data.map(f => f.lugar_id) : [])
        }
      } catch (error) {
        console.error('Error al conectar con favoritos:', error)
      }
    }

    fetchFavoritos()
  }, [user])

  const handleLogout = async (): Promise<void> => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setUser(null)
    setUserProfileImage(null)
    setShowUserMenu(false)
  }

  // Event handlers
  const handleMouseEnterButton = (e: MouseEvent<HTMLButtonElement>, color: string): void => {
    e.currentTarget.style.backgroundColor = color
  }

  const handleMouseLeaveButton = (e: MouseEvent<HTMLButtonElement>, color: string): void => {
    e.currentTarget.style.backgroundColor = color
  }

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

  // Filtrar lugares
  const filtered: Lugar[] = places.filter(p => {
    const searchText = `${p.nombre || ''} ${p.descripcion || ''}`.toLowerCase()
    const matchesSearch = searchText.includes(search.toLowerCase())
    const matchesMunicipio = selectedMunicipio === 'Todos' || p.municipio === selectedMunicipio
    return matchesSearch && matchesMunicipio
  })

  const destacados: Lugar[] = places.filter(p => p.destacado === true)
  const noDestacados: Lugar[] = places.filter(p => p.destacado === false)

  const firstRowPlaces: Lugar[] = destacados
  const secondRowPlaces: Lugar[] = noDestacados

  // Navigation items
  const navItems: NavItem[] = [
    { name: 'Inicio', href: '/' },
    { name: 'Recomendaciones', href: '/recomendaciones' },
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Contacto', href: '/contacto' }
  ]

  // Loading state
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, #e0f7fa, #e6ffe9)',
        padding: '1rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 'clamp(40px, 8vw, 50px)',
            height: 'clamp(40px, 8vw, 50px)',
            border: '4px solid #004e92',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ 
            color: '#004e92', 
            fontSize: 'clamp(1rem, 3vw, 1.2rem)' 
          }}>
            Cargando lugares...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Modal de Cookies */}
      {showCookieModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>
              🍪
            </div>
            <h3 style={{
              color: '#004e92',
              margin: '0 0 1rem 0',
              fontSize: '1.4rem'
            }}>
              Usamos Cookies
            </h3>
            <p style={{
              color: '#666',
              margin: '0 0 1.5rem 0',
              lineHeight: '1.5'
            }}>
              Este sitio utiliza cookies para mejorar tu experiencia de navegación y ofrecerte contenido personalizado.
            </p>
            <button
              onClick={acceptCookies}
              style={{
                background: 'linear-gradient(135deg, #004e92, #00a86b)',
                color: 'white',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Aceptar Cookies
            </button>
          </div>
        </div>
      )}

      {/* Header responsive con menú hamburguesa */}
      <header style={{ 
        background: 'linear-gradient(135deg, #004e92, #00a86b)', 
        padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1rem, 3vw, 2rem)',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 0.8rem)' }}>
            <div style={{ 
              width: 'clamp(40px, 8vw, 50px)', 
              height: 'clamp(40px, 8vw, 50px)', 
              borderRadius: '50%', 
              overflow: 'hidden',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
             <Image 
  src="/logo.jpg" 
  alt="Logo"
  width={45}
  height={45}
  style={{ objectFit: 'cover' }}
/>

            </div>
            <h2 style={{ 
              margin: 0, 
              fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', 
              fontWeight: 'bold', 
              letterSpacing: 'clamp(1px, 0.3vw, 2px)' 
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
                    onMouseEnter={e => (e.target as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={e => (e.target as HTMLAnchorElement).style.background = 'transparent'}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right side - User menu and hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 1rem)' }}>
            {/* User Authentication */}
            {!isAuthenticated ? (
              <button
                onClick={() => router.push('/auth/login')}
                style={{ 
                  backgroundColor: 'white', 
                  color: '#004e92',
                  padding: 'clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.8rem, 2.5vw, 1rem)', 
                  border: 'none', 
                  borderRadius: '0.5rem', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
                }}
                onMouseEnter={e => handleMouseEnterButton(e, '#f0f0f0')}
                onMouseLeave={e => handleMouseLeaveButton(e, 'white')}
              >
                Iniciar sesión
              </button>
            ) : (
              <div style={{ position: 'relative' }}>
                {/* Avatar del usuario con imagen de perfil real */}
                <div
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    cursor: 'pointer', 
                    padding: 'clamp(0.3rem, 1vw, 0.5rem) clamp(0.5rem, 2vw, 1rem)', 
                    borderRadius: '2rem', 
                    background: 'rgba(255,255,255,0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                  <div style={{ 
                    width: 'clamp(30px, 6vw, 35px)', 
                    height: 'clamp(30px, 6vw, 35px)', 
                    borderRadius: '50%', 
                    background: 'white', 
                    color: '#333',
                    border: '2px solid #ddd',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
{userProfileImage ? (
  <Image
    src={userProfileImage} 
    alt="Perfil" 
    width={35}
    height={35}
    style={{ 
      objectFit: 'cover',
      borderRadius: '50%'
    }}
    onError={(e) => {
      console.error('Error loading image:', userProfileImage) // Para debugging
      const img = e.target as HTMLImageElement
      img.style.display = 'none'
      const nextElement = img.nextSibling as HTMLElement
      if (nextElement) {
        nextElement.style.display = 'flex'
      }
      // Opcional: limpiar la imagen problemática
      setUserProfileImage(null)
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
                      fontSize: 'clamp(1rem, 2.5vw, 1.2rem)'
                    }}>
                      👤
                    </div>
                  </div>
                  <span style={{ 
                    fontWeight: '500', 
                    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                    display: 'none'
                  }} className="desktop-only">
                    {user?.email?.split('@')[0] || user?.name || 'Usuario'}
                  </span>
                  <span style={{ 
                    fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', 
                    display: 'none' 
                  }} className="desktop-only">
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
                    minWidth: 'clamp(180px, 40vw, 200px)', 
                    overflow: 'hidden', 
                    zIndex: 1000
                  }}>
                    <div style={{ 
                      padding: '1rem', 
                      borderBottom: '1px solid #eee', 
                      color: '#333', 
                    }}>
                      <div style={{ 
                        fontWeight: 'bold', 
                        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' 
                      }}>
                        {user?.name || 'Usuario'}
                      </div>
                      <div style={{ 
                        fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)', 
                        color: '#666',
                        wordBreak: 'break-all'
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
                        padding: 'clamp(0.6rem, 2vw, 0.8rem) 1rem', 
                        border: 'none', 
                        background: 'transparent', 
                        color: '#333', 
                        textAlign: 'left', 
                        cursor: 'pointer',
                        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
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
                        padding: 'clamp(0.6rem, 2vw, 0.8rem) 1rem', 
                        border: 'none', 
                        background: 'transparent', 
                        color: '#333',
                        textAlign: 'left', 
                        cursor: 'pointer',
                        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      ❤️ Mis Favoritos
                    </button>
                    {isAdmin && (
                      <button 
                        onClick={() => {
                          setShowUserMenu(false)
                          router.push('/admin')
                        }} 
                        style={{ 
                          width: '100%', 
                          padding: 'clamp(0.6rem, 2vw, 0.8rem) 1rem', 
                          border: 'none', 
                          background: 'transparent', 
                          color: '#333',
                          textAlign: 'left', 
                          cursor: 'pointer',
                          fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                          transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        ⚙️ Panel de Administración
                      </button>
                    )}
                    
                    <div style={{ borderTop: '1px solid #eee' }}>
                      <button 
                        onClick={handleLogout} 
                        style={{ 
                          width: '100%', 
                          padding: 'clamp(0.6rem, 2vw, 0.8rem) 1rem', 
                          border: 'none', 
                          background: 'transparent', 
                          color: '#dc3545', 
                          textAlign: 'left', 
                          cursor: 'pointer',
                          fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
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
                fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
                cursor: 'pointer',
                padding: 'clamp(0.4rem, 1vw, 0.5rem)',
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
                        padding: 'clamp(0.8rem, 2.5vw, 1rem)',
                        display: 'block',
                        borderRadius: '0.5rem',
                        transition: 'all 0.3s ease',
                        fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                      }}
                      onMouseEnter={e => (e.target as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.2)'}
                      onMouseLeave={e => (e.target as HTMLAnchorElement).style.background = 'transparent'}
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
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

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
            <div style={{
              background: 'rgba(255,255,255,0.9)',
              padding: '1rem 1.5rem',
              borderRadius: '1rem',
              marginBottom: '1rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: '#004e92' }}>
                {user ? (
                  <span>👋 ¡Hola, <strong>{user.name || user.email?.split('@')[0] || 'Usuario'}!</strong></span>
                ) : (
                  <span>👋 ¡Bienvenido a Cultour!</span>
                )}
              </div>
              <div style={{ 
                fontSize: 'clamp(0.9rem, 2vw, 1rem)', 
                color: '#00a86b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>👥</span>
                <span><strong>{totalVisitas.toLocaleString()}</strong> visitas</span>
              </div>
            </div>
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
                color: '#333',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}
            >
              {municipios.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              onClick={() => router.push('/recomendaciones')}
              style={{
                background: 'linear-gradient(135deg, #004e92, #00a86b)',
                color: 'white',
                padding: '0.8rem 1.5rem',
                fontSize: '1rem',
                borderRadius: '2rem',
                border: 'none',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              🤖 Ver Recomendaciones IA
            </button>
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
                  <InfiniteCarousel 
                    places={firstRowPlaces} 
                    favoritos={favoritos} 
                    toggleFavorito={toggleFavorito} 
                  />
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
                  <InfiniteCarousel 
                    places={secondRowPlaces} 
                    favoritos={favoritos} 
                    toggleFavorito={toggleFavorito} 
                  />
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
                      onClick={() => router.push(`/lugares/${place.id}`)}
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
                        {/* Botón de favorito */}
                        <div
                          onClick={(e: MouseEvent<HTMLDivElement>) => toggleFavorito(place.id, e)}
                          style={{
                            position: 'absolute',
                            top: '1rem',
                            left: '1rem',
                            fontSize: '2rem',
                            cursor: 'pointer',
                            textShadow: '2px 2px 6px rgba(0,0,0,0.8)',
                            transition: 'all 0.3s ease',
                            transform: 'scale(1)',
                            zIndex: 20,
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            width: '45px',
                            height: '45px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(10px)'
                          }}
                          onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                            e.currentTarget.style.transform = 'scale(1.15)'
                            e.currentTarget.style.background = 'rgba(255,255,255,0.3)'
                          }}
                          onMouseLeave={(e: MouseEvent<HTMLDivElement>) => {
                            e.currentTarget.style.transform = 'scale(1)'
                            e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
                          }}
                        >
                          {favoritos.includes(place.id) ? (
                            <span style={{ color: '#ff4757', filter: 'drop-shadow(0 0 8px rgba(255,71,87,0.6))' }}>❤️</span>
                          ) : (
                            <span style={{ color: 'white', filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.8))' }}>🤍</span>
                          )}
                        </div>

                        <Image
                          src={place.url_imagen}
                          alt={place.nombre}
                          width={400}
                          height={220}
                          style={{
                            width: '100%',
                            height: '220px',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                          }}
                          onError={handleImageError}
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
              <p>Intenta con otros términos de búsqueda o selecciona &quot;Todos&quot; los municipios.</p>
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
    </div>
  )
}