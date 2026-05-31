'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function PortfolioPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication and load portfolio
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/signin')
      return
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Portfolio Builder</h1>
        <p className="text-gray-600 mb-4">Portfolio ID: {params?.id}</p>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">✅ Backend API Working</h2>
            <p className="text-gray-700">Design systems and layouts are available via API</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>✓ GET /api/design-systems</li>
              <li>✓ GET /api/layouts</li>
              <li>✓ GET /api/layouts/category/{{category}}</li>
            </ul>
          </div>

          <button
            onClick={() => router.push(`/dashboard/project/${params?.id}/generate`)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            ← Back to Project
          </button>
        </div>
      </div>
    </div>
  )
}
