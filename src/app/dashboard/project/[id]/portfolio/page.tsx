'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// ==================== Helper Functions ====================

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return null
}

// Debounce helper
const debounce = (fn: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// ==================== Design Systems & Layouts ====================

const DESIGN_SYSTEMS = [
  {
    id: 'minimal-white',
    name: 'Minimal White',
    headerFont: 'Georgia',
    bodyFont: 'Inter',
    bg: '#FFFFFF',
    text: '#1A1A1A',
    accent: '#0057FF',
    secondary: '#F5F5F5',
    spacing: 'generous',
    grid: '1fr 1fr',
    description: 'Clean, elegant, timeless'
  },
  {
    id: 'dark-studio',
    name: 'Dark Studio',
    headerFont: 'Space Grotesk',
    bodyFont: 'Inter',
    bg: '#0D0D0D',
    text: '#F0F0F0',
    accent: '#FF4444',
    secondary: '#1A1A1A',
    spacing: 'tight',
    grid: '2fr 1fr',
    description: 'Bold, modern, dramatic'
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    headerFont: 'Playfair Display',
    bodyFont: 'Lora',
    bg: '#F9F6F1',
    text: '#2C2416',
    accent: '#8B7355',
    secondary: '#EDE8DF',
    spacing: 'medium',
    grid: '1fr 1fr 1fr',
    description: 'Warm, sophisticated, minimal'
  },
  {
    id: 'arch-journal',
    name: 'Architectural Journal',
    headerFont: 'Cormorant Garamond',
    bodyFont: 'Garamond',
    bg: '#FAFAF8',
    text: '#1C1C1C',
    accent: '#B5A48B',
    secondary: '#F0EDE6',
    spacing: 'generous',
    grid: '1fr 2fr',
    description: 'Professional, editorial, refined'
  },
  {
    id: 'competition',
    name: 'Competition Board',
    headerFont: 'Outfit',
    bodyFont: 'Inter',
    bg: '#F2F2F2',
    text: '#111111',
    accent: '#2D4A8A',
    secondary: '#E5E5E5',
    spacing: 'tight',
    grid: 'auto-fit',
    description: 'Grid-focused, structured, technical'
  },
  {
    id: 'parametric',
    name: 'Parametric',
    headerFont: 'JetBrains Mono',
    bodyFont: 'IBM Plex Mono',
    bg: '#0A0A14',
    text: '#E0E8FF',
    accent: '#7B5CF5',
    secondary: '#12122A',
    spacing: 'compact',
    grid: 'repeat(4, 1fr)',
    description: 'Algorithm-driven, futuristic, coded'
  },
  {
    id: 'corporate',
    name: 'Corporate',
    headerFont: 'DM Sans',
    bodyFont: 'Inter',
    bg: '#FFFFFF',
    text: '#2B3A52',
    accent: '#1B4F8A',
    secondary: '#F0F4F8',
    spacing: 'medium',
    grid: '1fr 1fr',
    description: 'Professional, trustworthy, clean'
  }
]

const LAYOUTS = [
  { id: 'cover-hero', name: 'Full Hero', category: 'cover', elements: ['HERO_IMAGE', 'HEADER', 'TAGLINE'], icon: '🖼️' },
  { id: 'cover-centered', name: 'Centered', category: 'cover', elements: ['HEADER', 'SUBTITLE'], icon: '⬇️' },
  { id: 'cover-split', name: 'Split', category: 'cover', elements: ['IMAGE', 'TEXT'], icon: '↔️' },
  { id: 'proj-hero-text', name: 'Hero + Text', category: 'project', elements: ['IMAGE', 'TEXT'], icon: '📐' },
  { id: 'proj-split-ratio', name: '60/40 Split', category: 'project', elements: ['LARGE_IMAGE', 'TEXT'], icon: '⚖️' },
  { id: 'proj-3col-grid', name: '3 Grid', category: 'project', elements: ['GRID_3'], icon: '⊞⊞⊞' },
  { id: 'proj-4col-grid', name: '4 Grid', category: 'project', elements: ['GRID_4'], icon: '⊞⊞⊞⊞' },
  { id: 'proj-masonry', name: 'Masonry', category: 'project', elements: ['MASONRY'], icon: '🧱' },
  { id: 'proj-plan-section', name: 'Plan+Section', category: 'project', elements: ['PLAN', 'SECTION'], icon: '📋' },
  { id: 'proj-diagram', name: 'Diagrams', category: 'project', elements: ['DIAGRAMS'], icon: '🔹' },
  { id: 'about-bio-skills', name: 'Bio+Skills', category: 'about', elements: ['BIO', 'SKILLS'], icon: '👤' },
  { id: 'about-photo-bio', name: 'Photo+Bio', category: 'about', elements: ['PHOTO', 'TEXT'], icon: '🖼️' },
]

const OVERLAYS = [
  { id: 'none', name: 'None', type: 'none', preview: 'Transparent' },
  { id: 'color-dark', name: 'Dark Overlay', type: 'color', color: '#000000', opacity: 0.3, preview: '⬛ Dark' },
  { id: 'color-light', name: 'Light Overlay', type: 'color', color: '#FFFFFF', opacity: 0.2, preview: '⬜ Light' },
  { id: 'gradient-left', name: 'Gradient Left', type: 'gradient', preview: '← Gradient' },
  { id: 'gradient-top', name: 'Gradient Top', type: 'gradient', preview: '↓ Gradient' },
  { id: 'pattern-dots', name: 'Dots', type: 'pattern', preview: '⚫ Dots' },
  { id: 'pattern-lines', name: 'Lines', type: 'pattern', preview: '║ Lines' },
]

// ==================== Notification Component ====================

function Notification({ message, type }: { message: string; type: 'success' | 'error' | 'info' }) {
  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : type === 'error' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
  const textColor = type === 'success' ? 'text-green-700' : type === 'error' ? 'text-red-700' : 'text-blue-700'
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'

  return (
    <div className={`fixed top-4 right-4 ${bgColor} border rounded-lg p-4 ${textColor} text-sm z-50 animate-pulse`}>
      {icon} {message}
    </div>
  )
}

// ==================== Loading Spinner ====================

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

// ==================== Main Component ====================

export default function PortfolioGenerator() {
  const params = useParams()
  const projectId = params?.id as string
  const router = useRouter()

  // State
  const [step, setStep] = useState('structure')
  const [config, setConfig] = useState({
    numPages: 8,
    numProjects: 4,
    hasAbout: true,
    designSystem: DESIGN_SYSTEMS[0],
    pages: [] as any[]
  })
  const [currentPageId, setCurrentPageId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [selectedOverlay, setSelectedOverlay] = useState('none')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [apiDesignSystems, setApiDesignSystems] = useState<any[]>([])
  const [apiLayouts, setApiLayouts] = useState<any[]>([])

  const token = getAuthToken()
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()

  // ==================== API Functions ====================

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const loadPortfolioConfig = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/api/projects/${projectId}/portfolio-config`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('Failed to load portfolio')

      const savedConfig = await res.json()

      const designSystem = DESIGN_SYSTEMS.find(ds => ds.id === savedConfig.design_system_id) || DESIGN_SYSTEMS[0]

      setConfig(prev => ({
        ...prev,
        numPages: savedConfig.num_pages || 8,
        numProjects: savedConfig.num_projects || 4,
        hasAbout: savedConfig.has_about ?? true,
        designSystem: savedConfig.design_system_config ? { ...designSystem, ...savedConfig.design_system_config } : designSystem
      }))

      // Load pages
      await loadPages()
      showNotification('Portfolio loaded', 'success')
    } catch (error) {
      showNotification('Failed to load portfolio', 'error')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const loadPages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/projects/${projectId}/pages`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('Failed to load pages')

      const data = await res.json()
      setConfig(prev => ({ ...prev, pages: data.pages || [] }))

      if (data.pages && data.pages.length > 0) {
        setCurrentPageId(data.pages[0].id)
      }
    } catch (error) {
      console.error('Failed to load pages:', error)
    }
  }

  const savePortfolioConfig = async () => {
    try {
      setSaving(true)
      const res = await fetch(`${API_URL}/api/projects/${projectId}/portfolio-config`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          num_pages: config.numPages,
          num_projects: config.numProjects,
          has_about: config.hasAbout,
          design_system_id: config.designSystem.id,
          design_system_config: config.designSystem,
          status: 'draft'
        })
      })

      if (!res.ok) throw new Error('Failed to save portfolio')

      showNotification('✅ Portfolio saved', 'success')
    } catch (error) {
      showNotification('Failed to save portfolio', 'error')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  // Debounced auto-save
  const debouncedSave = useRef(debounce(savePortfolioConfig, 1500))

  useEffect(() => {
    if (step === 'preview') {
      debouncedSave.current()
    }
  }, [config, step])

  // Fetch design systems and layouts from API
  useEffect(() => {
    const fetchAPIData = async () => {
      try {
        const dsRes = await fetch(`${API_URL}/api/design-systems`)
        const layoutRes = await fetch(`${API_URL}/api/layouts`)

        if (dsRes.ok) {
          const dsData = await dsRes.json()
          setApiDesignSystems(dsData)
        }

        if (layoutRes.ok) {
          const layoutData = await layoutRes.json()
          setApiLayouts(layoutData)
        }
      } catch (error) {
        console.error('Error fetching API data:', error)
      }
    }

    fetchAPIData()
  }, [])

  const createPagesFromConfig = async () => {
    try {
      setLoading(true)
      const pages = [
        { page_number: 1, page_name: 'Cover', page_type: 'cover', layout_id: LAYOUTS[0].id, layout_name: LAYOUTS[0].name, content: {}, assets: {} },
        ...Array(config.numProjects).fill(null).map((_, i) => ({
          page_number: i + 2,
          page_name: `Project ${i + 1}`,
          page_type: 'project',
          layout_id: LAYOUTS.filter(l => l.category === 'project')[i % 5]?.id || 'proj-hero-text',
          layout_name: LAYOUTS.filter(l => l.category === 'project')[i % 5]?.name || 'Hero + Text',
          content: {},
          assets: {}
        })),
        ...(config.hasAbout ? [{ page_number: config.numProjects + 2, page_name: 'About', page_type: 'about', layout_id: LAYOUTS.filter(l => l.category === 'about')[0]?.id || 'about-bio-skills', layout_name: LAYOUTS.filter(l => l.category === 'about')[0]?.name || 'Bio+Skills', content: {}, assets: {} }] : []),
        { page_number: config.numPages, page_name: 'Back', page_type: 'cover', layout_id: LAYOUTS[2].id, layout_name: LAYOUTS[2].name, content: {}, assets: {} }
      ]

      const res = await fetch(`${API_URL}/api/projects/${projectId}/pages/batch-create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pages)
      })

      if (!res.ok) throw new Error('Failed to create pages')

      const result = await res.json()
      setConfig(prev => ({ ...prev, pages: result.pages || [] }))
      if (result.pages && result.pages.length > 0) {
        setCurrentPageId(result.pages[0].id)
      }

      showNotification(`✅ Created ${result.pages_created} pages`, 'success')
      setStep('preview')
    } catch (error) {
      showNotification('Failed to create pages', 'error')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File, category: string, pageId: string) => {
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', category)

      const res = await fetch(`${API_URL}/api/projects/${projectId}/pages/${pageId}/assets/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })

      if (!res.ok) throw new Error('Upload failed')

      const asset = await res.json()
      showNotification(`✅ ${file.name} uploaded`, 'success')
      await loadPages()
    } catch (error) {
      showNotification('Upload failed', 'error')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const saveOverlay = async (pageId: string, overlayData: any) => {
    try {
      const res = await fetch(`${API_URL}/api/projects/${projectId}/pages/${pageId}/overlay`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(overlayData)
      })

      if (!res.ok) throw new Error('Failed to save overlay')

      showNotification('✅ Overlay updated', 'success')
      await loadPages()
    } catch (error) {
      showNotification('Failed to save overlay', 'error')
      console.error(error)
    }
  }

  const deletePage = async (pageId: string) => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/api/projects/${projectId}/pages/${pageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('Failed to delete page')

      setConfig(prev => ({
        ...prev,
        pages: prev.pages.filter(p => p.id !== pageId)
      }))
      setCurrentPageId(config.pages[0]?.id || null)
      showNotification('✅ Page deleted', 'success')
    } catch (error) {
      showNotification('Failed to delete page', 'error')
      console.error(error)
    } finally {
      setLoading(false)
      setShowDeleteConfirm(null)
    }
  }

  // Load portfolio on mount
  useEffect(() => {
    if (!token) {
      router.push('/signin')
      return
    }
    loadPortfolioConfig()
  }, [projectId, token])

  // ==================== Step 1: Structure ====================

  if (step === 'structure') {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Portfolio Configuration</h1>
          <p className="text-gray-600 mb-8">Step 1 of 5: Define structure</p>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Number of Pages</label>
              <input
                type="number"
                value={config.numPages}
                onChange={e => setConfig({ ...config, numPages: parseInt(e.target.value) })}
                min="4"
                max="50"
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-3">Number of Projects</label>
              <input
                type="number"
                value={config.numProjects}
                onChange={e => setConfig({ ...config, numProjects: parseInt(e.target.value) })}
                min="1"
                max="20"
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-3">Include About Page?</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setConfig({ ...config, hasAbout: true })}
                  className={`flex-1 py-2 rounded ${config.hasAbout ? 'bg-blue-600 text-white' : 'border border-gray-300'}`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfig({ ...config, hasAbout: false })}
                  className={`flex-1 py-2 rounded ${!config.hasAbout ? 'bg-blue-600 text-white' : 'border border-gray-300'}`}
                >
                  No
                </button>
              </div>
            </div>
            <button onClick={() => setStep('design')} className="w-full bg-blue-600 text-white py-3 rounded font-medium mt-8">
              Next: Choose Design System
            </button>
          </div>
        </div>
        {notification && <Notification message={notification.message} type={notification.type} />}
      </div>
    )
  }

  // ==================== Step 2: Design System ====================

  if (step === 'design') {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Choose Design System</h1>
          <p className="text-gray-600 mb-8">Step 2 of 5: Select visual style</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {DESIGN_SYSTEMS.map(ds => (
              <button
                key={ds.id}
                onClick={() => setConfig({ ...config, designSystem: ds })}
                className={`p-6 rounded-lg border-2 transition-all text-left overflow-hidden ${config.designSystem.id === ds.id ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-300'}`}
              >
                <div className="mb-4 h-32 rounded" style={{ backgroundColor: ds.bg, color: ds.text }}>
                  <div className="p-4 h-full flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-lg" style={{ fontFamily: ds.headerFont }}>
                        Sample Title
                      </h4>
                      <p style={{ fontFamily: ds.bodyFont }} className="text-sm mt-2">
                        This shows the fonts and colors
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: ds.accent }}></div>
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: ds.secondary }}></div>
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: ds.text, opacity: 0.3 }}></div>
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-2">{ds.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{ds.description}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>📝 {ds.headerFont} / {ds.bodyFont}</p>
                  <p>🎨 Accent: {ds.accent}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button onClick={() => setStep('structure')} className="flex-1 border border-gray-300 py-3 rounded font-medium">
              Back
            </button>
            <button onClick={() => setStep('layouts')} className="flex-1 bg-blue-600 text-white py-3 rounded font-medium">
              Next: Choose Layouts
            </button>
          </div>
        </div>
        {notification && <Notification message={notification.message} type={notification.type} />}
      </div>
    )
  }

  // ==================== Step 3: Layouts ====================

  if (step === 'layouts') {
    const ds = config.designSystem
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Select Layouts</h1>
          <p className="text-gray-600 mb-8">Step 3 of 5: Choose layout for each page type</p>

          {['cover', 'project', 'about'].map(category => {
            const layoutsForCategory = apiLayouts.length > 0
              ? apiLayouts.filter(l => l.category === category)
              : LAYOUTS.filter(l => l.category === category)

            return (
              <div key={category} className="mb-12">
                <h3 className="text-lg font-bold mb-4 capitalize">{category} Layouts</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {layoutsForCategory.map(layout => {
                    // Get a color from the API design system or use a default
                    const designSystemColor = apiDesignSystems.length > 0
                      ? apiDesignSystems[Math.floor(Math.random() * apiDesignSystems.length)]
                      : null
                    const previewColor = designSystemColor?.colors?.primary || ds.accent

                    return (
                      <div key={layout.id} className="p-4 rounded-lg border-2 border-gray-200 text-center hover:border-blue-400 hover:shadow-lg transition-all cursor-default overflow-hidden">
                        {/* Colored preview swatch */}
                        <div
                          className="mb-3 h-24 rounded flex items-center justify-center text-white font-bold text-lg"
                          style={{
                            background: `linear-gradient(135deg, ${previewColor} 0%, ${designSystemColor?.colors?.secondary || '#6B7280'} 100%)`,
                            color: designSystemColor?.colors?.text || '#FFFFFF'
                          }}
                        >
                          <div className="text-center">
                            <div className="font-bold text-xs opacity-75">{layout.category.toUpperCase()}</div>
                            <div className="text-sm">{layout.name}</div>
                          </div>
                        </div>
                        <p className="font-medium text-sm text-gray-800">{layout.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{(layout.components || layout.elements || []).join(', ').substring(0, 40)}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          <div className="flex gap-4 mt-12">
            <button onClick={() => setStep('design')} className="flex-1 border border-gray-300 py-3 rounded font-medium">
              Back
            </button>
            <button onClick={createPagesFromConfig} disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded font-medium disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <LoadingSpinner /> : 'Next: Preview & Edit'}
            </button>
          </div>
        </div>
        {notification && <Notification message={notification.message} type={notification.type} />}
      </div>
    )
  }

  // ==================== Step 4: Preview & Edit ====================

  if (step === 'preview') {
    const ds = config.designSystem
    const currentPage = config.pages.find(p => p.id === currentPageId) || config.pages[0]

    if (showDeleteConfirm) {
      return (
        <div className="min-h-screen bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-4">{showDeleteConfirm === 'portfolio' ? 'Delete Portfolio?' : 'Delete Page?'}</h2>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 border border-gray-300 py-2 rounded">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (showDeleteConfirm === 'page') {
                    deletePage(currentPageId!)
                  } else {
                    router.push('/dashboard')
                  }
                }}
                className="flex-1 bg-red-600 text-white py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )
    }

    if (!currentPage) {
      return <div className="min-h-screen flex items-center justify-center">No pages found</div>
    }

    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-gray-200 py-4 px-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Preview & Edit</h1>
              <p className="text-sm text-gray-600">{saving ? 'Saving...' : 'Auto-saving'}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep('layouts')} className="text-sm text-blue-600">
                ← Back
              </button>
              <button onClick={() => setShowDeleteConfirm('portfolio')} className="text-sm px-3 py-1 text-red-600 border border-red-300 rounded">
                🗑 Delete
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-5 gap-6 p-6">
          {/* LEFT: Page List */}
          <div className="border border-gray-200 rounded p-4 h-fit max-h-96 overflow-y-auto">
            <h3 className="font-bold mb-4">Pages</h3>
            <div className="space-y-2">
              {config.pages.map(page => (
                <button
                  key={page.id}
                  onClick={() => setCurrentPageId(page.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${currentPageId === page.id ? 'bg-blue-100 border border-blue-300' : 'hover:bg-gray-100'}`}
                >
                  <p className="font-medium">{page.page_name}</p>
                  <p className="text-xs text-gray-600">{page.layout_name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* CENTER: Live Preview */}
          <div className="col-span-2 flex justify-center">
            <div
              className="w-full max-w-md aspect-[9/16] rounded-lg shadow-lg overflow-hidden flex flex-col justify-between p-6 relative"
              style={{
                backgroundColor: ds.bg,
                color: ds.text,
                fontFamily: ds.bodyFont,
              }}
            >
              {/* Overlay Preview */}
              {selectedOverlay !== 'none' && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundColor: OVERLAYS.find(o => o.id === selectedOverlay)?.color,
                    opacity: OVERLAYS.find(o => o.id === selectedOverlay)?.opacity || 0.3,
                  }}
                />
              )}

              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: ds.headerFont }}>
                  {String(currentPage?.page_name || 'Untitled')}
                </h2>
                <p className="text-sm opacity-70">{currentPage?.layout_name}</p>
              </div>

              <div className="h-40 rounded relative z-10" style={{ backgroundColor: ds.secondary, opacity: 0.5 }}></div>

              <div className="h-px relative z-10" style={{ backgroundColor: ds.accent }}></div>
            </div>
          </div>

          {/* RIGHT: Controls */}
          <div className="col-span-2 border border-gray-200 rounded p-4 max-h-96 overflow-y-auto space-y-6">
            {/* Overlay */}
            <div>
              <h4 className="font-bold mb-3">Overlay Options</h4>
              <div className="grid grid-cols-2 gap-2">
                {OVERLAYS.map(overlay => (
                  <button
                    key={overlay.id}
                    onClick={() => {
                      setSelectedOverlay(overlay.id)
                      if (overlay.id !== 'none' && currentPage) {
                        saveOverlay(currentPage.id, {
                          overlay_type: overlay.type,
                          config: { color: overlay.color, opacity: overlay.opacity },
                          is_active: true
                        })
                      }
                    }}
                    className={`p-2 rounded text-sm ${selectedOverlay === overlay.id ? 'bg-blue-100 border-2 border-blue-600' : 'border border-gray-300 hover:border-gray-400'}`}
                  >
                    {overlay.preview}
                  </button>
                ))}
              </div>
            </div>

            {/* Assets */}
            <div className="border-t pt-4">
              <h4 className="font-bold mb-3">Assets</h4>

              {currentPage?.page_type === 'cover' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Cover Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file, 'front_cover', currentPage.id)
                    }}
                    disabled={uploading}
                    className="w-full text-sm"
                  />
                  <p className="text-xs text-gray-600">Recommended: 1200×1500px {uploading && '(uploading...)'}</p>
                </div>
              )}

              {currentPage?.page_type === 'project' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Renders</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, 'render', currentPage.id)
                      }}
                      disabled={uploading}
                      className="w-full text-sm mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Plans</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, 'plan', currentPage.id)
                      }}
                      disabled={uploading}
                      className="w-full text-sm mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Sections</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, 'section', currentPage.id)
                      }}
                      disabled={uploading}
                      className="w-full text-sm mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Diagrams</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, 'diagram', currentPage.id)
                      }}
                      disabled={uploading}
                      className="w-full text-sm mt-1"
                    />
                  </div>
                </div>
              )}

              <div className="border-t pt-4 mt-4">
                <button onClick={() => setShowDeleteConfirm('page')} className="w-full text-sm text-red-600 border border-red-300 py-2 rounded hover:bg-red-50">
                  🗑 Delete Page
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 flex gap-4">
          <button onClick={() => setStep('layouts')} className="flex-1 border border-gray-300 py-3 rounded font-medium">
            Back
          </button>
          <button onClick={() => setStep('export')} className="flex-1 bg-blue-600 text-white py-3 rounded font-medium">
            Next: Export & Share
          </button>
        </div>
        {notification && <Notification message={notification.message} type={notification.type} />}
      </div>
    )
  }

  // ==================== Step 5: Export & Share ====================

  if (step === 'export') {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold mb-2">Portfolio Complete!</h1>
            <p className="text-gray-600">Your beautiful portfolio is ready</p>
          </div>

          <div className="bg-gray-100 p-8 rounded-lg mb-8">
            <p className="text-sm text-gray-600 mb-4">Share Link:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={`https://frontend-fawn-kappa-36.vercel.app/p/${projectId}`}
                readOnly
                className="flex-1 px-4 py-3 border border-gray-300 rounded bg-white"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://frontend-fawn-kappa-36.vercel.app/p/${projectId}`)
                  showNotification('✅ Link copied!', 'success')
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded font-medium"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <button className="w-full border border-gray-300 py-3 rounded font-medium hover:bg-gray-50">📥 Download HTML</button>
            <button className="w-full border border-gray-300 py-3 rounded font-medium hover:bg-gray-50">📕 Download PDF</button>
            <button className="w-full border border-gray-300 py-3 rounded font-medium hover:bg-gray-50">💼 Share on LinkedIn</button>
            <button className="w-full border border-gray-300 py-3 rounded font-medium hover:bg-gray-50">🐦 Share on Twitter</button>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setStep('preview')} className="flex-1 border border-gray-300 py-3 rounded font-medium">
              Edit
            </button>
            <button onClick={() => router.push('/dashboard')} className="flex-1 bg-blue-600 text-white py-3 rounded font-medium">
              Go to Dashboard
            </button>
          </div>
        </div>
        {notification && <Notification message={notification.message} type={notification.type} />}
      </div>
    )
  }

  return null
}
