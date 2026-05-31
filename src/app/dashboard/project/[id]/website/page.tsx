'use client'

import { useState } from 'react'

import Link from 'next/link'
import Logo from '@/components/Logo'

export default function PortfolioWebsiteGenerator() {
  const [preview, setPreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [theme, setTheme] = useState<'light' | 'dark' | 'custom'>('light')
  const [primaryColor, setPrimaryColor] = useState('#0F172A')
  const [domain, setDomain] = useState('')
  const [published, setPublished] = useState(false)

  const previewDimensions = {
    desktop: { width: 1440, height: 900 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 390, height: 844 },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <h1 className="text-2xl font-bold">Portfolio Website</h1>
          </div>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="bg-gray-100 p-4 border-b flex gap-2 justify-center">
                {(['desktop', 'tablet', 'mobile'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setPreview(size)}
                    className={`px-4 py-2 rounded ${
                      preview === size
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex justify-center p-6 bg-white">
                <div
                  className="border-4 border-gray-400 rounded-lg overflow-hidden shadow-lg"
                  style={{
                    width: previewDimensions[preview].width,
                    height: previewDimensions[preview].height,
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Portfolio</h2>
                      <p className="text-gray-600">Preview will render here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-6">Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Theme</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Primary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-10 rounded border"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Domain</label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="yourname.com"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <button
                  onClick={() => setPublished(!published)}
                  className={`w-full py-2 rounded-lg font-bold transition ${
                    published
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {published ? '✓ Published' : 'Publish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
