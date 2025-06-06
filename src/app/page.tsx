import ProductGrid from '@/components/ProductGrid'

// Mock T-Shirt Daten - sofort funktionsfähig ohne Backend
const mockProducts = [
  {
    id: "tshirt_1",
    title: "Vintage Coding Tee",
    description: "Classic vintage style for developers who appreciate timeless design and quality code.",
    thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    tags: [
      { value: "vintage" },
      { value: "coding" },
      { value: "classic" }
    ],
    variants: [
      {
        id: "var_1",
        title: "Medium / Black",
        calculated_price: {
          calculated_amount: 2399
        }
      }
    ]
  },
  {
    id: "tshirt_2", 
    title: "Python Powered",
    description: "Show your love for Python with this sleek and comfortable developer tee.",
    thumbnail: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop",
    tags: [
      { value: "python" },
      { value: "programming" },
      { value: "developer" }
    ],
    variants: [
      {
        id: "var_2",
        title: "Large / Navy",
        calculated_price: {
          calculated_amount: 2199
        }
      }
    ]
  },
  {
    id: "tshirt_3",
    title: "JavaScript Ninja",
    description: "Stealthy, powerful, and precise - just like your JavaScript skills.",
    thumbnail: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop",
    tags: [
      { value: "javascript" },
      { value: "ninja" },
      { value: "frontend" }
    ],
    variants: [
      {
        id: "var_3",
        title: "Large / Charcoal",
        calculated_price: {
          calculated_amount: 2599
        }
      }
    ]
  },
  {
    id: "tshirt_4",
    title: "React Component",
    description: "Reusable, efficient, and always rendering perfectly - like this shirt.",
    thumbnail: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop",
    tags: [
      { value: "react" },
      { value: "component" },
      { value: "frontend" }
    ],
    variants: [
      {
        id: "var_4",
        title: "Medium / Royal Blue",
        calculated_price: {
          calculated_amount: 2299
        }
      }
    ]
  },
  {
    id: "tshirt_5",
    title: "AI/ML Engineer",
    description: "Training models by day, training at the gym by night. Neural networks included.",
    thumbnail: "https://images.unsplash.com/photo-1555374018-13a8994ab246?w=400&h=400&fit=crop",
    tags: [
      { value: "ai" },
      { value: "machine-learning" },
      { value: "engineer" }
    ],
    variants: [
      {
        id: "var_5",
        title: "Large / Forest Green",
        calculated_price: {
          calculated_amount: 2699
        }
      }
    ]
  },
  {
    id: "tshirt_6",
    title: "DevOps Master",
    description: "Deploying code and looking good doing it. CI/CD pipeline not included.",
    thumbnail: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop",
    tags: [
      { value: "devops" },
      { value: "deployment" },
      { value: "cicd" }
    ],
    variants: [
      {
        id: "var_6",
        title: "Medium / Burgundy",
        calculated_price: {
          calculated_amount: 2499
        }
      }
    ]
  },
  {
    id: "tshirt_7",
    title: "Full Stack Developer",
    description: "From frontend to backend, database to deployment - we do it all.",
    thumbnail: "https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=400&h=400&fit=crop",
    tags: [
      { value: "fullstack" },
      { value: "backend" },
      { value: "frontend" },
      { value: "database" }
    ],
    variants: [
      {
        id: "var_7",
        title: "Large / Midnight Black",
        calculated_price: {
          calculated_amount: 2799
        }
      }
    ]
  },
  {
    id: "tshirt_8",
    title: "Open Source Hero",
    description: "Contributing to the community one commit at a time. Pull requests welcome.",
    thumbnail: "https://images.unsplash.com/photo-1586281010493-d17f8f2e1e0d?w=400&h=400&fit=crop",
    tags: [
      { value: "opensource" },
      { value: "community" },
      { value: "hero" }
    ],
    variants: [
      {
        id: "var_8",
        title: "Medium / Steel Gray",
        calculated_price: {
          calculated_amount: 2399
        }
      }
    ]
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Developer T-Shirt Store
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Premium quality t-shirts for developers, programmers, and tech enthusiasts. 
            Code in style with our collection.
          </p>
        </div>
        
        <ProductGrid products={mockProducts} />
        
        <div className="text-center mt-16 p-8 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            🚀 Project Medusa Demo
          </h2>
          <p className="text-gray-600">
            This is a working demonstration of an automated T-shirt store built with Next.js.
            <br />
            <strong>Frontend:</strong> http://localhost:3000 ✅ | <strong>Mock Data:</strong> 8 T-shirt designs ✅
          </p>
        </div>
      </div>
    </div>
  );
}
