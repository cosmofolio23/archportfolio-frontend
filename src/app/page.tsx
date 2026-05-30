'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, user, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
        <div className="text-2xl font-bold text-primary">ArchPortfolio</div>
        <div className="flex gap-4">
          <Link href="/signin" className="btn-secondary btn-small">
            Sign In
          </Link>
          <Link href="/signup" className="btn-primary btn-small">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container-centered py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          Generate Professional Architecture Portfolios in Seconds
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload your renders, plans, sections, and diagrams. Let AI intelligently arrange them into stunning portfolio variations with 50+ layouts and 7 design systems.
        </p>

        <div className="flex gap-4 justify-center mb-16">
          <Link href="/signup" className="btn-primary text-lg px-8 py-3">
            Get Started Free
          </Link>
          <button className="btn-secondary text-lg px-8 py-3">
            See Demo
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="card p-6">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-xl font-semibold mb-2">50+ Layouts</h3>
            <p className="text-gray-600">From hero renders to technical plans, grid layouts to competition boards.</p>
          </div>

          <div className="card p-6">
            <div className="text-3xl mb-3">🎭</div>
            <h3 className="text-xl font-semibold mb-2">7 Design Systems</h3>
            <p className="text-gray-600">Minimal, Dark Studio, Scandinavian, Journal, Competition, Parametric, Corporate.</p>
          </div>

          <div className="card p-6">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
            <p className="text-gray-600">Intelligent layout recommendations and automatic portfolio generation.</p>
          </div>

          <div className="card p-6">
            <div className="text-3xl mb-3">📁</div>
            <h3 className="text-xl font-semibold mb-2">Organized Assets</h3>
            <p className="text-gray-600">Separate uploads for renders, plans, sections, and diagrams.</p>
          </div>

          <div className="card p-6">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-xl font-semibold mb-2">Export Options</h3>
            <p className="text-gray-600">PDF, web view, social media carousels, and competition boards.</p>
          </div>

          <div className="card p-6">
            <div className="text-3xl mb-3">💾</div>
            <h3 className="text-xl font-semibold mb-2">Save & Share</h3>
            <p className="text-gray-600">Store portfolios in your account, share links, download PDFs anytime.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16 mt-20">
        <div className="container-centered text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Portfolio?</h2>
          <p className="text-lg mb-8 opacity-90">
            Free to use, free to generate. No credit card required.
          </p>
          <Link href="/signup" className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Start Free Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="container-centered text-center">
          <p>&copy; 2024 ArchPortfolio Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
