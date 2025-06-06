'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon, HeartIcon, ShareIcon, ShoppingCartIcon, CheckIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useCart } from '@/contexts/CartContext'
import Header from '@/components/Header'

// Mock-Daten (gleiche wie auf Hauptseite)
const mockProducts = [
  {
    id: "tshirt_1",
    title: "Vintage Coding Tee",
    description: "Classic vintage style for developers who appreciate timeless design and quality code. Made from 100% organic cotton with a relaxed fit that's perfect for long coding sessions.",
    thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=600&fit=crop"
    ],
    variants: [
      {
        id: "var_1_s",
        title: "Small / Black",
        size: "S",
        color: "Black",
        calculated_price: { calculated_amount: 2399 },
        stock: 15
      },
      {
        id: "var_1_m",
        title: "Medium / Black", 
        size: "M",
        color: "Black",
        calculated_price: { calculated_amount: 2399 },
        stock: 8
      },
      {
        id: "var_1_l",
        title: "Large / Black",
        size: "L", 
        color: "Black",
        calculated_price: { calculated_amount: 2399 },
        stock: 12
      }
    ],
    features: ["100% Organic Cotton", "Machine Washable", "Unisex Fit", "Ethically Made"]
  },
  {
    id: "tshirt_2", 
    title: "Python Powered",
    description: "Show your love for Python with this sleek and comfortable developer tee. Features a minimalist Python logo and motivational coding quote.",
    thumbnail: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop"
    ],
    variants: [
      {
        id: "var_2_m",
        title: "Medium / Navy",
        size: "M",
        color: "Navy", 
        calculated_price: { calculated_amount: 2199 },
        stock: 20
      },
      {
        id: "var_2_l",
        title: "Large / Navy",
        size: "L",
        color: "Navy",
        calculated_price: { calculated_amount: 2199 },
        stock: 5
      }
    ],
    features: ["Soft Cotton Blend", "Pre-shrunk", "Screen Printed", "Developer Approved"]
  },
  {
    id: "tshirt_3",
    title: "JavaScript Ninja",
    description: "Stealthy, powerful, and precise - just like your JavaScript skills. This premium tee celebrates the art of modern web development.",
    thumbnail: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=600&fit=crop"
    ],
    variants: [
      {
        id: "var_3_l",
        title: "Large / Charcoal",
        size: "L",
        color: "Charcoal",
        calculated_price: { calculated_amount: 2599 },
        stock: 7
      }
    ],
    features: ["Premium Cotton", "Modern Fit", "Fade Resistant", "Limited Edition"]
  },
  {
    id: "tshirt_4",
    title: "React Component",
    description: "Reusable, efficient, and always rendering perfectly - like this shirt. Perfect for React developers who know the power of components.",
    thumbnail: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop"
    ],
    variants: [
      {
        id: "var_4_m",
        title: "Medium / Royal Blue",
        size: "M",
        color: "Royal Blue",
        calculated_price: { calculated_amount: 2299 },
        stock: 10
      }
    ],
    features: ["React Design", "Component Pattern", "Blue Theme", "Frontend Focus"]
  },
  {
    id: "tshirt_5",
    title: "AI/ML Engineer",
    description: "Training models by day, training at the gym by night. Neural networks included. Perfect for AI enthusiasts and machine learning engineers.",
    thumbnail: "https://images.unsplash.com/photo-1555374018-13a8994ab246?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1555374018-13a8994ab246?w=600&h=600&fit=crop"
    ],
    variants: [
      {
        id: "var_5_l",
        title: "Large / Forest Green",
        size: "L",
        color: "Forest Green",
        calculated_price: { calculated_amount: 2699 },
        stock: 8
      }
    ],
    features: ["AI/ML Theme", "Neural Network Design", "Green Color", "Tech Enthusiast"]
  },
  {
    id: "tshirt_6",
    title: "DevOps Master",
    description: "Deploying code and looking good doing it. CI/CD pipeline not included. For the DevOps engineers who keep the world running.",
    thumbnail: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop"
    ],
    variants: [
      {
        id: "var_6_m",
        title: "Medium / Burgundy",
        size: "M",
        color: "Burgundy",
        calculated_price: { calculated_amount: 2499 },
        stock: 12
      }
    ],
    features: ["DevOps Design", "CI/CD Theme", "Burgundy Color", "Deployment Focus"]
  },
  {
    id: "tshirt_7",
    title: "Full Stack Developer",
    description: "From frontend to backend, database to deployment - we do it all. The ultimate shirt for full stack developers who master every layer.",
    thumbnail: "https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=600&h=600&fit=crop"
    ],
    variants: [
      {
        id: "var_7_l",
        title: "Large / Midnight Black",
        size: "L",
        color: "Midnight Black",
        calculated_price: { calculated_amount: 2799 },
        stock: 6
      }
    ],
    features: ["Full Stack Design", "Complete Coverage", "Black Color", "All-in-One"]
  },
  {
    id: "tshirt_8",
    title: "Open Source Hero",
    description: "Contributing to the community one commit at a time. Pull requests welcome. For the heroes who make open source possible.",
    thumbnail: "https://images.unsplash.com/photo-1586281010493-d17f8f2e1e0d?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1586281010493-d17f8f2e1e0d?w=600&h=600&fit=crop"
    ],
    variants: [
      {
        id: "var_8_m",
        title: "Medium / Steel Gray",
        size: "M",
        color: "Steel Gray",
        calculated_price: { calculated_amount: 2399 },
        stock: 15
      }
    ],
    features: ["Open Source Theme", "Community Focus", "Steel Gray", "Hero Edition"]
  }
];

