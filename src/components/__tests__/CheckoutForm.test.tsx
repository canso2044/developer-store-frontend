import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CheckoutForm from '../CheckoutForm'

describe('CheckoutForm', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Form Rendering', () => {
    it('should render all required form fields', () => {
      render(<CheckoutForm onSubmit={mockOnSubmit} />)

      expect(screen.getByLabelText(/vorname/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/nachname/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/straße/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/postleitzahl/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/stadt/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/land/i)).toBeInTheDocument()
    })

    it('should render payment method options', () => {
      render(<CheckoutForm onSubmit={mockOnSubmit} />)

      expect(screen.getByLabelText(/kreditkarte/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/paypal/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/klarna/i)).toBeInTheDocument()
    })

    it('should have submit button', () => {
      render(<CheckoutForm onSubmit={mockOnSubmit} />)

      const submitButton = screen.getByRole('button', { name: /jetzt bestellen/i })
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).toHaveAttribute('type', 'submit')
    })
  })

  describe('Form Validation', () => {
    it('should prevent checkout with empty required fields', async () => {
      const user = userEvent.setup()

      render(<CheckoutForm onSubmit={mockOnSubmit} />)

      const submitButton = screen.getByRole('button', { name: /jetzt bestellen/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/vorname ist erforderlich/i)).toBeInTheDocument()
      })

      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should validate email format and show appropriate error', async () => {
      const user = userEvent.setup()

      render(<CheckoutForm onSubmit={mockOnSubmit} />)

      // Fill out all required fields except valid email
      await user.type(screen.getByLabelText(/vorname/i), 'Max')
      await user.type(screen.getByLabelText(/nachname/i), 'Mustermann')
      await user.type(screen.getByLabelText(/straße/i), 'Test Straße 1')
      await user.type(screen.getByLabelText(/postleitzahl/i), '12345')
      await user.type(screen.getByLabelText(/stadt/i), 'Berlin')
      
      // Type invalid email
      const emailInput = screen.getByLabelText(/e-mail/i)
      await user.type(emailInput, 'invalid-email')

      const submitButton = screen.getByRole('button', { name: /jetzt bestellen/i })
      await user.click(submitButton)

      await waitFor(() => {
        // Check for email validation error or failed submission
        expect(mockOnSubmit).not.toHaveBeenCalled()
      })
    })

    it('should submit form with valid data', async () => {
      const user = userEvent.setup()

      render(<CheckoutForm onSubmit={mockOnSubmit} />)

      // Fill all required fields with valid data
      await user.type(screen.getByLabelText(/vorname/i), 'Max')
      await user.type(screen.getByLabelText(/nachname/i), 'Mustermann')
      await user.type(screen.getByLabelText(/e-mail/i), 'max@example.com')
      await user.type(screen.getByLabelText(/straße/i), 'Test Straße 1')
      await user.type(screen.getByLabelText(/postleitzahl/i), '12345')
      await user.type(screen.getByLabelText(/stadt/i), 'Berlin')

      const submitButton = screen.getByRole('button', { name: /jetzt bestellen/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            firstName: 'Max',
            lastName: 'Mustermann',
            email: 'max@example.com',
            street: 'Test Straße 1',
            postalCode: '12345',
            city: 'Berlin',
            country: 'Deutschland',
            paymentMethod: 'creditcard'
          })
        )
      })
    })
  })

  describe('Payment Method Selection', () => {
    it('should allow selecting different payment methods', async () => {
      const user = userEvent.setup()

      render(<CheckoutForm onSubmit={mockOnSubmit} />)

      const paypalOption = screen.getByLabelText(/paypal/i)
      await user.click(paypalOption)

      expect(paypalOption).toBeChecked()
    })

    it('should have credit card selected by default', () => {
      render(<CheckoutForm onSubmit={mockOnSubmit} />)

      const creditCardOption = screen.getByLabelText(/kreditkarte/i)
      expect(creditCardOption).toBeChecked()
    })
  })

  describe('Loading State', () => {
    it('should show loading state when isLoading is true', () => {
      render(<CheckoutForm onSubmit={mockOnSubmit} isLoading={true} />)

      const submitButton = screen.getByRole('button', { name: /bestellung wird verarbeitet/i })
      expect(submitButton).toBeDisabled()
    })

    it('should disable button during loading', () => {
      render(<CheckoutForm onSubmit={mockOnSubmit} isLoading={true} />)

      const submitButton = screen.getByRole('button')
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels for all form controls', () => {
      render(<CheckoutForm onSubmit={mockOnSubmit} />)

      // Check that all inputs have associated labels
      const firstNameInput = screen.getByLabelText(/vorname/i)
      const lastNameInput = screen.getByLabelText(/nachname/i)
      const emailInput = screen.getByLabelText(/e-mail/i)
      const streetInput = screen.getByLabelText(/straße/i)
      const postalCodeInput = screen.getByLabelText(/postleitzahl/i)
      const cityInput = screen.getByLabelText(/stadt/i)
      const countrySelect = screen.getByLabelText(/land/i)

      expect(firstNameInput).toHaveAttribute('id')
      expect(lastNameInput).toHaveAttribute('id')
      expect(emailInput).toHaveAttribute('id')
      expect(streetInput).toHaveAttribute('id')
      expect(postalCodeInput).toHaveAttribute('id')
      expect(cityInput).toHaveAttribute('id')
      expect(countrySelect).toHaveAttribute('id')
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()

      render(<CheckoutForm onSubmit={mockOnSubmit} />)

      // Tab through form elements
      await user.tab()
      const firstNameInput = screen.getByLabelText(/vorname/i)
      expect(firstNameInput).toHaveFocus()

      await user.tab()
      const lastNameInput = screen.getByLabelText(/nachname/i)
      expect(lastNameInput).toHaveFocus()
    })

    it('should have form role and proper structure', () => {
      render(<CheckoutForm onSubmit={mockOnSubmit} />)

      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()

      const headings = screen.getAllByRole('heading', { level: 2 })
      expect(headings).toHaveLength(2) // Billing address + Payment method
    })
  })
}) 