import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProductDetailPage from '../page'
import { CartProvider } from '@/contexts/CartContext'
import { ReactNode } from 'react'

// Mock Next.js components
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: { children: ReactNode, href: string }) {
    return <a href={href} {...props}>{children}</a>
  }
})

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>
    {children}
  </CartProvider>
)

// Mock params for tshirt_1 which has multiple variants
const mockParams = Promise.resolve({ id: 'tshirt_1' })

describe('Product Detail Page - Variant Selection Cart Button Issue', () => {
  it('should maintain cart button click area after variant changes', async () => {
    // Suppress console errors from Header component in tests
    const originalError = console.error
    console.error = jest.fn()

    render(
      <TestWrapper>
        <ProductDetailPage params={mockParams} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Vintage Coding Tee')).toBeInTheDocument()
    }, { timeout: 5000 })

    // Verify initial cart button
    const initialCartButton = screen.getByRole('button', { name: /in den warenkorb/i })
    expect(initialCartButton).toBeInTheDocument()
    expect(initialCartButton).not.toBeDisabled()

    // Test variant switching that could cause the click area issue
    const variants = ['S / Black', 'M / Black', 'L / Black']
    
    for (const variantText of variants) {
      const variantButton = screen.getByText(variantText).closest('button')
      expect(variantButton).toBeInTheDocument()
      
      act(() => {
        fireEvent.click(variantButton!)
      })
      
      // Verify cart button is still properly accessible after variant change
      await waitFor(() => {
        const cartButton = screen.getByRole('button', { name: /in den warenkorb/i })
        expect(cartButton).toBeInTheDocument()
        expect(cartButton).not.toBeDisabled()
        expect(cartButton).toHaveClass('flex-1', 'py-3', 'px-6')
      })
    }

    // Final test - cart button should still work
    const finalCartButton = screen.getByRole('button', { name: /in den warenkorb/i })
    
    act(() => {
      fireEvent.click(finalCartButton)
    })

    await waitFor(() => {
      expect(screen.getByText(/hinzugefügt!/i)).toBeInTheDocument()
    })

    // Restore console.error
    console.error = originalError
  })

  it('should handle rapid variant switching without click issues', async () => {
    // Suppress console errors from Header component in tests
    const originalError = console.error
    console.error = jest.fn()

    render(
      <TestWrapper>
        <ProductDetailPage params={mockParams} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Vintage Coding Tee')).toBeInTheDocument()
    }, { timeout: 5000 })

    // Rapid switching between variants (the scenario where clicks "don't work")
    const smallVariant = screen.getByText('S / Black').closest('button')
    const mediumVariant = screen.getByText('M / Black').closest('button')
    const largeVariant = screen.getByText('L / Black').closest('button')

    // Rapid fire clicking between variants
    for (let i = 0; i < 3; i++) {
      act(() => {
        fireEvent.click(smallVariant!)
      })
      
      act(() => {
        fireEvent.click(mediumVariant!)
      })
      
      act(() => {
        fireEvent.click(largeVariant!)
      })
    }

    // After rapid switching, cart button should still be functional
    await waitFor(() => {
      const cartButton = screen.getByRole('button', { name: /in den warenkorb/i })
      expect(cartButton).toBeInTheDocument()
      expect(cartButton).not.toBeDisabled()
    })

    const cartButton = screen.getByRole('button', { name: /in den warenkorb/i })
    
    act(() => {
      fireEvent.click(cartButton)
    })

    await waitFor(() => {
      expect(screen.getByText(/hinzugefügt!/i)).toBeInTheDocument()
    })

    // Restore console.error
    console.error = originalError
  })
}) 