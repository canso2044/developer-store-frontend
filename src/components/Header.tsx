'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/contexts/CartContext'
import CartSidebar from './CartSidebar'

export default function Header() {
  const { state } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Improved cart state management with useCallback to prevent stale closures
  const openCart = useCallback(() => {
    setIsCartOpen(true)
  }, [])

  const closeCart = useCallback(() => {
    setIsCartOpen(false)
  }, [])

  // Auto-open cart sidebar on cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      openCart()
    }

    // Listen for custom cart update events
    window.addEventListener('cart-updated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate)
    }
  }, [openCart])

  // Debug logging for cart state changes (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Cart sidebar state changed:', isCartOpen)
    }
  }, [isCartOpen])

  return (
    <>
      {/* Beautiful Header with gradient background */}
      <header className="bg-white backdrop-blur-xl bg-white/95 shadow-lg border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            
            {/* Enhanced Logo/Brand */}
            <Link href="/" className="flex items-center group">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-xl">M</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
                </div>
                <div className="transform group-hover:translate-x-1 transition-transform duration-300">
                  <div className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Developer Store
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    Premium T-Shirts
                  </div>
                </div>
              </div>
            </Link>

            {/* Enhanced Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="relative text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 group py-2">
                <span>Shop</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></div>
              </Link>
              <Link href="/about" className="relative text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 group py-2">
                <span>Über uns</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></div>
              </Link>
              <Link href="/contact" className="relative text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 group py-2">
                <span>Kontakt</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></div>
              </Link>
            </nav>

            {/* Enhanced Cart Controls */}
            <div className="flex items-center space-x-4">
              {/* Beautiful Cart Button */}
              <div className="relative group">
                <div
                  className="relative p-3 text-gray-700 hover:text-blue-600 cursor-pointer min-h-[48px] min-w-[48px] flex items-center justify-center transition-all duration-300 rounded-xl hover:bg-blue-50 hover:shadow-lg"
                  title="Warenkorb öffnen"
                  role="button"
                  tabIndex={0}
                  aria-label="Warenkorb öffnen"
                  style={{ 
                    pointerEvents: 'none',
                    userSelect: 'none',
                    touchAction: 'manipulation'
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openCart()
                    }
                  }}
                >
                  {/* Enhanced Click Overlay */}
                  <div 
                    className="absolute inset-0 w-full h-full cursor-pointer z-50 rounded-xl"
                    onClick={(e) => {
                      console.log('🎯 OVERLAY CLICKED!')
                      e.preventDefault()
                      e.stopPropagation()
                      openCart()
                    }}
                    style={{
                      background: process.env.NODE_ENV === 'development' ? 'rgba(0,255,0,0.1)' : 'transparent',
                      pointerEvents: 'auto'
                    }}
                    title="Click Overlay - NUR DIESER BEREICH IST KLICKBAR"
                  />
                  
                  <ShoppingCartIcon 
                    className="h-6 w-6 relative z-10 group-hover:scale-110 transition-transform duration-300" 
                    style={{ pointerEvents: 'none' }}
                  />
                  
                  {/* Enhanced Cart Badge */}
                  {state.totalItems > 0 && (
                    <span 
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse shadow-lg border-2 border-white z-[60]"
                      style={{ pointerEvents: 'none' }}
                    >
                      {state.totalItems > 99 ? '99+' : state.totalItems}
                    </span>
                  )}
                  
                  {/* Enhanced Tooltip */}
                  <div className="hidden lg:block absolute right-0 top-full mt-3 bg-gray-900 text-white text-sm py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-10 shadow-xl">
                    <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                    {state.totalItems === 0 ? 'Warenkorb ist leer' : 
                     state.totalItems === 1 ? '1 Artikel im Warenkorb' : 
                     `${state.totalItems} Artikel im Warenkorb`}
                  </div>
                </div>
              </div>

              {/* Enhanced Cart Total */}
              {state.totalItems > 0 && (
                <div className="hidden md:block">
                  <button
                    onClick={openCart}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700"
                    type="button"
                    aria-label="Warenkorb Gesamtsumme anzeigen"
                  >
                    €{(state.totalPrice / 100).toFixed(2)}
                  </button>
                </div>
              )}

              {/* Fallback Cart Link for SEO */}
              <Link 
                href="/cart" 
                className="sr-only"
                aria-label="Zur Warenkorb-Seite"
              >
                Warenkorb
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Sidebar with improved state management */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={closeCart}
      />
    </>
  )
} 