import Layout from '@/components/Layout'
import { MouseEvent, useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'

interface NosotrosProps {
  user: User | null
  isAuthenticated: boolean
  showUserMenu: boolean
  setShowUserMenu: (value: boolean) => void
  handleLogout: () => void
}

export default function Nosotros(props: NosotrosProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 480)
      setIsTablet(window.innerWidth < 768)
    }

    // Configuración inicial
    handleResize()
    
    // Listener para cambios de tamaño
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    background: 'linear-gradient(to bottom, #e0f7fa, #e6ffe9)',
    minHeight: '100vh',
    padding: 'clamp(1rem, 3vw, 2rem) clamp(0.75rem, 2vw, 1rem)'
  }

  const heroStyle = {
    textAlign: 'center' as const,
    marginBottom: 'clamp(2rem, 4vw, 3rem)',
    background: 'rgba(255,255,255,0.95)',
    padding: 'clamp(2rem, 5vw, 3rem) clamp(1rem, 3vw, 2rem)',
    borderRadius: 'clamp(1rem, 2vw, 2rem)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
  }

  const sectionStyle = {
    background: 'white',
    padding: 'clamp(1.5rem, 4vw, 2.5rem)',
    borderRadius: 'clamp(1rem, 2vw, 1.5rem)',
    marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  }

  const iconContainerStyle = {
    width: 'clamp(50px, 8vw, 60px)',
    height: 'clamp(50px, 8vw, 60px)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
    flexShrink: 0
  }

  const headerFlexStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
    flexDirection: isMobile ? 'column' : 'row' as 'column' | 'row',
    textAlign: isMobile ? 'center' : 'left' as 'center' | 'left'
  }

  const gridStyle = {
    display: 'grid',
    gap: 'clamp(1rem, 3vw, 1.5rem)',
    marginTop: 'clamp(1.5rem, 4vw, 2rem)'
  }

  const stepCardStyle = {
    padding: 'clamp(1rem, 3vw, 1.5rem)',
    borderRadius: 'clamp(0.75rem, 2vw, 1rem)',
    textAlign: 'center' as const
  }

  const featureCardStyle = {
    padding: 'clamp(1rem, 3vw, 1.5rem)',
    borderRadius: 'clamp(0.75rem, 2vw, 1rem)'
  }

  const ctaStyle = {
    background: 'linear-gradient(135deg, #004e92, #00a86b)',
    padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2rem)',
    borderRadius: 'clamp(1rem, 2vw, 1.5rem)',
    textAlign: 'center' as const,
    color: 'white',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
  }

  const buttonStyle = {
    background: 'white',
    color: '#004e92',
    padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
    fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
    fontWeight: 'bold' as const,
    border: 'none',
    borderRadius: 'clamp(1.5rem, 4vw, 2rem)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    width: isMobile ? '100%' : 'auto',
    maxWidth: '300px'
  }

  return (
    <Layout {...props}>
      <div style={containerStyle}>
        {/* Hero Section */}
        <div style={heroStyle}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 6vw, 3.5rem)', 
            fontWeight: 'bold', 
            marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
            background: 'linear-gradient(135deg, #004e92, #00a86b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '1.2'
          }}>
            📱 Sobre Cultour
          </h1>
          <p style={{ 
            fontSize: 'clamp(1rem, 3vw, 1.3rem)', 
            color: '#666',
            maxWidth: '100%',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Tu guía digital inteligente para descubrir la Sierra Gorda Queretana
          </p>
        </div>

        {/* Qué es Cultour */}
        <section style={sectionStyle}>
          <div style={{
            ...headerFlexStyle,
            marginRight: isMobile ? '0' : '1rem',
            marginBottom: isMobile ? '1rem' : '0'
          }}>
            <div style={{
              ...iconContainerStyle,
              background: 'linear-gradient(135deg, #004e92, #00a86b)',
              marginRight: isMobile ? '0' : '1rem',
              marginBottom: isMobile ? '1rem' : '0'
            }}>
              📍
            </div>
            <h2 style={{ 
              fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', 
              color: '#004e92', 
              margin: 0,
              fontWeight: 'bold',
              lineHeight: '1.3'
            }}>
              ¿Qué es Cultour?
            </h2>
          </div>
          <p style={{ 
            fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', 
            lineHeight: '1.7',
            color: '#555',
            marginBottom: 'clamp(1rem, 3vw, 1.5rem)'
          }}>
            Cultour es una plataforma digital innovadora que te conecta con la riqueza cultural 
            y natural de la Sierra Gorda Queretana. No somos una agencia de viajes tradicional, 
            sino tu compañero digital inteligente que te brinda información valiosa sobre sitios 
            turísticos, historia local y puntos de interés.
          </p>
          <p style={{ 
            fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', 
            lineHeight: '1.7',
            color: '#555'
          }}>
            A través de notificaciones inteligentes basadas en tu ubicación, descubrirás lugares 
            fascinantes, aprenderás sobre la historia y cultura local, y obtendrás recomendaciones 
            personalizadas para hacer tu visita memorable.
          </p>
        </section>

        {/* Cómo Funciona */}
        <section style={sectionStyle}>
          <div style={headerFlexStyle}>
            <div style={{
              ...iconContainerStyle,
              background: 'linear-gradient(135deg, #00a86b, #004e92)',
              marginRight: isMobile ? '0' : '1rem',
              marginBottom: isMobile ? '1rem' : '0'
            }}>
              ⚡
            </div>
            <h2 style={{ 
              fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', 
              color: '#00a86b', 
              margin: 0,
              fontWeight: 'bold',
              lineHeight: '1.3'
            }}>
              ¿Cómo Funciona?
            </h2>
          </div>
          
          <div style={{
            ...gridStyle,
            gridTemplateColumns: isTablet ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))'
          }}>
            <div style={{
              ...stepCardStyle,
              background: 'linear-gradient(135deg, #e3f2fd, #f0f8ff)',
              border: '2px solid #bbdefb'
            }}>
              <div style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>📲</div>
              <h3 style={{ 
                color: '#004e92', 
                marginBottom: 'clamp(0.75rem, 2vw, 1rem)', 
                fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
                lineHeight: '1.3'
              }}>
                Activa Notificaciones
              </h3>
              <p style={{ 
                color: '#666', 
                fontSize: 'clamp(0.85rem, 2.2vw, 1rem)', 
                lineHeight: '1.6' 
              }}>
                Permite el acceso a tu ubicación para recibir información relevante cuando te acerques a sitios de interés
              </p>
            </div>

            <div style={{
              ...stepCardStyle,
              background: 'linear-gradient(135deg, #e8f5e8, #f0f8ff)',
              border: '2px solid #c8e6c9'
            }}>
              <div style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>🗺️</div>
              <h3 style={{ 
                color: '#00a86b', 
                marginBottom: 'clamp(0.75rem, 2vw, 1rem)', 
                fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
                lineHeight: '1.3'
              }}>
                Explora Libremente
              </h3>
              <p style={{ 
                color: '#666', 
                fontSize: 'clamp(0.85rem, 2.2vw, 1rem)', 
                lineHeight: '1.6' 
              }}>
                Recorre la Sierra Gorda a tu ritmo. La app detectará automáticamente cuando estés cerca de lugares especiales
              </p>
            </div>

            <div style={{
              ...stepCardStyle,
              background: 'linear-gradient(135deg, #fff3e0, #f3e5f5)',
              border: '2px solid #ffcc02'
            }}>
              <div style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>💡</div>
              <h3 style={{ 
                color: '#f57c00', 
                marginBottom: 'clamp(0.75rem, 2vw, 1rem)', 
                fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
                lineHeight: '1.3'
              }}>
                Recibe Información
              </h3>
              <p style={{ 
                color: '#666', 
                fontSize: 'clamp(0.85rem, 2.2vw, 1rem)', 
                lineHeight: '1.6' 
              }}>
                Obtén datos históricos, curiosidades, recomendaciones y consejos útiles sobre cada sitio que visites
              </p>
            </div>
          </div>
        </section>

        {/* Qué Incluye */}
        <section style={sectionStyle}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', 
            color: '#004e92', 
            marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
            textAlign: 'center',
            fontWeight: 'bold',
            lineHeight: '1.3'
          }}>
            🌟 Qué Incluye Nuestra Plataforma
          </h2>
          
          <div style={{
            ...gridStyle,
            gridTemplateColumns: isMobile ? '1fr' : 
                                 isTablet ? 'repeat(2, 1fr)' : 
                                 'repeat(auto-fit, minmax(280px, 1fr))'
          }}>
            {[
              {
                icon: '🏛️',
                title: 'Sitios Históricos',
                description: 'Información detallada sobre las 5 Misiones Franciscanas, sitios arqueológicos, y edificaciones coloniales con su historia y significado cultural.',
                gradient: 'linear-gradient(135deg, #fce4ec, #e8eaf6)',
                border: '#f8bbd9',
                color: '#004e92'
              },
              {
                icon: '🌿',
                title: 'Áreas Naturales',
                description: 'Reservas naturales, miradores, cascadas, grutas y senderos interpretativos con información sobre flora, fauna y ecosistemas únicos.',
                gradient: 'linear-gradient(135deg, #e8f5e8, #f0f8ff)',
                border: '#c8e6c9',
                color: '#00a86b'
              },
              {
                icon: '🎭',
                title: 'Cultura Local',
                description: 'Tradiciones, festivales, artesanías locales, gastronomía típica y lugares donde experimentar la cultura auténtica de la región.',
                gradient: 'linear-gradient(135deg, #fff3e0, #f3e5f5)',
                border: '#ffcc02',
                color: '#f57c00'
              },
              {
                icon: '📍',
                title: 'Puntos de Interés',
                description: 'Miradores, lugares fotogénicos, centros de visitantes, museos comunitarios y espacios de interpretación ambiental.',
                gradient: 'linear-gradient(135deg, #e1f5fe, #f3e5f5)',
                border: '#b3e5fc',
                color: '#0277bd'
              },
              {
                icon: '🍽️',
                title: 'Gastronomía',
                description: 'Restaurantes locales, fondas familiares, platillos típicos y ingredientes autóctonos de la Sierra Gorda.',
                gradient: 'linear-gradient(135deg, #f3e5f5, #e8f5e8)',
                border: '#ce93d8',
                color: '#7b1fa2'
              },
              {
                icon: '🛏️',
                title: 'Servicios',
                description: 'Hoteles, cabañas, casas rurales, servicios médicos, transporte local y centros de información turística.',
                gradient: 'linear-gradient(135deg, #ffebee, #f1f8e9)',
                border: '#ffcdd2',
                color: '#d32f2f'
              }
            ].map((item, index) => (
              <div key={index} style={{
                ...featureCardStyle,
                background: item.gradient,
                border: `2px solid ${item.border}`
              }}>
                <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>{item.icon}</div>
                <h3 style={{ 
                  color: item.color, 
                  marginBottom: 'clamp(0.75rem, 2vw, 1rem)', 
                  fontSize: 'clamp(1rem, 2.8vw, 1.2rem)',
                  lineHeight: '1.3'
                }}>
                  {item.title}
                </h3>
                <p style={{ 
                  color: '#666', 
                  fontSize: 'clamp(0.8rem, 2.2vw, 0.95rem)', 
                  lineHeight: '1.6' 
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Tecnología */}
        <section style={sectionStyle}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', 
            color: '#004e92', 
            marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
            textAlign: 'center',
            fontWeight: 'bold',
            lineHeight: '1.3'
          }}>
            🤖 Tecnología Inteligente
          </h2>
          <div style={{
            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
            padding: 'clamp(1.5rem, 4vw, 2rem)',
            borderRadius: 'clamp(0.75rem, 2vw, 1rem)',
            textAlign: 'center'
          }}>
            <p style={{ 
              fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', 
              lineHeight: '1.7',
              color: '#555',
              marginBottom: 'clamp(1rem, 3vw, 1.5rem)'
            }}>
              Utilizamos geolocalización avanzada y algoritmos inteligentes para detectar tu proximidad 
              a sitios de interés y enviarte notificaciones relevantes en el momento perfecto.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'clamp(0.5rem, 2vw, 1rem)',
              background: 'rgba(0,78,146,0.1)',
              padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 2rem)',
              borderRadius: 'clamp(1rem, 3vw, 2rem)',
              marginTop: 'clamp(0.75rem, 2vw, 1rem)',
              flexDirection: isMobile ? 'column' : 'row',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>📡</span>
              <span style={{ 
                color: '#004e92', 
                fontWeight: '600',
                fontSize: 'clamp(0.85rem, 2.2vw, 1rem)'
              }}>
                GPS + Inteligencia Artificial + Base de Datos Local
              </span>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section style={ctaStyle}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', 
            marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
            fontWeight: 'bold',
            lineHeight: '1.3'
          }}>
            🚀 Comienza tu Aventura Digital
          </h2>
          <p style={{ 
            fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', 
            lineHeight: '1.6',
            marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
            maxWidth: '100%',
            margin: '0 auto 2rem auto'
          }}>
            Descarga la app, activa las notificaciones y déjate sorprender por todo lo que 
            la Sierra Gorda tiene para ofrecerte. ¡Tu guía inteligente te está esperando!
          </p>
          <button
            onClick={() => window.location.href = '/contacto'}
            style={buttonStyle}
            onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)'
            }}
            onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.transform = 'translateY(0px)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'
            }}
          >
            Más Información 📱
          </button>
        </section>
      </div>
    </Layout>
  )
}