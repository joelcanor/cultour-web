import Layout from '@/components/Layout'


export default function Nosotros(props) {
  return (
    <Layout {...props}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Sobre Nosotros</h1>
      <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
        Somos un equipo apasionado por la cultura, la naturaleza y el turismo responsable. Cultour nace como una plataforma
        para mostrar la belleza de la Sierra Gorda Queretana y conectar a los viajeros con experiencias auténticas.
      </p>
      <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
        Nuestra misión es impulsar el turismo local y preservar el patrimonio natural y cultural a través de la tecnología y la colaboración comunitaria.
      </p>
    </Layout>
  )
}
