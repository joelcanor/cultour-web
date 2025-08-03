import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'
import ReCAPTCHA from 'react-google-recaptcha'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showResendEmail, setShowResendEmail] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)

  const openTerms = () => dialogRef.current?.showModal()
  const closeTerms = () => dialogRef.current?.close()

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!acceptedTerms) {
    setError('Debes aceptar los términos y condiciones.')
    return
  }
  if (!captchaToken) {
    setError('Por favor completa el reCAPTCHA.')
    return
  }

  setIsLoading(true)
  setError('')
  setShowResendEmail(false)

const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password })

if (error) {
  setError(error.message)

  if (error.message.toLowerCase().includes('confirm')) {
    setShowResendEmail(true)
  }
} else {
  const session = signInData.session
  const user = session?.user

  if (user) {
    const { data: perfil, error: perfilError } = await supabase
      .from('perfil_usuario')
      .select('rol')
      .eq('id', user.id)
      .single()

    if (perfilError) {
      console.error('Error obteniendo rol:', perfilError.message)
      router.push('/')
    } else {
      if (perfil?.rol === 'admin') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    }
  } else {
    router.push('/')
  }
}


  setIsLoading(false)
}


  const handleForgotPassword = async () => {
    if (!email) { 
      setError('Ingresa tu correo para restablecer la contraseña.')
      return 
    }
    
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    
    if (error) {
      setError(error.message)
    } else {
      alert('Se ha enviado un correo para restablecer tu contraseña.')
    }
  }

  const handleResendEmail = async () => {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
  })

  if (error) {
    setError('Error al reenviar el correo: ' + error.message)
  } else {
    setError('Correo de confirmación reenviado correctamente. Revisa tu bandeja.')
    setShowResendEmail(false)
  }
}


  const inputStyle = (hasError: boolean = false) => ({
    padding: '1rem 1.2rem',
    border: `2px solid ${hasError ? '#ef4444' : '#e5e7eb'}`,
    borderRadius: '0.8rem',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: '#fafafa',
    width: '100%',
    boxSizing: 'border-box' as const,
  })

  const buttonStyle = {
    background: isLoading 
      ? 'linear-gradient(to right, #94a3b8, #64748b)' 
      : 'linear-gradient(to right, #004e92, #00a86b)',
    color: 'white',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '0.8rem',
    fontWeight: '600',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    transform: isLoading ? 'scale(0.98)' : 'scale(1)',
    boxShadow: '0 4px 12px rgba(0, 78, 146, 0.3)',
    width: '100%',
  }

  const forgotButtonStyle = {
    background: 'none',
    color: '#004e92',
    border: 'none',
    textAlign: 'left' as const,
    fontSize: '0.9rem',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: '0.5rem 0',
    transition: 'color 0.3s ease',
  }

  const oauthButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    color: '#333',
    padding: '0.8rem 1rem',
    borderRadius: '0.8rem',
    fontWeight: '500',
    border: '2px solid #e5e7eb',
    width: '100%',
    cursor: 'pointer',
    marginBottom: '0.8rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }} 
        style={{ 
          background: 'white', 
          borderRadius: '1.5rem', 
          padding: '3rem', 
          maxWidth: '450px', 
          width: '100%', 
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)', 
          textAlign: 'center' 
        }}
      >
        {/* Logo */}
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}
        >
          <img 
            src="/logo.jpg" 
            alt="Logo" 
            style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              objectFit: 'cover', 
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
              border: '3px solid white'
            }} 
          />
        </motion.div>

        {/* Título */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ 
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#004e92', 
            marginBottom: '0.5rem' 
          }}>
            Iniciar Sesión
          </h2>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>
            Accede a tu cuenta de Cultour
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              value={email} 
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError('')
              }} 
              required 
              style={inputStyle(!!error)} 
            />
          </div>

          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Contraseña" 
              value={password} 
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError('')
              }} 
              required 
              style={inputStyle(!!error)} 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
                color: '#6b7280'
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <button 
            type="button" 
            onClick={handleForgotPassword} 
            style={forgotButtonStyle}
            onMouseEnter={(e) => e.target.style.color = '#00a86b'}
            onMouseLeave={(e) => e.target.style.color = '#004e92'}
          >
            ¿Olvidaste tu contraseña?
          </button>

          {/* Términos y condiciones */}
          <label style={{ 
            textAlign: 'left', 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '0.5rem',
            fontSize: '0.9rem',
            color: '#666'
          }}>
            <input 
              type="checkbox" 
              checked={acceptedTerms} 
              onChange={() => setAcceptedTerms(!acceptedTerms)} 
              style={{ marginTop: '0.2rem' }} 
            />
            <span>
              Acepto los{' '}
              <span 
                onClick={openTerms} 
                style={{ 
                  color: '#004e92', 
                  textDecoration: 'underline', 
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                términos y condiciones
              </span>
            </span>
          </label>

          {/* ReCAPTCHA */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ReCAPTCHA 
              sitekey="6LeLOI4rAAAAAB2vTL1uVICM9uOW5vu7HGFkV6-1" 
              onChange={token => setCaptchaToken(token || '')} 
            />
          </div>

          {/* Error Message */}
    {error && (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }} 
    animate={{ opacity: 1, scale: 1 }}
    style={{
      padding: '1rem',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '0.5rem',
      color: '#dc2626',
      fontSize: '0.9rem'
    }}
  >
    <p style={{ marginBottom: showResendEmail ? '0.5rem' : '0' }}>
      {error}
    </p>

    {showResendEmail && (
      <button
        type="button"
        onClick={handleResendEmail}
        style={{
          background: 'none',
          border: '1px solid #dc2626',
          color: '#dc2626',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          fontSize: '0.85rem',
          cursor: 'pointer',
          marginTop: '0.5rem'
        }}
      >
        Reenviar correo de confirmación
      </button>
    )}
  </motion.div>
)}


          {/* Botón de login */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            style={buttonStyle}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Iniciando sesión...
              </span>
            ) : (
              'Entrar'
            )}
          </motion.button>
        </form>

        {/* Link de registro */}
        <p style={{ marginTop: '1.5rem', fontSize: '0.95rem', color: '#666' }}>
          ¿No tienes una cuenta?{' '}
          <span
            onClick={() => router.push('/auth/register')}
            style={{ 
              color: '#004e92', 
              fontWeight: '600', 
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Regístrate aquí
          </span>
        </p>

        {/* Separador */}
        <div style={{ 
          height: '1px', 
          background: 'linear-gradient(to right, transparent, #e5e7eb, transparent)', 
          margin: '2rem 0' 
        }} />

        {/* Botones OAuth */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <motion.button 
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })} 
            style={oauthButtonStyle}
            whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
            whileTap={{ scale: 0.98 }}
          >
            <img 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" 
              alt="Google" 
              style={{ width: '20px', marginRight: '10px' }} 
            />
            Iniciar con Google
          </motion.button>

          <motion.button
            onClick={() => router.push('/auth/register')}
            style={{ 
              ...oauthButtonStyle, 
              background: 'linear-gradient(to right, #004e92, #00a86b)', 
              color: 'white',
              border: 'none'
            }}
            whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0, 78, 146, 0.3)' }}
            whileTap={{ scale: 0.98 }}
          >
            <img 
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png" 
              alt="Registro" 
              style={{ width: '20px', marginRight: '10px' }} 
            />
            Crear Nueva Cuenta
          </motion.button>
        </div>
      </motion.div>

      {/* Modal de Términos y Condiciones */}
      <dialog
        ref={dialogRef}
        style={{
          padding: '2.5rem',
          borderRadius: '1.5rem',
          maxWidth: '500px',
          width: '90%',
          border: 'none',
          textAlign: 'center',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          position: 'fixed',
          backgroundColor: 'white',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        }}
      >
        <h3 style={{ color: '#004e92', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
          Términos y Condiciones de Uso
        </h3>
        <div style={{ textAlign: 'left', lineHeight: '1.6', color: '#555', marginBottom: '2rem' }}>
          <p style={{ marginBottom: '1rem' }}>
            Bienvenido a <strong>Cultour</strong>. Al registrarte, aceptas que usaremos tus datos únicamente para ofrecerte recomendaciones personalizadas de turismo cultural y experiencias auténticas.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            La aplicación no utiliza ubicación en segundo plano, ni acceso al micrófono, ni otras funciones sin tu permiso explícito. Respetamos tu privacidad y la protección de tus datos personales.
          </p>
          <p>
            <strong>Cultour</strong> promueve el turismo responsable y el respeto al entorno cultural y natural de cada destino que visitamos.
          </p>
        </div>
        <motion.button
          onClick={closeTerms}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'linear-gradient(to right, #004e92, #00a86b)',
            color: 'white',
            padding: '0.8rem 2rem',
            border: 'none',
            borderRadius: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(0, 78, 146, 0.3)',
          }}
        >
          Entendido
        </motion.button>
      </dialog>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}