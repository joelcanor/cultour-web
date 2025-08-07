import Layout from '@/components/Layout'
import { useState } from 'react'

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault()
    
    // Validar campos requeridos
    if (!formData.nombre || !formData.email || !formData.asunto || !formData.mensaje) {
      alert('Por favor completa todos los campos obligatorios (marcados con *)')
      return
    }
    
    // Construir el mensaje de WhatsApp (más corto para evitar problemas)
    const whatsappMessage = `🌟 Consulta Cultour 🌟

👤 ${formData.nombre}
📧 ${formData.email}
📱 ${formData.telefono || 'No proporcionado'}
📝 ${formData.asunto}

💬 ${formData.mensaje}

_Desde cultour web_`
    
    const whatsappLink = `https://wa.me/524272737288?text=${encodeURIComponent(whatsappMessage)}`
    
    // Abrir WhatsApp en nueva ventana
    window.open(whatsappLink, '_blank')
    
    // Limpiar formulario
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      asunto: '',
      mensaje: ''
    })
  }

  // Nuevo método: Abrir Gmail directamente
  const handleGmailDirect = (e) => {
    e.preventDefault()
    
    // Validar campos requeridos
    if (!formData.nombre || !formData.email || !formData.asunto || !formData.mensaje) {
      alert('Por favor completa todos los campos obligatorios (marcados con *)')
      return
    }
    
    const emailSubject = `Cultour - ${formData.asunto}`
    const emailBody = `Hola equipo de Cultour,

Nombre: ${formData.nombre}
Email: ${formData.email}
Teléfono: ${formData.telefono || 'No proporcionado'}
Asunto: ${formData.asunto}

Mensaje:
${formData.mensaje}

Saludos desde la web de Cultour`
    
    // URL para Gmail web
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=cultourweb@gmail.com&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
    
    // Abrir Gmail en nueva ventana
    window.open(gmailUrl, '_blank')
    
    // Limpiar formulario
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      asunto: '',
      mensaje: ''
    })
  }

  return (
    <Layout>
      <div style={{ 
        maxWidth: '1200px', 
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
            📞 Contacto
          </h1>
          <p style={{ 
            fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)', 
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            ¿Tienes preguntas sobre nuestra plataforma turística o necesitas información sobre la Sierra Gorda?
          </p>
        </div>

        {/* Contacto Rápido */}
        <section style={{
          background: 'white',
          padding: '2.5rem',
          borderRadius: '1.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
            color: '#004e92', 
            marginBottom: '2rem',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            🚀 Contacto Directo
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {/* WhatsApp */}
            <a
              href="https://wa.me/524272737288?text=Hola,%20me%20interesa%20conocer%20más%20sobre%20Cultour%20y%20la%20Sierra%20Gorda"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                borderRadius: '1rem',
                color: 'white',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
              }}
              onMouseEnter={e => {
                e.target.style.transform = 'translateY(-5px)'
                e.target.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.4)'
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'translateY(0px)'
                e.target.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.3)'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginRight: '1rem'
              }}>
                📱
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
                  WhatsApp - Respuesta Inmediata
                </h3>
                <p style={{ margin: 0, fontSize: '0.95rem', opacity: '0.9' }}>
                  +52 427 273 7288
                </p>
              </div>
            </a>

            {/* Gmail Web directo */}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=cultourweb@gmail.com&subject=Consulta%20Cultour&body=Hola%20equipo%20de%20Cultour,%0D%0A%0D%0AMe%20interesa%20conocer%20más%20información%20sobre..."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #EA4335, #FBBC05)',
                borderRadius: '1rem',
                color: 'white',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(234, 67, 53, 0.3)'
              }}
              onMouseEnter={e => {
                e.target.style.transform = 'translateY(-5px)'
                e.target.style.boxShadow = '0 8px 25px rgba(234, 67, 53, 0.4)'
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'translateY(0px)'
                e.target.style.boxShadow = '0 4px 15px rgba(234, 67, 53, 0.3)'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginRight: '1rem'
              }}>
                🌐
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
                  Gmail Web - Siempre Funciona
                </h3>
                <p style={{ margin: 0, fontSize: '0.95rem', opacity: '0.9' }}>
                  cultourweb@gmail.com
                </p>
              </div>
            </a>
          </div>
        </section>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Información de Contacto */}
          <section style={{
            background: 'white',
            padding: '2.5rem',
            borderRadius: '1.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            height: 'fit-content'
          }}>
            <h2 style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
              color: '#004e92', 
              marginBottom: '2rem',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              📍 Información de Contacto
            </h2>

            {/* Ubicación */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1.5rem',
              padding: '1rem',
              background: 'linear-gradient(135deg, #fff5f5, #fffafa)',
              borderRadius: '1rem',
              border: '1px solid #ffe6e6'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #DC143C, #B22222)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                marginRight: '1rem',
                color: 'white'
              }}>
                📍
              </div>
              <div>
                <h3 style={{ color: '#004e92', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                  Oficina de Desarrollo
                </h3>
                <p style={{ 
                  color: '#666', 
                  margin: 0,
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  lineHeight: '1.4'
                }}>
                  Jalpan de Serra, Querétaro, México
                </p>
              </div>
            </div>

            {/* Horarios */}
            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #004e92, #00a86b)',
              borderRadius: '1rem',
              color: 'white',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>
                🕒 Horarios de Atención
              </h3>
              <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}>
                Lunes a Viernes: 9:00 AM - 6:00 PM
              </p>
              <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}>
                Sábados: 9:00 AM - 2:00 PM
              </p>
              <p style={{ margin: '0.5rem 0', fontSize: '0.95rem', opacity: '0.8' }}>
                WhatsApp disponible 24/7
              </p>
            </div>

            {/* Respuesta rápida */}
            <div style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, #f0fff4, #f8fff8)',
              borderRadius: '1rem',
              border: '1px solid #e6ffe6',
              textAlign: 'center'
            }}>
              <h4 style={{ color: '#00a86b', margin: '0 0 0.5rem 0' }}>
                ⚡ Tiempo de Respuesta
              </h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                WhatsApp: Inmediato<br/>
                Email: 24-48 horas
              </p>
            </div>
          </section>

          {/* Formulario de Contacto Mejorado */}
          <section style={{
            background: 'white',
            padding: '2.5rem',
            borderRadius: '1.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
              color: '#004e92', 
              marginBottom: '1.5rem',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              📝 Formulario Personalizado
            </h2>

            <p style={{
              textAlign: 'center',
              color: '#666',
              marginBottom: '2rem',
              fontSize: '1rem'
            }}>
              Llena el formulario y envía tu consulta por tu método preferido
            </p>

            <form>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#004e92',
                    fontWeight: '500'
                  }}>
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={e => e.target.style.borderColor = '#004e92'}
                    onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#004e92',
                    fontWeight: '500'
                  }}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={e => e.target.style.borderColor = '#004e92'}
                    onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#004e92',
                  fontWeight: '500'
                }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#004e92'}
                  onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#004e92',
                  fontWeight: '500'
                }}>
                  Asunto *
                </label>
                <select
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                  onFocus={e => e.target.style.borderColor = '#004e92'}
                  onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                >
                  <option value="">Selecciona un tema</option>
                  <option value="información sobre la app">Información sobre la app</option>
                  <option value="soporte técnico">Soporte técnico</option>
                  <option value="sitios turísticos">Consulta sobre sitios turísticos</option>
                  <option value="colaboración">Colaboración</option>
                  <option value="sugerencias">Sugerencias de mejora</option>
                  <option value="reportar problema">Reportar un problema</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#004e92',
                  fontWeight: '500'
                }}>
                  Mensaje *
                </label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Describe tu consulta, problema o sugerencia con detalle..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    minHeight: '120px'
                  }}
                  onFocus={e => e.target.style.borderColor = '#004e92'}
                  onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              {/* Botones de envío - Solo Gmail Web y WhatsApp */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <button
                  type="button"
                  onClick={handleWhatsAppSubmit}
                  style={{
                    background: 'linear-gradient(135deg, #25D366, #128C7E)',
                    color: 'white',
                    padding: '1rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
                  }}
                  onMouseEnter={e => {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.4)'
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0px)'
                    e.target.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.3)'
                  }}
                >
                  📱 Enviar por WhatsApp
                </button>

                <button
                  type="button"
                  onClick={handleGmailDirect}
                  style={{
                    background: 'linear-gradient(135deg, #EA4335, #FBBC05)',
                    color: 'white',
                    padding: '1rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(234, 67, 53, 0.3)'
                  }}
                  onMouseEnter={e => {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 6px 20px rgba(234, 67, 53, 0.4)'
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0px)'
                    e.target.style.boxShadow = '0 4px 15px rgba(234, 67, 53, 0.3)'
                  }}
                >
                  🌐 Enviar por Gmail Web
                </button>
              </div>
            </form>

            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
              borderRadius: '0.5rem',
              textAlign: 'center',
              fontSize: '0.9rem',
              color: '#666'
            }}>
              <p style={{ margin: '0 0 0.5rem 0' }}>
                💡 <strong>Opciones de envío:</strong>
              </p>
              <p style={{ margin: 0, fontSize: '0.8rem' }}>
                📱 WhatsApp (inmediato) • 🌐 Gmail Web (siempre funciona)
              </p>
            </div>
          </section>
        </div>

        {/* Información de la App */}
        <section style={{
          background: 'white',
          padding: '2.5rem',
          borderRadius: '1.5rem',
          marginTop: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
            color: '#004e92', 
            marginBottom: '1.5rem',
            fontWeight: 'bold'
          }}>
            📲 Próximamente: App Cultour
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem'
          }}>
            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)',
              borderRadius: '1rem',
              border: '1px solid #bbdefb'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔔</div>
              <h3 style={{ color: '#004e92', marginBottom: '0.5rem' }}>Notificaciones Inteligentes</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Recibe alertas automáticas cuando te acerques a sitios de interés histórico o natural
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #f1f8e9, #e8f5e8)',
              borderRadius: '1rem',
              border: '1px solid #c8e6c9'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🗺️</div>
              <h3 style={{ color: '#00a86b', marginBottom: '0.5rem' }}>Mapa Interactivo</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Navegación offline con puntos de interés marcados y rutas sugeridas
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #fff3e0, #fce4ec)',
              borderRadius: '1rem',
              border: '1px solid #ffcc02'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</div>
              <h3 style={{ color: '#f57c00', marginBottom: '0.5rem' }}>Guías Culturales</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Información detallada sobre historia, tradiciones y curiosidades locales
              </p>
            </div>
          </div>
        </section>

        {/* Soporte y FAQ */}
        <section style={{
          background: 'white',
          padding: '2.5rem',
          borderRadius: '1.5rem',
          marginTop: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
            color: '#004e92', 
            marginBottom: '2rem',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            ❓ Preguntas Frecuentes
          </h2>
          
          <div style={{
            display: 'grid',
            gap: '1rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ color: '#004e92', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                ¿Cuándo estará disponible la app?
              </h3>
              <p style={{ color: '#666', margin: 0, fontSize: '0.95rem' }}>
                Estamos en fase de desarrollo. Suscríbete a nuestras notificaciones para ser el primero en saberlo.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ color: '#004e92', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                ¿La app funcionará sin internet?
              </h3>
              <p style={{ color: '#666', margin: 0, fontSize: '0.95rem' }}>
                Sí, tendrás acceso a mapas offline y información básica. Las notificaciones requieren GPS activo.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ color: '#004e92', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                ¿Cómo puedo colaborar con contenido local?
              </h3>
              <p style={{ color: '#666', margin: 0, fontSize: '0.95rem' }}>
                Contáctanos por email o WhatsApp. Buscamos colaboradores locales para enriquecer el contenido.
              </p>
            </div>
          </div>
        </section>

        {/* Redes Sociales */}
        <section style={{
          background: 'linear-gradient(135deg, #004e92, #00a86b)',
          padding: '2rem',
          borderRadius: '1.5rem',
          marginTop: '2rem',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
            marginBottom: '1rem',
            fontWeight: 'bold'
          }}>
            🌐 Síguenos para Actualizaciones
          </h2>
          <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
            Mantente informado sobre el desarrollo de la app y descubrimientos en la Sierra Gorda
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
          

            

    
          </div>
        </section>
      </div>
    </Layout>
  )
}