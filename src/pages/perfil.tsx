import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Layout from '@/components/Layout'

export default function PerfilPage() {
  const [user, setUser] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  
  // Nuevos estados para los campos editables
  const [nombre, setNombre] = useState<string>('')
  const [telefono, setTelefono] = useState<string>('')
  const [loadingProfile, setLoadingProfile] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        fetchUserData(session.user.id)
      }
    }

    getUser()
  }, [])

  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('perfil_usuario')
        .select('foto_url, nombre, telefono')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user data:', error)
        return
      }

      if (data) {
        if (data.foto_url) setImageUrl(data.foto_url)
        if (data.nombre) setNombre(data.nombre)
        if (data.telefono) setTelefono(data.telefono)
      }
    } catch (err) {
      console.error('Error fetching user data:', err)
    }
  }

  // Toda la lógica de imagen se mantiene igual
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      
      // Validar tipo de archivo
      if (!selectedFile.type.startsWith('image/')) {
        setError('Por favor selecciona un archivo de imagen válido')
        return
      }
      
      // Validar tamaño (máximo 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('La imagen debe ser menor a 5MB')
        return
      }
      
      setFile(selectedFile)
      setError(null)
      
      // Preview de la imagen
      const reader = new FileReader()
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      
      if (!droppedFile.type.startsWith('image/')) {
        setError('Por favor selecciona un archivo de imagen válido')
        return
      }
      
      if (droppedFile.size > 5 * 1024 * 1024) {
        setError('La imagen debe ser menor a 5MB')
        return
      }
      
      setFile(droppedFile)
      setError(null)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string)
      }
      reader.readAsDataURL(droppedFile)
    }
  }

  const handleUpload = async () => {
    if (!file || !user) return
    
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}/perfil.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('imagenes-perfil')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        throw uploadError
      }

      const { data: publicUrlData } = supabase
        .storage
        .from('imagenes-perfil')
        .getPublicUrl(filePath)

      const foto_url = publicUrlData.publicUrl

      const { error: dbError } = await supabase
        .from('perfil_usuario')
        .upsert({ id: user.id, foto_url, nombre, telefono })

      if (dbError) {
        throw dbError
      }

      setImageUrl(foto_url)
      setSuccess('¡Imagen de perfil actualizada exitosamente!')
      setFile(null)
    } catch (err: any) {
      setError(err.message || 'Error al subir la imagen')
    } finally {
      setLoading(false)
    }
  }

  // Nueva función para guardar solo los datos del perfil
  const handleSaveProfile = async () => {
    if (!user) return
    
    setLoadingProfile(true)
    setError(null)
    setSuccess(null)

    try {
      const { error: dbError } = await supabase
        .from('perfil_usuario')
        .upsert({ id: user.id, nombre, telefono })

      if (dbError) {
        throw dbError
      }

      setSuccess('¡Perfil actualizado exitosamente!')
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el perfil')
    } finally {
      setLoadingProfile(false)
    }
  }

  const removeImage = () => {
    setFile(null)
    setImageUrl(null)
    setError(null)
    setSuccess(null)
  }

  return (
    <Layout user={user} isAuthenticated={true}>
      <div style={{
        minHeight: 'calc(100vh - 120px)',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        padding: '2rem 1rem'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 10px 40px rgba(0, 78, 146, 0.1)',
          overflow: 'hidden'
        }}>
          {/* Header del perfil */}
          <div style={{
            background: 'linear-gradient(135deg, #004e92, #00a86b)',
            padding: '2rem',
            textAlign: 'center',
            color: 'white'
          }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              margin: '0 0 0.5rem 0', 
              fontWeight: 'bold' 
            }}>
              Mi Perfil
            </h1>
            <p style={{ 
              margin: 0, 
              opacity: 0.9, 
              fontSize: '1.1rem' 
            }}>
              {user?.email}
            </p>
          </div>

          {/* Contenido del perfil */}
          <div style={{ padding: '2rem' }}>
            {/* Imagen de perfil */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                position: 'relative',
                display: 'inline-block',
                marginBottom: '1.5rem'
              }}>
                {imageUrl ? (
                  <img 
                    src={`${imageUrl}?t=${Date.now()}`} 
                    alt="Foto de perfil" 
                    style={{ 
                      width: 180, 
                      height: 180, 
                      borderRadius: '50%', 
                      objectFit: 'cover',
                      border: '5px solid #004e92',
                      boxShadow: '0 8px 25px rgba(0, 78, 146, 0.2)'
                    }} 
                  />
                ) : (
                  <div style={{
                    width: 180,
                    height: 180,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #004e92, #00a86b)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem',
                    color: 'white',
                    boxShadow: '0 8px 25px rgba(0, 78, 146, 0.2)'
                  }}>
                    👤
                  </div>
                )}
                
                {imageUrl && (
                  <button
                    onClick={removeImage}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '35px',
                      height: '35px',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 10px rgba(220, 53, 69, 0.3)'
                    }}
                    title="Eliminar imagen"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Zona de carga */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${dragActive ? '#00a86b' : '#ddd'}`,
                  borderRadius: '1rem',
                  padding: '2rem',
                  textAlign: 'center',
                  background: dragActive ? 'rgba(0, 168, 107, 0.05)' : '#f8f9fa',
                  transition: 'all 0.3s ease',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
                <p style={{ margin: '0 0 1rem 0', color: '#666' }}>
                  Arrastra una imagen aquí o haz clic para seleccionar
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  style={{
                    background: 'linear-gradient(135deg, #004e92, #00a86b)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    transition: 'transform 0.2s ease',
                    boxShadow: '0 4px 15px rgba(0, 78, 146, 0.3)',
                    display: 'inline-block'
                  }}
                  onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
                >
                  Seleccionar Imagen
                </label>
                <p style={{ margin: '1rem 0 0 0', fontSize: '0.85rem', color: '#999' }}>
                  Máximo 5MB • JPG, PNG, GIF
                </p>
              </div>

              {/* Botón de guardar imagen */}
              {file && (
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  style={{
                    background: loading ? '#ccc' : 'linear-gradient(135deg, #00a86b, #004e92)',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '0.75rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    boxShadow: loading ? 'none' : '0 4px 20px rgba(0, 168, 107, 0.3)',
                    width: '100%',
                    maxWidth: '300px',
                    marginBottom: '2rem'
                  }}
                >
                  {loading ? '⏳ Guardando...' : '💾 Guardar Imagen'}
                </button>
              )}
            </div>

            {/* Formulario de datos personales */}
            <div style={{
              background: '#f8f9fa',
              borderRadius: '0.75rem',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{
                margin: '0 0 1.5rem 0',
                color: '#004e92',
                fontSize: '1.5rem',
                textAlign: 'center'
              }}>
                Información Personal
              </h3>

              {/* Campo Nombre */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#004e92',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}>
                  👤 Nombre Completo
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ingresa tu nombre completo"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = '#00a86b'}
                  onBlur={e => e.target.style.borderColor = '#e9ecef'}
                />
              </div>

              {/* Campo Teléfono */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#004e92',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}>
                  📞 Teléfono
                </label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ingresa tu número de teléfono"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = '#00a86b'}
                  onBlur={e => e.target.style.borderColor = '#e9ecef'}
                />
              </div>

              {/* Botón guardar perfil */}
              <button
                onClick={handleSaveProfile}
                disabled={loadingProfile}
                style={{
                  background: loadingProfile ? '#ccc' : 'linear-gradient(135deg, #004e92, #00a86b)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '0.75rem',
                  cursor: loadingProfile ? 'not-allowed' : 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  boxShadow: loadingProfile ? 'none' : '0 4px 20px rgba(0, 78, 146, 0.3)',
                  width: '100%'
                }}
              >
                {loadingProfile ? '⏳ Guardando...' : '💾 Guardar Perfil'}
              </button>
            </div>

            {/* Mensajes de estado */}
            {error && (
              <div style={{
                background: '#f8d7da',
                color: '#721c24',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                border: '1px solid #f5c6cb',
                textAlign: 'center'
              }}>
                ❌ {error}
              </div>
            )}

            {success && (
              <div style={{
                background: '#d1edff',
                color: '#0c5460',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                border: '1px solid #bee5eb',
                textAlign: 'center'
              }}>
                ✅ {success}
              </div>
            )}

            {/* Información adicional del usuario */}
            <div style={{
              background: '#f8f9fa',
              borderRadius: '0.75rem',
              padding: '1.5rem'
            }}>
              <h3 style={{
                margin: '0 0 1rem 0',
                color: '#004e92',
                fontSize: '1.3rem'
              }}>
                Información de la Cuenta
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>📧</span>
                <span style={{ color: '#666' }}>Email:</span>
                <span style={{ fontWeight: '500' }}>{user?.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🆔</span>
                <span style={{ color: '#666' }}>ID de Usuario:</span>
                <span style={{ fontWeight: '500', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                  {user?.id?.substring(0, 8)}...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}