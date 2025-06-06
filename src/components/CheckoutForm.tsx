'use client'

import { useState } from 'react'
import { CustomerInfo } from '../services/orderService'

// Form data interface
interface FormData extends CustomerInfo {
  paymentMethod: 'creditcard' | 'paypal' | 'klarna'
}

// Validation errors interface
interface ValidationErrors {
  firstName?: string
  lastName?: string
  email?: string
  street?: string
  postalCode?: string
  city?: string
  country?: string
  paymentMethod?: string
}

// Props interface
interface CheckoutFormProps {
  onSubmit: (formData: FormData) => Promise<void> | void
  isLoading?: boolean
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    postalCode: '',
    city: '',
    country: 'Deutschland',
    paymentMethod: 'creditcard'
  })

  const [errors, setErrors] = useState<ValidationErrors>({})

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePostalCode = (code: string): boolean => {
    // German postal code format: 5 digits
    return /^\d{5}$/.test(code)
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Vorname ist erforderlich'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nachname ist erforderlich'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Straße ist erforderlich'
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postleitzahl ist erforderlich'
    } else if (!validatePostalCode(formData.postalCode)) {
      newErrors.postalCode = 'Bitte geben Sie eine gültige Postleitzahl ein (5 Ziffern)'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Stadt ist erforderlich'
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Land ist erforderlich'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      await onSubmit(formData)
    }
  }

  const countries = [
    'Deutschland',
    'Österreich',
    'Schweiz',
    'Frankreich',
    'Italien',
    'Spanien',
    'Niederlande'
  ]

  return (
    <form onSubmit={handleSubmit} role="form" className="space-y-6">
      {/* Billing Address Section */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Rechnungsadresse</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Vorname *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Nachname *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            E-Mail *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
            Straße und Hausnummer *
          </label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleInputChange}
            disabled={isLoading}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.street ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.street && (
            <p className="mt-1 text-sm text-red-600">{errors.street}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
              Postleitzahl *
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.postalCode ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.postalCode && (
              <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
            )}
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              Stadt *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Land *
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            disabled={isLoading}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.country ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">{errors.country}</p>
          )}
        </div>
      </div>

      {/* Payment Method Section */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Zahlungsart</h2>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              id="creditcard"
              name="paymentMethod"
              type="radio"
              value="creditcard"
              checked={formData.paymentMethod === 'creditcard'}
              onChange={handleInputChange}
              disabled={isLoading}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="creditcard" className="ml-3 block text-sm font-medium text-gray-700">
              Kreditkarte (Visa, Mastercard, American Express)
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="paypal"
              name="paymentMethod"
              type="radio"
              value="paypal"
              checked={formData.paymentMethod === 'paypal'}
              onChange={handleInputChange}
              disabled={isLoading}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
              PayPal
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="klarna"
              name="paymentMethod"
              type="radio"
              value="klarna"
              checked={formData.paymentMethod === 'klarna'}
              onChange={handleInputChange}
              disabled={isLoading}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="klarna" className="ml-3 block text-sm font-medium text-gray-700">
              Klarna (Kauf auf Rechnung)
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }`}
        >
          {isLoading ? 'Bestellung wird verarbeitet...' : 'Jetzt bestellen'}
        </button>
      </div>
    </form>
  )
}

export default CheckoutForm 