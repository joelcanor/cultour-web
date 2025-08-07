import Layout from '@/components/Layout'
import { useState, ChangeEvent, FormEvent } from 'react'
import type { User } from '@supabase/supabase-js'

export default function Contacto() {
  // Props para Layout - página pública sin autenticación
  const [showUserMenu, setShowUserMenu] = useState(false)
  const user: User | null = null
  const isAuthenticated = false
  const handleLogout = () => {}
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleWhatsAppSubmit = (e: FormEvent<HTMLButtonElement>) => {
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
  const handleGmailDirect = (e: FormEvent<HTMLButtonElement>) => {
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
    <Layout 
      user={user}
      isAuthenticated={isAuthenticated}
      showUserMenu={showUserMenu}
      setShowUserMenu={setShowUserMenu}
      handleLogout={handleLogout}
    >
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        background: 'linear-gradient(to bottom, #e0f7fa, #e6ffe9)',
        minHeight: '100vh',
        padding: 'clamp(1rem, 4vw, 2rem)' // 📱 Padding fluido
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'clamp(2rem, 6vw, 3rem)', // 📱 Margin fluido
          background: 'rgba(255,255,255,0.9)',
          padding: 'clamp(1.5rem, 5vw, 3rem) clamp(1rem, 3vw, 2rem)', // 📱 Padding adaptativo
          borderRadius: 'clamp(1rem, 3vw, 2rem)', // 📱 Border radius fluido
          boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 6vw, 3.5rem)', // 📱 Mejorado el tamaño mínimo
            fontWeight: 'bold', 
            marginBottom: 'clamp(0.5rem, 2vw, 1rem)', // 📱 Margin fluido
            background: 'linear-gradient(135deg, #004e92, #00a86b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            📞 Contacto
          </h1>
          <p style={{ 
            fontSize: 'clamp(1rem, 3vw, 1.3rem)', // 📱 Tamaño más conservador
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 'clamp(1.4, 2vw, 1.6)' // 📱 Line height fluido
          }}>
            ¿Tienes preguntas sobre nuestra plataforma turística o necesitas información sobre la Sierra Gorda?
          </p>
        </div>

        {/* Contacto Rápido */}
        <section style={{
          background: 'white',
          padding: 'clamp(1.5rem, 4vw, 2.5rem)', // 📱 Padding adaptativo
          borderRadius: 'clamp(1rem, 2vw, 1.5rem)', // 📱 Border radius fluido
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          marginBottom: 'clamp(1.5rem, 4vw, 2rem)' // 📱 Margin fluido
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.3rem, 4vw, 2rem)', // 📱 Mejor escala en móviles
            color: '#004e92', 
            marginBottom: 'clamp(1.5rem, 4vw, 2rem)', // 📱 Margin fluido
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            🚀 Contacto Directo
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // 📱 Reducido de 300px a 280px
            gap: 'clamp(1rem, 3vw, 1.5rem)', // 📱 Gap fluido
            marginBottom: 'clamp(1.5rem, 4vw, 2rem)' // 📱 Margin fluido
          }}>
            {/* WhatsApp */}
            <a
              href="https://wa.me/524272737288?text=Hola,%20me%20interesa%20conocer%20más%20sobre%20Cultour%20y%20la%20Sierra%20Gorda"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: 'clamp(1rem, 3vw, 1.5rem)', // 📱 Padding fluido
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                borderRadius: 'clamp(0.75rem, 2vw, 1rem)', // 📱 Border radius fluido
                color: 'white',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
                flexDirection: 'row', // 📱 Forzar dirección horizontal
                gap: 'clamp(0.5rem, 2vw, 1rem)' // 📱 Gap entre elementos
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.4)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0px)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.3)'
              }}
            >
              <div style={{
                width: 'clamp(45px, 8vw, 60px)', // 📱 Tamaño fluido del icono
                height: 'clamp(45px, 8vw, 60px)',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', // 📱 Icono fluido
                flexShrink: 0 // 📱 No reducir el icono
              }}>
                📱
              </div>
              <div style={{ minWidth: 0 }}> {/* 📱 Permitir que el texto se contraiga */}
                <h3 style={{ 
                  margin: '0 0 0.5rem 0', 
                  fontSize: 'clamp(1rem, 3vw, 1.2rem)', // 📱 Texto fluido
                  lineHeight: 1.2 // 📱 Line height compacto
                }}>
                  WhatsApp - Respuesta Inmediata
                </h3>
                <p style={{ 
                  margin: 0, 
                  fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', // 📱 Texto secundario fluido
                  opacity: '0.9',
                  wordBreak: 'break-all' // 📱 Permitir quebrar el número
                }}>
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
                padding: 'clamp(1rem, 3vw, 1.5rem)', // 📱 Padding fluido
                background: 'linear-gradient(135deg, #EA4335, #FBBC05)',
                borderRadius: 'clamp(0.75rem, 2vw, 1rem)', // 📱 Border radius fluido
                color: 'white',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(234, 67, 53, 0.3)',
                flexDirection: 'row', // 📱 Forzar dirección horizontal
                gap: 'clamp(0.5rem, 2vw, 1rem)' // 📱 Gap entre elementos
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(234, 67, 53, 0.4)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0px)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(234, 67, 53, 0.3)'
              }}
            >
              <div style={{
                width: 'clamp(45px, 8vw, 60px)', // 📱 Tamaño fluido del icono
                height: 'clamp(45px, 8vw, 60px)',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', // 📱 Icono fluido
                flexShrink: 0 // 📱 No reducir el icono
              }}>
                🌐
              </div>
              <div style={{ minWidth: 0 }}> {/* 📱 Permitir que el texto se contraiga */}
                <h3 style={{ 
                  margin: '0 0 0.5rem 0', 
                  fontSize: 'clamp(1rem, 3vw, 1.2rem)', // 📱 Texto fluido
                  lineHeight: 1.2 // 📱 Line height compacto
                }}>
                  Gmail Web - Siempre Funciona
                </h3>
                <p style={{ 
                  margin: 0, 
                  fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', // 📱 Texto secundario fluido
                  opacity: '0.9',
                  wordBreak: 'break-all' // 📱 Permitir quebrar el email
                }}>
                  cultourweb@gmail.com
                </p>
              </div>
            </a>
          </div>
        </section>

        {/* Layout principal - Información y Formulario */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // 📱 Reducido de 400px a 280px
          gap: 'clamp(1.5rem, 4vw, 2rem)', // 📱 Gap fluido
          alignItems: 'start'
        }}>
          {/* Información de Contacto */}
          <section style={{
            background: 'white',
            padding: 'clamp(1.5rem, 4vw, 2.5rem)', // 📱 Padding adaptativo
            borderRadius: 'clamp(1rem, 2vw, 1.5rem)', // 📱 Border radius fluido
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            height: 'fit-content'
          }}>
            <h2 style={{ 
              fontSize: 'clamp(1.3rem, 4vw, 2rem)', // 📱 Mejor escala
              color: '#004e92', 
              marginBottom: 'clamp(1.5rem, 4vw, 2rem)', // 📱 Margin fluido
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              📍 Información de Contacto
            </h2>

            {/* Ubicación */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 'clamp(1rem, 3vw, 1.5rem)', // 📱 Margin fluido
              padding: 'clamp(0.75rem, 2vw, 1rem)', // 📱 Padding fluido
              background: 'linear-gradient(135deg, #fff5f5, #fffafa)',
              borderRadius: 'clamp(0.75rem, 2vw, 1rem)', // 📱 Border radius fluido
              border: '1px solid #ffe6e6',
              gap: 'clamp(0.5rem, 2vw, 1rem)' // 📱 Gap fluido
            }}>
              <div style={{
                width: 'clamp(40px, 8vw, 50px)', // 📱 Tamaño fluido
                height: 'clamp(40px, 8vw, 50px)',
                background: 'linear-gradient(135deg, #DC143C, #B22222)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', // 📱 Icono fluido
                color: 'white',
                flexShrink: 0 // 📱 No reducir el icono
              }}>
                📍
              </div>
              <div style={{ minWidth: 0 }}> {/* 📱 Permitir contracción del texto */}
                <h3 style={{ 
                  color: '#004e92', 
                  margin: '0 0 0.5rem 0', 
                  fontSize: 'clamp(1rem, 3vw, 1.1rem)', // 📱 Texto fluido
                  lineHeight: 1.2
                }}>
                  Oficina de Desarrollo
                </h3>
                <p style={{ 
                  color: '#666', 
                  margin: 0,
                  fontSize: 'clamp(0.85rem, 2.5vw, 1rem)', // 📱 Texto fluido
                  lineHeight: 1.4
                }}>
                  Jalpan de Serra, Querétaro, México
                </p>
              </div>
            </div>

            {/* Horarios */}
            <div style={{
              padding: 'clamp(1rem, 3vw, 1.5rem)', // 📱 Padding fluido
              background: 'linear-gradient(135deg, #004e92, #00a86b)',
              borderRadius: 'clamp(0.75rem, 2vw, 1rem)', // 📱 Border radius fluido
              color: 'white',
              textAlign: 'center',
              marginBottom: 'clamp(1rem, 3vw, 1.5rem)' // 📱 Margin fluido
            }}>
              <h3 style={{ 
                margin: '0 0 1rem 0', 
                fontSize: 'clamp(1rem, 3vw, 1.1rem)' // 📱 Texto fluido
              }}>
                🕒 Horarios de Atención
              </h3>
              <p style={{ 
                margin: '0.5rem 0', 
                fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)' // 📱 Texto fluido
              }}>
                Lunes a Viernes: 9:00 AM - 6:00 PM
              </p>
              <p style={{ 
                margin: '0.5rem 0', 
                fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)' // 📱 Texto fluido
              }}>
                Sábados: 9:00 AM - 2:00 PM
              </p>
              <p style={{ 
                margin: '0.5rem 0', 
                fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)', // 📱 Texto fluido
                opacity: '0.8' 
              }}>
                WhatsApp disponible 24/7
              </p>
            </div>

            {/* Respuesta rápida */}
            <div style={{
              padding: 'clamp(0.75rem, 2vw, 1rem)', // 📱 Padding fluido
              background: 'linear-gradient(135deg, #f0fff4, #f8fff8)',
              borderRadius: 'clamp(0.75rem, 2vw, 1rem)', // 📱 Border radius fluido
              border: '1px solid #e6ffe6',
              textAlign: 'center'
            }}>
              <h4 style={{ 
                color: '#00a86b', 
                margin: '0 0 0.5rem 0',
                fontSize: 'clamp(1rem, 3vw, 1.1rem)' // 📱 Texto fluido
              }}>
                ⚡ Tiempo de Respuesta
              </h4>
              <p style={{ 
                margin: 0, 
                fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)', // 📱 Texto fluido
                color: '#666' 
              }}>
                WhatsApp: Inmediato<br/>
                Email: 24-48 horas
              </p>
            </div>
          </section>

          {/* Formulario de Contacto Mejorado */}
          <section style={{
            background: 'white',
            padding: 'clamp(1.5rem, 4vw, 2.5rem)', // 📱 Padding adaptativo
            borderRadius: 'clamp(1rem, 2vw, 1.5rem)', // 📱 Border radius fluido
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ 
              fontSize: 'clamp(1.3rem, 4vw, 2rem)', // 📱 Mejor escala
              color: '#004e92', 
              marginBottom: 'clamp(1rem, 3vw, 1.5rem)', // 📱 Margin fluido
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              📝 Formulario Personalizado
            </h2>

            <p style={{
              textAlign: 'center',
              color: '#666',
              marginBottom: 'clamp(1.5rem, 4vw, 2rem)', // 📱 Margin fluido
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' // 📱 Texto fluido
            }}>
              Llena el formulario y envía tu consulta por tu método preferido
            </p>

            <form>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // 📱 Mantener 200px para campos
                gap: 'clamp(0.75rem, 2vw, 1rem)', // 📱 Gap fluido
                marginBottom: 'clamp(0.75rem, 2vw, 1rem)' // 📱 Margin fluido
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#004e92',
                    fontWeight: '500',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' // 📱 Label fluido
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
                      padding: 'clamp(0.6rem, 2vw, 0.75rem)', // 📱 Padding fluido
                      border: '2px solid #e0e0e0',
                      borderRadius: 'clamp(0.4rem, 1vw, 0.5rem)', // 📱 Border radius fluido
                      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', // 📱 Font size fluido
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = '#004e92'}
                    onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#004e92',
                    fontWeight: '500',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' // 📱 Label fluido
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
                      padding: 'clamp(0.6rem, 2vw, 0.75rem)', // 📱 Padding fluido
                      border: '2px solid #e0e0e0',
                      borderRadius: 'clamp(0.4rem, 1vw, 0.5rem)', // 📱 Border radius fluido
                      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', // 📱 Font size fluido
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = '#004e92'}
                    onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}> {/* 📱 Margin fluido */}
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#004e92',
                  fontWeight: '500',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' // 📱 Label fluido
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
                    padding: 'clamp(0.6rem, 2vw, 0.75rem)', // 📱 Padding fluido
                    border: '2px solid #e0e0e0',
                    borderRadius: 'clamp(0.4rem, 1vw, 0.5rem)', // 📱 Border radius fluido
                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', // 📱 Font size fluido
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#004e92'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'}
                />
              </div>

              <div style={{ marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}> {/* 📱 Margin fluido */}
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#004e92',
                  fontWeight: '500',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' // 📱 Label fluido
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
                    padding: 'clamp(0.6rem, 2vw, 0.75rem)', // 📱 Padding fluido
                    border: '2px solid #e0e0e0',
                    borderRadius: 'clamp(0.4rem, 1vw, 0.5rem)', // 📱 Border radius fluido
                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', // 📱 Font size fluido
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#004e92'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'}
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

              <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}> {/* 📱 Margin fluido */}
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#004e92',
                  fontWeight: '500',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' // 📱 Label fluido
                }}>
                  Mensaje *
                </label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Describe tu consulta, problema o sugerencia con detalle..."
                  style={{
                    width: '100%',
                    padding: 'clamp(0.6rem, 2vw, 0.75rem)', // 📱 Padding fluido
                    border: '2px solid #e0e0e0',
                    borderRadius: 'clamp(0.4rem, 1vw, 0.5rem)', // 📱 Border radius fluido
                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', // 📱 Font size fluido
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    minHeight: 'clamp(100px, 20vw, 120px)' // 📱 Altura mínima fluida
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#004e92'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'}
                />
              </div>

              {/* Botones de envío - Responsivos */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // 📱 Se stackean automáticamente en móviles
                gap: 'clamp(0.75rem, 2vw, 1rem)' // 📱 Gap fluido
              }}>
                <button
                  type="button"
                  onClick={handleWhatsAppSubmit}
                  style={{
                    background: 'linear-gradient(135deg, #25D366, #128C7E)',
                    color: 'white',
                    padding: 'clamp(0.8rem, 3vw, 1rem) clamp(1rem, 3vw, 1.5rem)', // 📱 Padding fluido
                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', // 📱 Font size fluido
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: 'clamp(0.4rem, 1vw, 0.5rem)', // 📱 Border radius fluido
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
                    display: 'flex', // 📱 Flex para centrar contenido
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem', // 📱 Gap entre icono y texto
                    minHeight: 'clamp(44px, 10vw, 50px)' // 📱 Altura mínima táctil
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.4)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0px)'
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.3)'
                  }}
                >
                  <span>📱</span>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Enviar por WhatsApp
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleGmailDirect}
                  style={{
                    background: 'linear-gradient(135deg, #EA4335, #FBBC05)',
                    color: 'white',
                    padding: 'clamp(0.8rem, 3vw, 1rem) clamp(1rem, 3vw, 1.5rem)', // 📱 Padding fluido
                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', // 📱 Font size fluido
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: 'clamp(0.4rem, 1vw, 0.5rem)', // 📱 Border radius fluido
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(234, 67, 53, 0.3)',
                    display: 'flex', // 📱 Flex para centrar contenido
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem', // 📱 Gap entre icono y texto
                    minHeight: 'clamp(44px, 10vw, 50px)' // 📱 Altura mínima táctil
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(234, 67, 53, 0.4)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0px)'
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(234, 67, 53, 0.3)'
                  }}
                >
                  <span>🌐</span>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Enviar por Gmail Web
                  </span>
                </button>
              </div>
            </form>

            <div style={{
              marginTop: 'clamp(1rem, 3vw, 1.5rem)', // 📱 Margin fluido
              padding: 'clamp(0.75rem, 2vw, 1rem)', // 📱 Padding fluido
              background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
              borderRadius: 'clamp(0.4rem, 1vw, 0.5rem)', // 📱 Border radius fluido
              textAlign: 'center',
              fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)', // 📱 Font size fluido
              color: '#666'
            }}>
              <p style={{ margin: '0 0 0.5rem 0' }}>
                💡 <strong>Opciones de envío:</strong>
              </p>
              <p style={{ margin: 0, fontSize: 'clamp(0.75rem, 2vw, 0.8rem)' }}> {/* 📱 Font size fluido */}
                📱 WhatsApp (inmediato) • 🌐 Gmail Web (siempre funciona)
              </p>
            </div>
          </section>
        </div>

        {/* Información de la App */}
        <section style={{
          background: 'white',
          padding: 'clamp(1.5rem, 4vw, 2.5rem)', // 📱 Padding adaptativo
          borderRadius: 'clamp(1rem, 2vw, 1.5rem)', // 📱 Border radius fluido
          marginTop: 'clamp(1.5rem, 4vw, 2rem)', // 📱 Margin fluido
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.3rem, 4vw, 2rem)', // 📱 Mejor escala
            color: '#004e92', 
            marginBottom: 'clamp(1rem, 3vw, 1.5rem)', // 📱 Margin fluido
            fontWeight: 'bold'
          }}>
            📲 Próximamente: App Cultour
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // 📱 Mantener 250px
            gap: 'clamp(1rem, 3vw, 1.5rem)', // 📱 Gap fluido
            marginTop: 'clamp(1.5rem, 4vw, 2rem)' // 📱 Margin fluido
          }}>
            <div style={{
              padding: 'clamp(1rem, 3vw, 1.5rem)', // 📱 Padding fluido
              background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)',
              borderRadius: 'clamp(0.75rem, 2vw, 1rem)', // 📱 Border radius fluido
              border: '1px solid #bbdefb'
            }}>
              <div style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 2rem)', // 📱 Icono fluido
                marginBottom: 'clamp(0.5rem, 2vw, 1rem)' // 📱 Margin fluido
              }}>🔔</div>
              <h3 style={{ 
                color: '#004e92', 
                marginBottom: '0.5rem',
                fontSize: 'clamp(1rem, 3vw, 1.2rem)' // 📱 Título fluido
              }}>Notificaciones Inteligentes</h3>
              <p style={{ 
                color: '#666', 
                fontSize: 'clamp(0.85rem, 2.2vw, 0.9rem)', // 📱 Descripción fluida
                lineHeight: 1.4
              }}>
                Recibe alertas automáticas cuando te acerques a sitios de interés histórico o natural
              </p>
            </div>

            <div style={{
              padding: 'clamp(1rem, 3vw, 1.5rem)', // 📱 Padding fluido
              background: 'linear-gradient(135deg, #f1f8e9, #e8f5e8)',
              borderRadius: 'clamp(0.75rem, 2vw, 1rem)', // 📱 Border radius fluido
              border: '1px solid #c8e6c9'
            }}>
              <div style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 2rem)', // 📱 Icono fluido
                marginBottom: 'clamp(0.5rem, 2vw, 1rem)' // 📱 Margin fluido
              }}>🗺️</div>
              <h3 style={{ 
                color: '#00a86b', 
                marginBottom: '0.5rem',
                fontSize: 'clamp(1rem, 3vw, 1.2rem)' // 📱 Título fluido
              }}>Mapa Interactivo</h3>
              <p style={{ 
                color: '#666', 
                fontSize: 'clamp(0.85rem, 2.2vw, 0.9rem)', // 📱 Descripción fluida
                lineHeight: 1.4
              }}>
                Navegación offline con puntos de interés marcados y rutas sugeridas
              </p>
            </div>

            <div style={{
              padding: 'clamp(1rem, 3vw, 1.5rem)', // 📱 Padding fluido
              background: 'linear-gradient(135deg, #fff3e0, #fce4ec)',
              borderRadius: 'clamp(0.75rem, 2vw, 1rem)', // 📱 Border radius fluido
              border: '1px solid #ffcc02'
            }}>
              <div style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 2rem)', // 📱 Icono fluido
                marginBottom: 'clamp(0.5rem, 2vw, 1rem)' // 📱 Margin fluido
              }}>📚</div>
              <h3 style={{ 
                color: '#f57c00', 
                marginBottom: '0.5rem',
                fontSize: 'clamp(1rem, 3vw, 1.2rem)' // 📱 Título fluido
              }}>Guías Culturales</h3>
              <p style={{ 
                color: '#666', 
                fontSize: 'clamp(0.85rem, 2.2vw, 0.9rem)', // 📱 Descripción fluida
                lineHeight: 1.4
              }}>
                Información detallada sobre historia, tradiciones y curiosidades locales
              </p>
            </div>
          </div>
        </section>

        {/* Soporte y FAQ */}
        <section style={{
          background: 'white',
          padding: 'clamp(1.5rem, 4vw, 2.5rem)', // 📱 Padding adaptativo
          borderRadius: 'clamp(1rem, 2vw, 1.5rem)', // 📱 Border radius fluido
          marginTop: 'clamp(1.5rem, 4vw, 2rem)', // 📱 Margin fluido
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.3rem, 4vw, 2rem)', // 📱 Mejor escala
            color: '#004e92', 
            marginBottom: 'clamp(1.5rem, 4vw, 2rem)', // 📱 Margin fluido
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            ❓ Preguntas Frecuentes
          </h2>
          
          <div style={{
            display: 'grid',
            gap: 'clamp(0.75rem, 2vw, 1rem)' // 📱 Gap fluido
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
              padding: 'clamp(1rem, 3vw, 1.5rem)', // 📱 Padding fluido
              borderRadius: 'clamp(0.75rem, 2vw, 1rem)', // 📱 Border radius fluido
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ 
                color: '#004e92', 
                marginBottom: '0.5rem', 
                fontSize: 'clamp(1rem, 3vw, 1.1rem)' // 📱 Título fluido
              }}>
                ¿Cuándo estará disponible la app?
              </h3>
              <p style={{ 
                color: '#666', 
                margin: 0, 
                fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', // 📱 Texto fluido
                lineHeight: 1.5
              }}>
                Estamos en fase de desarrollo. Suscríbete a nuestras notificaciones para ser el primero en saberlo.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
              padding: 'clamp(1rem, 3vw, 1.5rem)', // 📱 Padding fluido
              borderRadius: 'clamp(0.75rem, 2vw, 1rem)', // 📱 Border radius fluido
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ 
                color: '#004e92', 
                marginBottom: '0.5rem', 
                fontSize: 'clamp(1rem, 3vw, 1.1rem)' // 📱 Título fluido
              }}>
                ¿La app funcionará sin internet?
              </h3>
              <p style={{ 
                color: '#666', 
                margin: 0, 
                fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', // 📱 Texto fluido
                lineHeight: 1.5
              }}>
                Sí, tendrás acceso a mapas offline y información básica. Las notificaciones requieren GPS activo.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
              padding: 'clamp(1rem, 3vw, 1.5rem)', // 📱 Padding fluido
              borderRadius: 'clamp(0.75rem, 2vw, 1rem)', // 📱 Border radius fluido
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ 
                color: '#004e92', 
                marginBottom: '0.5rem', 
                fontSize: 'clamp(1rem, 3vw, 1.1rem)' // 📱 Título fluido
              }}>
                ¿Cómo puedo colaborar con contenido local?
              </h3>
              <p style={{ 
                color: '#666', 
                margin: 0, 
                fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', // 📱 Texto fluido
                lineHeight: 1.5
              }}>
                Contáctanos por email o WhatsApp. Buscamos colaboradores locales para enriquecer el contenido.
              </p>
            </div>
          </div>
        </section>

        {/* Redes Sociales */}
        <section style={{
          background: 'linear-gradient(135deg, #004e92, #00a86b)',
          padding: 'clamp(1.5rem, 4vw, 2rem)', // 📱 Padding fluido
          borderRadius: 'clamp(1rem, 2vw, 1.5rem)', // 📱 Border radius fluido
          marginTop: 'clamp(1.5rem, 4vw, 2rem)', // 📱 Margin fluido
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.3rem, 4vw, 2rem)', // 📱 Mejor escala
            marginBottom: 'clamp(0.75rem, 2vw, 1rem)', // 📱 Margin fluido
            fontWeight: 'bold'
          }}>
            🌐 Síguenos para Actualizaciones
          </h2>
          <p style={{ 
            marginBottom: 'clamp(1.5rem, 4vw, 2rem)', // 📱 Margin fluido
            fontSize: 'clamp(1rem, 3vw, 1.1rem)', // 📱 Texto fluido
            lineHeight: 1.5,
            maxWidth: '600px',
            margin: '0 auto clamp(1.5rem, 4vw, 2rem) auto' // 📱 Centrar y margin fluido
          }}>
            Mantente informado sobre el desarrollo de la app y descubrimientos en la Sierra Gorda
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(1rem, 3vw, 1.5rem)', // 📱 Gap fluido
            flexWrap: 'wrap'
          }}>
            {/* Aquí puedes agregar enlaces a redes sociales cuando estén disponibles */}
          </div>
        </section>
      </div>
    </Layout>
  )
}