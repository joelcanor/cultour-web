import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        window.location.href = '/auth/update-password'
      }
    })

    return () => {
      data.subscription.unsubscribe()
    }
  }, [])

  return <Component {...pageProps} />
}
