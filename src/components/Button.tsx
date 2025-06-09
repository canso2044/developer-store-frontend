import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center font-semibold rounded-xl
    transition-all duration-200 transform hover:-translate-y-0.5 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    active:scale-95
  `

  const variants = {
    primary: `
      bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg
      hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl
    `,
    secondary: `
      bg-white text-gray-900 border-2 border-gray-200 shadow-md
      hover:border-gray-300 hover:shadow-lg hover:bg-gray-50
    `,
    ghost: `
      bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900
    `,
    gradient: `
      bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white shadow-lg
      hover:from-purple-700 hover:via-pink-700 hover:to-red-700 hover:shadow-xl
    `,
    outline: `
      bg-transparent border-2 border-blue-600 text-blue-600 
      hover:bg-blue-600 hover:text-white hover:shadow-lg
    `
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  }

  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <button
      className={`
        ${baseClasses} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${widthClass}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Loading...
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  )
} 