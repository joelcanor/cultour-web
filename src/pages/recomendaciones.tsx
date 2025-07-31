import Layout from '@/components/Layout'

export default function Recomendaciones(props) {
  return (
    <Layout {...props}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Recomendaciones Turísticas</h1>
      <ul style={{ paddingLeft: '1.5rem', fontSize: '1.1rem', lineHeight: '2rem' }}>
        <li>📍 Visita el Mirador Cuatro Palos al amanecer...</li>
        <li>🥾 Usa calzado cómodo...</li>
      </ul>
    </Layout>
  )
}
