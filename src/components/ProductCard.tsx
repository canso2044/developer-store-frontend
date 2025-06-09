import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  // Finde den niedrigsten Preis aus allen Varianten
  const getLowestPrice = () => {
    const prices = product.variants?.flatMap(variant => {
      // Unterstütze sowohl Backend-Format (prices array) als auch Mock-Format (calculated_price)
      if (variant.prices && variant.prices.length > 0) {
        return variant.prices.map(price => price.amount)
      } else if (variant.calculated_price) {
        return [variant.calculated_price.calculated_amount]
      }
      return [2500] // Fallback-Preis 25€
    }) || [2500]
    return Math.min(...prices) / 100 // Von Cent zu Euro
  }

  // Hauptbild oder Placeholder
  const imageUrl = product.thumbnail || (product.images && product.images[0]?.url) || 
    'https://via.placeholder.com/400x400/f3f4f6/6b7280?text=T-Shirt'

  const lowestPrice = getLowestPrice()
  const categoryTag = product.collection?.title || 'T-Shirt'

  return (
    <Link href={`/products/${product.handle || product.id}`}>
      <div className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200 hover:-translate-y-2 animate-fade-in">
        {/* Enhanced Image Container with Gradient Overlay */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Beautiful gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Enhanced Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-white/20">
              {categoryTag}
            </span>
          </div>

          {/* Enhanced Quick View Overlay with Beautiful Animation */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
            <button className="bg-white/95 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-xl font-semibold shadow-xl border border-white/20 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200 hover:bg-white hover:shadow-2xl">
              Quick View
            </button>
          </div>

          {/* Beautiful corner accent */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Enhanced Product Info with Better Typography */}
        <div className="p-6">
          {/* Enhanced Title with Gradient */}
          <h3 className="font-bold text-gray-900 text-xl mb-3 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {product.title}
          </h3>

          {/* Enhanced Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Enhanced Tags with Beautiful Pills */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 text-xs font-medium px-3 py-1 rounded-full border border-gray-200 hover:border-gray-300 transition-colors duration-200"
                >
                  #{tag.value}
                </span>
              ))}
              {product.tags.length > 3 && (
                <span className="text-gray-400 text-xs font-medium bg-gray-50 px-2 py-1 rounded-full">
                  +{product.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Enhanced Price Section with Gradient */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                €{lowestPrice.toFixed(2)}
              </span>
              <span className="text-gray-500 text-sm font-medium">
                from
              </span>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-700">
                {product.variants?.length || 0} variants
              </div>
              <div className="text-xs text-gray-500">
                Sizes & Colors
              </div>
            </div>
          </div>

          {/* Enhanced Availability with Color Dots */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-1">
                {/* Enhanced color dots with shadows */}
                <div className="w-5 h-5 bg-gray-900 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform duration-200"></div>
                <div className="w-5 h-5 bg-white rounded-full border-2 border-gray-300 shadow-lg hover:scale-110 transition-transform duration-200"></div>
                <div className="w-5 h-5 bg-gray-600 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform duration-200"></div>
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                ✓ In Stock
              </span>
            </div>

            {/* Add to Cart Quick Action */}
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5">
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Beautiful bottom accent line */}
        <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </div>
    </Link>
  )
} 