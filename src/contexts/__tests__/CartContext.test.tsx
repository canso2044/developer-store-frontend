import { renderHook, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import React, { ReactNode } from 'react'
import { CartProvider, useCart } from '../CartContext'

// Simplified mock cart item for testing
const mockCartItem = {
  id: 'test-product-1-variant-1',
  productId: 'test-product-1',
  title: 'Test T-Shirt',
  image: 'https://example.com/image.jpg',
  price: 2500, // 25.00 EUR in cents
  variant: {
    id: 'variant-1',
    size: 'M',
    color: 'Black',
    title: 'Medium / Black'
  },
  quantity: 2
}

// Test wrapper component
const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

describe('CartContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  describe('Initial State', () => {
    it('should have empty cart initially', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      expect(result.current.state.items).toEqual([])
      expect(result.current.state.totalItems).toBe(0)
      expect(result.current.state.totalPrice).toBe(0)
    })
  })

  describe('Add Items', () => {
    it('should add new item to cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      act(() => {
        result.current.addItem(mockCartItem)
      })

      expect(result.current.state.items).toHaveLength(1)
      expect(result.current.state.items[0]).toMatchObject(mockCartItem)
      expect(result.current.state.totalItems).toBe(2)
      expect(result.current.state.totalPrice).toBe(5000) // 2 × 25.00
    })

    it('should increase quantity for existing item', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      act(() => {
        result.current.addItem(mockCartItem)
      })

      act(() => {
        result.current.addItem(mockCartItem)
      })

      expect(result.current.state.items).toHaveLength(1)
      expect(result.current.state.items[0].quantity).toBe(4)
      expect(result.current.state.totalItems).toBe(4)
      expect(result.current.state.totalPrice).toBe(10000) // 4 × 25.00
    })

    it('should add multiple different items', () => {
      const { result } = renderHook(() => useCart(), { wrapper })
      const mockCartItem2 = {
        ...mockCartItem,
        id: 'test-product-2-variant-1',
        productId: 'test-product-2',
        title: 'Another T-Shirt',
        quantity: 1
      }

      act(() => {
        result.current.addItem(mockCartItem)
      })

      act(() => {
        result.current.addItem(mockCartItem2)
      })

      expect(result.current.state.items).toHaveLength(2)
      expect(result.current.state.totalItems).toBe(3) // 2 + 1
      expect(result.current.state.totalPrice).toBe(7500) // (2 × 25.00) + (1 × 25.00)
    })
  })

  describe('Remove Items', () => {
    it('should remove item completely when quantity is 1', () => {
      const { result } = renderHook(() => useCart(), { wrapper })
      const singleItem = { ...mockCartItem, quantity: 1 }

      act(() => {
        result.current.addItem(singleItem)
      })

      act(() => {
        result.current.removeItem(singleItem.id)
      })

      expect(result.current.state.items).toHaveLength(0)
      expect(result.current.state.totalItems).toBe(0)
    })

    it('should decrease quantity using updateQuantity', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      act(() => {
        result.current.addItem(mockCartItem) // quantity 2
      })

      act(() => {
        result.current.updateQuantity(mockCartItem.id, 1)
      })

      expect(result.current.state.items).toHaveLength(1)
      expect(result.current.state.items[0].quantity).toBe(1)
      expect(result.current.state.totalItems).toBe(1)
    })
  })

  describe('Update Quantity', () => {
    it('should update item quantity', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      act(() => {
        result.current.addItem(mockCartItem)
      })

      act(() => {
        result.current.updateQuantity(mockCartItem.id, 5)
      })

      expect(result.current.state.items[0].quantity).toBe(5)
      expect(result.current.state.totalItems).toBe(5)
      expect(result.current.state.totalPrice).toBe(12500) // 5 × 25.00
    })

    it('should remove item when quantity is set to 0', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      act(() => {
        result.current.addItem(mockCartItem)
      })

      act(() => {
        result.current.updateQuantity(mockCartItem.id, 0)
      })

      expect(result.current.state.items).toHaveLength(0)
    })
  })

  describe('Clear Cart', () => {
    it('should clear all items from cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      act(() => {
        result.current.addItem(mockCartItem)
      })

      act(() => {
        result.current.clearCart()
      })

      expect(result.current.state.items).toHaveLength(0)
      expect(result.current.state.totalItems).toBe(0)
      expect(result.current.state.totalPrice).toBe(0)
    })
  })

  describe('Get Item Quantity', () => {
    it('should return correct quantity for existing item', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      act(() => {
        result.current.addItem(mockCartItem)
      })

      expect(result.current.getItemQuantity(mockCartItem.productId, mockCartItem.variant.id)).toBe(2)
    })

    it('should return 0 for non-existing item', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      expect(result.current.getItemQuantity('non-existing-product', 'non-existing-variant')).toBe(0)
    })
  })

  describe('LocalStorage Persistence', () => {
    it('should save cart to localStorage when items change', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      act(() => {
        result.current.addItem(mockCartItem)
      })

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'medusa-cart',
        expect.stringContaining('test-product-1-variant-1')
      )
    })

    it('should load cart from localStorage on initialization', () => {
      // Pre-populate localStorage
      const savedCart = [mockCartItem]
      const mockGetItem = localStorage.getItem as jest.MockedFunction<typeof localStorage.getItem>
      mockGetItem.mockReturnValue(JSON.stringify(savedCart))

      const { result } = renderHook(() => useCart(), { wrapper })

      expect(result.current.state.items).toHaveLength(1)
      expect(result.current.state.totalItems).toBe(2)
      expect(result.current.state.totalPrice).toBe(5000)
    })

    it('should handle corrupted localStorage data gracefully', () => {
      const mockGetItem = localStorage.getItem as jest.MockedFunction<typeof localStorage.getItem>
      mockGetItem.mockReturnValue('invalid-json')

      const { result } = renderHook(() => useCart(), { wrapper })

      // Should fall back to empty cart
      expect(result.current.state.items).toEqual([])
      expect(result.current.state.totalItems).toBe(0)
    })
  })
}) 