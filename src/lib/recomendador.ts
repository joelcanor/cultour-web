// lib/recomendador.ts
import natural from 'natural'

interface Lugar {
  id: string
  nombre: string
  descripcion: string
  municipio: string
}

export function recomendarLugaresIA(
  todosLosLugares: Lugar[],
  favoritosDelUsuario: Lugar[],
  maxRecomendaciones: number = 5
): Lugar[] {
  if (favoritosDelUsuario.length === 0) return []

  const tfidf = new natural.TfIdf()

  // Convertimos todos los lugares a texto plano
  todosLosLugares.forEach(lugar => {
    const texto = `${lugar.nombre} ${lugar.descripcion} ${lugar.municipio}`
    tfidf.addDocument(texto)
  })

  // Generamos un texto promedio de los favoritos del usuario
  const textoFavoritos = favoritosDelUsuario
    .map(lugar => `${lugar.nombre} ${lugar.descripcion} ${lugar.municipio}`)
    .join(' ')

  // Calculamos la similitud con todos los lugares
  const similitudes: { lugar: Lugar; score: number }[] = todosLosLugares.map((lugar, i) => {
    const score = tfidf.tfidf(textoFavoritos, i)
    return { lugar, score }
  })

  // Filtramos lugares que ya están en favoritos
  const favoritosIds = new Set(favoritosDelUsuario.map(l => l.id))
  const recomendaciones = similitudes
    .filter(sim => !favoritosIds.has(sim.lugar.id))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxRecomendaciones)
    .map(sim => sim.lugar)

  return recomendaciones
}
