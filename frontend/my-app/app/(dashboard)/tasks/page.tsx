'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, SlidersHorizontal, Filter, Plus, Columns3, List as ListIcon, Check, ChevronRight } from 'lucide-react';
import { BoardView } from '@/components/tasks/BoardView';
import { ListView } from '@/components/tasks/ListView';
import { TaskModal } from '@/components/tasks/TaskModal';
import { api, TaskData } from '@/lib/api';
import { useRouter } from 'next/navigation';

export type VisibleFields = { priority: boolean; members: boolean; dueDate: boolean; tags: boolean };

export default function TasksPage() {
  const router = useRouter();
  
  // UI State
  const [view, setView] = useState<'board' | 'list'>('board');
  const [showFields, setShowFields] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Data State
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<TaskData | null>(null);
  
  // Search & Fields State
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleFields, setVisibleFields] = useState<VisibleFields>({ priority: true, members: true, dueDate: true, tags: true });

  // 🛑 NEW: Advanced Filter State (Identical to Projects)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    'Status': [], 'Priority': [], 'Members': [], 'Due Date': [], 'Teams': [], 'Labels': [], 'Reporter': []
  });

  const fieldsRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const filterCategories = [
    { name: 'Status', options: ['Backlog', 'To Do', 'Doing', 'Completed', 'On Hold'] },
    { name: 'Priority', options: ['No Priority', 'Urgent', 'High', 'Medium', 'Low'] },
    { name: 'Members', options: ['Admin', 'Dexter', 'Unassigned'] },
    { name: 'Due Date', options: ['Overdue', 'This Week', 'This Month', 'No Date'] },
    { name: 'Teams', options: ['Engineering', 'Design', 'Marketing'] },
    { name: 'Labels', options: ['Bug', 'Feature', 'Improvement', 'Research', 'Frontend', 'Deployment'] },
    { name: 'Reporter', options: ['Admin', 'Dexter'] },
  ];

  useEffect(() => { loadTasks(); }, []);

  // Universal Click-Outside Listener for all Header Menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fieldsRef.current && !fieldsRef.current.contains(e.target as Node)) {
        setShowFields(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
        setActiveSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadTasks = async () => {
    setIsLoading(true);
    try { setTasks(await api.getTasks()); } 
    catch (error) { console.error("Fetch error:", error); } 
    finally { setIsLoading(false); }
  };

  const toggleFilterOption = (category: string, option: string) => {
    setActiveFilters(prev => {
      const current = prev[category] || [];
      const updated = current.includes(option) ? current.filter(item => item !== option) : [...current, option];
      return { ...prev, [category]: updated };
    });
  };

  // 🛑 FIXED: Multi-Level Filtering + Automatic Priority Sorting
  const processedTasks = useMemo(() => {
    let result = tasks.filter(task => {
      // 1. Text Search
      if (!task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      // 2. Active Filters
      for (const [category, selectedOptions] of Object.entries(activeFilters)) {
        if (selectedOptions.length === 0) continue;
        
        if (category === 'Status' && !selectedOptions.includes(task.status || 'Backlog')) return false;
        if (category === 'Priority' && !selectedOptions.includes(task.priority || 'No Priority')) return false;
        if (category === 'Members') {
          const taskMembers = task.members?.length ? task.members : ['Unassigned'];
          if (!taskMembers.some(m => selectedOptions.includes(m))) return false;
        }
        if (category === 'Labels') {
          const taskTags = task.tags?.length ? task.tags : [];
          if (!taskTags.some(t => selectedOptions.includes(t))) return false;
        }
      }
      return true;
    });
    
    // 3. Always sort by Priority so urgent tasks float to the top
    const priorityWeight: Record<string, number> = { 'Urgent': 4, 'High': 3, 'Medium': 2, 'Low': 1, 'No Priority': 0 };
    result.sort((a, b) => (priorityWeight[b.priority] ?? 0) - (priorityWeight[a.priority] ?? 0));
    
    return result;
  }, [tasks, searchQuery, activeFilters]);

  const toggleField = (field: keyof VisibleFields) => setVisibleFields(prev => ({ ...prev, [field]: !prev[field] }));

  const handleDeleteTask = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await api.deleteTask(id);
      loadTasks();
    }
  };

  // UI Color Helpers matching Figma
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
      
      <TaskModal isOpen={isModalOpen || !!editingTask} initialData={editingTask} onClose={() => { setIsModalOpen(false); setEditingTask(null); }} onRefresh={loadTasks} />

      {/* FULL WIDTH HEADER WITH BOTTOM BORDER */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#09090b] shrink-0">
        <h1 className="text-[20px] font-semibold text-foreground tracking-tight">Tasks</h1>
        
        <div className="flex items-center gap-3">
          {/* Live Search Bar */}
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..." 
              className="pl-8 pr-12 py-1.5 border border-[#e4e4e7] dark:border-[#27272a] rounded-[8px] bg-white dark:bg-[#09090b] text-[13px] font-medium focus:outline-none focus:ring-1 focus:ring-primary w-[240px] shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] transition-all"
            />
          </div>
          
          {/* Dynamic Fields Dropdown */}
          <div className="relative" ref={fieldsRef}>
            <button 
              onClick={() => setShowFields(!showFields)} 
              className="flex items-center gap-2 px-3 py-1.5 border border-[#e4e4e7] dark:border-[#27272a] rounded-[8px] text-[13px] font-medium hover:bg-muted transition-colors shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] text-foreground"
            >
              <SlidersHorizontal size={14} /> Fields
            </button>
            
            {showFields && (
              <div className="absolute right-0 top-full mt-2 w-[240px] bg-white dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex p-1 bg-[#f4f4f5] dark:bg-[#27272a] rounded-[8px] mb-2">
                  <button onClick={() => setView('list')} className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[12px] font-semibold rounded-md transition-all ${view === 'list' ? 'bg-white dark:bg-[#18181b] shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                    <ListIcon size={14} /> List
                  </button>
                  <button onClick={() => setView('board')} className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[12px] font-semibold rounded-md transition-all ${view === 'board' ? 'bg-white dark:bg-[#18181b] shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                    <Columns3 size={14} /> Board
                  </button>
                </div>
                <div className="space-y-0.5 mt-2">
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
          
          {/* ADVANCED FILTER POPOVER (Replaces basic Sorting Toggle) */}
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
          
          {/* Create Task Action */}
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#09090b] dark:bg-white text-white dark:text-black rounded-[8px] text-[13px] font-medium shadow-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> Add Task
          </button>
        </div>
      </header>

      {/* Main Content Area has padding applied internally */}
      <div className="flex-1 overflow-hidden bg-[#fafafa] dark:bg-[#09090b]">
        <div className="h-full p-8 pt-6">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-muted-foreground text-[14px]">Loading database...</div>
          ) : processedTasks.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground text-[14px]">No tasks found.</div>
          ) : view === 'board' ? (
            <BoardView tasks={processedTasks} onUpdate={loadTasks} visibleFields={visibleFields} onEdit={(task) => router.push(`/tasks/${task.id}`)} onDelete={handleDeleteTask} />
          ) : (
            <ListView tasks={processedTasks} visibleFields={visibleFields} onEdit={(task) => router.push(`/tasks/${task.id}`)} onDelete={handleDeleteTask} />
          )}
        </div>
      </div>
    </div>
  );
}