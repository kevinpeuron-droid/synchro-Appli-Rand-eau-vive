import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ProjectView } from './components/ProjectView';
import { Modal } from './components/Modal';
import { Button } from './components/Button';
import { Project } from './types';
import { Plus, Menu, X, Layout } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'vercel-hub-projects';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form state
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectUrl, setNewProjectUrl] = useState('');
  const [error, setError] = useState('');

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProjects(parsed);
        if (parsed.length > 0) {
          setActiveProjectId(parsed[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load projects", e);
    }
  }, []);

  // Save to local storage whenever projects change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !newProjectUrl.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    let formattedUrl = newProjectUrl;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const newProject: Project = {
      id: crypto.randomUUID(),
      name: newProjectName,
      url: formattedUrl,
      createdAt: Date.now()
    };

    setProjects([...projects, newProject]);
    setActiveProjectId(newProject.id);
    
    // Reset form
    setNewProjectName('');
    setNewProjectUrl('');
    setError('');
    setIsModalOpen(false);
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      const remaining = projects.filter(p => p.id !== id);
      setProjects(remaining);
      if (activeProjectId === id) {
        setActiveProjectId(remaining.length > 0 ? remaining[0].id : null);
      }
    }
  };

  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <div className="flex h-screen w-full bg-background text-slate-200">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
           <div className="w-64 h-full bg-surface border-r border-border p-4" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold">Menu</h2>
                <button onClick={() => setIsMobileMenuOpen(false)}><X /></button>
             </div>
             <div className="space-y-2">
                {projects.map(p => (
                   <button 
                     key={p.id}
                     onClick={() => { setActiveProjectId(p.id); setIsMobileMenuOpen(false); }}
                     className={`w-full text-left px-3 py-2 rounded-md ${activeProjectId === p.id ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                   >
                     {p.name}
                   </button>
                ))}
                <button 
                  onClick={() => { setIsModalOpen(true); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-primary mt-4 border border-dashed border-border rounded-md justify-center"
                >
                  <Plus size={16} /> Ajouter
                </button>
             </div>
           </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <Sidebar 
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
        onAddProject={() => setIsModalOpen(true)}
        onDeleteProject={handleDeleteProject}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden h-14 border-b border-border bg-surface flex items-center justify-between px-4 shrink-0">
           <div className="flex items-center gap-3">
              <button onClick={() => setIsMobileMenuOpen(true)} className="p-1">
                <Menu className="w-5 h-5 text-slate-300" />
              </button>
              <h1 className="font-bold">Vercel Hub</h1>
           </div>
        </div>

        {activeProject ? (
          <ProjectView project={activeProject} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-background">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-6 border border-border">
              <Layout className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Bienvenue sur votre Dashboard</h2>
            <p className="text-slate-400 max-w-md mb-8">
              Centralisez tous vos déploiements Vercel en un seul endroit. Ajoutez votre premier lien pour commencer.
            </p>
            <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
              Ajouter un projet
            </Button>
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter un projet">
        <form onSubmit={handleAddProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nom du projet</label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Ex: Mon Portfolio"
              className="w-full bg-slate-900 border border-border rounded-md px-3 py-2 text-slate-100 focus:ring-1 focus:ring-primary outline-none"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">URL Vercel</label>
            <input
              type="text"
              value={newProjectUrl}
              onChange={(e) => setNewProjectUrl(e.target.value)}
              placeholder="Ex: https://mon-projet.vercel.app"
              className="w-full bg-slate-900 border border-border rounded-md px-3 py-2 text-slate-100 focus:ring-1 focus:ring-primary outline-none"
            />
            <p className="text-xs text-slate-500 mt-1">L'URL doit commencer par http:// ou https://</p>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Ajouter le projet
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default App;