'use client'

import { Fragment, useCallback, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import { ShoppingCartIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { state, removeItem, updateQuantity, clearCart } = useCart()

  // Improved close handler with useCallback to prevent stale closures
  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const handleQuantityChange = useCallback((id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }, [removeItem, updateQuantity])

  const handleClearCart = useCallback(() => {
    clearCart()
  }, [clearCart])

  const handleRemoveItem = useCallback((id: string) => {
    removeItem(id)
  }, [removeItem])

  const formatPrice = useCallback((price: number) => {
    return (price / 100).toFixed(2)
  }, [])

  // Debug logging for cart sidebar state changes (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('CartSidebar isOpen changed:', isOpen)
    }
  }, [isOpen])

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-gradient-to-b from-white to-gray-50 shadow-2xl">
                    {/* Beautiful Header with Gradient */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <ShoppingCartIcon className="h-5 w-5" />
                          </div>
                          <Dialog.Title className="text-xl font-bold">
                            Warenkorb
                          </Dialog.Title>
                        </div>
                        <button
                          type="button"
                          className="relative -m-2 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                          onClick={handleClose}
                          aria-label="Warenkorb schließen"
                        >
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                      
                      {/* Cart Stats */}
                      <div className="mt-4 flex items-center justify-between text-blue-100">
                        <span className="text-sm">
                          {state.totalItems} {state.totalItems === 1 ? 'Artikel' : 'Artikel'}
                        </span>
                        <span className="text-sm font-medium">
                          €{formatPrice(state.totalPrice)}
                        </span>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">

                      {/* Cart Items */}
                      <div className="mt-8">
                        {state.items.length === 0 ? (
                          <div className="text-center py-12">
                            <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                              Dein Warenkorb ist leer
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Füge einige großartige T-Shirts hinzu!
                            </p>
                            <div className="mt-6">
                              <Link
                                href="/"
                                onClick={handleClose}
                                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              >
                                Weiter einkaufen
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div className="flow-root">
                            <ul role="list" className="-my-6 divide-y divide-gray-200">
                              {state.items.map((item) => (
                                <li key={item.id} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <Image
                                      src={item.image}
                                      alt={item.title}
                                      width={96}
                                      height={96}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3 className="text-sm font-medium">{item.title}</h3>
                                        <p className="ml-4">€{formatPrice(item.price * item.quantity)}</p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">
                                        {item.variant.size} / {item.variant.color}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        €{formatPrice(item.price)} pro Stück
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      {/* Quantity Controls */}
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                          className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                          type="button"
                                          aria-label={`Menge von ${item.title} verringern`}
                                        >
                                          <MinusIcon className="h-4 w-4" />
                                        </button>
                                        <span className="min-w-[2rem] text-center font-medium">
                                          {item.quantity}
                                        </span>
                                        <button
                                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                          className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                          type="button"
                                          aria-label={`Menge von ${item.title} erhöhen`}
                                        >
                                          <PlusIcon className="h-4 w-4" />
                                        </button>
                                      </div>

                                      {/* Remove Button */}
                                      <div className="flex">
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveItem(item.id)}
                                          className="font-medium text-red-600 hover:text-red-500 flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                                          aria-label={`${item.title} aus Warenkorb entfernen`}
                                        >
                                          <TrashIcon className="h-4 w-4" />
                                          <span>Entfernen</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    {state.items.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        {/* Subtotal */}
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Zwischensumme</p>
                          <p>€{formatPrice(state.totalPrice)}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Versandkosten werden beim Checkout berechnet.
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="mt-6 space-y-3">
                          <Link
                            href="/cart"
                            onClick={handleClose}
                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            Zum Warenkorb
                          </Link>
                          <button
                            type="button"
                            onClick={handleClearCart}
                            className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            aria-label="Alle Artikel aus Warenkorb entfernen"
                          >
                            Warenkorb leeren
                          </button>
                        </div>
                        
                        {/* Continue Shopping */}
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            oder{' '}
                            <button
                              type="button"
                              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                              onClick={handleClose}
                            >
                              weiter einkaufen
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
} 