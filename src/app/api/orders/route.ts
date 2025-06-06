import { NextRequest, NextResponse } from 'next/server'

export interface OrderRequest {
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  address: {
    street: string
    city: string
    zipCode: string
    country: string
  }
  paymentMethod: 'credit_card' | 'paypal' | 'klarna'
  paymentDetails: {
    cardNumber?: string
    expiryDate?: string
    cvv?: string
    paypalEmail?: string
    klarnaToken?: string
  }
  items: Array<{
    productId: string
    title: string
    price: number
    quantity: number
    variant: {
      id: string
      size: string
      color: string
      title: string
    }
  }>
  subtotal: number
  tax: number
  total: number
}

export interface OrderResponse {
  success: boolean
  orderId?: string
  message: string
  error?: string
}

// Mock order counter for generating unique order IDs
let orderCounter = 1000

export async function POST(request: NextRequest): Promise<NextResponse<OrderResponse>> {
  try {
    const body: OrderRequest = await request.json()
    
    // Simulate validation
    if (!body.customerInfo?.email || !body.customerInfo?.firstName || !body.customerInfo?.lastName) {
      return NextResponse.json({
        success: false,
        message: "Kundendaten sind unvollständig",
        error: "INVALID_CUSTOMER_INFO"
      }, { status: 400 })
    }
    
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Warenkorb ist leer",
        error: "EMPTY_CART"
      }, { status: 400 })
    }
    
    if (!body.paymentMethod) {
      return NextResponse.json({
        success: false,
        message: "Zahlungsmethode nicht ausgewählt",
        error: "NO_PAYMENT_METHOD"
      }, { status: 400 })
    }
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simulate payment failure (10% chance for testing)
    if (Math.random() < 0.1) {
      return NextResponse.json({
        success: false,
        message: "Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.",
        error: "PAYMENT_FAILED"
      }, { status: 402 })
    }
    
    // Generate order ID
    const orderId = `ORD-${Date.now()}-${++orderCounter}`
    
    // Log order for debugging (in real app, save to database)
    console.log('Order created:', {
      orderId,
      customer: body.customerInfo.email,
      total: body.total,
      items: body.items.length,
      paymentMethod: body.paymentMethod
    })
    
    // Success response
    return NextResponse.json({
      success: true,
      orderId,
      message: "Bestellung erfolgreich aufgegeben"
    }, { status: 201 })
    
  } catch (error) {
    console.error('Order API Error:', error)
    
    return NextResponse.json({
      success: false,
      message: "Server-Fehler bei der Bestellabwicklung",
      error: "INTERNAL_SERVER_ERROR"
    }, { status: 500 })
  }
}

// Health check endpoint
export async function GET(): Promise<NextResponse<{ status: string, timestamp: string }>> {
  return NextResponse.json({
    status: "OK",
    timestamp: new Date().toISOString()
  })
} 