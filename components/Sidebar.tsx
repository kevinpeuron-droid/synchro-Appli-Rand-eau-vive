import React from 'react';
import { Project } from '../types';
import { Plus, LayoutGrid, Trash2, Globe } from 'lucide-react';

interface SidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onAddProject: () => void;
  onDeleteProject: (id: string, e: React.MouseEvent) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onAddProject,
  onDeleteProject
}) => {
  return (
    <div className="w-64 bg-surface border-r border-border h-full flex flex-col hidden md:flex">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <div className="h-8 w-8 bg-white rounded-md flex items-center justify-center text-black">
          <svg viewBox="0 0 76 65" fill="currentColor" height="16" width="16"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z"></path></svg>
        </div>
        <h1 className="font-bold text-lg tracking-tight">Vercel Hub</h1>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        <div className="px-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Projets
        </div>
        
        {projects.length === 0 && (
          <div className="px-2 py-8 text-center text-sm text-slate-500 border border-dashed border-border rounded-md m-2">
            Aucun projet
          </div>
        )}

        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className={`group flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-all ${
              activeProjectId === project.id
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3 truncate">
              <Globe className="h-4 w-4 shrink-0 opacity-70" />
              <span className="truncate">{project.name}</span>
            </div>
            <button
              onClick={(e) => onDeleteProject(project.id, e)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-all"
              title="Supprimer"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <button
          onClick={onAddProject}
          className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-slate-200 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouveau Projet
        </button>
      </div>
    </div>
  );
};