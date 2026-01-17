import { GetServerSideProps } from 'next'
import { supabase } from '@/lib/supabaseClient'

interface Lugar {
  id: string
  nombre: string
  updated_at?: string
}

function generateSiteMap(lugares: Lugar[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Página principal -->
     <url>
       <loc>https://cultour-web-fpd3.vercel.app</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     
     <!-- Páginas estáticas -->
     <url>
       <loc>https://cultour-web-fpd3.vercel.app/recomendaciones</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>https://cultour-web-fpd3.vercel.app/nosotros</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.7</priority>
     </url>
     <url>
       <loc>https://cultour-web-fpd3.vercel.app/contacto</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.7</priority>
     </url>
     
     <!-- Páginas dinámicas de lugares -->
     ${lugares
       .map((lugar) => {
         return `
       <url>
           <loc>https://cultour-web-fpd3.vercel.app/lugares/${lugar.id}</loc>
           <lastmod>${lugar.updated_at || new Date().toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.9</priority>
       </url>
     `
       })
       .join('')}
   </urlset>
 `
}

function SiteMap() {
  // getServerSideProps hará el trabajo
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Obtener todos los lugares de la base de datos
  const { data: lugares } = await supabase
    .from('lugares')
    .select('id, nombre, updated_at')

  // Generar el sitemap XML
  const sitemap = generateSiteMap(lugares || [])

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap