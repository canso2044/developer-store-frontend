export interface Product {
  id: string
  title: string
  description: string
  handle?: string
  thumbnail?: string
  images?: { url: string }[]
  variants: ProductVariant[]
  tags?: { value: string }[]
  collection?: { title: string }
  status?: string
  created_at?: string
  updated_at?: string
}

export interface ProductVariant {
  id: string
  title: string
  prices?: { amount: number; currency_code: string }[]
  calculated_price?: { calculated_amount: number }
  inventory_quantity?: number
  options?: { value: string }[]
  sku?: string
}

export interface ProductsResponse {
  products: Product[]
  count: number
  offset: number
  limit: number
} 