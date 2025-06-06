import { orderService, OrderData, PaymentResult } from '../orderService'

// Mock fetch for testing
global.fetch = jest.fn()

describe('orderService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('submitOrder', () => {
    const mockOrderData: OrderData = {
      customerInfo: {
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max@example.com',
        street: 'Musterstraße 123',
        postalCode: '12345',
        city: 'Berlin',
        country: 'Deutschland'
      },
      items: [
        {
          id: 'product-1-variant-1',
          productId: 'product-1',
          title: 'Test T-Shirt',
          image: 'test.jpg',
          price: 2500, // 25.00 EUR
          variant: {
            id: 'variant-1',
            size: 'M',
            color: 'Black',
            title: 'Medium / Black'
          },
          quantity: 2
        }
      ],
      paymentMethod: 'creditcard',
      totalAmount: 5000, // 50.00 EUR
      taxAmount: 950 // 19% tax
    }

    it('should submit order successfully', async () => {
      const mockResponse: PaymentResult = {
        success: true,
        orderId: 'order-123',
        paymentId: 'payment-456',
        message: 'Order placed successfully'
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await orderService.submitOrder(mockOrderData)

      expect(fetch).toHaveBeenCalledWith('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockOrderData)
      })

      expect(result).toEqual(mockResponse)
    })

    it('should handle payment failure', async () => {
      const mockErrorResponse: PaymentResult = {
        success: false,
        error: 'Payment declined',
        message: 'Your payment could not be processed'
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => mockErrorResponse
      })

      const result = await orderService.submitOrder(mockOrderData)

      expect(result).toEqual(mockErrorResponse)
    })

    it('should handle network errors', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const result = await orderService.submitOrder(mockOrderData)

      expect(result).toEqual({
        success: false,
        error: 'Network error',
        message: 'Unable to connect to payment service'
      })
    })

    it('should validate order data before submission', async () => {
      const invalidOrderData = {
        ...mockOrderData,
        customerInfo: {
          ...mockOrderData.customerInfo,
          email: 'invalid-email' // Invalid email
        }
      }

      const result = await orderService.submitOrder(invalidOrderData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('validation')
      expect(fetch).not.toHaveBeenCalled()
    })
  })

  describe('processPayment', () => {
    it('should process credit card payment', async () => {
      const paymentData = {
        method: 'creditcard' as const,
        amount: 5000,
        cardNumber: '4111111111111111',
        expiryMonth: '12',
        expiryYear: '2025',
        cvv: '123'
      }

      const mockResponse = {
        success: true,
        transactionId: 'txn-789',
        message: 'Payment processed successfully'
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await orderService.processPayment(paymentData)

      expect(result).toEqual(mockResponse)
    })

    it('should process PayPal payment', async () => {
      const paymentData = {
        method: 'paypal' as const,
        amount: 5000,
        paypalOrderId: 'paypal-order-123'
      }

      const result = await orderService.processPayment(paymentData)

      expect(result.success).toBe(true)
    })

    it('should process Klarna payment', async () => {
      const paymentData = {
        method: 'klarna' as const,
        amount: 5000,
        klarnaToken: 'klarna-token-456'
      }

      const result = await orderService.processPayment(paymentData)

      expect(result.success).toBe(true)
    })
  })

  describe('getOrderStatus', () => {
    it('should fetch order status', async () => {
      const orderId = 'order-123'
      const mockStatus = {
        id: orderId,
        status: 'processing',
        trackingNumber: 'TRK-456789',
        estimatedDelivery: '2025-06-10'
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatus
      })

      const result = await orderService.getOrderStatus(orderId)

      expect(fetch).toHaveBeenCalledWith(`/api/orders/${orderId}`)
      expect(result).toEqual(mockStatus)
    })

    it('should handle order not found', async () => {
      const orderId = 'nonexistent-order'

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      const result = await orderService.getOrderStatus(orderId)

      expect(result).toBeNull()
    })
  })
}) 