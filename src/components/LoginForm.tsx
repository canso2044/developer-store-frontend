'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LoginFormProps {
  onLogin: (success: boolean) => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Simple password - in production use environment variable
  const STORE_PASSWORD = 'demo2025'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    if (password === STORE_PASSWORD) {
      // Set auth in localStorage
      localStorage.setItem('store_authenticated', 'true')
      localStorage.setItem('store_auth_time', Date.now().toString())
      onLogin(true)
      router.refresh()
    } else {
      setError('Falsches Passwort. Bitte versuche es erneut.')
      onLogin(false)
    }
    
    setLoading(false)
    setPassword('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🛒 Developer Store</h1>
          <p className="text-gray-600">Beta-Zugang erforderlich</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Store-Passwort
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Passwort eingeben..."
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Anmeldung...
                  </div>
                ) : (
                  'Store betreten'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">🎯 Beta-Test Info:</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Vollständiger E-Commerce Store</li>
                <li>• Checkout-Flow mit Mock-Payment</li>
                <li>• 66/66 Tests grün ✅</li>
                <li>• Feedback erwünscht! 😊</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 