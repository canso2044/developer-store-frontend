import '@testing-library/jest-dom'
import React from 'react'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement('img', {
      ...props,
      src: props.src,
      alt: props.alt || '',
      width: props.width,
      height: props.height,
    })
  },
}))

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }) => 
    React.createElement('a', { href, ...props }, children),
}))

// Mock localStorage with proper spy functions
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Reset localStorage mocks before each test
beforeEach(() => {
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
  localStorageMock.clear.mockClear()
})

// Filter out specific console errors we don't want to see in tests
const originalError = console.error
console.error = function (...args) {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Received `true` for a non-boolean attribute `fill`')
  ) {
    return
  }
  return originalError.call(console, ...args)
}

// Mock console.error to reduce noise in tests
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    return originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
}) 