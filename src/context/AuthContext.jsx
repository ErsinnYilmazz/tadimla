import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)
    // Gerçek projede API çağrısı olacak
    await new Promise(r => setTimeout(r, 1000))
    setUser({ id: '1', name: 'Ersin Yılmaz', email })
    setLoading(false)
    return true
  }

  const register = async (name, email, password) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setUser({ id: '1', name, email })
    setLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}