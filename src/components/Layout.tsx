import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  className?: string
}

export default function Layout({ children, title, subtitle, className = '' }: LayoutProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        {(title || subtitle) && (
          <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center animate-slide-up">
                {title && (
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-24 bg-white/5 rounded-full blur-3xl"></div>
            </div>
          </section>
        )}

        {/* Main Content Area */}
        <main className="relative">
          {children}
        </main>

        {/* Beautiful Footer */}
        <footer className="bg-gray-900 text-white mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">M</span>
                  </div>
                  <div>
                    <div className="font-bold text-xl">Developer Store</div>
                    <div className="text-gray-400 text-sm">Premium T-Shirts</div>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed max-w-md">
                  High-quality, developer-inspired t-shirts for the modern programmer. 
                  Comfort meets style in every piece.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="/" className="text-gray-300 hover:text-white transition-colors duration-200">Shop</a></li>
                  <li><a href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">About</a></li>
                  <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">Contact</a></li>
                  <li><a href="/faq" className="text-gray-300 hover:text-white transition-colors duration-200">FAQ</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Contact</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>support@developerstore.com</li>
                  <li>+49 123 456 789</li>
                  <li>Berlin, Germany</li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
              <p className="text-gray-400 text-sm">
                © 2024 Developer Store. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
} 