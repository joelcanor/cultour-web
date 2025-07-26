import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!newPassword || !confirmPassword) {
      setError('Completa ambos campos.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/auth/login'), 2500)
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'linear-gradient(to bottom right, #004e92, #00a86b)'
    }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'white',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
          textAlign: 'center'
        }}
      >
        <h2 style={{ color: '#004e92', marginBottom: '1rem' }}>Restablecer Contraseña</h2>
        <p style={{ fontSize: '0.95rem', color: '#555', marginBottom: '1.5rem' }}>
          Escribe tu nueva contraseña
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Campo nueva contraseña */}
          <div style={{ position: 'relative' }}>
            <input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{
                padding: '1rem',
                paddingRight: '3rem',
                border: '2px solid #ddd',
                borderRadius: '0.8rem',
                fontSize: '1rem',
                width: '100%'
              }}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                color: '#6b7280',
                cursor: 'pointer'
              }}
            >
              {showNewPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Campo confirmar contraseña */}
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                padding: '1rem',
                paddingRight: '3rem',
                border: '2px solid #ddd',
                borderRadius: '0.8rem',
                fontSize: '1rem',
                width: '100%'
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                color: '#6b7280',
                cursor: 'pointer'
              }}
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Mensajes */}
          {error && <p style={{ color: '#dc2626', fontSize: '0.9rem' }}>{error}</p>}
          {success && <p style={{ color: '#16a34a', fontSize: '0.9rem' }}>¡Contraseña actualizada! Redirigiendo...</p>}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            style={{
              background: loading
                ? 'linear-gradient(to right, #94a3b8, #64748b)'
                : 'linear-gradient(to right, #004e92, #00a86b)',
              color: 'white',
              padding: '1rem',
              border: 'none',
              borderRadius: '0.8rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(0, 78, 146, 0.3)',
              marginTop: '1rem'
            }}
          >
            {loading ? 'Actualizando...' : 'Guardar nueva contraseña'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
