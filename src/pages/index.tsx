import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'

const places = [
  {
    id: '1',
    url: '/jalpan.jpg',
    name: 'Misión de Jalpan',
    description: 'Patrimonio Mundial y centro de la Sierra Gorda.',
    municipio: 'Jalpan'
  },
  {
    id: '2',
    url: '/puentede_dios.jpeg',
    name: 'Puente de Dios',
    description: 'Paraje natural con pozas cristalinas y cascadas escondidas.',
    municipio: 'Jalpan'
  },
  {
    id: '3',
    url: '/cuatro_palos.webp',
    name: 'Mirador Cuatro Palos',
    description: 'Vista épica entre montañas y nubes en Pinal de Amoles.',
    municipio: 'Pinal'
  },
  {
    id: '4',
    url: '/rio_escanela.webp',
    name: 'Río Escanela',
    description: 'Sendero con ríos, puentes colgantes y cascadas.',
    municipio: 'Pinal'
  },
  {
    id: '5',
    url: '/sotano_barro.jpg',
    name: 'Sótano del Barro',
    description: 'Hábitat de guacamayas verdes y aventura para exploradores.',
    municipio: 'Pinal'
  },
  {
    id: '6',
    url: '/conca.jpg',
    name: 'Misión de Concá',
    description: 'Arquitectura barroca en un entorno cultural y natural.',
    municipio: 'Arroyo Seco'
  }
]

const municipios = ['Todos', 'Jalpan', 'Landa', 'Arroyo Seco', 'Pinal', 'Peñamiller']

export default function Home() {
  const [search, setSearch] = useState('')
  const [selectedMunicipio, setSelectedMunicipio] = useState('Todos')

  const filtered = places.filter(p => {
    const matchesSearch = `${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase())
    const matchesMunicipio = selectedMunicipio === 'Todos' || p.municipio === selectedMunicipio
    return matchesSearch && matchesMunicipio
  })

  return (
    <>
      <Head>
        <title>CULTOUR - Vive la cultura, descubre la sierra</title>
        <meta name="description" content="Explora la Sierra Gorda Queretana" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header style={{ background: 'linear-gradient(to right, #004e92, #00a86b)', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Image src="/logo.jpg" alt="Logo" width={40} height={40} />
          <h2 style={{ margin: 0 }}>CULTOUR</h2>
        </div>
        <nav>
          <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', margin: 0, padding: 0 }}>
            <li><Link href="/">Inicio</Link></li>
            <li><Link href="/recomendaciones">Recomendaciones</Link></li>
            <li><Link href="/nosotros">Sobre Nosotros</Link></li>
            <li><Link href="/contacto">Contacto</Link></li>
          </ul>
        </nav>
      </header>

      <main style={{ padding: '2rem', background: 'linear-gradient(to bottom, #e0f7fa, #e6ffe9)' }}>
        <h1 style={{ textAlign: 'center', color: '#004e92' }}>Descubre la Sierra Gorda Queretana</h1>

        <div style={{ textAlign: 'center', margin: '1.5rem auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Buscar lugares, municipios…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '0.75rem 1rem', width: '300px', borderRadius: '0.5rem', marginBottom: '1rem' }}
          />
          <select
            value={selectedMunicipio}
            onChange={e => setSelectedMunicipio(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '0.5rem' }}
          >
            {municipios.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(place => (
            <motion.div
              key={place.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}
            >
              <img
                src={place.url}
                alt={place.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '1rem' }}>
                <h3 style={{ color: '#004e92' }}>{place.name}</h3>
                <p>{place.description}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Secciones vacías por municipio */}
        {municipios.filter(m => m !== 'Todos').map(m => (
          <section key={m} style={{ marginTop: '3rem' }}>
            <h2 style={{ borderBottom: '2px solid #004e92', color: '#004e92' }}>{m}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
              {/* Aquí se agregarán tarjetas reales después */}
              <motion.div style={{ height: '200px', background: '#ccc', borderRadius: '1rem' }} whileHover={{ scale: 1.02 }} />
              <motion.div style={{ height: '200px', background: '#ccc', borderRadius: '1rem' }} whileHover={{ scale: 1.02 }} />
              <motion.div style={{ height: '200px', background: '#ccc', borderRadius: '1rem' }} whileHover={{ scale: 1.02 }} />
            </div>
          </section>
        ))}
      </main>

      <footer style={{ background: 'linear-gradient(to right, #004e92, #00a86b)', color: 'white', textAlign: 'center', padding: '1rem' }}>
        © 2025 Cultour. Todos los derechos reservados.
      </footer>
    </>
  )
}
