import { CartItem } from '../contexts/CartContext'

// Types
export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  street: string
  postalCode: string
  city: string
  country: string
}

export interface OrderData {
  customerInfo: CustomerInfo
  items: CartItem[]
  paymentMethod: 'creditcard' | 'paypal' | 'klarna'
  totalAmount: number
  taxAmount: number
}

export interface PaymentResult {
  success: boolean
  orderId?: string
  paymentId?: string
  transactionId?: string
  error?: string
  message: string
}

export interface PaymentData {
  method: 'creditcard' | 'paypal' | 'klarna'
  amount: number
  cardNumber?: string
  expiryMonth?: string
  expiryYear?: string
  cvv?: string
  paypalOrderId?: string
  klarnaToken?: string
}

export interface OrderStatus {
  id: string
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled'
  trackingNumber?: string
  estimatedDelivery?: string
}

// Validation helpers
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateOrderData = (orderData: OrderData): { isValid: boolean; error?: string } => {
  const { customerInfo } = orderData

  if (!customerInfo.firstName) {
    return { isValid: false, error: 'validation: First name is required' }
  }
  
  if (!customerInfo.lastName) {
    return { isValid: false, error: 'validation: Last name is required' }
  }
  
  if (!customerInfo.email || !validateEmail(customerInfo.email)) {
    return { isValid: false, error: 'validation: Valid email is required' }
  }
  
  if (!customerInfo.street) {
    return { isValid: false, error: 'validation: Street address is required' }
  }
  
  if (!customerInfo.postalCode) {
    return { isValid: false, error: 'validation: Postal code is required' }
  }
  
  if (!customerInfo.city) {
    return { isValid: false, error: 'validation: City is required' }
  }

  if (orderData.items.length === 0) {
    return { isValid: false, error: 'validation: No items in order' }
  }

  return { isValid: true }
}

// Order Service Implementation
class OrderService {
  async submitOrder(orderData: OrderData): Promise<PaymentResult> {
    try {
      // Validate order data first
      const validation = validateOrderData(orderData)
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error,
          message: 'Order validation failed'
        }
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()

      if (response.ok) {
        return result
      } else {
        return result
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Unable to connect to payment service'
      }
    }
  }

  async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      // For demo purposes, simulate different payment methods
      switch (paymentData.method) {
        case 'creditcard':
          const response = await fetch('/api/payments/creditcard', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
          })
          return await response.json()

        case 'paypal':
          // Simulate PayPal processing
          return {
            success: true,
            transactionId: `paypal-${Date.now()}`,
            message: 'PayPal payment processed successfully'
          }

        case 'klarna':
          // Simulate Klarna processing
          return {
            success: true,
            transactionId: `klarna-${Date.now()}`,
            message: 'Klarna payment processed successfully'
          }

        default:
          return {
            success: false,
            error: 'Unsupported payment method',
            message: 'The selected payment method is not supported'
          }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing error',
        message: 'Payment could not be processed'
      }
    }
  }

  async getOrderStatus(orderId: string): Promise<OrderStatus | null> {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      
      if (response.ok) {
        return await response.json()
      } else if (response.status === 404) {
        return null
      } else {
        throw new Error('Failed to fetch order status')
      }
    } catch (error) {
      console.error('Error fetching order status:', error)
      return null
    }
  }
}

// Export singleton instance
export const orderService = new OrderService()

// Export types and service
export { OrderService } 