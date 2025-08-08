  // pages/api/recomendaciones.ts
  import type { NextApiRequest, NextApiResponse } from 'next'
  import { supabase } from '@/lib/supabaseClient'
  import { recomendarLugaresIA } from '@/lib/recomendador'

  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { usuario_id } = req.query

    if (!usuario_id || typeof usuario_id !== 'string') {
      return res.status(400).json({ error: 'Falta el parámetro usuario_id' })
    }

    try {
      // 1. Obtener todos los lugares
      const { data: todosLosLugares, error: errorLugares } = await supabase
        .from('lugares')
        .select('id, nombre, descripcion, municipio, url_imagen')

      if (errorLugares || !todosLosLugares) {
        return res.status(500).json({ error: 'Error al obtener los lugares' })
      }

      // 2. Obtener los favoritos del usuario
      const { data: favoritosIds, error: errorFavoritos } = await supabase
        .from('favoritos')
        .select('lugar_id')
        .eq('usuario_id', usuario_id)

      if (errorFavoritos || !favoritosIds) {
        return res.status(500).json({ error: 'Error al obtener favoritos' })
      }

      // 3. Buscar detalles de los lugares favoritos
      const favoritosDelUsuario = todosLosLugares.filter(lugar =>
        favoritosIds.some(fav => fav.lugar_id === lugar.id)
      )

      // 4. Ejecutar recomendación IA
      const recomendaciones = recomendarLugaresIA(todosLosLugares, favoritosDelUsuario)

      // 5. Devolver resultado
      return res.status(200).json({ recomendaciones })
    } catch (error) {
      console.error('Error en API de recomendaciones:', error)
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
