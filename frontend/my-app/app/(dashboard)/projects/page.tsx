'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, SlidersHorizontal, Filter, Plus, MoreHorizontal, Edit2, Trash2, ChevronRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation'; // 🛑 1. Imported the router
import { api, ProjectData } from '@/lib/api';
import { ProjectModal } from '@/components/projects/ProjectModal';

export default function ProjectsPage() {
  const router = useRouter(); // 🛑 2. Initialized the router hook

  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  
  const filterRef = useRef<HTMLDivElement>(null);

  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    'Status': [], 'Priority': [], 'Members': [], 'Due Date': [], 'Teams': [], 'Labels': [], 'Reporter': []
  });

  const filterCategories = [
    { name: 'Status', options: ['Backlog', 'To Do', 'Doing', 'Completed', 'On Hold'] },
    { name: 'Priority', options: ['No Priority', 'Urgent', 'High', 'Medium', 'Low'] },
    { name: 'Members', options: ['Admin', 'Dexter', 'Unassigned'] },
    { name: 'Due Date', options: ['Overdue', 'This Week', 'This Month', 'No Date'] },
    { name: 'Teams', options: ['Engineering', 'Design', 'Marketing'] },
    { name: 'Labels', options: ['Bug', 'Feature', 'Improvement', 'Research'] },
    { name: 'Reporter', options: ['Admin', 'Dexter'] },
  ];

  useEffect(() => { 
    loadProjects(); 
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
        setActiveSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try { setProjects(await api.getProjects()); } 
    catch (error) { console.error("Failed to fetch projects", error); } 
    finally { setIsLoading(false); }
  };

  const toggleFilterOption = (category: string, option: string) => {
    setActiveFilters(prev => {
      const current = prev[category] || [];
      const updated = current.includes(option) ? current.filter(item => item !== option) : [...current, option];
      return { ...prev, [category]: updated };
    });
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(proj => {
      if (!proj.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [category, selectedOptions] of Object.entries(activeFilters)) {
        if (selectedOptions.length === 0) continue;
        if (category === 'Priority' && !selectedOptions.includes(proj.priority || 'No Priority')) return false;
        if (category === 'Members' && !selectedOptions.includes(proj.lead || 'Unassigned')) return false;
      }
      return true;
    });
  }, [projects, searchQuery, activeFilters]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await api.deleteProject(id);
      loadProjects();
    }
  };

  const getPriorityColor = (p: string) => {
    if (p === 'Urgent') return 'text-red-500';
    if (p === 'High') return 'text-orange-500';
    if (p === 'Medium') return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  const getStatusColor = (s: string) => {
    if (s === 'Completed') return 'bg-emerald-500';
    if (s === 'Doing') return 'bg-blue-500';
    if (s === 'On Hold' || s === 'Backlog') return 'bg-orange-500';
    return 'bg-gray-400';
  };

  return (
    <div className="h-full flex flex-col bg-[#fafafa] dark:bg-[#09090b]">
      
      <ProjectModal isOpen={isModalOpen || !!editingProject} initialData={editingProject} onClose={() => { setIsModalOpen(false); setEditingProject(null); }} onRefresh={loadProjects} />

      <header className="flex items-center justify-between px-8 py-5 border-b border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#09090b] shrink-0">
        <h1 className="text-[20px] font-semibold text-foreground tracking-tight">Projects</h1>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..." 
              className="pl-8 pr-12 py-1.5 border border-[#e4e4e7] dark:border-[#27272a] rounded-[8px] bg-white dark:bg-[#09090b] text-[13px] font-medium focus:outline-none focus:ring-1 focus:ring-primary w-[240px] shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] transition-all" 
            />
          </div>
          
          <button className="flex items-center gap-2 px-3 py-1.5 border border-[#e4e4e7] dark:border-[#27272a] rounded-[8px] text-[13px] font-medium hover:bg-muted transition-colors shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] text-foreground">
            <SlidersHorizontal size={14} /> Fields
          </button>
          
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => { setIsFilterOpen(!isFilterOpen); setActiveSubmenu(null); }}
              className={`p-1.5 border rounded-[8px] transition-colors shadow-sm ${Object.values(activeFilters).some(arr => arr.length > 0) ? 'bg-primary text-primary-foreground border-primary' : 'border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#09090b] hover:bg-muted text-muted-foreground'}`}
            >
              <Filter size={16} />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-2 w-[220px] bg-white dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-1 z-[120] animate-in fade-in zoom-in-95 duration-200">
                {filterCategories.map(category => {
                  const selectedCount = (activeFilters[category.name] || []).length;
                  return (
                    <div key={category.name} className="relative" onMouseEnter={() => setActiveSubmenu(category.name)}>
                      <button onClick={() => setActiveSubmenu(category.name)} className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${activeSubmenu === category.name ? 'bg-muted text-foreground' : 'text-foreground hover:bg-muted'}`}>
                        <span>{category.name}</span>
                        <div className="flex items-center gap-1.5">
                          {selectedCount > 0 && <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{selectedCount}</span>}
                          <ChevronRight size={14} className="text-muted-foreground" />
                        </div>
                      </button>

                      {activeSubmenu === category.name && (
                        <div className="absolute right-[calc(100%+4px)] top-0 w-[180px] bg-white dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-1 z-[130] animate-in fade-in zoom-in-95 duration-200">
                          <div className="px-3 py-2 text-[11px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">{category.name}</div>
                          {category.options.map(option => {
                            const isSelected = (activeFilters[category.name] || []).includes(option);
                            const isPriority = category.name === 'Priority';
                            return (
                              <button key={option} onClick={() => toggleFilterOption(category.name, option)} className={`w-full flex items-center justify-between px-3 py-2 text-[13px] rounded-md font-medium transition-colors ${isPriority ? `hover:bg-muted ${getPriorityColor(option)}` : 'hover:bg-muted text-foreground'}`}>
                                <div className="flex items-center gap-2.5">
                                  {isPriority && option !== 'No Priority' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 22V14M12 22V8M20 22V2" strokeLinecap="round" /></svg>}
                                  {isPriority && option === 'No Priority' && <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground ml-0.5" />}
                                  {category.name === 'Status' && <span className={`w-2 h-2 rounded-full ${getStatusColor(option)}`} />}
                                  <span>{option}</span>
                                </div>
                                {isSelected && <Check size={14} className={isPriority ? getPriorityColor(option) : 'text-primary'} />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#09090b] dark:bg-white text-white dark:text-black rounded-[8px] text-[13px] font-medium shadow-sm hover:opacity-90 transition-opacity">
            <Plus size={16} /> Add Project
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-[#fafafa] dark:bg-[#09090b] p-8 pt-6">
        
        <div className="border border-[#e4e4e7] dark:border-[#27272a] rounded-[12px] bg-white dark:bg-[#18181b] shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#e4e4e7] dark:border-[#27272a] text-[12px] font-semibold text-muted-foreground bg-[#fafafa] dark:bg-[#18181b]/50 rounded-t-[12px]">
            <div className="col-span-5">Projects</div>
            <div className="col-span-2">Priority</div>
            <div className="col-span-2">Lead</div>
            <div className="col-span-2">Due Date</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {isLoading && <div className="p-8 text-center text-[13px] text-muted-foreground">Loading projects...</div>}
          {!isLoading && filteredProjects.length === 0 && <div className="p-8 text-center text-[13px] text-muted-foreground">No projects found matching filters.</div>}

          {filteredProjects.map(proj => (
            <div key={proj.id} className="grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-[#e4e4e7] dark:border-[#27272a] last:border-0 items-center text-[13px] hover:bg-[#fafafa] dark:hover:bg-[#18181b]/50 transition-colors">
              
              {/* 🛑 3. Functional Router Push Attached */}
              <div 
                onClick={() => router.push(`/projects/${proj.id}`)}
                className="col-span-5 font-semibold text-foreground hover:text-primary cursor-pointer transition-colors"
              >
                {proj.name}
              </div>
              
              <div className={`col-span-2 flex items-center gap-1.5 ${getPriorityColor(proj.priority)} font-medium`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 22V14M12 22V8M20 22V2" strokeLinecap="round" /></svg>
                {proj.priority || 'No Priority'}
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-[10px] font-bold uppercase shadow-sm">
                  {proj.lead ? proj.lead.charAt(0) : 'A'}
                </div>
                <span className="text-muted-foreground">{proj.lead || 'Admin'}</span>
              </div>
              <div className="col-span-2 text-muted-foreground">{proj.dueDate || 'No Date'}</div>
              <div className="col-span-1 flex justify-end text-muted-foreground relative action-menu-container">
                <button onClick={() => setOpenMenuId(openMenuId === proj.id ? null : proj.id)} className="p-1.5 hover:bg-muted rounded-md focus:outline-none transition-colors">
                  <MoreHorizontal size={15} />
                </button>
                {openMenuId === proj.id && (
                  <div className="absolute right-0 top-8 w-[140px] bg-white dark:bg-[#09090b] border border-[#e4e4e7] dark:border-[#27272a] rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-1.5 z-[120] animate-in fade-in zoom-in-95 duration-200">
                    <button onClick={() => { setEditingProject(proj); setOpenMenuId(null); }} className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[13px] font-medium hover:bg-muted transition-colors text-foreground">
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => { handleDelete(proj.id); setOpenMenuId(null); }} className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[13px] font-medium hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 transition-colors">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}