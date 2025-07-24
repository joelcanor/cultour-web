import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.push('/')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #004e92, #00a86b)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'white',
          borderRadius: '1.5rem',
          padding: '3rem',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
          textAlign: 'center'
        }}
      >  <div style={{
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem'
  }}>
    <img
      src="/logo.jpg"
      alt="Logo"
      style={{ 
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        objectFit: 'cover',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
      }}
    />
  </div>

        <h2 style={{ marginBottom: '1rem', color: '#004e92' }}>Iniciar sesión</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Entrar</button>
          {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
        </form>

        <hr style={{ margin: '2rem 0', borderColor: '#ddd' }} />

        <button
          onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
          style={oauthButtonStyle}
        >
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" style={{ width: '20px', marginRight: '10px' }} />
          Iniciar con Google
        </button>

        <button
          onClick={() => supabase.auth.signInWithOAuth({ provider: 'facebook' })}
          style={{ ...oauthButtonStyle, backgroundColor: '#3b5998', color: 'white' }}
        >
          <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style={{ width: '20px', marginRight: '10px' }} />
          Iniciar con Facebook
        </button>
      </motion.div>
    </div>
  )
}

const inputStyle = {
  padding: '0.8rem 1rem',
  border: '1px solid #ccc',
  borderRadius: '0.8rem',
  fontSize: '1rem'
}

const buttonStyle = {
  backgroundColor: '#004e92',
  color: 'white',
  padding: '0.8rem 1rem',
  border: 'none',
  borderRadius: '0.8rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '1rem'
}

const oauthButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#ffffff',
  color: '#333',
  padding: '0.7rem 1rem',
  borderRadius: '0.8rem',
  fontWeight: '500',
  border: '1px solid #ddd',
  width: '100%',
  cursor: 'pointer',
  marginBottom: '0.8rem'
}
