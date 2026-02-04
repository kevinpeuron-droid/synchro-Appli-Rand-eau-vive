import React, { useState } from 'react';
import { X, CornerDownLeft, Command } from 'lucide-react';
import { Site, SiteCategory, CATEGORY_CONFIG } from '../types';

interface AddSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (site: Omit<Site, 'id' | 'createdAt'>) => void;
}

export const AddSiteModal: React.FC<AddSiteModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<SiteCategory>('portal');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http')) {
      formattedUrl = `https://${formattedUrl}`;
    }
    onAdd({ name: name.trim(), url: formattedUrl, category });
    setName(''); setUrl(''); setCategory('portal');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4">
      <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#0A0A0A] border border-zinc-800 shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header style Command Palette */}
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-3">
          <Command className="w-4 h-4 text-zinc-500" />
          <span className="text-sm font-medium text-zinc-400">Ajouter une ressource</span>
          <div className="flex-1" />
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-0">
          <div className="flex flex-col">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom du projet..."
              className="w-full bg-transparent border-b border-zinc-800 px-6 py-4 text-lg text-white placeholder-zinc-600 focus:outline-none focus:bg-zinc-900/30 transition-colors"
              autoFocus
            />
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-transparent border-b border-zinc-800 px-6 py-4 text-base font-mono text-zinc-300 placeholder-zinc-700 focus:outline-none focus:bg-zinc-900/30 transition-colors"
            />
          </div>

          <div className="p-4 bg-[#0A0A0A]">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-600 mb-3">Sélectionner un tag</label>
            <div className="flex flex-wrap gap-2 mb-6">
              {(Object.keys(CATEGORY_CONFIG) as SiteCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                    category === cat
                      ? 'bg-zinc-100 text-black border-zinc-100'
                      : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
                  }`}
                >
                  {CATEGORY_CONFIG[cat].label}
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md text-sm font-semibold hover:bg-zinc-200 transition-colors"
              >
                Confirmer <CornerDownLeft className="w-3 h-3" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};