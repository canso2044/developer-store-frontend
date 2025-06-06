# 🧪 Testing Guide - Project Medusa Frontend

## Overview

This document explains how to write and run tests in Project Medusa. We use **Jest** and **React Testing Library** for comprehensive frontend testing.

## 🚀 Quick Start

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern="ProductCard.test.tsx"

# Run tests matching a pattern
npm test -- --testNamePattern="should render"
```

### Test Structure

Tests are located in `__tests__` folders next to the components they test:

```
src/
├── components/
│   ├── ProductCard.tsx
│   └── __tests__/
│       └── ProductCard.test.tsx
├── contexts/
│   ├── CartContext.tsx
│   └── __tests__/
│       └── CartContext.test.tsx
```

## 🛠️ Testing Setup

### Configuration Files

- **`jest.config.js`** - Jest configuration with Next.js integration
- **`jest.setup.js`** - Global test setup and mocks
- **`package.json`** - Test scripts and dependencies

### Key Dependencies

```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@testing-library/react": "^16.1.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.5.2",
    "@types/jest": "^29.5.0"
  }
}
```

## 📝 Writing Tests

### Basic Component Test

```tsx
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent title="Test" />)
    
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

### Testing with Context (Cart Components)

```tsx
import { render, screen } from '@testing-library/react'
import { CartProvider } from '../../contexts/CartContext'
import ProductCard from '../ProductCard'

const Wrapper = ({ children }) => (
  <CartProvider>{children}</CartProvider>
)

describe('ProductCard', () => {
  it('should render with cart context', () => {
    render(
      <Wrapper>
        <ProductCard product={mockProduct} />
      </Wrapper>
    )
    
    expect(screen.getByText('Add to Cart')).toBeInTheDocument()
  })
})
```

### Testing User Interactions

```tsx
import userEvent from '@testing-library/user-event'

it('should handle button click', async () => {
  const user = userEvent.setup()
  const onClickMock = jest.fn()
  
  render(<Button onClick={onClickMock}>Click me</Button>)
  
  await user.click(screen.getByRole('button'))
  
  expect(onClickMock).toHaveBeenCalledTimes(1)
})
```

### Testing Async Operations

```tsx
import { waitFor } from '@testing-library/react'

it('should update after async operation', async () => {
  render(<AsyncComponent />)
  
  await user.click(screen.getByText('Load Data'))
  
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument()
  })
})
```

## 🎯 Testing Patterns

### 1. Component Rendering Tests

Test that components render correctly with different props:

```tsx
describe('ProductCard Rendering', () => {
  it('should display product information', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument()
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument()
    expect(screen.getByAltText(mockProduct.title)).toBeInTheDocument()
  })
  
  it('should handle missing data gracefully', () => {
    const incompleteProduct = { ...mockProduct, description: undefined }
    
    render(<ProductCard product={incompleteProduct} />)
    
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument()
    // Should not crash when description is missing
  })
})
```

### 2. User Interaction Tests

Test user interactions and state changes:

```tsx
describe('Cart Functionality', () => {
  it('should add item to cart', async () => {
    const user = userEvent.setup()
    
    render(
      <CartProvider>
        <ProductCard product={mockProduct} />
        <CartSidebar isOpen={true} onClose={() => {}} />
      </CartProvider>
    )
    
    await user.click(screen.getByText('Add to Cart'))
    
    expect(screen.getByText('1 item in cart')).toBeInTheDocument()
  })
})
```

### 3. Context and State Tests

Test React Context and state management:

```tsx
describe('CartContext', () => {
  it('should add items correctly', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider
    })
    
    act(() => {
      result.current.addItem(mockCartItem)
    })
    
    expect(result.current.state.items).toHaveLength(1)
    expect(result.current.state.totalItems).toBe(2)
  })
})
```

### 4. Edge Cases and Error Handling

Test edge cases and error scenarios:

```tsx
describe('Edge Cases', () => {
  it('should handle empty cart gracefully', () => {
    render(
      <CartProvider>
        <CartSidebar isOpen={true} onClose={() => {}} />
      </CartProvider>
    )
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  })
  
  it('should handle invalid quantity input', async () => {
    const user = userEvent.setup()
    
    render(<QuantityInput value={1} onChange={() => {}} />)
    
    const input = screen.getByRole('spinbutton')
    await user.clear(input)
    await user.type(input, '-5')
    
    // Should not allow negative quantities
    expect(input).toHaveValue(0)
  })
})
```

