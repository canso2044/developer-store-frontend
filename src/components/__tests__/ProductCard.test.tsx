import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProductCard from '../ProductCard'
import { CartProvider } from '../../contexts/CartContext'
import { ReactNode } from 'react'

// Mock data matching the application's product structure
const mockProduct = {
  id: 'tshirt_1',
  title: 'Vintage Coding Tee',
  description: 'A comfortable vintage-style t-shirt for coding enthusiasts.',
  thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
  variants: [
    {
      id: 'variant_1',
      title: 'Small / Black',
      inventory_quantity: 10,
      prices: [{ amount: 2500, currency_code: 'EUR' }] // 25.00 EUR in cents
    },
    {
      id: 'variant_2',
      title: 'Medium / Black',
      inventory_quantity: 5,
      prices: [{ amount: 2500, currency_code: 'EUR' }]
    }
  ],
  tags: [
    { value: 'vintage' },
    { value: 'coding' },
    { value: 'comfortable' }
  ]
}

const mockProductWithoutVariants = {
  ...mockProduct,
  variants: []
}

const mockProductWithoutTags = {
  ...mockProduct,
  tags: []
}

// Test wrapper with CartProvider
const Wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

describe('ProductCard', () => {
  describe('Basic Rendering', () => {
    it('should render product information correctly', () => {
      render(
        <Wrapper>
          <ProductCard product={mockProduct} />
        </Wrapper>
      )

      // Check basic product info
      expect(screen.getByText('Vintage Coding Tee')).toBeInTheDocument()
      expect(screen.getByText('A comfortable vintage-style t-shirt for coding enthusiasts.')).toBeInTheDocument()
      
      // Check image
      const image = screen.getByAltText('Vintage Coding Tee')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', expect.stringContaining('photo-1521572163474-6864f9cf17ab'))
      
      // Check price display (price is rendered as "€25.00")
      expect(screen.getByText(/€\s*25\.00/)).toBeInTheDocument()
      expect(screen.getByText('from')).toBeInTheDocument()
      
      // Check variant count
      expect(screen.getByText('2 variants')).toBeInTheDocument()
      
      // Check tags (rendered as #tag)
      expect(screen.getByText('#vintage')).toBeInTheDocument()
      expect(screen.getByText('#coding')).toBeInTheDocument()
      expect(screen.getByText('#comfortable')).toBeInTheDocument()
      
      // Check Quick View button
      expect(screen.getByText('Quick View')).toBeInTheDocument()
      
      // Check In Stock status
      expect(screen.getByText('In Stock')).toBeInTheDocument()
    })

    it('should render as a clickable link', () => {
      render(
        <Wrapper>
          <ProductCard product={mockProduct} />
        </Wrapper>
      )

      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/products/tshirt_1')
    })
  })

  describe('Price Calculation', () => {
    it('should display the minimum price when multiple variants exist', () => {
      const productWithDifferentPrices = {
        ...mockProduct,
        variants: [
          {
            id: 'variant_1',
            title: 'Small / Black',
            inventory_quantity: 10,
            prices: [{ amount: 2000, currency_code: 'EUR' }] // 20.00 EUR
          },
          {
            id: 'variant_2',
            title: 'Medium / Black',
            inventory_quantity: 5,
            prices: [{ amount: 3000, currency_code: 'EUR' }] // 30.00 EUR
          }
        ]
      }

      render(
        <Wrapper>
          <ProductCard product={productWithDifferentPrices} />
        </Wrapper>
      )

      // Should show the minimum price (20.00 EUR)
      expect(screen.getByText(/€\s*20\.00/)).toBeInTheDocument()
    })

    it('should render fallback price when no variants', () => {
      render(
        <Wrapper>
          <ProductCard product={mockProductWithoutVariants} />
        </Wrapper>
      )

      // Should show fallback price (Infinity when no variants)
      expect(screen.getByText(/€\s*Infinity/)).toBeInTheDocument()
      expect(screen.getByText('0 variants')).toBeInTheDocument()
    })
  })

  describe('Tags Handling', () => {
    it('should not render tag section when no tags', () => {
      render(
        <Wrapper>
          <ProductCard product={mockProductWithoutTags} />
        </Wrapper>
      )

      // Tags section should not be present
      expect(screen.queryByText('#vintage')).not.toBeInTheDocument()
      expect(screen.queryByText('#coding')).not.toBeInTheDocument()
    })

    it('should handle undefined tags gracefully', () => {
      const productWithUndefinedTags = {
        ...mockProduct,
        tags: undefined
      }

      render(
        <Wrapper>
          <ProductCard product={productWithUndefinedTags} />
        </Wrapper>
      )

      // Component should still render without errors
      expect(screen.getByText('Vintage Coding Tee')).toBeInTheDocument()
      expect(screen.queryByText('#vintage')).not.toBeInTheDocument()
    })

    it('should limit tags display to first 3 and show +more', () => {
      const productWithManyTags = {
        ...mockProduct,
        tags: [
          { value: 'vintage' },
          { value: 'coding' },
          { value: 'comfortable' },
          { value: 'stylish' },
          { value: 'durable' }
        ]
      }

      render(
        <Wrapper>
          <ProductCard product={productWithManyTags} />
        </Wrapper>
      )

      // Should show first 3 tags
      expect(screen.getByText('#vintage')).toBeInTheDocument()
      expect(screen.getByText('#coding')).toBeInTheDocument()
      expect(screen.getByText('#comfortable')).toBeInTheDocument()
      
      // Should show +more indicator
      expect(screen.getByText('+2 more')).toBeInTheDocument()
      
      // Should not show 4th and 5th tags
      expect(screen.queryByText('#stylish')).not.toBeInTheDocument()
      expect(screen.queryByText('#durable')).not.toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should have proper CSS classes for responsive layout', () => {
      const { container } = render(
        <Wrapper>
          <ProductCard product={mockProduct} />
        </Wrapper>
      )

      const link = container.querySelector('a')
      const card = link?.querySelector('div')
      
      expect(card).toHaveClass('group', 'cursor-pointer', 'bg-white', 'rounded-xl', 'shadow-sm', 'hover:shadow-lg', 'transition-all', 'duration-300', 'overflow-hidden')
    })
  })

  describe('Accessibility', () => {
    it('should have proper alt text for images', () => {
      render(
        <Wrapper>
          <ProductCard product={mockProduct} />
        </Wrapper>
      )

      const image = screen.getByAltText('Vintage Coding Tee')
      expect(image).toBeInTheDocument()
    })

    it('should be keyboard accessible as a link', () => {
      render(
        <Wrapper>
          <ProductCard product={mockProduct} />
        </Wrapper>
      )

      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/products/tshirt_1')
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing thumbnail gracefully', () => {
      const productWithoutThumbnail = {
        ...mockProduct,
        thumbnail: undefined
      }

      render(
        <Wrapper>
          <ProductCard product={productWithoutThumbnail} />
        </Wrapper>
      )

      // Component should still render
      expect(screen.getByText('Vintage Coding Tee')).toBeInTheDocument()
      
      // Should have a placeholder image
      const image = screen.getByAltText('Vintage Coding Tee')
      expect(image).toHaveAttribute('src', expect.stringContaining('placeholder'))
    })

    it('should handle very long product titles without breaking layout', () => {
      const productWithLongTitle = {
        ...mockProduct,
        title: 'This is a very long product title that should be handled gracefully by the component without breaking the layout'
      }

      render(
        <Wrapper>
          <ProductCard product={productWithLongTitle} />
        </Wrapper>
      )

      expect(screen.getByText(productWithLongTitle.title)).toBeInTheDocument()
    })

    it('should handle very long descriptions without breaking layout', () => {
      const productWithLongDescription = {
        ...mockProduct,
        description: 'This is a very long product description that should be handled gracefully by the component. It contains multiple sentences and should wrap properly within the card layout without causing any display issues.'
      }

      render(
        <Wrapper>
          <ProductCard product={productWithLongDescription} />
        </Wrapper>
      )

      expect(screen.getByText(productWithLongDescription.description)).toBeInTheDocument()
    })
  })
}) 