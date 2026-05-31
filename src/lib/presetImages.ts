export const PRESET_IMAGES = {
  stylePreviews: {
    'minimal-white': {
      name: 'Minimal White',
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
      sampleRender: 'https://images.unsplash.com/photo-1487873391519-e21cc028cb29?w=1200&h=800&fit=crop',
    },
    'dark-studio': {
      name: 'Dark Studio',
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
      sampleRender: 'https://images.unsplash.com/photo-1487873391519-e21cc028cb29?w=1200&h=800&fit=crop',
    },
    'scandinavian': {
      name: 'Scandinavian',
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
      sampleRender: 'https://images.unsplash.com/photo-1487873391519-e21cc028cb29?w=1200&h=800&fit=crop',
    },
    'arch-journal': {
      name: 'Architectural Journal',
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
      sampleRender: 'https://images.unsplash.com/photo-1487873391519-e21cc028cb29?w=1200&h=800&fit=crop',
    },
    'competition': {
      name: 'Competition Board',
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
      sampleRender: 'https://images.unsplash.com/photo-1487873391519-e21cc028cb29?w=1200&h=800&fit=crop',
    },
    'parametric': {
      name: 'Parametric',
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
      sampleRender: 'https://images.unsplash.com/photo-1487873391519-e21cc028cb29?w=1200&h=800&fit=crop',
    },
    'corporate': {
      name: 'Corporate',
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
      sampleRender: 'https://images.unsplash.com/photo-1487873391519-e21cc028cb29?w=1200&h=800&fit=crop',
    },
  },
  layoutPreviews: {
    'cover-hero-full': 'https://images.unsplash.com/photo-1487873391519-e21cc028cb29?w=1200&h=1000&fit=crop',
    'cover-centered-type': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=1000&fit=crop',
    'proj-hero-text': 'https://images.unsplash.com/photo-1487873391519-e21cc028cb29?w=1200&h=800&fit=crop',
    'proj-split-60-40': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
    'about-minimal-cv': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop',
    'contents-minimal': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop',
  },
  sampleAssets: {
    renders: [
      'https://images.unsplash.com/photo-1487873391519-e21cc028cb29?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    ],
  },
}

export const getStylePackPreview = (stylePackId: string) => 
  PRESET_IMAGES.stylePreviews[stylePackId as keyof typeof PRESET_IMAGES.stylePreviews]

export const getLayoutPreview = (layoutId: string) => 
  PRESET_IMAGES.layoutPreviews[layoutId as keyof typeof PRESET_IMAGES.layoutPreviews]

export const getOverlayPreview = (overlayType: string) => ({
  name: overlayType,
  description: `${overlayType} overlay effect`,
})
