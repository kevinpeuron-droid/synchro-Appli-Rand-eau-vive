export type SiteCategory = 'portal' | 'tool' | 'doc' | 'other';

export interface Site {
  id: string;
  name: string;
  url: string;
  category: SiteCategory;
  createdAt: number;
}

export type Project = Site;

export type ViewMode = 'mobile' | 'tablet' | 'desktop';

export const CATEGORY_CONFIG: Record<SiteCategory, { label: string; color: string }> = {
  portal: { label: 'Portails', color: 'text-indigo-400' },
  tool: { label: 'Outils', color: 'text-emerald-400' },
  doc: { label: 'Docs', color: 'text-amber-400' },
  other: { label: 'Divers', color: 'text-pink-400' }
};