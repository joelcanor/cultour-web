import Layout from '@/components/Layout'

export default function Contacto(props) {
  return (
    <Layout {...props}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Contacto</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
        ¿Tienes preguntas, sugerencias o quieres colaborar? ¡Estamos para escucharte!
      </p>
      <ul style={{ fontSize: '1.1rem', lineHeight: '2rem' }}>
        <li>📧 Email: contacto@cultour.com</li>
        <li>📱 WhatsApp: +52 442 123 4567</li>
        <li>📍 Ubicación: Jalpan de Serra, Querétaro, México</li>
      </ul>
    </Layout>
  )
}
