import React, { useState, useEffect } from 'react';
import { Site, SiteCategory } from './types';
import { SiteCard } from './components/SiteCard';
import { AddSiteModal } from './components/AddSiteModal';
import { Plus, Search, Command, Activity } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'vercel-hub-sites-v2';

const INITIAL_DATA: Site[] = [
  { id: '1', name: 'Vercel Platform', url: 'https://vercel.com', category: 'portal', createdAt: Date.now() },
  { id: '2', name: 'GitHub Repo', url: 'https://github.com', category: 'tool', createdAt: Date.now() },
  { id: '3', name: 'Stripe Dashboard', url: 'https://stripe.com', category: 'tool', createdAt: Date.now() },
];

const TABS: { id: SiteCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Vue d\'ensemble' },
  { id: 'portal', label: 'Portails' },
  { id: 'tool', label: 'Outils' },
  { id: 'doc', label: 'Documentation' },
];

function App() {
  const [sites, setSites] = useState<Site[]>([]);
  const [activeTab, setActiveTab] = useState<SiteCategory | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try { 
        setSites(JSON.parse(stored)); 
      } catch (e) { 
        setSites(INITIAL_DATA); 
      }
    } else { 
      setSites(INITIAL_DATA); 
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sites));
    }
  }, [sites, mounted]);

  const handleAddSite = (newSiteData: Omit<Site, 'id' | 'createdAt'>) => {
    setSites(prev => [{ ...newSiteData, id: crypto.randomUUID(), createdAt: Date.now() }, ...prev]);
  };

  const handleDeleteSite = (id: string) => {
    setSites(prev => prev.filter(site => site.id !== id));
  };

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          site.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || site.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="relative min-h-screen">
      {/* Background FX */}
      <div className="spotlight" />
      <div className="vignette" />

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        
        {/* Top Navigation */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5 text-black" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-white">Hub.</span>
          </div>

          <div className="flex-1 max-w-md mx-auto w-full">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-zinc-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Rechercher une ressource..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                 <span className="text-[10px] text-zinc-700 font-mono border border-zinc-800 rounded px-1.5 py-0.5">/</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau</span>
          </button>
        </header>

        {/* Tab Navigation */}
        <div className="flex items-center gap-8 mb-10 border-b border-zinc-900 pb-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              )}
            </button>
          ))}
        </div>

        {/* Grid Area */}
        <main className="min-h-[400px]">
          {filteredSites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSites.map((site) => (
                <SiteCard key={site.id} site={site} onDelete={handleDeleteSite} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 rounded-lg border border-dashed border-zinc-800 flex items-center justify-center mb-4">
                <Command className="w-5 h-5 text-zinc-700" />
              </div>
              <p className="text-zinc-500 text-sm">Aucune donnée affichée.</p>
            </div>
          )}
        </main>
        
        <footer className="mt-20 py-8 border-t border-zinc-900 flex justify-between items-center text-xs text-zinc-600">
          <p>System Status: Operational</p>
          <p className="font-mono">v3.0.0</p>
        </footer>
      </div>

      <AddSiteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddSite} />
    </div>
  );
}

export default App;