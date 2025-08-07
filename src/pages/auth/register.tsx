// src/pages/auth/register.tsx
import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'

interface FormData {
  username: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  username?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
  general?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const formatPhoneNumber = (value: string) => {
    // Remover todo lo que no sea número
    const numbers = value.replace(/\D/g, '')
    
    // Si empieza con 52, mantenerlo
    if (numbers.startsWith('52')) {
      const phoneNumber = numbers.slice(2)
      if (phoneNumber.length <= 10) {
        return `+52 ${phoneNumber}`
      }
    }
    
    // Si no empieza con 52, agregar +52
    if (numbers.length <= 10) {
      return numbers ? `+52 ${numbers}` : ''
    }
    
    return value
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validar username
    if (!form.username.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio'
    } else if (form.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres'
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      newErrors.username = 'Solo se permiten letras, números y guiones bajos'
    }

    // Validar email
    if (!form.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido'
    }

    // Validar teléfono
    const phoneNumbers = form.phone.replace(/\D/g, '')
    if (!form.phone.trim()) {
      newErrors.phone = 'El número de teléfono es obligatorio'
    } else if (phoneNumbers.length < 12 || phoneNumbers.length > 12) {
      newErrors.phone = 'El teléfono debe tener exactamente 10 dígitos'
    }

    // Validar contraseña
    if (!form.password) {
      newErrors.password = 'La contraseña es obligatoria'
    } else if (form.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = 'Debe contener al menos una mayúscula, una minúscula y un número'
    }

    // Validar confirmación de contraseña
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña'
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name === 'phone') {
      const formattedPhone = formatPhoneNumber(value)
      setForm({ ...form, [name]: formattedPhone })
    } else {
      setForm({ ...form, [name]: value })
    }

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      // Intentar registro directamente sin verificar existencia previa
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            username: form.username,
            phone: form.phone,
          },
        },
      })

      if (error) {
        console.log('Error de registro:', error.message)
        
        // Manejar errores específicos de Supabase
        if (error.message.includes('User already registered') || 
            error.message.includes('already been registered')) {
          setErrors({ 
            email: 'Este correo ya está registrado.',
            general: 'Ya existe una cuenta con este correo electrónico. ¿Quizás quieres iniciar sesión?'
          })
        } else if (error.message.includes('Password should be at least')) {
          setErrors({ password: 'La contraseña debe tener al menos 6 caracteres.' })
        } else if (error.message.includes('Invalid email')) {
          setErrors({ email: 'El formato del correo electrónico no es válido.' })
        } else if (error.message.includes('signup is disabled')) {
          setErrors({ general: 'El registro está temporalmente deshabilitado.' })
        } else {
          // Para cualquier otro error, mostrar mensaje genérico
          setErrors({ general: `Error de registro: ${error.message}` })
        }
      } else {
        // Registro exitoso
        setSuccess(true)
        // Pequeño delay para mostrar el mensaje de éxito
        setTimeout(() => router.push('/'), 1500)
      }
    } catch (err) {
      console.error('Error inesperado:', err)
      setErrors({ general: 'Error inesperado. Inténtalo de nuevo.' })
    } finally {
      setIsLoading(false)
    }
  }

  const inputContainerStyle = {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center'
  }

  const inputStyle = (hasError: boolean) => ({
    padding: '1rem 1.2rem 1rem 3.5rem',
    border: `2px solid ${hasError ? '#ef4444' : '#e5e7eb'}`,
    borderRadius: '0.75rem',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: '#fafafa',
    boxShadow: hasError ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : 'none',
    width: '100%'
  })

  const iconStyle = {
    position: 'absolute' as const,
    left: '1.2rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#6b7280',
    zIndex: 1
  }

  const passwordToggleStyle = {
    position: 'absolute' as const,
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem'
  }

  const buttonStyle = {
    background: isLoading 
      ? 'linear-gradient(135deg, #94a3b8, #64748b)' 
      : 'linear-gradient(to right, #004e92, #00a86b)',
    color: 'white',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '0.75rem',
    fontWeight: '600',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    transform: isLoading ? 'scale(0.98)' : 'scale(1)',
    boxShadow: '0 4px 12px rgba(0, 78, 146, 0.3)',
  }

  if (success) {
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
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
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
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ color: '#004e92', marginBottom: '1rem', fontSize: '1.5rem' }}>
            ¡Bienvenido a Cultour!
          </h2>
          <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1rem' }}>
            Tu cuenta ha sido creada exitosamente. 
          </p>
          <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Si proporcionaste un email válido, recibirás un correo de confirmación. 
            Mientras tanto, ya puedes explorar la aplicación.
          </p>
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
            <p style={{ fontSize: '0.9rem', color: '#0369a1' }}>
              Redirigiendo a la aplicación...
            </p>
          </div>
        </motion.div>
      </div>
    )
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
        initial={{ opacity: 0, y: 20 }} 
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
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '1.8rem', 
            fontWeight: '700', 
            color: '#004e92', 
            marginBottom: '0.5rem' 
          }}>
            Registro
          </h1>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>
            Completa el formulario para crear tu cuenta
          </p>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <div style={inputContainerStyle}>
              <FaUser style={iconStyle} size={18} />
              <input
                name="username"
                placeholder="Nombre de usuario"
                value={form.username}
                onChange={handleChange}
                style={inputStyle(!!errors.username)}
              />
            </div>
            {errors.username && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', marginLeft: '0.5rem' }}
              >
                {errors.username}
              </motion.p>
            )}
          </div>

          <div>
            <div style={inputContainerStyle}>
              <FaEnvelope style={iconStyle} size={18} />
              <input
                name="email"
                type="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
                style={inputStyle(!!errors.email)}
              />
            </div>
            {errors.email && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', marginLeft: '0.5rem' }}
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          <div>
            <div style={inputContainerStyle}>
              <FaPhone style={iconStyle} size={18} />
              <input
                name="phone"
                placeholder="+52 1234567890"
                value={form.phone}
                onChange={handleChange}
                style={inputStyle(!!errors.phone)}
              />
            </div>
            {errors.phone && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', marginLeft: '0.5rem' }}
              >
                {errors.phone}
              </motion.p>
            )}
          </div>

          <div>
            <div style={inputContainerStyle}>
              <FaLock style={iconStyle} size={18} />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña (mín. 8 caracteres)"
                value={form.password}
                onChange={handleChange}
                style={inputStyle(!!errors.password)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={passwordToggleStyle}
              >
                {showPassword ? (
                  <FaEye color="#004e92" size={22} />
                ) : (
                  <FaEyeSlash color="#004e92" size={22} />
                )}
              </button>
            </div>
            {errors.password && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', marginLeft: '0.5rem' }}
              >
                {errors.password}
              </motion.p>
            )}
          </div>

          <div>
            <div style={inputContainerStyle}>
              <FaLock style={iconStyle} size={18} />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirmar contraseña"
                value={form.confirmPassword}
                onChange={handleChange}
                style={inputStyle(!!errors.confirmPassword)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={passwordToggleStyle}
              >
                {showConfirmPassword ? (
                  <FaEye color="#004e92" size={22} />
                ) : (
                  <FaEyeSlash color="#004e92" size={22} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', marginLeft: '0.5rem' }}
              >
                {errors.confirmPassword}
              </motion.p>
            )}
          </div>

          {errors.general && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              style={{
                padding: '1rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.5rem',
                color: '#dc2626'
              }}
            >
              <p style={{ marginBottom: '0.5rem' }}>{errors.general}</p>
              {errors.general.includes('iniciar sesión') && (
                <button
                  type="button"
                  onClick={() => router.push('/auth/login')}
                  style={{
                    background: 'none',
                    border: '1px solid #dc2626',
                    color: '#dc2626',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  Ir a Iniciar Sesión
                </button>
              )}
            </motion.div>
          )}

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
                Creando cuenta...
              </span>
            ) : (
              'Crear Cuenta'
            )}
          </motion.button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <div style={{ 
            height: '1px', 
            background: 'linear-gradient(to right, transparent, #e5e7eb, transparent)', 
            margin: '1.5rem 0' 
          }} />
          <p style={{ fontSize: '0.95rem', color: '#6b7280' }}>
            ¿Ya tienes una cuenta?{' '}
            <span 
              onClick={() => router.push('/auth/login')} 
              style={{ 
                color: '#004e92', 
                cursor: 'pointer', 
                fontWeight: '600',
                textDecoration: 'underline'
              }}
            >
              Iniciar Sesión
            </span>
          </p>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}