import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'
import ReCAPTCHA from 'react-google-recaptcha'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [showResendEmail, setShowResendEmail] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false)
  const [captchaToken, setCaptchaToken] = useState<string>('')
  const dialogRef = useRef<HTMLDialogElement>(null)

  const openTerms = (): void => dialogRef.current?.showModal()
  const closeTerms = (): void => dialogRef.current?.close()

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
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

  const handleForgotPassword = async (): Promise<void> => {
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

  const handleResendEmail = async (): Promise<void> => {
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

  const handleForgotButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>): void => {
    (e.target as HTMLButtonElement).style.color = '#00a86b'
  }

  const handleForgotButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>): void => {
    (e.target as HTMLButtonElement).style.color = '#004e92'
  }

  const handleGoogleLogin = async (): Promise<void> => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) {
      setError('Error al iniciar sesión con Google: ' + error.message)
    }
  }

  const handleGoToRegister = (): void => {
    router.push('/auth/register')
  }

  const inputStyle = (hasError: boolean = false): React.CSSProperties => ({
    padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1rem, 2.5vw, 1.2rem)',
    border: `2px solid ${hasError ? '#ef4444' : '#e5e7eb'}`,
    borderRadius: 'clamp(0.6rem, 1.5vw, 0.8rem)',
    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: '#fafafa',
    width: '100%',
    boxSizing: 'border-box',
  })

  const buttonStyle: React.CSSProperties = {
    background: isLoading 
      ? 'linear-gradient(to right, #94a3b8, #64748b)' 
      : 'linear-gradient(to right, #004e92, #00a86b)',
    color: 'white',
    padding: 'clamp(0.8rem, 2.5vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
    border: 'none',
    borderRadius: 'clamp(0.6rem, 1.5vw, 0.8rem)',
    fontWeight: '600',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
    transition: 'all 0.3s ease',
    transform: isLoading ? 'scale(0.98)' : 'scale(1)',
    boxShadow: '0 4px 12px rgba(0, 78, 146, 0.3)',
    width: '100%',
    minHeight: '48px',
  }

  const forgotButtonStyle: React.CSSProperties = {
    background: 'none',
    color: '#004e92',
    border: 'none',
    textAlign: 'left',
    fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: '0.5rem 0',
    transition: 'color 0.3s ease',
    minHeight: '44px',
  }

  const oauthButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    color: '#333',
    padding: 'clamp(0.7rem, 2vw, 0.8rem) clamp(0.8rem, 2vw, 1rem)',
    borderRadius: 'clamp(0.6rem, 1.5vw, 0.8rem)',
    fontWeight: '500',
    border: '2px solid #e5e7eb',
    width: '100%',
    cursor: 'pointer',
    marginBottom: 'clamp(0.6rem, 1.5vw, 0.8rem)',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)',
    minHeight: '48px',
    gap: 'clamp(0.5rem, 1vw, 0.75rem)',
  }

  const containerStyle: React.CSSProperties = { 
    minHeight: '100vh', 
    background: 'linear-gradient(to bottom right, #004e92, #00a86b)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 'clamp(1rem, 4vw, 2rem)',
    boxSizing: 'border-box'
  }

  const cardStyle: React.CSSProperties = { 
    background: 'white', 
    borderRadius: 'clamp(1rem, 3vw, 1.5rem)', 
    padding: 'clamp(1.5rem, 5vw, 3rem)', 
    maxWidth: 'min(450px, 95vw)', 
    width: '100%', 
    boxShadow: '0 12px 40px rgba(0,0,0,0.2)', 
    textAlign: 'center' as const,
    margin: 'auto',
    boxSizing: 'border-box'
  }

  const logoContainerStyle: React.CSSProperties = { 
    display: 'flex', 
    justifyContent: 'center', 
    marginBottom: 'clamp(1rem, 3vw, 1.5rem)' 
  }

  const logoStyle: React.CSSProperties = { 
    borderRadius: '50%', 
    objectFit: 'cover' as const, 
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
    border: '3px solid white'
  }

  const titleContainerStyle: React.CSSProperties = { 
    marginBottom: 'clamp(1.5rem, 4vw, 2rem)' 
  }

  const titleStyle: React.CSSProperties = { 
    fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
    fontWeight: '700',
    color: '#004e92', 
    marginBottom: '0.5rem',
    lineHeight: '1.2'
  }

  const subtitleStyle: React.CSSProperties = { 
    color: '#666', 
    fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
    lineHeight: '1.4'
  }

  const formStyle: React.CSSProperties = { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 'clamp(1rem, 3vw, 1.5rem)' 
  }

  const passwordContainerStyle: React.CSSProperties = { 
    position: 'relative' 
  }

  const passwordToggleStyle: React.CSSProperties = {
    position: 'absolute',
    right: 'clamp(0.8rem, 2vw, 1rem)',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
    color: '#6b7280',
    minWidth: '44px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const termsLabelStyle: React.CSSProperties = { 
    textAlign: 'left' as const, 
    display: 'flex', 
    alignItems: 'flex-start', 
    gap: 'clamp(0.4rem, 1vw, 0.5rem)',
    fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
    color: '#666',
    lineHeight: '1.4'
  }

  const checkboxStyle: React.CSSProperties = { 
    marginTop: '0.2rem',
    minWidth: '16px',
    minHeight: '16px',
    cursor: 'pointer'
  }

  const termsLinkStyle: React.CSSProperties = { 
    color: '#004e92', 
    textDecoration: 'underline', 
    cursor: 'pointer',
    fontWeight: '500'
  }

  const captchaContainerStyle: React.CSSProperties = { 
    display: 'flex', 
    justifyContent: 'center'
  }

  const errorContainerStyle: React.CSSProperties = {
    padding: 'clamp(0.8rem, 2vw, 1rem)',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 'clamp(0.4rem, 1vw, 0.5rem)',
    color: '#dc2626',
    fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
    lineHeight: '1.4',
    textAlign: 'left' as const
  }

  const resendButtonStyle: React.CSSProperties = {
    background: 'none',
    border: '1px solid #dc2626',
    color: '#dc2626',
    padding: 'clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.8rem, 2vw, 1rem)',
    borderRadius: 'clamp(0.4rem, 1vw, 0.5rem)',
    fontSize: 'clamp(0.75rem, 1.6vw, 0.85rem)',
    cursor: 'pointer',
    marginTop: '0.5rem',
    minHeight: '40px'
  }

  const registerTextStyle: React.CSSProperties = { 
    marginTop: 'clamp(1rem, 3vw, 1.5rem)', 
    fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)', 
    color: '#666',
    lineHeight: '1.4' 
  }

  const registerLinkStyle: React.CSSProperties = { 
    color: '#004e92', 
    fontWeight: '600', 
    textDecoration: 'underline',
    cursor: 'pointer'
  }

  const separatorStyle: React.CSSProperties = { 
    height: '1px', 
    background: 'linear-gradient(to right, transparent, #e5e7eb, transparent)', 
    margin: 'clamp(1.5rem, 4vw, 2rem) 0' 
  }

  const oauthContainerStyle: React.CSSProperties = { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 'clamp(0.6rem, 1.5vw, 0.8rem)' 
  }

  const createAccountButtonStyle: React.CSSProperties = { 
    ...oauthButtonStyle, 
    background: 'linear-gradient(to right, #004e92, #00a86b)', 
    color: 'white',
    border: 'none'
  }

  const modalStyle: React.CSSProperties = {
    padding: 'clamp(1.5rem, 5vw, 2.5rem)',
    borderRadius: 'clamp(1rem, 3vw, 1.5rem)',
    maxWidth: 'min(500px, 90vw)',
    width: '90%',
    maxHeight: '80vh',
    border: 'none',
    textAlign: 'center' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'fixed' as const,
    backgroundColor: 'white',
    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
    boxSizing: 'border-box',
    overflow: 'auto'
  }

  const modalTitleStyle: React.CSSProperties = { 
    color: '#004e92', 
    fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)', 
    marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
    lineHeight: '1.3'
  }

  const modalContentStyle: React.CSSProperties = { 
    textAlign: 'left' as const, 
    lineHeight: '1.6', 
    color: '#555', 
    marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
    fontSize: 'clamp(0.85rem, 2vw, 0.95rem)'
  }

  const modalButtonStyle: React.CSSProperties = {
    background: 'linear-gradient(to right, #004e92, #00a86b)',
    color: 'white',
    padding: 'clamp(0.7rem, 2vw, 0.8rem) clamp(1.5rem, 4vw, 2rem)',
    border: 'none',
    borderRadius: 'clamp(0.6rem, 1.5vw, 0.8rem)',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
    boxShadow: '0 4px 12px rgba(0, 78, 146, 0.3)',
    minHeight: '48px'
  }

  const imageStyle: React.CSSProperties = { 
    width: 'clamp(18px, 3vw, 20px)',
    height: 'clamp(18px, 3vw, 20px)'
  }

  return (
    <div style={containerStyle}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }} 
        style={cardStyle}
      >
        {/* Logo */}
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={logoContainerStyle}
        >
          <Image
            src="/logo.jpg" 
            alt="Logo" 
            width={100}
            height={100}
            style={logoStyle}
          />
        </motion.div>

        {/* Título */}
        <div style={titleContainerStyle}>
          <h2 style={titleStyle}>
            Iniciar Sesión
          </h2>
          <p style={subtitleStyle}>
            Accede a tu cuenta de Cultour
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} style={formStyle}>
          <div>
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              value={email} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value)
                if (error) setError('')
              }} 
              required 
              style={inputStyle(!!error)} 
            />
          </div>

          <div style={passwordContainerStyle}>
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Contraseña" 
              value={password} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value)
                if (error) setError('')
              }} 
              required 
              style={inputStyle(!!error)} 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={passwordToggleStyle}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <button 
            type="button" 
            onClick={handleForgotPassword} 
            style={forgotButtonStyle}
            onMouseEnter={handleForgotButtonMouseEnter}
            onMouseLeave={handleForgotButtonMouseLeave}
          >
            ¿Olvidaste tu contraseña?
          </button>

          {/* Términos y condiciones */}
          <label style={termsLabelStyle}>
            <input 
              type="checkbox" 
              checked={acceptedTerms} 
              onChange={() => setAcceptedTerms(!acceptedTerms)} 
              style={checkboxStyle} 
            />
            <span>
              Acepto los{' '}
              <span 
                onClick={openTerms} 
                style={termsLinkStyle}
              >
                términos y condiciones
              </span>
            </span>
          </label>

          {/* ReCAPTCHA */}
          <div style={captchaContainerStyle}>
            <ReCAPTCHA 
              sitekey="6Lc4R50rAAAAAFrQUU6brzmLaTACddpwr8dD_c5I" 
              onChange={(token: string | null) => setCaptchaToken(token || '')} 
            />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              style={errorContainerStyle}
            >
              <p style={{ marginBottom: showResendEmail ? '0.5rem' : '0' }}>
                {error}
              </p>

              {showResendEmail && (
                <button
                  type="button"
                  onClick={handleResendEmail}
                  style={resendButtonStyle}
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
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 'clamp(0.4rem, 1vw, 0.5rem)' 
              }}>
                <div style={{
                  width: 'clamp(16px, 3vw, 20px)',
                  height: 'clamp(16px, 3vw, 20px)',
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
        <p style={registerTextStyle}>
          ¿No tienes una cuenta?{' '}
          <span
            onClick={handleGoToRegister}
            style={registerLinkStyle}
          >
            Regístrate aquí
          </span>
        </p>

        {/* Separador */}
        <div style={separatorStyle} />

        {/* Botones OAuth */}
        <div style={oauthContainerStyle}>
          <motion.button 
            onClick={handleGoogleLogin} 
            style={oauthButtonStyle}
            whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
            whileTap={{ scale: 0.98 }}
          >
            <Image
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" 
              alt="Google" 
              width={20}
              height={20}
              style={imageStyle}
            />
            Iniciar con Google
          </motion.button>

          <motion.button
            onClick={handleGoToRegister}
            style={createAccountButtonStyle}
            whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0, 78, 146, 0.3)' }}
            whileTap={{ scale: 0.98 }}
          >
            <Image
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png" 
              alt="Registro" 
              width={20}
              height={20}
              style={{ 
                ...imageStyle,
                filter: 'brightness(0) invert(1)' // Para hacerlo blanco en fondo oscuro
              }}
            />
            Crear Nueva Cuenta
          </motion.button>
        </div>
      </motion.div>

      {/* Modal de Términos y Condiciones */}
      <dialog
        ref={dialogRef}
        style={modalStyle}
      >
        <h3 style={modalTitleStyle}>
          Términos y Condiciones de Uso
        </h3>
        <div style={modalContentStyle}>
          <p style={{ marginBottom: '1rem' }}>
            Bienvenido a <strong>Cultour</strong>. Al registrarte, aceptas que usaremos tus datos únicamente para ofrecerte recomendaciones personalizadas de turismo cultural y experiencias auténticas.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            La aplicación no utiliza ubicación en segundo plano, ni acceso al micrófono, ni otras funciones sin tu permiso explícito. Respetamos tu privacidad y la protección de tus datos personales.
          </p>
          <p>
            <strong>Cultour</strong> promueve el turismo responsible y el respeto al entorno cultural y natural de cada destino que visitamos.
          </p>
        </div>
        <motion.button
          onClick={closeTerms}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={modalButtonStyle}
        >
          Entendido
        </motion.button>
      </dialog>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Media queries para breakpoints específicos */
        @media (max-width: 480px) {
          dialog {
            width: 95% !important;
            padding: 1.5rem !important;
          }
        }
        
        @media (max-width: 320px) {
          dialog {
            width: 98% !important;
            padding: 1rem !important;
          }
        }
        
        /* Mejorar el comportamiento en pantallas táctiles */
        @media (hover: none) and (pointer: coarse) {
          button:hover {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  )
}