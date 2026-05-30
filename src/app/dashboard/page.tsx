'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { apiClient } from '@/lib/api'

interface Project {
  id: string
  title: string
  description?: string
  project_type: string
  status: string
  created_at: string
}

export default function Dashboard() {
  const { isAuthenticated, user } = useAuthStore()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectTitle, setNewProjectTitle] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin')
      return
    }

    loadProjects()
  }, [isAuthenticated, router])

  const loadProjects = async () => {
    try {
      setIsLoading(true)
      const data = await apiClient.getProjects()
      setProjects(data)
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjectTitle.trim()) return

    try {
      const newProject = await apiClient.createProject(newProjectTitle)
      setProjects([...projects, newProject])
      setNewProjectTitle('')
      setShowNewProject(false)
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure? This cannot be undone.')) {
      try {
        await apiClient.deleteProject(projectId)
        setProjects(projects.filter((p) => p.id !== projectId))
      } catch (error) {
        console.error('Failed to delete project:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-bg-subtle">
      {/* Header */}
      <header className="bg-white border-b border-border-light shadow-elevation-1 sticky top-0 z-40">
        <div className="container-centered py-6 md:py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-charcoal">Dashboard</h1>
            <p className="text-stone-light mt-2">Welcome back, <span className="font-semibold text-slate">{user?.name || user?.email}</span></p>
          </div>
          <button
            onClick={() => router.push('/signin')}
            className="btn-tertiary text-sm"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-centered py-12 md:py-16">
        {/* Create New Project Section */}
        <div className="mb-12">
          {!showNewProject ? (
            <button
              onClick={() => setShowNewProject(true)}
              className="btn-primary text-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Project
            </button>
          ) : (
            <div className="card p-8 bg-white">
              <h2 className="text-2xl font-semibold text-slate mb-6">Create New Project</h2>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate mb-2">Project Name</label>
                  <input
                    type="text"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    placeholder="e.g., Museum Redesign, Residential Tower"
                    className="input-field"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary">
                    Create Project
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewProject(false)
                      setNewProjectTitle('')
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Projects List */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-border-light border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-stone-light">Loading your projects...</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="card bg-white p-16 text-center">
            <div className="text-6xl mb-6 opacity-20">📐</div>
            <h3 className="text-2xl font-semibold text-slate mb-3">No projects yet</h3>
            <p className="text-stone-light mb-8 max-w-sm mx-auto">
              Get started by creating your first project. Upload your architectural renders, plans, and diagrams to begin.
            </p>
            <button
              onClick={() => setShowNewProject(true)}
              className="btn-primary"
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold text-slate mb-8">
              Your Projects
              <span className="text-sm font-normal text-stone-light ml-2">({projects.length})</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/project/${project.id}`}
                >
                  <div className="card group bg-white overflow-hidden h-full hover:shadow-elevation-3 cursor-pointer">
                    {/* Thumbnail Area */}
                    <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden relative">
                      <div className="text-5xl opacity-30">🏗️</div>
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-all duration-200"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2 gap-3">
                        <h3 className="text-lg font-semibold text-charcoal flex-1 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleDeleteProject(project.id)
                          }}
                          className="flex-shrink-0 text-stone-light hover:text-error transition-colors p-1 hover:bg-red-50 rounded"
                          title="Delete project"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                          </svg>
                        </button>
                      </div>

                      {/* Asset Count Indicator */}
                      <div className="mb-4 pb-4 border-b border-border-light">
                        <div className="text-xs font-medium text-stone-light mb-2">Assets</div>
                        <div className="flex gap-2">
                          <div className="flex-1 h-6 rounded bg-blue-100 flex items-center justify-center text-xs font-medium text-primary" title="Renders">R</div>
                          <div className="flex-1 h-6 rounded bg-amber-100 flex items-center justify-center text-xs font-medium text-amber-700" title="Plans">P</div>
                          <div className="flex-1 h-6 rounded bg-green-100 flex items-center justify-center text-xs font-medium text-green-700" title="Sections">S</div>
                          <div className="flex-1 h-6 rounded bg-purple-100 flex items-center justify-center text-xs font-medium text-purple-700" title="Diagrams">D</div>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="badge badge-info">
                          {project.project_type || 'Project'}
                        </span>
                        <span className="text-stone-light">
                          {new Date(project.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
