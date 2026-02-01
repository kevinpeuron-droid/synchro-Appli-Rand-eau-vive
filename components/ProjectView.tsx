import React, { useState } from 'react';
import { Project, ViewMode } from '../types';
import { ExternalLink, RefreshCw, Smartphone, Tablet, Monitor, Info } from 'lucide-react';

interface ProjectViewProps {
  project: Project;
}

export const ProjectView: React.FC<ProjectViewProps> = ({ project }) => {
  const [key, setKey] = useState(0); // Used to force reload iframe
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');

  const reloadIframe = () => setKey(prev => prev + 1);

  const getContainerWidth = () => {
    switch (viewMode) {
      case 'mobile': return 'max-w-[375px]';
      case 'tablet': return 'max-w-[768px]';
      default: return 'max-w-full';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden relative">
      {/* Toolbar */}
      <div className="h-14 border-b border-border bg-surface flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold text-slate-100">{project.name}</h2>
          <div className="h-4 w-[1px] bg-border mx-2 hidden sm:block"></div>
          <span className="text-xs text-slate-500 truncate max-w-[200px] hidden sm:block font-mono">
            {project.url}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900 rounded-md p-1 border border-border flex items-center mr-2 hidden md:flex">
            <button 
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded ${viewMode === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Mobile View"
            >
              <Smartphone className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setViewMode('tablet')}
              className={`p-1.5 rounded ${viewMode === 'tablet' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Tablet View"
            >
              <Tablet className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded ${viewMode === 'desktop' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Desktop View"
            >
              <Monitor className="h-4 w-4" />
            </button>
          </div>

          <button 
            onClick={reloadIframe}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <a 
            href={project.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs bg-slate-800 text-slate-200 hover:bg-slate-700 border border-border px-3 py-1.5 rounded-md transition-colors"
          >
            Ouvrir <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Viewport */}
      <div className="flex-1 overflow-auto bg-slate-900/50 flex justify-center py-4 relative">
        <div className={`w-full ${getContainerWidth()} transition-all duration-300 h-full bg-white shadow-2xl overflow-hidden relative`}>
            {/* Warning overlay for potential loading issues */}
            <div className="absolute inset-x-0 top-0 bg-yellow-500/10 border-b border-yellow-500/20 text-yellow-500 text-xs py-1 px-2 text-center z-20 opacity-0 hover:opacity-100 transition-opacity">
               <Info className="inline w-3 h-3 mr-1" /> Si le site ne charge pas, utilisez le bouton "Ouvrir" en haut à droite (certains sites bloquent l'intégration).
            </div>

            <iframe 
              key={key}
              src={project.url} 
              title={project.name}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
        </div>
      </div>
    </div>
  );
};