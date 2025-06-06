import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import React, { ReactNode } from 'react'
import CartSidebar from '../CartSidebar'
import { CartProvider } from '../../contexts/CartContext'

// Simplified test wrapper
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

describe('CartSidebar', () => {
  describe('Basic Rendering', () => {
    it('should render when isOpen is true', () => {
      render(
        <TestWrapper>
          <CartSidebar isOpen={true} onClose={() => {}} />
        </TestWrapper>
      )

      expect(screen.getByText('Warenkorb')).toBeInTheDocument()
    })

    it('should not render when isOpen is false', () => {
      render(
        <TestWrapper>
          <CartSidebar isOpen={false} onClose={() => {}} />
        </TestWrapper>
      )

      expect(screen.queryByText('Warenkorb')).not.toBeInTheDocument()
    })
  })

  describe('Empty Cart State', () => {
    it('should display empty cart message when no items', () => {
      render(
        <TestWrapper>
          <CartSidebar isOpen={true} onClose={() => {}} />
        </TestWrapper>
      )

      expect(screen.getByText('Dein Warenkorb ist leer')).toBeInTheDocument()
      expect(screen.getByText('Füge einige großartige T-Shirts hinzu!')).toBeInTheDocument()
    })

    it('should have continue shopping link in empty state', () => {
      render(
        <TestWrapper>
          <CartSidebar isOpen={true} onClose={() => {}} />
        </TestWrapper>
      )

      const continueShoppingLink = screen.getByRole('link', { name: /weiter einkaufen/i })
      expect(continueShoppingLink).toBeInTheDocument()
      expect(continueShoppingLink).toHaveAttribute('href', '/')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <TestWrapper>
          <CartSidebar isOpen={true} onClose={() => {}} />
        </TestWrapper>
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should have close button', () => {
      render(
        <TestWrapper>
          <CartSidebar isOpen={true} onClose={() => {}} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: /schließen/i })).toBeInTheDocument()
    })
  })
}) 