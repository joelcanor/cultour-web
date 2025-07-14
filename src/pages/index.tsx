import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <Head>
        <title>CULTOUR</title>
        <meta name="description" content="Vive la cultura, descubre la Sierra" />
      </Head>
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f8f9fa',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <Image src="/logo.jpg" alt="Cultour Logo" width={180} height={180} />
        <h1 style={{ fontSize: '2.5rem', color: '#2b6777' }}>Bienvenido a <span style={{ color: '#52ab98' }}>CULTOUR</span></h1>
        <p style={{ fontSize: '1.2rem', marginTop: '1rem', maxWidth: '600px' }}>
          Vive la cultura, descubre la Sierra Gorda Queretana. Explora lugares increíbles y recibe recomendaciones personalizadas según tus gustos.
        </p>
        <button style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          backgroundColor: '#52ab98',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer'
        }}>
          Explorar Lugares
        </button>
      </main>
    </>
  )
}
