import React from 'react';
import { Site, CATEGORY_CONFIG } from '../types';
import { ArrowUpRight, Globe, Layers, Terminal, FolderOpen } from 'lucide-react';

interface SiteCardProps {
  site: Site;
  onDelete: (id: string) => void;
}

const getCategoryIcon = (category: string) => {
  const props = { className: "w-4 h-4" };
  switch (category) {
    case 'portal': return <Layers {...props} />;
    case 'tool': return <Terminal {...props} />;
    case 'doc': return <FolderOpen {...props} />;
    default: return <Globe {...props} />;
  }
};

export const SiteCard: React.FC<SiteCardProps> = ({ site, onDelete }) => {
  const config = CATEGORY_CONFIG[site.category];
  const domain = site.url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

  return (
    <div className="group relative h-40 bg-[#0A0A0A] border border-zinc-800 hover:border-zinc-600 transition-colors duration-300 rounded-xl overflow-hidden flex flex-col justify-between p-5">
      
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-md bg-zinc-900 border border-zinc-800 ${config.color} transition-colors group-hover:bg-zinc-800`}>
          {getCategoryIcon(site.category)}
        </div>

        <div className="flex gap-2 relative z-10">
           <a 
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
          >
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Bottom Section */}
      <div>
        <h3 className="text-base font-semibold text-zinc-100 mb-1 tracking-tight group-hover:text-white transition-colors">
          {site.name}
        </h3>
        <div className="flex items-center justify-between relative z-10">
          <p className="text-xs text-zinc-500 font-mono truncate max-w-[120px]">
            {domain}
          </p>
          
          <button 
             onClick={(e) => {
               e.stopPropagation();
               e.preventDefault();
               onDelete(site.id);
             }}
             className="text-[10px] uppercase tracking-wider font-medium text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            Supprimer
          </button>
        </div>
      </div>

      {/* Decorative Gradient Line on Hover */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-zinc-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Full click area backdrop */}
      <a href={site.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-0" />
    </div>
  );
};