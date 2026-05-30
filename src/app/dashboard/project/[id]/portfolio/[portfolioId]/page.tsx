'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const STYLE_CONFIGS: Record<string, { bg: string; text: string; accent: string; font: string }> = {
  minimal_white: { bg: '#FFFFFF', text: '#000000', accent: '#333333', font: 'Inter, sans-serif' },
  dark_studio: { bg: '#1a1a1a', text: '#FFFFFF', accent: '#888888', font: 'Inter, sans-serif' },
  scandinavian: { bg: '#F5F0E8', text: '#2C2C2C', accent: '#8B7355', font: 'Georgia, serif' },
  architectural_journal: { bg: '#F8F4EF', text: '#1C1C1C', accent: '#8B0000', font: 'Georgia, serif' },
  competition_board: { bg: '#0A0A2E', text: '#FFFFFF', accent: '#FFD700', font: 'Inter, sans-serif' },
  parametric: { bg: '#F0F4FF', text: '#1A1A3E', accent: '#4169E1', font: 'monospace' },
  corporate: { bg: '#FAFAFA', text: '#2D2D2D', accent: '#003366', font: 'Inter, sans-serif' },
}

export default function PortfolioPreviewPage() {
  const params = useParams()
  const router = useRouter()
  const { token, isAuthenticated } = useAuthStore()
  const [portfolio, setPortfolio] = useState<any>(null)
  const [assets, setAssets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) { router.push('/signin'); return }
    loadPortfolio()
    loadAssets()
  }, [isAuthenticated])

  const loadPortfolio = async () => {
    try {
      const savedToken = token || localStorage.getItem('auth_token')
      const res = await fetch(`${API_URL}/api/portfolios/${params.portfolioId}`, {
        headers: { 'Authorization': `Bearer ${savedToken}` }
      })
      if (res.ok) setPortfolio(await res.json())
    } catch (e) { console.error(e) }
    finally { setIsLoading(false) }
  }

  const loadAssets = async () => {
    try {
      const savedToken = token || localStorage.getItem('auth_token')
      const res = await fetch(`${API_URL}/api/assets/${params.id}/list`, {
        headers: { 'Authorization': `Bearer ${savedToken}` }
      })
      if (res.ok) {
        const data = await res.json()
        const all = [
          ...(data.render || []),
          ...(data.plan || []),
          ...(data.section || []),
          ...(data.diagram || []),
        ]
        setAssets(all)
      }
    } catch (e) { console.error(e) }
  }

  const styleConfig = STYLE_CONFIGS[portfolio?.style_pack] || STYLE_CONFIGS.minimal_white
  const renders = assets.filter(a => a.asset_type === 'render' && a.file_url?.startsWith('http'))
  const plans = assets.filter(a => a.asset_type === 'plan' && a.file_url?.startsWith('http'))
  const sections = assets.filter(a => a.asset_type === 'section' && a.file_url?.startsWith('http'))
  const diagrams = assets.filter(a => a.asset_type === 'diagram' && a.file_url?.startsWith('http'))

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 animate-pulse">Loading portfolio...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white shadow-sm sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/project/${params.id}/generate`} className="text-gray-500 hover:text-gray-700 text-sm">
            ← Back to Generate
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-medium">Portfolio Preview - Variant #{portfolio?.variant_number}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
            🎨 {portfolio?.style_pack?.replace('_', ' ')}
          </span>
          <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
            📐 {portfolio?.layout_id?.replace('_', ' ')}
          </span>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            🖨️ Print / PDF
          </button>
        </div>
      </div>

      {/* A4 Portfolio Pages */}
      <div className="max-w-4xl mx-auto py-8 space-y-6 px-4">

        {/* Page 1 - Cover / Hero */}
        <div
          className="w-full shadow-2xl rounded-sm overflow-hidden"
          style={{
            background: styleConfig.bg,
            color: styleConfig.text,
            fontFamily: styleConfig.font,
            aspectRatio: '1/1.414', // A4 ratio
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Hero Image */}
          {renders[0] && (
            <div className="flex-1 relative overflow-hidden">
              <img
                src={renders[0].file_url}
                alt="Hero render"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute bottom-0 left-0 right-0 p-8"
                style={{ background: `linear-gradient(transparent, ${styleConfig.bg})` }}
              >
                <h1 className="text-4xl font-bold mb-2">Project Portfolio</h1>
                <p style={{ color: styleConfig.accent }}>Architecture Design</p>
              </div>
            </div>
          )}
          {!renders[0] && (
            <div className="flex-1 flex items-center justify-center" style={{ background: styleConfig.accent + '20' }}>
              <div className="text-center">
                <div className="text-6xl mb-4">🏛️</div>
                <h1 className="text-4xl font-bold">Project Portfolio</h1>
                <p style={{ color: styleConfig.accent }}>Architecture Design</p>
              </div>
            </div>
          )}
        </div>

        {/* Page 2 - Renders Grid */}
        {renders.length > 1 && (
          <div
            className="w-full shadow-2xl rounded-sm overflow-hidden p-8"
            style={{
              background: styleConfig.bg,
              color: styleConfig.text,
              fontFamily: styleConfig.font,
              aspectRatio: '1/1.414',
            }}
          >
            <h2 className="text-2xl font-bold mb-2" style={{ color: styleConfig.accent }}>Visualizations</h2>
            <div className="w-12 h-1 mb-6" style={{ background: styleConfig.accent }}></div>
            <div className="grid grid-cols-2 gap-4 h-[80%]">
              {renders.slice(1, 5).map((r, i) => (
                <img key={i} src={r.file_url} alt="" className="w-full h-full object-cover rounded-sm" />
              ))}
            </div>
          </div>
        )}

        {/* Page 3 - Plans */}
        {plans.length > 0 && (
          <div
            className="w-full shadow-2xl rounded-sm overflow-hidden p-8"
            style={{
              background: styleConfig.bg,
              color: styleConfig.text,
              fontFamily: styleConfig.font,
              aspectRatio: '1/1.414',
            }}
          >
            <h2 className="text-2xl font-bold mb-2" style={{ color: styleConfig.accent }}>Floor Plans</h2>
            <div className="w-12 h-1 mb-6" style={{ background: styleConfig.accent }}></div>
            <div className="grid grid-cols-1 gap-6 h-[80%]">
              {plans.slice(0, 2).map((p, i) => (
                <img key={i} src={p.file_url} alt="" className="w-full h-full object-contain rounded-sm" />
              ))}
            </div>
          </div>
        )}

        {/* Page 4 - Sections & Diagrams */}
        {(sections.length > 0 || diagrams.length > 0) && (
          <div
            className="w-full shadow-2xl rounded-sm overflow-hidden p-8"
            style={{
              background: styleConfig.bg,
              color: styleConfig.text,
              fontFamily: styleConfig.font,
              aspectRatio: '1/1.414',
            }}
          >
            <h2 className="text-2xl font-bold mb-2" style={{ color: styleConfig.accent }}>
              {sections.length > 0 ? 'Sections & Elevations' : 'Diagrams'}
            </h2>
            <div className="w-12 h-1 mb-6" style={{ background: styleConfig.accent }}></div>
            <div className="grid grid-cols-2 gap-4 h-[80%]">
              {[...sections, ...diagrams].slice(0, 4).map((a, i) => (
                <img key={i} src={a.file_url} alt="" className="w-full h-full object-contain rounded-sm" />
              ))}
            </div>
          </div>
        )}

        {/* More Renders */}
        {renders.length > 5 && (
          <div
            className="w-full shadow-2xl rounded-sm overflow-hidden p-8"
            style={{
              background: styleConfig.bg,
              color: styleConfig.text,
              fontFamily: styleConfig.font,
              aspectRatio: '1/1.414',
            }}
          >
            <h2 className="text-2xl font-bold mb-2" style={{ color: styleConfig.accent }}>More Views</h2>
            <div className="w-12 h-1 mb-6" style={{ background: styleConfig.accent }}></div>
            <div className="grid grid-cols-3 gap-3 h-[80%]">
              {renders.slice(5, 11).map((r, i) => (
                <img key={i} src={r.file_url} alt="" className="w-full h-full object-cover rounded-sm" />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
