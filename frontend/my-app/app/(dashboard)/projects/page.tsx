'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, Filter, Plus, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { api, ProjectData } from '@/lib/api';
import { ProjectModal } from '@/components/projects/ProjectModal';

export default function ProjectsPage() {
  // Data State
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => { 
    loadProjects(); 
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Live Search Filtering
  const filteredProjects = useMemo(() => {
    return projects.filter(proj => 
      proj.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  // Handle Deletion
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await api.deleteProject(id);
      loadProjects();
    }
  };

  const getPriorityColor = (p: string) => {
    if (p === 'Urgent' || p === 'High') return 'text-red-500';
    if (p === 'Medium') return 'text-orange-500';
    return 'text-gray-400';
  };

  return (
    <div className="h-full flex flex-col p-8 bg-white dark:bg-[#09090b]">
      
      {/* Dynamic Modal */}
      <ProjectModal 
        isOpen={isModalOpen || !!editingProject} 
        initialData={editingProject} 
        onClose={() => { setIsModalOpen(false); setEditingProject(null); }} 
        onRefresh={loadProjects} 
      />

      {/* HEADER SECTION (Fixed) */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-[20px] font-semibold text-foreground">Projects</h1>
        </div>
        
        <div className="flex items-center gap-2.5">
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..." 
              className="pl-8 pr-12 py-1.5 border border-border rounded-lg bg-white dark:bg-[#09090b] text-[13px] focus:outline-none focus:ring-1 focus:ring-primary w-[240px] transition-all" 
            />
          </div>
          
          <button className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg bg-white dark:bg-[#09090b] text-[13px] font-medium hover:bg-muted transition-colors shadow-sm">
            <SlidersHorizontal size={14} /> Fields
          </button>
          
          <button className="p-1.5 border border-border rounded-lg bg-white dark:bg-[#09090b] hover:bg-muted transition-colors shadow-sm">
            <Filter size={16} className="text-muted-foreground" />
          </button>

          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#09090b] dark:bg-white text-white dark:text-black rounded-lg text-[13px] font-medium shadow-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> Add Project
          </button>
        </div>
      </header>

      {/* TABLE SECTION */}
      {/* Note: overflow-visible is crucial here so the dropdown menu doesn't get cut off */}
      <div className="border border-border rounded-xl bg-white dark:bg-[#09090b] shadow-sm flex-1 max-h-min overflow-visible pb-20">
        
        {/* Table Column Headers */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border text-[12px] font-medium text-muted-foreground bg-muted/30">
          <div className="col-span-5">Projects</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Lead</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Loading / Empty States */}
        {isLoading && <div className="p-8 text-center text-[13px] text-muted-foreground">Loading projects...</div>}
        {!isLoading && filteredProjects.length === 0 && <div className="p-8 text-center text-[13px] text-muted-foreground">No projects found.</div>}

        {/* Mapped Data Rows */}
        {filteredProjects.map(proj => (
          <div key={proj.id} className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border last:border-0 items-center text-[13px] hover:bg-muted/50 transition-colors">
            
            <div className="col-span-5 font-semibold text-primary">{proj.name}</div>
            
            <div className={`col-span-2 flex items-center gap-1.5 ${getPriorityColor(proj.priority)} font-medium`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 22V14M12 22V8M20 22V2" strokeLinecap="round" /></svg>
              {proj.priority}
            </div>
            
            <div className="col-span-2 flex items-center gap-2">
              {/* Fallback avatar block to fix the broken image issue */}
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-[10px] font-bold uppercase">
                {proj.lead ? proj.lead.charAt(0) : 'A'}
              </div>
              <span className="text-muted-foreground">{proj.lead || 'Admin'}</span>
            </div>
            
            <div className="col-span-2 text-muted-foreground">{proj.dueDate || 'No Date'}</div>
            
            {/* ACTION MENU */}
            <div className="col-span-1 flex justify-end text-muted-foreground relative">
              <button 
                onClick={() => setOpenMenuId(openMenuId === proj.id ? null : proj.id)} 
                className="p-1.5 hover:bg-border rounded focus:outline-none transition-colors"
              >
                <MoreHorizontal size={14} />
              </button>
              
              {/* The Dropdown Panel */}
              {openMenuId === proj.id && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-[#18181b] border border-border rounded-lg shadow-lg py-1 z-[100]">
                  <button 
                    onClick={() => { setEditingProject(proj); setOpenMenuId(null); }} 
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] hover:bg-muted transition-colors text-foreground"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => { handleDelete(proj.id); setOpenMenuId(null); }} 
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}