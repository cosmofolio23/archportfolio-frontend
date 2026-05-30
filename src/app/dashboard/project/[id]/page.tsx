'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'

interface Asset {
  id: string
  asset_type: string
  file_name: string
  file_url: string
  file_size: number
  created_at: string
}

interface Project {
  id: string
  title: string
  description?: string
  project_type: string
  status: string
  created_at: string
}

const ASSET_CATEGORIES = [
  { key: 'render', label: '🏛️ Renders', description: 'Exterior & interior renders' },
  { key: 'plan', label: '📐 Plans', description: 'Floor plans & site plans' },
  { key: 'section', label: '✂️ Sections', description: 'Building sections & elevations' },
  { key: 'diagram', label: '📊 Diagrams', description: 'Concept & analysis diagrams' },
]

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const { token, isAuthenticated } = useAuthStore()
  const [project, setProject] = useState<Project | null>(null)
  const [assets, setAssets] = useState<Record<string, Asset[]>>({
    render: [], plan: [], section: [], diagram: []
  })
  const [activeTab, setActiveTab] = useState('render')
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [uploadProgress, setUploadProgress] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isAuthenticated) { router.push('/signin'); return }
    loadProject()
    loadAssets()
  }, [isAuthenticated])

  const loadProject = async () => {
    try {
      const res = await fetch(`${API_URL}/api/projects/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) setProject(await res.json())
    } catch (e) { console.error(e) }
  }

  const loadAssets = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`${API_URL}/api/assets/${params.id}/list`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setAssets({
          render: data.render || [],
          plan: data.plan || [],
          section: data.section || [],
          diagram: data.diagram || [],
        })
      }
    } catch (e) { console.error(e) }
    finally { setIsLoading(false) }
  }

  const handleUpload = async (files: FileList) => {
    if (!files.length) return
    setIsUploading(true)
    setUploadProgress(`Uploading ${files.length} file(s)...`)

    const formData = new FormData()
    Array.from(files).forEach(f => formData.append('files', f))

    try {
      const res = await fetch(
        `${API_URL}/api/assets/${params.id}/upload?asset_type=${activeTab}`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        }
      )
      if (res.ok) {
        setUploadProgress('✅ Uploaded successfully!')
        await loadAssets()
        setTimeout(() => setUploadProgress(''), 2000)
      } else {
        const err = await res.json()
        setUploadProgress(`❌ Error: ${err.detail}`)
      }
    } catch (e: any) {
      setUploadProgress(`❌ Upload failed: ${e.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteAsset = async (assetId: string) => {
    try {
      await fetch(`${API_URL}/api/assets/${params.id}/assets/${assetId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      await loadAssets()
    } catch (e) { console.error(e) }
  }

  const totalAssets = Object.values(assets).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">← Dashboard</Link>
            <span className="text-gray-300">/</span>
            <h1 className="text-xl font-bold text-gray-900">{project?.title || 'Loading...'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{totalAssets} assets</span>
            {totalAssets > 0 && (
              <Link
                href={`/dashboard/project/${params.id}/generate`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                ✨ Generate Portfolio
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Upload Area */}
        <div
          className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6 hover:border-blue-400 transition cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files) }}
        >
          <div className="text-4xl mb-3">
            {ASSET_CATEGORIES.find(c => c.key === activeTab)?.label}
          </div>
          <p className="text-lg font-medium text-gray-700 mb-1">
            Drop files here or click to upload
          </p>
          <p className="text-sm text-gray-500">
            {ASSET_CATEGORIES.find(c => c.key === activeTab)?.description}
          </p>
          {uploadProgress && (
            <p className="mt-3 text-sm font-medium text-blue-600">{uploadProgress}</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6">
          {ASSET_CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
                activeTab === cat.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.label}
              {assets[cat.key]?.length > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === cat.key ? 'bg-blue-500' : 'bg-gray-200 text-gray-600'
                }`}>
                  {assets[cat.key].length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Asset Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading assets...</div>
        ) : assets[activeTab]?.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <div className="text-5xl mb-3">📁</div>
            <p className="text-gray-500">No {activeTab}s uploaded yet</p>
            <p className="text-sm text-gray-400 mt-1">Click the upload area above to add files</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {assets[activeTab].map(asset => (
              <div key={asset.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden group">
                <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                  {asset.file_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img src={asset.file_url} alt={asset.file_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-4xl">📄</div>
                  )}
                  <button
                    onClick={() => handleDeleteAsset(asset.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs hidden group-hover:flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate">{asset.file_name}</p>
                  <p className="text-xs text-gray-400">
                    {asset.file_size ? `${(asset.file_size / 1024).toFixed(0)} KB` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Generate CTA */}
        {totalAssets > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Ready to generate your portfolio?</h2>
            <p className="text-blue-100 mb-4">
              You have {totalAssets} assets across {Object.values(assets).filter(a => a.length > 0).length} categories
            </p>
            <Link
              href={`/dashboard/project/${params.id}/generate`}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition inline-block"
            >
              ✨ Generate Portfolio Variants
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
