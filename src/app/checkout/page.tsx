'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useCart } from '../../contexts/CartContext'
import CheckoutForm from '../../components/CheckoutForm'
import { orderService, OrderData } from '../../services/orderService'
import Header from '../../components/Header'

export default function CheckoutPage() {
  const router = useRouter()
  const { state, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  // Redirect to cart if empty
  useEffect(() => {
    if (state.items.length === 0) {
      router.replace('/cart')
    }
  }, [state.items.length, router])

  // Calculate totals
  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2)
  }

  const taxRate = 0.19 // 19% VAT
  const taxAmount = Math.round(state.totalPrice * taxRate)
  const totalWithTax = state.totalPrice + taxAmount

  const handleCheckoutSubmit = async (formData: {firstName: string, lastName: string, email: string, street: string, postalCode: string, city: string, country: string, paymentMethod: 'creditcard' | 'paypal' | 'klarna'}) => {
    setIsLoading(true)
    setError('')

    try {
      const orderData: OrderData = {
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          street: formData.street,
          postalCode: formData.postalCode,
          city: formData.city,
          country: formData.country
        },
        items: state.items,
        paymentMethod: formData.paymentMethod,
        totalAmount: totalWithTax,
        taxAmount: taxAmount
      }

      const result = await orderService.submitOrder(orderData)

      if (result.success && result.orderId) {
        // Clear cart on successful order
        clearCart()
        
        // Redirect to success page
        router.push(`/order-success/${result.orderId}`)
      } else {
        setError(result.message || 'Order submission failed')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Checkout error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render if cart is empty (redirect will happen)
  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p>Weiterleitung zum Warenkorb...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Zurück zum Warenkorb
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">
            Vervollständigen Sie Ihre Bestellung
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <CheckoutForm 
                onSubmit={handleCheckoutSubmit}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm sticky top-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Bestellübersicht</h2>
              </div>

              {/* Cart Items */}
              <div className="px-6 py-4">
                <div className="space-y-4 mb-6">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {item.variant.size} • {item.variant.color}
                        </p>
                        <p className="text-sm text-gray-900">
                          {item.quantity}x €{formatPrice(item.price)}
                        </p>
                      </div>
                      
                      <div className="text-sm font-medium text-gray-900">
                        €{formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-t border-gray-200 pt-4">
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
                    <span className="font-medium">€{formatPrice(taxAmount)}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Gesamtsumme</span>
                      <span>€{formatPrice(totalWithTax)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Info */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    SSL-verschlüsselte Übertragung
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Sichere Zahlungsabwicklung
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    30 Tage Rückgaberecht
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 