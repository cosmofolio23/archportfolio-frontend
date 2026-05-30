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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container-centered py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name || user?.email}!</p>
          </div>
          <Link href="/dashboard" className="text-primary hover:text-secondary">
            Logout
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-centered py-12">
        {/* Create New Project Section */}
        {!showNewProject ? (
          <button
            onClick={() => setShowNewProject(true)}
            className="btn-primary mb-8 text-lg"
          >
            + New Project
          </button>
        ) : (
          <form onSubmit={handleCreateProject} className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
            <div className="flex gap-4">
              <input
                type="text"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                placeholder="Project name (e.g., 'Museum Redesign')"
                className="input-field flex-1"
                autoFocus
              />
              <button type="submit" className="btn-primary">
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowNewProject(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Projects List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No projects yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/project/${project.id}`}
              >
                <div className="card p-6 h-full hover:shadow-lg cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 flex-1">
                      {project.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleDeleteProject(project.id)
                      }}
                      className="text-red-600 hover:text-red-700 text-sm ml-2"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 h-12">
                    {project.description || 'No description'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {project.project_type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
