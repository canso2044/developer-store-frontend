'use client'

import { useState, useEffect, ReactNode } from 'react'
import LoginForm from './LoginForm'

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      try {
        const authenticated = localStorage.getItem('store_authenticated')
        const authTime = localStorage.getItem('store_auth_time')
        
        if (authenticated === 'true' && authTime) {
          // Check if auth is still valid (24 hours)
          const authTimestamp = parseInt(authTime)
          const now = Date.now()
          const twentyFourHours = 24 * 60 * 60 * 1000
          
          if (now - authTimestamp < twentyFourHours) {
            setIsAuthenticated(true)
          } else {
            // Auth expired
            localStorage.removeItem('store_authenticated')
            localStorage.removeItem('store_auth_time')
            setIsAuthenticated(false)
          }
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success)
  }

  const handleLogout = () => {
    localStorage.removeItem('store_authenticated')
    localStorage.removeItem('store_auth_time')
    setIsAuthenticated(false)
  }

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Store wird geladen...</p>
        </div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  // Add logout functionality to authenticated content
  return (
    <div>
      {/* Mobile-friendly logout button */}
      <div className="fixed top-2 left-2 z-50 md:top-4 md:right-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 md:px-3 md:py-1 rounded-full shadow-lg transition-colors flex items-center"
          title="Store verlassen"
        >
          <span className="md:hidden">🚪</span>
          <span className="hidden md:inline">🚪 Logout</span>
        </button>
      </div>
      {children}
    </div>
  )
} 