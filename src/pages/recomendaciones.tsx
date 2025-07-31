import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { supabase } from '@/lib/supabaseClient'

export default function Recomendaciones(props) {
  const { user } = props
  const [recomendacionesIA, setRecomendacionesIA] = useState([])
  const [lugaresCercanos, setLugaresCercanos] = useState([])

  useEffect(() => {
    const fetchRecomendacionesIA = async () => {
      if (!user) return

      try {
        const res = await fetch(`/api/recomendaciones?usuario_id=${user.id}`)
        const json = await res.json()
        if (res.ok) {
          setRecomendacionesIA(json.recomendaciones)
        } else {
          console.error('Error en recomendaciones IA:', json.error)
        }
      } catch (err) {
        console.error('Error al obtener recomendaciones IA:', err)
      }
    }

    fetchRecomendacionesIA()
  }, [user])

  useEffect(() => {
    const fetchLugaresCercanos = async (lat, lon) => {
      const { data, error } = await supabase
        .from('lugares')
        .select('id, nombre, municipio, descripcion, url_imagen, latitud, longitud')

      if (error) {
        console.error('Error al obtener lugares:', error)
        return
      }

      const lugaresConDistancia = data.map(lugar => {
        const distancia = calcularDistancia(lat, lon, lugar.latitud, lugar.longitud)
        return { ...lugar, distancia }
      })

      const cercanos = lugaresConDistancia
        .filter(l => l.distancia < 50)
        .sort((a, b) => a.distancia - b.distancia)
        .slice(0, 5)

      setLugaresCercanos(cercanos)
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        fetchLugaresCercanos(latitude, longitude)
      },
      (err) => {
        console.warn('Permiso de geolocalización denegado', err)
      }
    )
  }, [])

  function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const renderTarjetas = (lugares) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2rem',
      marginTop: '2rem'
    }}>
      {lugares.map(lugar => (
        <div key={lugar.id} style={{
          background: 'white',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
          onClick={() => window.location.href = `/lugares/${lugar.id}`}>
          <img src={lugar.url_imagen} alt={lugar.nombre} style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover'
          }} />
          <div style={{ padding: '1rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#004e92' }}>{lugar.nombre}</h3>
            <p style={{ margin: 0, color: '#555' }}>{lugar.descripcion}</p>
            {lugar.distancia && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#00a86b' }}>
                📍 A {lugar.distancia.toFixed(2)} km de ti
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <Layout {...props}>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center' }}>
          🤖 Recomendaciones Inteligentes
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#555' }}>
          Estas sugerencias han sido generadas por una IA basada en tus lugares favoritos.
        </p>

        {recomendacionesIA.length > 0 ? (
          renderTarjetas(recomendacionesIA)
        ) : (
          <p style={{ textAlign: 'center', color: '#999' }}>
            No hay suficientes datos para hacer recomendaciones por IA aún.
          </p>
        )}

        <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginTop: '4rem', textAlign: 'center' }}>
          📍 Lugares Cercanos
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#555' }}>
          Según tu ubicación actual, estos lugares están muy cerca.
        </p>

        {lugaresCercanos.length > 0 ? (
          renderTarjetas(lugaresCercanos)
        ) : (
          <p style={{ textAlign: 'center', color: '#999' }}>
            No se pudo obtener tu ubicación o no hay lugares cercanos.
          </p>
        )}
      </div>
    </Layout>
  )
}
