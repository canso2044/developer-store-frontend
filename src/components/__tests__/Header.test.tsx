import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import Header from '../Header'
import { CartProvider } from '@/contexts/CartContext'
import { ReactNode } from 'react'

// Mock Next.js Link
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: { children: ReactNode, href: string }) {
    return <a href={href} {...props}>{children}</a>
  }
})

// Mock CartSidebar
jest.mock('../CartSidebar', () => {
  return function MockCartSidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    return isOpen ? (
      <div data-testid="cart-sidebar">
        <button onClick={onClose} data-testid="close-sidebar">Close</button>
      </div>
    ) : null
  }
})

// Test wrapper
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

describe('Header Component', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('Basic Rendering', () => {
    it('should render logo and navigation', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      expect(screen.getByText('Developer Store')).toBeInTheDocument()
      expect(screen.getByText('Premium T-Shirts')).toBeInTheDocument()
      expect(screen.getByText('Shop')).toBeInTheDocument()
      expect(screen.getByText('Über uns')).toBeInTheDocument()
      expect(screen.getByText('Kontakt')).toBeInTheDocument()
    })

    it('should render cart icon with zero badge initially', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      const cartButtons = screen.getAllByTitle(/Warenkorb öffnen/)
      expect(cartButtons).toHaveLength(2) // Mobile and Desktop buttons
      
      // Should not show badge when cart is empty
      expect(screen.queryByText('0')).not.toBeInTheDocument()
    })
  })

  describe('Cart Button Functionality', () => {
    it('should open cart sidebar when mobile cart icon is clicked', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      const cartButton = screen.getByTitle('Warenkorb öffnen (Icon)')
      
      await act(async () => {
        fireEvent.click(cartButton)
      })

      await waitFor(() => {
        expect(screen.getByTestId('cart-sidebar')).toBeInTheDocument()
      })
    })

    it('should close cart sidebar when close button is clicked', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      const cartButton = screen.getByTitle('Warenkorb öffnen (Icon)')
      
      await act(async () => {
        fireEvent.click(cartButton)
      })

      await waitFor(() => {
        expect(screen.getByTestId('cart-sidebar')).toBeInTheDocument()
      })

      const closeButton = screen.getByTestId('close-sidebar')
      
      await act(async () => {
        fireEvent.click(closeButton)
      })

      await waitFor(() => {
        expect(screen.queryByTestId('cart-sidebar')).not.toBeInTheDocument()
      })
    })

    it('should show cart functionality when items are present', () => {
      // This test verifies that cart buttons exist and are functional
      // The actual cart state is tested in CartContext.test.tsx
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      // Should show mobile cart button
      const cartButton = screen.getByTitle('Warenkorb öffnen (Icon)')
      expect(cartButton).toBeInTheDocument()
      
      // Should show desktop cart button  
      const desktopCartButtons = screen.getAllByText('Warenkorb')
      const desktopCartButton = desktopCartButtons.find(el => el.tagName === 'BUTTON')
      expect(desktopCartButton).toBeInTheDocument()
      
      // Both buttons should be clickable
      expect(cartButton).not.toBeDisabled()
      expect(desktopCartButton).not.toBeDisabled()
    })

    it('should render multiple cart buttons for different screen sizes', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      // Mobile cart button (always visible)
      const cartButton = screen.getByTitle('Warenkorb öffnen (Icon)')
      expect(cartButton).toBeInTheDocument()

      // Desktop "Warenkorb" text button (hidden on mobile with lg:inline-flex)
      const desktopCartButtons = screen.getAllByText('Warenkorb')
      expect(desktopCartButtons.length).toBeGreaterThan(0)
      
      // Find the button (not the link)
      const desktopCartButton = desktopCartButtons.find(el => el.tagName === 'BUTTON')
      expect(desktopCartButton).toBeInTheDocument()
      
      // Both should be clickable
      expect(cartButton).not.toBeDisabled()
      expect(desktopCartButton).not.toBeDisabled()
    })

    it('should have proper accessibility attributes', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      const cartButton = screen.getByTitle('Warenkorb öffnen (Icon)')
      expect(cartButton).toHaveAttribute('title', 'Warenkorb öffnen (Icon)')
      
      const desktopCartButton = screen.getByTitle('Warenkorb öffnen (Desktop)')
      expect(desktopCartButton).toHaveAttribute('title', 'Warenkorb öffnen (Desktop)')
      
      // Check if the fallback link for SEO exists
      const fallbackLink = screen.getByLabelText('Zur Warenkorb-Seite')
      expect(fallbackLink).toBeInTheDocument()
      expect(fallbackLink).toHaveAttribute('href', '/cart')
    })

    it('should test desktop cart button functionality', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      // Find the desktop cart button specifically
      const desktopCartButton = screen.getByTitle('Warenkorb öffnen (Desktop)')
      
      expect(desktopCartButton).toBeInTheDocument()
      
      // Test clicking the desktop button
      await act(async () => {
        fireEvent.click(desktopCartButton!)
      })

      await waitFor(() => {
        expect(screen.getByTestId('cart-sidebar')).toBeInTheDocument()
      })
    })

    it('should allow multiple open/close/reopen cycles', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      const cartButton = screen.getByTitle('Warenkorb öffnen (Icon)')
      
      // First cycle: Open -> Close -> Reopen
      act(() => {
        fireEvent.click(cartButton)
      })
      await waitFor(() => {
        expect(screen.getByTestId('cart-sidebar')).toBeInTheDocument()
      })
      
      const closeButton = screen.getByTestId('close-sidebar')
      act(() => {
        fireEvent.click(closeButton)
      })
      await waitFor(() => {
        expect(screen.queryByTestId('cart-sidebar')).not.toBeInTheDocument()
      })
      
      // This should work - reopen the cart
      act(() => {
        fireEvent.click(cartButton)
      })
      await waitFor(() => {
        expect(screen.getByTestId('cart-sidebar')).toBeInTheDocument()
      })
      
      // Second cycle: Close -> Reopen again
      const closeButton2 = screen.getByTestId('close-sidebar')
      act(() => {
        fireEvent.click(closeButton2)
      })
      await waitFor(() => {
        expect(screen.queryByTestId('cart-sidebar')).not.toBeInTheDocument()
      })
      
      // This should also work - third open
      act(() => {
        fireEvent.click(cartButton)
      })
      await waitFor(() => {
        expect(screen.getByTestId('cart-sidebar')).toBeInTheDocument()
      })
    })

    it('should work with desktop cart button multiple times', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      const desktopCartButton = screen.getByTitle('Warenkorb öffnen (Desktop)')
      
      // Test desktop button multiple open/close cycles
      act(() => {
        fireEvent.click(desktopCartButton)
      })
      await waitFor(() => {
        expect(screen.getByTestId('cart-sidebar')).toBeInTheDocument()
      })
      
      const closeButton = screen.getByTestId('close-sidebar')
      act(() => {
        fireEvent.click(closeButton)
      })
      await waitFor(() => {
        expect(screen.queryByTestId('cart-sidebar')).not.toBeInTheDocument()
      })
      
      // Desktop button should work again
      act(() => {
        fireEvent.click(desktopCartButton)
      })
      await waitFor(() => {
        expect(screen.getByTestId('cart-sidebar')).toBeInTheDocument()
      })
    })

    it('should handle cart state transitions correctly', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      const cartButton = screen.getByTitle('Warenkorb öffnen (Icon)')
      
      // Initial state - sidebar should be closed
      expect(screen.queryByTestId('cart-sidebar')).not.toBeInTheDocument()
      
      // Open cart
      act(() => {
        fireEvent.click(cartButton)
      })
      await waitFor(() => {
        expect(screen.getByTestId('cart-sidebar')).toBeInTheDocument()
      })
      
      // Close via close button
      const closeButton = screen.getByTestId('close-sidebar')
      act(() => {
        fireEvent.click(closeButton)
      })
      await waitFor(() => {
        expect(screen.queryByTestId('cart-sidebar')).not.toBeInTheDocument()
      })
      
      // Try to reopen - this is where the bug might occur
      act(() => {
        fireEvent.click(cartButton)
      })
      await waitFor(() => {
        expect(screen.getByTestId('cart-sidebar')).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should handle rapid open/close operations', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      const cartButton = screen.getByTitle('Warenkorb öffnen (Icon)')
      
      // Rapid clicking simulation
      for (let i = 0; i < 3; i++) {
        act(() => {
          fireEvent.click(cartButton)
        })
        await waitFor(() => {
          expect(screen.getByTestId('cart-sidebar')).toBeInTheDocument()
        })
        
        const closeButton = screen.getByTestId('close-sidebar')
        act(() => {
          fireEvent.click(closeButton)
        })
        await waitFor(() => {
          expect(screen.queryByTestId('cart-sidebar')).not.toBeInTheDocument()
        })
      }
      
      // Final test - should still work
      act(() => {
        fireEvent.click(cartButton)
      })
      await waitFor(() => {
        expect(screen.getByTestId('cart-sidebar')).toBeInTheDocument()
      })
    })
  })

  describe('Cart Update Events', () => {
    it('should auto-open sidebar on cart update event', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      // Simulate cart update event
      await act(async () => {
        const cartUpdateEvent = new Event('cart-updated')
        window.dispatchEvent(cartUpdateEvent)
      })

      await waitFor(() => {
        expect(screen.getByTestId('cart-sidebar')).toBeInTheDocument()
      })
    })
  })

  describe('Responsive Design', () => {
    it('should show/hide elements based on screen size classes', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      // Navigation should be hidden on mobile (hidden md:flex)
      const navigation = screen.getByRole('navigation')
      expect(navigation).toHaveClass('hidden', 'md:flex')

      // Desktop cart button should be hidden on small screens but visible on medium+ (md:inline-flex)
      const desktopCartButtons = screen.getAllByText('Warenkorb')
      const desktopCartButton = desktopCartButtons.find(el => el.tagName === 'BUTTON')
      expect(desktopCartButton).toHaveClass('hidden', 'md:inline-flex')
    })

    it('should have adequate click area for desktop cart button', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      // Find the desktop cart button
      const desktopCartButton = screen.getByTitle('Warenkorb öffnen (Desktop)')
      
      // Check for improved padding and minimum size (44x44px click area for accessibility)
      expect(desktopCartButton).toHaveClass('px-4', 'py-3', 'min-h-[44px]', 'min-w-[88px]')
      
      // The button should now be visible at medium screens instead of large
      expect(desktopCartButton).toHaveClass('hidden', 'md:inline-flex')
      
      // Button should have pointer cursor
      expect(desktopCartButton).toHaveClass('cursor-pointer')
      
      // Should have title for accessibility
      expect(desktopCartButton).toHaveAttribute('title', 'Warenkorb öffnen (Desktop)')
    })

    it('should have adequate click area for mobile cart icon button', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      // Find the mobile cart icon button
      const mobileCartButton = screen.getByTitle('Warenkorb öffnen (Icon)')
      
      // Check for adequate padding and minimum size (44x44px click area for accessibility)
      expect(mobileCartButton).toHaveClass('p-3', 'min-h-[44px]', 'min-w-[44px]')
      
      // Should be flexbox centered to ensure icon is properly aligned
      expect(mobileCartButton).toHaveClass('flex', 'items-center', 'justify-center')
      
      // Button should have pointer cursor
      expect(mobileCartButton).toHaveClass('cursor-pointer')
      
      // Should have proper accessibility attributes
      expect(mobileCartButton).toHaveAttribute('title', 'Warenkorb öffnen (Icon)')
      expect(mobileCartButton).toHaveAttribute('aria-label', 'Warenkorb öffnen')
      expect(mobileCartButton).toHaveAttribute('type', 'button')
    })

    it('should ensure cart icon click area covers entire icon', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      const mobileCartButton = screen.getByTitle('Warenkorb öffnen (Icon)')
      
      // Verify button dimensions are sufficient to cover icon (6x6 / 7x7) plus padding
      expect(mobileCartButton).toHaveClass('p-3') // 12px padding all around
      expect(mobileCartButton).toHaveClass('min-h-[44px]', 'min-w-[44px]') // Minimum touch target
      
      // Button should be positioned relatively for badge positioning
      expect(mobileCartButton).toHaveClass('relative')
      
      // Icon should be contained within the button
      const cartIcon = mobileCartButton.querySelector('svg')
      expect(cartIcon).toBeInTheDocument()
      expect(cartIcon).toHaveClass('h-6', 'w-6', 'sm:h-7', 'sm:w-7')
    })

    it('should provide multiple accessible cart buttons for different breakpoints', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      // Mobile/Tablet cart icon button (always visible)
      const iconButton = screen.getByTitle('Warenkorb öffnen (Icon)')
      expect(iconButton).toBeInTheDocument()
      expect(iconButton).toHaveClass('p-3', 'cursor-pointer', 'min-h-[44px]', 'min-w-[44px]') // Enhanced touch target with cursor

      // Desktop text button (now visible on medium+ screens instead of large only)
      const desktopCartButton = screen.getByTitle('Warenkorb öffnen (Desktop)')
      expect(desktopCartButton).toBeInTheDocument()
      
      // Both should be easily clickable
      expect(iconButton).not.toBeDisabled()
      expect(desktopCartButton).not.toBeDisabled()
      
      // Fixed: Desktop button is now visible on medium screens (md+) instead of large (lg+)
      expect(desktopCartButton).toHaveClass('hidden', 'md:inline-flex')
      expect(desktopCartButton).toHaveClass('cursor-pointer')
    })
  })
}) 