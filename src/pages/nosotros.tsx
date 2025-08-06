import Layout from '@/components/Layout'

export default function Nosotros(props) {
  return (
    <Layout {...props}>
      <div style={{ 
        maxWidth: '1000px', 
        margin: '0 auto',
        background: 'linear-gradient(to bottom, #e0f7fa, #e6ffe9)',
        minHeight: '100vh',
        padding: '2rem 1rem'
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          background: 'rgba(255,255,255,0.9)',
          padding: '3rem 2rem',
          borderRadius: '2rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #004e92, #00a86b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            📱 Sobre Cultour
          </h1>
          <p style={{ 
            fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)', 
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Tu guía digital inteligente para descubrir la Sierra Gorda Queretana
          </p>
        </div>

        {/* Qué es Cultour */}
        <section style={{
          background: 'white',
          padding: '2.5rem',
          borderRadius: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #004e92, #00a86b)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              marginRight: '1rem'
            }}>
              📍
            </div>
            <h2 style={{ 
              fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', 
              color: '#004e92', 
              margin: 0,
              fontWeight: 'bold'
            }}>
              ¿Qué es Cultour?
            </h2>
          </div>
          <p style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.2rem)', 
            lineHeight: '1.8',
            color: '#555',
            marginBottom: '1.5rem'
          }}>
            Cultour es una plataforma digital innovadora que te conecta con la riqueza cultural 
            y natural de la Sierra Gorda Queretana. No somos una agencia de viajes tradicional, 
            sino tu compañero digital inteligente que te brinda información valiosa sobre sitios 
            turísticos, historia local y puntos de interés.
          </p>
          <p style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.2rem)', 
            lineHeight: '1.8',
            color: '#555'
          }}>
            A través de notificaciones inteligentes basadas en tu ubicación, descubrirás lugares 
            fascinantes, aprenderás sobre la historia y cultura local, y obtendrás recomendaciones 
            personalizadas para hacer tu visita memorable.
          </p>
        </section>

        {/* Cómo Funciona */}
        <section style={{
          background: 'white',
          padding: '2.5rem',
          borderRadius: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #00a86b, #004e92)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              marginRight: '1rem'
            }}>
              ⚡
            </div>
            <h2 style={{ 
              fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', 
              color: '#00a86b', 
              margin: 0,
              fontWeight: 'bold'
            }}>
              ¿Cómo Funciona?
            </h2>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #e3f2fd, #f0f8ff)',
              padding: '1.5rem',
              borderRadius: '1rem',
              textAlign: 'center',
              border: '2px solid #bbdefb'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📲</div>
              <h3 style={{ color: '#004e92', marginBottom: '1rem', fontSize: '1.3rem' }}>
                Activa Notificaciones
              </h3>
              <p style={{ color: '#666', fontSize: '1rem', lineHeight: '1.6' }}>
                Permite el acceso a tu ubicación para recibir información relevante cuando te acerques a sitios de interés
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #e8f5e8, #f0f8ff)',
              padding: '1.5rem',
              borderRadius: '1rem',
              textAlign: 'center',
              border: '2px solid #c8e6c9'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🗺️</div>
              <h3 style={{ color: '#00a86b', marginBottom: '1rem', fontSize: '1.3rem' }}>
                Explora Libremente
              </h3>
              <p style={{ color: '#666', fontSize: '1rem', lineHeight: '1.6' }}>
                Recorre la Sierra Gorda a tu ritmo. La app detectará automáticamente cuando estés cerca de lugares especiales
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #fff3e0, #f3e5f5)',
              padding: '1.5rem',
              borderRadius: '1rem',
              textAlign: 'center',
              border: '2px solid #ffcc02'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💡</div>
              <h3 style={{ color: '#f57c00', marginBottom: '1rem', fontSize: '1.3rem' }}>
                Recibe Información
              </h3>
              <p style={{ color: '#666', fontSize: '1rem', lineHeight: '1.6' }}>
                Obtén datos históricos, curiosidades, recomendaciones y consejos útiles sobre cada sitio que visites
              </p>
            </div>
          </div>
        </section>

        {/* Qué Incluye */}
        <section style={{
          background: 'white',
          padding: '2.5rem',
          borderRadius: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', 
            color: '#004e92', 
            marginBottom: '2rem',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            🌟 Qué Incluye Nuestra Plataforma
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #fce4ec, #e8eaf6)',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '2px solid #f8bbd9'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏛️</div>
              <h3 style={{ color: '#004e92', marginBottom: '1rem', fontSize: '1.2rem' }}>
                Sitios Históricos
              </h3>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Información detallada sobre las 5 Misiones Franciscanas, sitios arqueológicos, 
                y edificaciones coloniales con su historia y significado cultural.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #e8f5e8, #f0f8ff)',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '2px solid #c8e6c9'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌿</div>
              <h3 style={{ color: '#00a86b', marginBottom: '1rem', fontSize: '1.2rem' }}>
                Áreas Naturales
              </h3>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Reservas naturales, miradores, cascadas, grutas y senderos interpretativos 
                con información sobre flora, fauna y ecosistemas únicos.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #fff3e0, #f3e5f5)',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '2px solid #ffcc02'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎭</div>
              <h3 style={{ color: '#f57c00', marginBottom: '1rem', fontSize: '1.2rem' }}>
                Cultura Local
              </h3>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Tradiciones, festivales, artesanías locales, gastronomía típica 
                y lugares donde experimentar la cultura auténtica de la región.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #e1f5fe, #f3e5f5)',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '2px solid #b3e5fc'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📍</div>
              <h3 style={{ color: '#0277bd', marginBottom: '1rem', fontSize: '1.2rem' }}>
                Puntos de Interés
              </h3>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Miradores, lugares fotogénicos, centros de visitantes, museos 
                comunitarios y espacios de interpretación ambiental.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f3e5f5, #e8f5e8)',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '2px solid #ce93d8'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🍽️</div>
              <h3 style={{ color: '#7b1fa2', marginBottom: '1rem', fontSize: '1.2rem' }}>
                Gastronomía
              </h3>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Restaurantes locales, fondas familiares, platillos típicos 
                y ingredientes autóctonos de la Sierra Gorda.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #ffebee, #f1f8e9)',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '2px solid #ffcdd2'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🛏️</div>
              <h3 style={{ color: '#d32f2f', marginBottom: '1rem', fontSize: '1.2rem' }}>
                Servicios
              </h3>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Hoteles, cabañas, casas rurales, servicios médicos, 
                transporte local y centros de información turística.
              </p>
            </div>
          </div>
        </section>

        {/* Tecnología */}
        <section style={{
          background: 'white',
          padding: '2.5rem',
          borderRadius: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', 
            color: '#004e92', 
            marginBottom: '2rem',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            🤖 Tecnología Inteligente
          </h2>
          <div style={{
            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
            padding: '2rem',
            borderRadius: '1rem',
            textAlign: 'center'
          }}>
            <p style={{ 
              fontSize: 'clamp(1rem, 2vw, 1.2rem)', 
              lineHeight: '1.8',
              color: '#555',
              marginBottom: '1.5rem'
            }}>
              Utilizamos geolocalización avanzada y algoritmos inteligentes para detectar tu proximidad 
              a sitios de interés y enviarte notificaciones relevantes en el momento perfecto.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1rem',
              background: 'rgba(0,78,146,0.1)',
              padding: '1rem 2rem',
              borderRadius: '2rem',
              marginTop: '1rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>📡</span>
              <span style={{ color: '#004e92', fontWeight: '600' }}>
                GPS + Inteligencia Artificial + Base de Datos Local
              </span>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section style={{
          background: 'linear-gradient(135deg, #004e92, #00a86b)',
          padding: '3rem 2rem',
          borderRadius: '1.5rem',
          textAlign: 'center',
          color: 'white',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', 
            marginBottom: '1rem',
            fontWeight: 'bold'
          }}>
            🚀 Comienza tu Aventura Digital
          </h2>
          <p style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.2rem)', 
            lineHeight: '1.6',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem auto'
          }}>
            Descarga la app, activa las notificaciones y déjate sorprender por todo lo que 
            la Sierra Gorda tiene para ofrecerte. ¡Tu guía inteligente te está esperando!
          </p>
          <button
            onClick={() => window.location.href = '/contacto'}
            style={{
              background: 'white',
              color: '#004e92',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '2rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={e => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)'
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'translateY(0px)'
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'
            }}
          >
            Más Información 📱
          </button>
        </section>
      </div>
    </Layout>
  )
}