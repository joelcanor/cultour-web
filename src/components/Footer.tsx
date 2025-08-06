import Link from 'next/link'
export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #004e92, #00a86b)',
      color: 'white',
      textAlign: 'center',
      padding: 'clamp(1.5rem, 4vw, 2rem)',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <p style={{ 
          margin: 0, 
          fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
          fontWeight: '300',
          lineHeight: 1.4
        }}>
          © 2025 Cultour. Todos los derechos reservados.
        </p>
        <p style={{ 
          margin: '0.5rem 0 0 0', 
          fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
          opacity: '0.8',
          lineHeight: 1.4
        }}>
          Vive la cultura, descubre la sierra
        </p>
        
        {/* Enlaces adicionales para móvil */}
        <div style={{
          marginTop: '1.5rem',
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(1rem, 4vw, 2rem)',
          flexWrap: 'wrap'
        }}>
          <a 
            href="/privacidad" 
            style={{ 
              color: 'rgba(255,255,255,0.8)', 
              textDecoration: 'none', 
              fontSize: 'clamp(0.75rem, 1.8vw, 0.85rem)',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={e => (e.target as HTMLElement).style.color = 'white'}
            onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.8)'}
          >
            Privacidad
          </a>
          <a 
            href="/terminos" 
            style={{ 
              color: 'rgba(255,255,255,0.8)', 
              textDecoration: 'none', 
              fontSize: 'clamp(0.75rem, 1.8vw, 0.85rem)',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={e => (e.target as HTMLElement).style.color = 'white'}
            onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.8)'}
          >
            Términos
          </a>
          <Link
            href="/contacto" 
            style={{ 
              color: 'rgba(255,255,255,0.8)', 
              textDecoration: 'none', 
              fontSize: 'clamp(0.75rem, 1.8vw, 0.85rem)',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={e => (e.target as HTMLElement).style.color = 'white'}
            onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.8)'}
          >
            Contacto
          </Link>
        </div>
      </div>
    </footer>
  )
}