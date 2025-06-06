'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/contexts/CartContext'
import CartSidebar from './CartSidebar'

export default function Header() {
  const { state } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Auto-open cart sidebar on cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      setIsCartOpen(true)
    }

    // Listen for custom cart update events
    window.addEventListener('cart-updated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate)
    }
  }, [])

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">Developer Store</div>
                  <div className="text-xs text-gray-500">Premium T-Shirts</div>
                </div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Shop
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">
                Über uns
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
                Kontakt
              </Link>
            </nav>

            {/* Cart Controls - Mobile Optimized */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Quick Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors group"
                title="Warenkorb öffnen"
              >
                <ShoppingCartIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                
                {/* Cart Badge */}
                {state.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
                    {state.totalItems > 99 ? '99+' : state.totalItems}
                  </span>
                )}
                
                {/* Hover Tooltip - Desktop only */}
                <div className="hidden sm:block absolute right-0 top-full mt-2 bg-gray-900 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {state.totalItems === 0 ? 'Warenkorb ist leer' : 
                   state.totalItems === 1 ? '1 Artikel im Warenkorb' : 
                   `${state.totalItems} Artikel im Warenkorb`}
                </div>
              </button>

              {/* Cart Total - Desktop */}
              {state.totalItems > 0 && (
                <div className="hidden md:block">
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    €{(state.totalPrice / 100).toFixed(2)}
                  </button>
                </div>
              )}

              {/* Full Cart Button - Large Screens */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="hidden lg:inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Warenkorb
              </button>

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

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
} 