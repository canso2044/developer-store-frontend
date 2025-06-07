'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

// Cart Item Interface
export interface CartItem {
  id: string
  productId: string
  title: string
  image: string
  price: number // in Cent
  variant: {
    id: string
    size: string
    color: string
    title: string
  }
  quantity: number
}

// Cart State Interface
interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

// Actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'id'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

// Initial State
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0
}

// Helper Functions
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  return { totalItems, totalPrice }
}

const generateCartItemId = (productId: string, variantId: string): string => {
  return `${productId}-${variantId}`
}

// Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItemId = generateCartItemId(action.payload.productId, action.payload.variant.id)
      const existingItemIndex = state.items.findIndex(item => item.id === newItemId)

      let newItems: CartItem[]

      if (existingItemIndex >= 0) {
        // Item bereits im Warenkorb - Menge erhöhen
        newItems = state.items.map(item =>
          item.id === newItemId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
      } else {
        // Neues Item hinzufügen
        const newItem: CartItem = {
          id: newItemId,
          ...action.payload
        }
        newItems = [...state.items, newItem]
      }

      const { totalItems, totalPrice } = calculateTotals(newItems)
      return { items: newItems, totalItems, totalPrice }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      const { totalItems, totalPrice } = calculateTotals(newItems)
      return { items: newItems, totalItems, totalPrice }
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0)

      const { totalItems, totalPrice } = calculateTotals(newItems)
      return { items: newItems, totalItems, totalPrice }
    }

    case 'CLEAR_CART': {
      return initialState
    }

    case 'LOAD_CART': {
      const { totalItems, totalPrice } = calculateTotals(action.payload)
      return { items: action.payload, totalItems, totalPrice }
    }

    default:
      return state
  }
}

// Context
interface CartContextType {
  state: CartState
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (productId: string, variantId: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Provider Component
interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // LocalStorage Key
  const CART_STORAGE_KEY = 'medusa-cart'

  // Load from localStorage on mount with robust error handling
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart && savedCart.trim()) {
        // Validate JSON before parsing
        const parsedCart: CartItem[] = JSON.parse(savedCart)
        
        // Validate that it's actually an array of CartItems
        if (Array.isArray(parsedCart)) {
          dispatch({ type: 'LOAD_CART', payload: parsedCart })
        } else {
          console.warn('Invalid cart data format in localStorage, clearing...')
          localStorage.removeItem(CART_STORAGE_KEY)
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      // Clear corrupted localStorage data
      try {
        localStorage.removeItem(CART_STORAGE_KEY)
        console.info('Cleared corrupted cart data from localStorage')
      } catch (clearError) {
        console.error('Error clearing localStorage:', clearError)
      }
    }
  }, [])

  // Save to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [state.items])

  // Actions
  const addItem = (item: Omit<CartItem, 'id'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
    
    // Trigger auto-open cart sidebar event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-updated'))
    }
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getItemQuantity = (productId: string, variantId: string): number => {
    const itemId = generateCartItemId(productId, variantId)
    const item = state.items.find(item => item.id === itemId)
    return item ? item.quantity : 0
  }

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Custom Hook
export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// Export Context for advanced usage
export { CartContext } 