import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<any>(null)
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
  )
}
