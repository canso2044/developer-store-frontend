'use client'


import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon, TrashIcon, PlusIcon, MinusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { ShoppingCartIcon } from '@heroicons/react/24/solid'
import { useCart } from '@/contexts/CartContext'
import Header from '@/components/Header'

export default function CartPage() {
  const router = useRouter()
  const { state, removeItem, updateQuantity, clearCart } = useCart()

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2)
  }

  const handleCheckout = () => {
    // Navigate to checkout page
    router.push('/checkout')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Zurück zum Shop
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Warenkorb</h1>
          <p className="mt-2 text-gray-600">
            {state.totalItems === 0 ? 'Dein Warenkorb ist leer' : 
             state.totalItems === 1 ? '1 Artikel in deinem Warenkorb' : 
             `${state.totalItems} Artikel in deinem Warenkorb`}
          </p>
        </div>

        {state.items.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-16">
            <ShoppingCartIcon className="mx-auto h-24 w-24 text-gray-400" />
            <h2 className="mt-4 text-2xl font-semibold text-gray-900">
              Dein Warenkorb ist leer
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Entdecke unsere großartige Auswahl an Developer T-Shirts!
            </p>
            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                Jetzt einkaufen
              </Link>
            </div>
          </div>
        ) : (
          /* Cart with Items */
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Artikel</h2>
                    <button
                      onClick={clearCart}
                      className="text-sm text-red-600 hover:text-red-500 font-medium transition-colors"
                    >
                      Warenkorb leeren
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {state.items.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={96}
                            height={96}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Größe: {item.variant.size} • Farbe: {item.variant.color}
                          </p>
                          <p className="mt-2 text-lg font-semibold text-gray-900">
                            €{formatPrice(item.price)} pro Stück
                          </p>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex flex-col items-end space-y-4">
                          {/* Total Price for this item */}
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              €{formatPrice(item.price * item.quantity)}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <MinusIcon className="h-5 w-5" />
                            </button>
                            <span className="min-w-[3rem] text-center font-medium text-lg">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <PlusIcon className="h-5 w-5" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-500 flex items-center space-x-1 text-sm font-medium transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                            <span>Entfernen</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-sm sticky top-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Bestellübersicht</h2>
                </div>

                <div className="px-6 py-4 space-y-4">
                  {/* Items Summary */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Artikel ({state.totalItems})
                    </span>
                    <span className="font-medium">€{formatPrice(state.totalPrice)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Versandkosten</span>
                    <span className="font-medium text-green-600">Kostenlos</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Steuer (19%)</span>
                    <span className="font-medium">€{formatPrice(Math.round(state.totalPrice * 0.19))}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Gesamtsumme</span>
                      <span>€{formatPrice(state.totalPrice + Math.round(state.totalPrice * 0.19))}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 px-4 rounded-md font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700"
                  >
                    Zur Kasse
                  </button>
                  
                  <p className="mt-3 text-xs text-gray-500 text-center">
                    Sichere Bezahlung mit SSL-Verschlüsselung
                  </p>
                </div>

                {/* Additional Info */}
                <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Kostenloser Versand ab €50
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      30 Tage Rückgaberecht
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      2-4 Werktage Lieferzeit
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 