
export enum TabType {
  UNIVERSAL = 'universal',
  YOUTUBE = 'youtube',
  THUMBNAIL = 'thumbnail',
  REELS = 'reels',
  EDUCATION = 'education',
  PLATFORM = 'platform',
  PRESENTATION = 'presentation',
  IMAGE_EDIT = 'image_edit'
}

export interface PromptInput {
  goal?: string;
  context?: string;
  audience?: string;
  format?: string;
  constraints?: string;
  depth?: 'beginner' | 'advanced';
  platform?: 'studio' | 'long_context' | 'code';
  image?: string;
  imagePrompt?: string;
}

export interface Source {
  uri: string;
  title: string;
}

export interface AIResult {
  text: string;
  sources?: Source[];
  imageUrl?: string;
}
