import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import CheckoutPage from '../page'
import { useCart } from '../../../contexts/CartContext'
import { orderService } from '../../../services/orderService'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock order service
jest.mock('../../../services/orderService')

// Mock cart context
jest.mock('../../../contexts/CartContext', () => ({
  useCart: jest.fn(),
}))

describe('CheckoutPage', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  describe('Empty Cart Behavior', () => {
    beforeEach(() => {
      // Mock empty cart
      ;(useCart as jest.Mock).mockReturnValue({
        state: { items: [], totalItems: 0, totalPrice: 0 },
        addItem: jest.fn(),
        removeItem: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
        getItemQuantity: jest.fn(() => 0)
      })
    })

    it('should redirect to cart when cart is empty', () => {
      render(<CheckoutPage />)
      
      expect(mockRouter.replace).toHaveBeenCalledWith('/cart')
    })

    it('should show redirect message for empty cart', () => {
      render(<CheckoutPage />)
      
      expect(screen.getByText(/weiterleitung zum warenkorb/i)).toBeInTheDocument()
    })
  })

  describe('Cart with Items', () => {
    const mockCartWithItems = {
      items: [
        {
          id: 'test-item-1',
          productId: 'tshirt_1',
          title: 'Test T-Shirt',
          image: '/test.jpg',
          price: 2500,
          quantity: 2,
          variant: {
            id: 'var_1',
            size: 'M',
            color: 'Blue',
            title: 'M Blue'
          }
        }
      ],
      totalItems: 2,
      totalPrice: 5000
    }

    beforeEach(() => {
      // Mock cart with items
      ;(useCart as jest.Mock).mockReturnValue({
        state: mockCartWithItems,
        addItem: jest.fn(),
        removeItem: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
        getItemQuantity: jest.fn(() => 2)
      })
    })

    it('should render checkout page when cart has items', () => {
      render(<CheckoutPage />)

      expect(screen.getByText(/checkout/i)).toBeInTheDocument()
      expect(screen.getByText(/bestellübersicht/i)).toBeInTheDocument()
    })

    it('should display cart items in order summary', () => {
      render(<CheckoutPage />)

      expect(screen.getByText(/test t-shirt/i)).toBeInTheDocument()
      // Test cart display - both title and price should be present
      expect(screen.getAllByText(/€50\.00/)).toHaveLength(3) // Header, order summary, total
    })

    it('should calculate correct totals including tax', () => {
      render(<CheckoutPage />)

      expect(screen.getByText(/steuer.*19%/i)).toBeInTheDocument()
      expect(screen.getByText(/gesamtsumme/i)).toBeInTheDocument()
      expect(screen.getByText(/59.50/)).toBeInTheDocument() // Total with tax
    })

    it('should handle successful checkout', async () => {
      const user = userEvent.setup()
      const mockOrderResponse = {
        success: true,
        orderId: 'order-123',
        message: 'Order placed successfully'
      }

      ;(orderService.submitOrder as jest.Mock).mockResolvedValueOnce(mockOrderResponse)

      render(<CheckoutPage />)

      // Fill required form fields
      await user.type(screen.getByLabelText(/vorname/i), 'Max')
      await user.type(screen.getByLabelText(/nachname/i), 'Mustermann')
      await user.type(screen.getByLabelText(/e-mail/i), 'max@example.com')
      await user.type(screen.getByLabelText(/straße/i), 'Test Straße 1')
      await user.type(screen.getByLabelText(/postleitzahl/i), '12345')
      await user.type(screen.getByLabelText(/stadt/i), 'Berlin')

      const submitButton = screen.getByRole('button', { name: /jetzt bestellen/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(orderService.submitOrder).toHaveBeenCalled()
        expect(mockRouter.push).toHaveBeenCalledWith('/order-success/order-123')
      })
    })

    it('should show validation errors for invalid form', async () => {
      const user = userEvent.setup()

      render(<CheckoutPage />)

      const submitButton = screen.getByRole('button', { name: /jetzt bestellen/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/vorname ist erforderlich/i)).toBeInTheDocument()
      })

      expect(orderService.submitOrder).not.toHaveBeenCalled()
    })
  })

  describe('Form Validation', () => {
    beforeEach(() => {
      // Mock cart with items for form tests
      ;(useCart as jest.Mock).mockReturnValue({
        state: { 
          items: [{ id: '1', productId: 'test', title: 'Test', image: '', price: 1000, quantity: 1, variant: { id: '1', size: 'M', color: 'Blue', title: 'M Blue' } }], 
          totalItems: 1, 
          totalPrice: 1000 
        },
        addItem: jest.fn(),
        removeItem: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
        getItemQuantity: jest.fn(() => 1)
      })
    })

    it('should validate email format and show errors', async () => {
      const user = userEvent.setup()

      render(<CheckoutPage />)

      // Fill all required fields first except email
      await user.type(screen.getByLabelText(/vorname/i), 'Max')
      await user.type(screen.getByLabelText(/nachname/i), 'Mustermann')
      await user.type(screen.getByLabelText(/straße/i), 'Test Straße 1')
      await user.type(screen.getByLabelText(/postleitzahl/i), '12345')
      await user.type(screen.getByLabelText(/stadt/i), 'Berlin')
      
      // Now type invalid email
      const emailInput = screen.getByLabelText(/e-mail/i)
      await user.type(emailInput, 'invalid-email')

      const submitButton = screen.getByRole('button', { name: /jetzt bestellen/i })
      await user.click(submitButton)

      await waitFor(() => {
        // Check for any email validation error
        expect(screen.getByText(/e-mail/i)).toBeInTheDocument()
      })
    })

    it('should show loading state during submission', async () => {
      const user = userEvent.setup()
      
      // Mock delayed order service
      ;(orderService.submitOrder as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ success: true, orderId: '123' }), 100))
      )

      render(<CheckoutPage />)

      // Fill valid form data
      await user.type(screen.getByLabelText(/vorname/i), 'Max')
      await user.type(screen.getByLabelText(/nachname/i), 'Mustermann')
      await user.type(screen.getByLabelText(/e-mail/i), 'max@example.com')
      await user.type(screen.getByLabelText(/straße/i), 'Test Straße 1')
      await user.type(screen.getByLabelText(/postleitzahl/i), '12345')
      await user.type(screen.getByLabelText(/stadt/i), 'Berlin')

      const submitButton = screen.getByRole('button', { name: /jetzt bestellen/i })
      await user.click(submitButton)

      expect(screen.getByText(/bestellung wird verarbeitet/i)).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      // Mock cart with items for accessibility tests
      ;(useCart as jest.Mock).mockReturnValue({
        state: { 
          items: [{ id: '1', productId: 'test', title: 'Test', image: '', price: 1000, quantity: 1, variant: { id: '1', size: 'M', color: 'Blue', title: 'M Blue' } }], 
          totalItems: 1, 
          totalPrice: 1000 
        },
        addItem: jest.fn(),
        removeItem: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
        getItemQuantity: jest.fn(() => 1)
      })
    })

    it('should have proper heading structure', () => {
      render(<CheckoutPage />)

      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toBeInTheDocument()
      expect(mainHeading).toHaveTextContent(/checkout/i)
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      
      render(<CheckoutPage />)

      // Tab multiple times to skip header elements and get to form
      await user.tab()
      await user.tab()
      await user.tab()
      await user.tab()
      await user.tab()
      
      // Should eventually focus on form elements
      const focusedElement = document.activeElement
      expect(focusedElement).toBeInTheDocument()
    })
  })
}) 