## 🔧 Mocking

### Next.js Components

Next.js components are automatically mocked in `jest.setup.js`:

```js
// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />
}))

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }) => (
    <a href={href} {...props}>{children}</a>
  )
}))
```

### LocalStorage

LocalStorage is mocked globally:

```js
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock
```

### Custom Mocks

Create custom mocks for external dependencies:

```tsx
// Mock API calls
jest.mock('../../api/products', () => ({
  fetchProducts: jest.fn(() => Promise.resolve(mockProducts))
}))
```

## 📊 Test Coverage

### Coverage Reports

Generate coverage reports to see which parts of your code are tested:

```bash
npm run test:coverage
```

This creates a `coverage/` directory with detailed HTML reports.

### Coverage Goals

Aim for:
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

### Excluding Files from Coverage

Update `jest.config.js` to exclude files:

```js
collectCoverageFrom: [
  'src/**/*.{js,jsx,ts,tsx}',
  '!src/**/*.d.ts',
  '!src/**/index.{js,ts}',
  '!src/**/*.stories.{js,jsx,ts,tsx}', // Exclude Storybook files
]
```

## 🐛 Debugging Tests

### Common Issues

1. **Tests timing out**: Use `waitFor` for async operations
2. **Elements not found**: Check if component is wrapped with required providers
3. **Mock not working**: Ensure mocks are defined before imports

### Debugging Tips

```tsx
// Debug what's rendered
screen.debug() // Prints entire DOM
screen.debug(screen.getByTestId('my-element')) // Prints specific element

// Check available queries
screen.logTestingPlaygroundURL() // Opens Testing Playground

// Use data-testid for complex queries
<button data-testid="submit-button">Submit</button>
screen.getByTestId('submit-button')
```

### VS Code Integration

Add to `.vscode/settings.json`:

```json
{
  "jest.jestCommandLine": "npm test --",
  "jest.autoRun": "watch"
}
```

## 📚 Best Practices

### 1. Test Behavior, Not Implementation

❌ **Don't test implementation details:**
```tsx
// Bad - testing internal state
expect(component.state.isLoading).toBe(true)
```

✅ **Test user-visible behavior:**
```tsx
// Good - testing what user sees
expect(screen.getByText('Loading...')).toBeInTheDocument()
```

### 2. Use Semantic Queries

Prefer queries that match how users interact:

```tsx
// Best to worst query priority:
screen.getByRole('button', { name: 'Submit' })
screen.getByLabelText('Email address')
screen.getByPlaceholderText('Enter email')
screen.getByText('Submit')
screen.getByTestId('submit-button') // Last resort
```

### 3. Test Accessibility

Ensure your components are accessible:

```tsx
it('should be keyboard accessible', async () => {
  const user = userEvent.setup()
  
  render(<MyForm />)
  
  await user.tab() // Focus first element
  await user.keyboard('{Enter}') // Activate with keyboard
  
  expect(screen.getByText('Form submitted')).toBeInTheDocument()
})
```

### 4. Keep Tests Simple and Focused

Each test should verify one specific behavior:

```tsx
// Good - focused test
it('should display error message when email is invalid', () => {
  render(<LoginForm />)
  // Test only email validation
})

// Bad - testing multiple things
it('should handle form submission with validation and success', () => {
  // Too much in one test
})
```

### 5. Use Descriptive Test Names

```tsx
// Good - describes what and when
it('should display loading spinner when fetching products')
it('should show error message when API call fails')
it('should disable submit button when form is invalid')

// Bad - vague descriptions
it('should work correctly')
it('should handle errors')
```

## 🚀 Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --coverage --watchAll=false
      - uses: codecov/codecov-action@v3
```

## 📖 Resources

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Playground](https://testing-playground.com/) - Interactive query builder
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🎯 Example Test Files

Check these files for comprehensive examples:

- `src/contexts/__tests__/CartContext.test.tsx` - Context testing
- `src/components/__tests__/ProductCard.test.tsx` - Component testing
- `src/components/__tests__/CartSidebar.test.tsx` - Complex interaction testing

---

**Happy Testing! 🧪✨**

Remember: Good tests give you confidence to refactor and add features without breaking existing functionality. 