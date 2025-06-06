'use client'

import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import { Product } from '@/types/product'

interface ProductGridProps {
  products?: Product[]
}

export default function ProductGrid({ products: providedProducts }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(providedProducts || [])
  const [loading, setLoading] = useState(!providedProducts)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Wenn Produkte als Props übergeben wurden, verwende diese
    if (providedProducts) {
      setProducts(providedProducts)
      setLoading(false)
      return
    }

    // Andernfalls versuche vom Backend zu laden
    const fetchProducts = async () => {
      try {
        const medusa = (await import('@/lib/medusa')).default
        setLoading(true)
        setError(null)
        
        const response = await medusa.products.list({
          limit: 50,
          offset: 0
        })
        
        setProducts(response.products as unknown as Product[])
      } catch (err) {
        console.error('Fehler beim Laden der Produkte:', err)
        setError('Fehler beim Laden der Produkte. Ist das Backend gestartet?')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [providedProducts])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Lade T-Shirt Kollektion...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Oops! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
          <p className="text-gray-600 mb-4">
            Starte das MedusaJS Backend mit:
          </p>
          <code className="bg-gray-100 px-3 py-2 rounded text-sm">
            cd backend/my-medusa-store && npm run dev
          </code>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Keine Produkte gefunden
          </h2>
          <p className="text-gray-600 mb-4">
            Lade T-Shirt Sample-Daten mit:
          </p>
          <code className="bg-gray-100 px-3 py-2 rounded text-sm">
            cd backend/my-medusa-store && npm run seed:tshirts
          </code>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Developer T-Shirt Store
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Premium T-Shirts für Entwickler, Programmierer und Tech-Enthusiasten. 
              Von Python bis React - finde dein perfektes Tech-Statement!
            </p>
            <div className="mt-6 flex justify-center">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {products.length} Designs verfügbar
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>🚀 Project Medusa - Automatisierter T-Shirt Store</p>
            <p className="mt-1">
              Powered by Next.js + MedusaJS + Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 