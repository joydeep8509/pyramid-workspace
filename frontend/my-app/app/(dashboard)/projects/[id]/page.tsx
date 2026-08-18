'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, SlidersHorizontal, Filter, Plus, PanelLeftClose, ChevronRight, Check, ListIcon, Columns3 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { api, TaskData, ProjectData } from '@/lib/api';
import { ListView } from '@/components/tasks/ListView';
import { TaskModal } from '@/components/tasks/TaskModal';
import { VisibleFields } from '../../tasks/page';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  // Data State
  const [project, setProject] = useState<ProjectData | null>(null);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskData | null>(null);
  
  // Fields & Search State
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFields, setShowFields] = useState(false);
  const [visibleFields, setVisibleFields] = useState<VisibleFields>({ priority: true, members: true, dueDate: true, tags: false });
  
  const fieldsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, [projectId]);

  // Click-Outside Listeners for Popovers & Expandable Search
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fieldsRef.current && !fieldsRef.current.contains(e.target as Node)) {
        setShowFields(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node) && searchQuery === '') {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load the specific project to get its name for the breadcrumb
      const allProjects = await api.getProjects();
      const currentProject = allProjects.find(p => p.id.toString() === projectId);
      if (currentProject) setProject(currentProject);

      // Load tasks (In a real app, this would be api.getTasksByProjectId(id))
      setTasks(await api.getTasks());
    } catch (error) {
      console.error("Failed to load project details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processedTasks = useMemo(() => {
    return tasks.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [tasks, searchQuery]);

  const toggleField = (field: keyof VisibleFields) => setVisibleFields(prev => ({ ...prev, [field]: !prev[field] }));

  const handleDeleteTask = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await api.deleteTask(id);
      loadData();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#09090b] overflow-hidden">
      
      <TaskModal isOpen={isModalOpen || !!editingTask} initialData={editingTask} onClose={() => { setIsModalOpen(false); setEditingTask(null); }} onRefresh={loadData} />

      {/* TOP BREADCRUMB HEADER */}
      <header className="flex items-center gap-3 px-6 py-3.5 border-b border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#09090b] shrink-0">
        <button 
          onClick={() => router.push('/projects')} 
          className="p-1.5 text-muted-foreground hover:bg-muted rounded-md transition-colors"
        >
          <PanelLeftClose size={18} />
        </button>
        <div className="w-[1px] h-4 bg-[#e4e4e7] dark:bg-[#27272a] mx-1"></div>
        <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
          <button onClick={() => router.push('/projects')} className="hover:text-foreground transition-colors">Projects</button>
          <ChevronRight size={14} className="opacity-50" />
          <span className="text-foreground">{project?.name || 'Design Homepage'}</span>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto px-8 pt-8 pb-20 bg-white dark:bg-[#09090b]">
        
        {/* SECONDARY HEADER: "Tasks" Title + Action Buttons */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[20px] font-semibold text-foreground tracking-tight">Tasks</h1>
          
          <div className="flex items-center gap-2.5">
            
            {/* Expandable Search Button (Matches Screenshot Layout) */}
            <div className="relative flex items-center" ref={searchRef}>
              {showSearch ? (
                <div className="relative animate-in fade-in slide-in-from-right-4 duration-200">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    autoFocus
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..." 
                    className="pl-8 pr-4 py-1.5 border border-[#e4e4e7] dark:border-[#27272a] rounded-[8px] bg-white dark:bg-[#09090b] text-[13px] font-medium focus:outline-none focus:ring-1 focus:ring-primary w-[200px] shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] transition-all"
                  />
                </div>
              ) : (
                <button 
                  onClick={() => setShowSearch(true)} 
                  className="p-1.5 border border-[#e4e4e7] dark:border-[#27272a] rounded-[8px] bg-white dark:bg-[#09090b] text-muted-foreground hover:bg-muted transition-colors shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]"
                >
                  <Search size={16} />
                </button>
              )}
            </div>

            {/* Dynamic Fields Dropdown */}
            <div className="relative" ref={fieldsRef}>
              <button 
                onClick={() => setShowFields(!showFields)} 
                className="flex items-center gap-2 px-3 py-1.5 border border-[#e4e4e7] dark:border-[#27272a] rounded-[8px] text-[13px] font-medium hover:bg-muted transition-colors shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] text-foreground bg-white dark:bg-[#09090b]"
              >
                <SlidersHorizontal size={14} /> Fields
              </button>
              
              {showFields && (
                <div className="absolute right-0 top-full mt-2 w-[240px] bg-white dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="space-y-0.5">
                    {(Object.keys(visibleFields) as Array<keyof VisibleFields>).map((field) => (
                      <label key={field} className="flex items-center justify-between px-3 py-2 hover:bg-muted rounded-[8px] cursor-pointer text-[13px] font-medium capitalize text-foreground transition-colors group">
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                        <input type="checkbox" className="hidden" checked={visibleFields[field]} onChange={() => toggleField(field)} />
                        <div className={`w-[18px] h-[18px] rounded-[6px] border flex items-center justify-center transition-colors ${visibleFields[field] ? 'bg-black border-black text-white dark:bg-white dark:border-white dark:text-black' : 'border-[#e4e4e7] dark:border-[#27272a] bg-transparent group-hover:border-foreground/30'}`}>
                          {visibleFields[field] && <Check size={12} strokeWidth={3} />}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filter Button */}
            <button className="p-1.5 border border-[#e4e4e7] dark:border-[#27272a] rounded-[8px] bg-white dark:bg-[#09090b] text-muted-foreground hover:bg-muted transition-colors shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
              <Filter size={16} />
            </button>
            
            {/* Create Task Action */}
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#09090b] dark:bg-white text-white dark:text-black rounded-[8px] text-[13px] font-medium shadow-sm hover:opacity-90 transition-opacity"
            >
              <Plus size={16} /> Add Task
            </button>
          </div>
        </div>

        {/* LIST VIEW RENDER */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground text-[14px]">Loading project tasks...</div>
        ) : processedTasks.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground text-[14px]">No tasks found.</div>
        ) : (
          <ListView 
            tasks={processedTasks} 
            visibleFields={visibleFields} 
            onEdit={(task) => router.push(`/tasks/${task.id}`)} 
            onDelete={handleDeleteTask} 
          />
        )}
        
      </div>
    </div>
  );
}