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
      <div className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
              {categoryTag}
            </span>
          </div>

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
            <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              Quick View
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md"
                >
                  #{tag.value}
                </span>
              ))}
              {product.tags.length > 3 && (
                <span className="text-gray-400 text-xs">
                  +{product.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Price and Variants Info */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                €{lowestPrice.toFixed(2)}
              </span>
              <span className="text-gray-500 text-sm ml-1">
                from
              </span>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {product.variants?.length || 0} variants
              </div>
              <div className="text-xs text-gray-400">
                Sizes & Colors
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="mt-3 flex items-center">
            <div className="flex -space-x-1">
              {/* Color dots (simplified) */}
              <div className="w-4 h-4 bg-black rounded-full border-2 border-white"></div>
              <div className="w-4 h-4 bg-white rounded-full border-2 border-gray-300"></div>
              <div className="w-4 h-4 bg-gray-600 rounded-full border-2 border-white"></div>
            </div>
            <span className="ml-2 text-xs text-gray-500">
              In Stock
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
} 