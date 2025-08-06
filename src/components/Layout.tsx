// ✅ Layout.tsx
import Header from './Header'
import Footer from './Footer'
import { ReactNode } from 'react'

type LayoutProps = {
  children: ReactNode
  user: any
  isAuthenticated: boolean
  showUserMenu: boolean
  setShowUserMenu: (value: boolean) => void
  handleLogout: () => void
}

export default function Layout({
  children,
  user,
  isAuthenticated,
  showUserMenu,
  setShowUserMenu,
  handleLogout
}: LayoutProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        user={user}
        isAuthenticated={isAuthenticated}
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
        handleLogout={handleLogout}
      />
      <main style={{ flex: 1, padding: '2rem', background: 'linear-gradient(to bottom, #e0f7fa, #e6ffe9)' }}>
        {children}
      </main>
      <Footer />
    </div>
  )
}