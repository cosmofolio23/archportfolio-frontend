export type PageType = 'cover' | 'contents' | 'project' | 'about' | 'credits'
export type DesignMode = 'ai' | 'manual'
export type AssetType = 'render' | 'plan' | 'section' | 'diagram' | 'photo' | 'sketch'

export interface PortfolioConfig {
  id: string
  title: string
  architectName: string
  architectBio?: string
  totalPages: number
  projectCount: number
  stylePackId: string
  hasFrontPage: boolean
  hasContentsPage: boolean
  hasResumePage: boolean
  hasLastPage: boolean
  shareSlug?: string
  isPublic: boolean
  status: 'draft' | 'building' | 'complete' | 'published'
}

export interface PageConfig {
  id: string
  pageNumber: number
  pageType: PageType
  layoutId: string
  contentBlocks: ContentBlockConfig[]
  assetAssignments: Record<string, string>
  styleOverride?: Partial<StylePackTokens>
  isLocked: boolean
  content: Record<string, string>
  overlays?: OverlayConfig[]
}

export interface OverlayConfig {
  id: string
  type: 'color' | 'gradient' | 'pattern' | 'text' | 'vignette' | 'blur'
  enabled: boolean
  settings: Record<string, any>
}

export interface ContentBlockConfig {
  blockType: string
  slotId: string
  data: Record<string, any>
  order: number
}

export interface BuilderState {
  currentStep: number
  totalPages: number
  projectCount: number
  frontPage: {
    designMode: DesignMode
    selectedLayoutId: string | null
    content: { title: string; subtitle: string; tagline?: string; image?: string }
  }
  lastPage: {
    selectedLayoutId: string | null
    content: { contactEmail?: string; website?: string; phone?: string; qrCode?: boolean }
  }
  resumePage: {
    enabled: boolean
    content: {
      name: string
      bio: string
      education: string[]
      experience: string[]
      skills: string[]
      awards: string[]
      software: string[]
      languages: string[]
      interests: string[]
    }
  }
  contentsPage: {
    enabled: boolean
    style: 'minimal' | 'visual' | 'numbered'
  }
  projectPages: ProjectPageConfig[]
  stylePackId: string
  portfolioId: string | null
}

export interface ProjectPageConfig {
  projectId: string
  projectName: string
  layoutId: string
  pageNumbers: number[]
  content: {
    title: string
    description: string
    location?: string
    year?: string
    area?: string
    typology?: string
    status?: string
    role?: string
    conceptStatement?: string
  }
  assets: {
    renders: string[]
    plans: string[]
    sections: string[]
    diagrams: string[]
  }
}

export interface StylePackTokens {
  id: string
  name: string
  description: string
  fonts: {
    heading: FontConfig
    subheading: FontConfig
    body: FontConfig
    caption: FontConfig
    pageNumber: FontConfig
  }
  colors: {
    background: string
    surface: string
    text: { primary: string; secondary: string; tertiary: string }
    accent: { primary: string; secondary: string }
    border: string
    overlay: string
  }
  spacing: {
    pageMargin: string
    sectionGap: string
    itemGap: string
    innerPadding: string
    headerHeight: string
  }
  grid: {
    columns: number
    gutter: string
    maxWidth: string
  }
  borders: {
    width: string
    style: string
    color: string
    radius: string
  }
  pageNumber: {
    position: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'none'
    format: 'numeric' | 'roman' | 'dash' | 'dot'
  }
  effects: {
    imageBorderRadius: string
    cardShadow: string
    hoverScale: number
    imageFilter?: string
    overlayOpacity: number
  }
}

export interface FontConfig {
  family: string
  weight: number
  size: string
  letterSpacing: string
  lineHeight: string
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none'
}

export interface LayoutDefinition {
  id: string
  name: string
  category: 'cover' | 'project' | 'about' | 'contents' | 'credits'
  description: string
  previewImageUrl?: string
  requiredAssetTypes: AssetType[]
  minAssets: number
  maxAssets: number
  contentSlots: ContentSlot[]
  gridConfig: GridConfig
  compatibleStyles: string[]
  tags: string[]
}

export interface ContentSlot {
  id: string
  type: 'image' | 'text' | 'header' | 'gallery' | 'drawing' | 'block'
  position: { x: number; y: number; w: number; h: number }
  required: boolean
  label: string
  acceptedAssetTypes?: AssetType[]
}

export interface GridConfig {
  columns: number
  rows: number
  gap: string
  areas?: string[][]
}

export interface ContentBlockDefinition {
  id: string
  name: string
  category: 'header' | 'content' | 'media' | 'data' | 'utility'
  description: string
  defaultConfig: Record<string, any>
  requiredFields: string[]
  icon: string
}