type ProductVariant = {
  id: string
  title: string
  size: string
  color: string
  calculated_price: { calculated_amount: number }
  stock: number
}

type ProductType = {
  id: string
  title: string
  description: string
  thumbnail: string
  gallery?: string[]
  variants: ProductVariant[]
  features?: string[]
}

interface ProductDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {

  const [product, setProduct] = useState<ProductType | null>(null)
  const { addItem, getItemQuantity } = useCart()
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await Promise.resolve(params)
      const id = resolvedParams.id

      const foundProduct = mockProducts.find(p => p.id === id)
      setProduct(foundProduct || null)
      if (foundProduct) {
        setSelectedVariant(foundProduct.variants[0])
      }
    }
    resolveParams()
  }, [params])

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produkt nicht gefunden</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Zurück zum Shop
          </Link>
        </div>
      </div>
    )
  }

  const price = selectedVariant?.calculated_price.calculated_amount || 2500
  const formattedPrice = (price / 100).toFixed(2)
  
  // Warenkorb-Funktionen
  const handleAddToCart = async () => {
    if (!selectedVariant || !product) return
    
    setIsAdding(true)
    
    try {
      addItem({
        productId: product.id,
        title: product.title,
        image: product.thumbnail || '',
        price: selectedVariant.calculated_price.calculated_amount,
        variant: {
          id: selectedVariant.id,
          size: selectedVariant.size,
          color: selectedVariant.color,
          title: selectedVariant.title
        },
        quantity
      })
      
      // Success Feedback
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 2000)
      
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }
  
  // Aktuelle Menge im Warenkorb
  const currentCartQuantity = selectedVariant ? 
    getItemQuantity(product.id, selectedVariant.id) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Zurück zum Shop
          </Link>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <Image
                src={product.gallery?.[selectedImage] || product.thumbnail || ''}
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex space-x-2">
                {product.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-blue-600">€{formattedPrice}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Größe: {selectedVariant?.size}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">Farbe: {selectedVariant?.color}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Variants */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Größe & Farbe wählen:</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedVariant?.id === variant.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div>{variant.size} / {variant.color}</div>
                    <div className="text-xs text-gray-500">
                      {variant.stock > 0 ? `${variant.stock} verfügbar` : 'Ausverkauft'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Features:</h3>
              <ul className="grid grid-cols-2 gap-2">
                {product.features?.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-semibold text-gray-900">Anzahl:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || selectedVariant.stock === 0 || isAdding}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all ${
                    justAdded 
                      ? 'bg-green-600 text-white' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } disabled:bg-gray-300 disabled:cursor-not-allowed`}
                >
                  {isAdding ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Wird hinzugefügt...</span>
                    </>
                  ) : justAdded ? (
                    <>
                      <CheckIcon className="h-5 w-5" />
                      <span>Hinzugefügt!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCartIcon className="h-5 w-5" />
                      <span>In den Warenkorb ({quantity})</span>
                    </>
                  )}
                </button>
                
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6 text-gray-400" />
                  )}
                </button>
                
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <ShareIcon className="h-6 w-6 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Stock Status & Cart Info */}
            <div className="space-y-2">
              {selectedVariant && (
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    selectedVariant.stock > 10 ? 'bg-green-500' : 
                    selectedVariant.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm text-gray-600">
                    {selectedVariant.stock > 10 ? 'Auf Lager' :
                     selectedVariant.stock > 0 ? `Nur noch ${selectedVariant.stock} verfügbar` : 'Ausverkauft'}
                  </span>
                </div>
              )}
              
              {/* Already in Cart Info */}
              {currentCartQuantity > 0 && (
                <div className="flex items-center space-x-2 text-sm text-blue-600">
                  <ShoppingCartIcon className="h-4 w-4" />
                  <span>
                    {currentCartQuantity} {currentCartQuantity === 1 ? 'Stück' : 'Stück'} bereits im Warenkorb
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 