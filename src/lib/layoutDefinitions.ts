import { LayoutDefinition } from '@/types/portfolio'

export const LAYOUT_DEFINITIONS: LayoutDefinition[] = [
  {
    id: 'cover-hero-full',
    name: 'Full Hero',
    category: 'cover',
    description: 'Full-bleed hero image with title overlay.',
    requiredAssetTypes: ['render'],
    minAssets: 1,
    maxAssets: 1,
    contentSlots: [
      { id: 'hero', type: 'image', position: { x: 0, y: 0, w: 100, h: 100 }, required: true, label: 'Hero Image' },
      { id: 'title', type: 'header', position: { x: 8, y: 65, w: 84, h: 20 }, required: true, label: 'Title' },
      { id: 'subtitle', type: 'text', position: { x: 8, y: 85, w: 60, h: 8 }, required: false, label: 'Subtitle' },
    ],
    gridConfig: { columns: 1, rows: 1, gap: '0' },
    compatibleStyles: ['minimal-white', 'dark-studio', 'scandinavian', 'arch-journal', 'competition', 'parametric', 'corporate'],
    tags: ['dramatic', 'visual', 'hero'],
  },
  {
    id: 'cover-centered-type',
    name: 'Centered Typography',
    category: 'cover',
    description: 'Typography-focused cover.',
    requiredAssetTypes: [],
    minAssets: 0,
    maxAssets: 0,
    contentSlots: [
      { id: 'title', type: 'header', position: { x: 10, y: 35, w: 80, h: 15 }, required: true, label: 'Title' },
      { id: 'subtitle', type: 'text', position: { x: 20, y: 56, w: 60, h: 10 }, required: false, label: 'Subtitle' },
      { id: 'author', type: 'text', position: { x: 25, y: 80, w: 50, h: 5 }, required: true, label: 'Author Name' },
    ],
    gridConfig: { columns: 1, rows: 1, gap: '0' },
    compatibleStyles: ['minimal-white', 'scandinavian', 'arch-journal', 'corporate'],
    tags: ['typographic', 'elegant', 'minimal'],
  },
  {
    id: 'proj-hero-text',
    name: 'Hero + Description',
    category: 'project',
    description: 'Full-width hero render with project description below.',
    requiredAssetTypes: ['render'],
    minAssets: 1,
    maxAssets: 2,
    contentSlots: [
      { id: 'hero', type: 'image', position: { x: 0, y: 0, w: 100, h: 55 }, required: true, label: 'Hero Render' },
      { id: 'title', type: 'header', position: { x: 8, y: 60, w: 84, h: 8 }, required: true, label: 'Project Title' },
      { id: 'description', type: 'text', position: { x: 8, y: 70, w: 50, h: 25 }, required: true, label: 'Description' },
    ],
    gridConfig: { columns: 2, rows: 2, gap: '24px' },
    compatibleStyles: ['minimal-white', 'dark-studio', 'scandinavian', 'arch-journal', 'corporate'],
    tags: ['hero', 'description', 'standard'],
  },
  {
    id: 'proj-split-60-40',
    name: '60/40 Split',
    category: 'project',
    description: '60% large image, 40% text.',
    requiredAssetTypes: ['render'],
    minAssets: 1,
    maxAssets: 2,
    contentSlots: [
      { id: 'image', type: 'image', position: { x: 0, y: 0, w: 60, h: 100 }, required: true, label: 'Main Image' },
      { id: 'title', type: 'header', position: { x: 65, y: 8, w: 30, h: 10 }, required: true, label: 'Title' },
      { id: 'description', type: 'text', position: { x: 65, y: 22, w: 30, h: 50 }, required: true, label: 'Description' },
    ],
    gridConfig: { columns: 2, rows: 1, gap: '0' },
    compatibleStyles: ['minimal-white', 'scandinavian', 'arch-journal', 'corporate'],
    tags: ['split', 'balanced', 'editorial'],
  },
  {
    id: 'about-minimal-cv',
    name: 'Minimal CV',
    category: 'about',
    description: 'Clean, structured CV layout.',
    requiredAssetTypes: [],
    minAssets: 0,
    maxAssets: 1,
    contentSlots: [
      { id: 'name', type: 'header', position: { x: 5, y: 5, w: 90, h: 10 }, required: true, label: 'Name' },
      { id: 'bio', type: 'text', position: { x: 5, y: 18, w: 60, h: 15 }, required: true, label: 'Bio' },
      { id: 'education', type: 'block', position: { x: 5, y: 38, w: 28, h: 55 }, required: true, label: 'Education' },
      { id: 'experience', type: 'block', position: { x: 36, y: 38, w: 28, h: 55 }, required: true, label: 'Experience' },
      { id: 'skills', type: 'block', position: { x: 67, y: 38, w: 28, h: 55 }, required: true, label: 'Skills' },
    ],
    gridConfig: { columns: 3, rows: 2, gap: '24px' },
    compatibleStyles: ['minimal-white', 'scandinavian', 'arch-journal', 'corporate'],
    tags: ['cv', 'resume', 'professional'],
  },
  {
    id: 'contents-minimal',
    name: 'Minimal Contents',
    category: 'contents',
    description: 'Clean list of contents with page numbers.',
    requiredAssetTypes: [],
    minAssets: 0,
    maxAssets: 0,
    contentSlots: [
      { id: 'title', type: 'header', position: { x: 10, y: 10, w: 80, h: 10 }, required: true, label: 'Contents Title' },
      { id: 'list', type: 'block', position: { x: 10, y: 25, w: 80, h: 65 }, required: true, label: 'Page List' },
    ],
    gridConfig: { columns: 1, rows: 1, gap: '0' },
    compatibleStyles: ['minimal-white', 'scandinavian', 'arch-journal', 'corporate'],
    tags: ['contents', 'list', 'minimal'],
  },
]

export const getLayoutsByCategory = (category: string) =>
  LAYOUT_DEFINITIONS.filter(l => l.category === category)

export const getLayout = (id: string) =>
  LAYOUT_DEFINITIONS.find(l => l.id === id)

export const getCompatibleLayouts = (stylePackId: string) =>
  LAYOUT_DEFINITIONS.filter(l => l.compatibleStyles.includes(stylePackId))
