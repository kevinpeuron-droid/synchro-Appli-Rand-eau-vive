export interface Project {
  id: string;
  name: string;
  url: string;
  createdAt: number;
}

export type ViewMode = 'desktop' | 'mobile' | 'tablet';