// pages/_app.tsx - REEMPLAZA TU ARCHIVO ACTUAL
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        setIsAuthenticated(true)
      }
    }

    getSession()

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        window.location.href = '/auth/update-password'
      }
      setUser(session?.user ?? null)
      setIsAuthenticated(!!session?.user)
    })

    return () => {
      data.subscription.unsubscribe()
    }
  }, [])

  return (
    <>
      {/* 🎯 SEO Global - Meta tags por defecto */}
      <Head>
        {/* Title por defecto */}
        <title>Cultour - Descubre la Sierra Gorda de Querétaro</title>
        
        {/* Meta básicos */}
        <meta name="description" content="Explora los lugares más espectaculares de la Sierra Gorda Queretana: Jalpan de Serra, Landa de Matamoros, Arroyo Seco y Pinal de Amoles. Cultura, naturaleza y aventura." />
        <meta name="keywords" content="Sierra Gorda, Querétaro, turismo, ecoturismo, Jalpan de Serra, Landa de Matamoros, Arroyo Seco, Pinal de Amoles, cascadas, misiones franciscanas, naturaleza México" />
        <meta name="author" content="Cultour" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://cultour-web-fpd3.vercel.app" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Cultour" />
        <meta property="og:title" content="Cultour - Descubre la Sierra Gorda de Querétaro" />
        <meta property="og:description" content="Explora los lugares más espectaculares de la Sierra Gorda Queretana. Cultura, naturaleza y aventura te esperan." />
        <meta property="og:url" content="https://cultour-web-fpd3.vercel.app" />
        <meta property="og:image" content="https://cultour-web-fpd3.vercel.app/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Sierra Gorda Querétaro - Cultour" />
        <meta property="og:locale" content="es_MX" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@cultour_mx" />
        <meta name="twitter:creator" content="@cultour_mx" />
        <meta name="twitter:title" content="Cultour - Descubre la Sierra Gorda de Querétaro" />
        <meta name="twitter:description" content="Explora los lugares más espectaculares de la Sierra Gorda Queretana" />
        <meta name="twitter:image" content="https://cultour-web-fpd3.vercel.app/og-image.jpg" />
        
        {/* Geo tags */}
        <meta name="geo.region" content="MX-QUE" />
        <meta name="geo.placename" content="Sierra Gorda, Querétaro" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#004e92" />
        
        {/* Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect para performance */}
        <link rel="preconnect" href="https://yiaplofsopkyasrkhjhf.supabase.co" />
        <link rel="dns-prefetch" href="https://yiaplofsopkyasrkhjhf.supabase.co" />
        
        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
      </Head>
      
      <Component 
        {...pageProps} 
        user={user}
        isAuthenticated={isAuthenticated}
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
        handleLogout={async () => {
          await supabase.auth.signOut()
          setUser(null)
          setIsAuthenticated(false)
          setShowUserMenu(false)
        }}
      />
    </>
  )
}