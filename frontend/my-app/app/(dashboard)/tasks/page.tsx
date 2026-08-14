'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, Filter, Plus, Columns3, List as ListIcon, Check } from 'lucide-react';
import { BoardView } from '@/components/tasks/BoardView';
import { ListView } from '@/components/tasks/ListView';
import { TaskModal } from '@/components/tasks/TaskModal';
import { api, TaskData } from '@/lib/api';

// Type definition for the dynamic fields toggle
export type VisibleFields = { priority: boolean; members: boolean; dueDate: boolean; tags: boolean };

export default function TasksPage() {
  // UI State
  const [view, setView] = useState<'board' | 'list'>('board');
  const [showFields, setShowFields] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Data State
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<TaskData | null>(null);
  
  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortByPriority, setSortByPriority] = useState(false);
  const [visibleFields, setVisibleFields] = useState<VisibleFields>({
    priority: true, members: true, dueDate: true, tags: true
  });

  // Fetch tasks on initial mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Process tasks dynamically based on search input and priority sort
  const processedTasks = useMemo(() => {
    let result = tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (sortByPriority) {
      const priorityWeight: Record<string, number> = { 
        'Urgent': 4, 'High': 3, 'Medium': 2, 'Low': 1, 'No Priority': 0 
      };
      result.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
    }
    
    return result;
  }, [tasks, searchQuery, sortByPriority]);

  // Handler to toggle specific fields on/off
  const toggleField = (field: keyof VisibleFields) => {
    setVisibleFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Handler to delete a task
  const handleDeleteTask = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await api.deleteTask(id);
      loadTasks(); // Refresh the list after deletion
    }
  };

  return (
    <div className="h-full flex flex-col p-8 bg-white dark:bg-[#09090b]">
      
      {/* Smart Modal handles both Creating and Editing */}
      <TaskModal 
        isOpen={isModalOpen || !!editingTask} 
        initialData={editingTask}
        onClose={() => { setIsModalOpen(false); setEditingTask(null); }} 
        onRefresh={loadTasks} 
      />

      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-500 font-bold">
            D
          </div>
          <h1 className="text-[20px] font-semibold">Tasks</h1>
        </div>
        
        <div className="flex items-center gap-2.5">
          {/* Live Search Bar */}
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..." 
              className="pl-8 pr-12 py-1.5 border border-border rounded-lg bg-white dark:bg-[#09090b] text-[13px] focus:outline-none focus:ring-1 focus:ring-primary w-[240px] transition-all"
            />
          </div>
          
          {/* Dynamic Fields Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowFields(!showFields)} 
              className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-[13px] font-medium hover:bg-muted transition-colors shadow-sm"
            >
              <SlidersHorizontal size={14} /> Fields
            </button>
            
            {showFields && (
              <div className="absolute right-0 top-full mt-2 w-[220px] bg-white dark:bg-[#09090b] border border-border rounded-xl shadow-lg p-1.5 z-50">
                
                {/* View Toggles inside Dropdown */}
                <div className="flex p-1 bg-muted rounded-lg mb-2">
                  <button 
                    onClick={() => setView('list')} 
                    className={`flex-1 flex items-center justify-center gap-2 py-1 text-[12px] font-medium rounded-md ${view === 'list' ? 'bg-white dark:bg-[#27272a] shadow-sm text-foreground' : 'text-muted-foreground'}`}
                  >
                    <ListIcon size={14} /> List
                  </button>
                  <button 
                    onClick={() => setView('board')} 
                    className={`flex-1 flex items-center justify-center gap-2 py-1 text-[12px] font-medium rounded-md ${view === 'board' ? 'bg-white dark:bg-[#27272a] shadow-sm text-foreground' : 'text-muted-foreground'}`}
                  >
                    <Columns3 size={14} /> Board
                  </button>
                </div>
                
                {/* Checkboxes for Field Visibility */}
                <div className="space-y-0.5">
                  {(Object.keys(visibleFields) as Array<keyof VisibleFields>).map((field) => (
                    <label key={field} className="flex items-center justify-between px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer text-[13px] capitalize text-foreground">
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={visibleFields[field]} 
                        onChange={() => toggleField(field)} 
                      />
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${visibleFields[field] ? 'bg-black border-black text-white dark:bg-white dark:border-white dark:text-black' : 'border-border bg-transparent'}`}>
                        {visibleFields[field] && <Check size={12} />}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Priority Sorting Toggle */}
          <button 
            onClick={() => setSortByPriority(!sortByPriority)} 
            className={`p-1.5 border rounded-lg transition-colors shadow-sm ${sortByPriority ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted text-muted-foreground'}`}
            title="Sort by Priority"
          >
            <Filter size={16} />
          </button>

          {/* Create Task Action */}
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#09090b] dark:bg-white text-white dark:text-black rounded-lg text-[13px] font-medium shadow-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> Add Task
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground text-[14px]">
            Loading database...
          </div>
        ) : processedTasks.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground text-[14px]">
            No tasks found.
          </div>
        ) : view === 'board' ? (
          <BoardView 
            tasks={processedTasks} 
            onUpdate={loadTasks} 
            visibleFields={visibleFields} 
            // 🛑 ADD THESE TWO LINES SO THE BOARD CAN EDIT AND DELETE:
            onEdit={(task) => setEditingTask(task)} 
            onDelete={handleDeleteTask} 
          />
        ) : (
          <ListView 
            tasks={processedTasks} 
            visibleFields={visibleFields} 
            onEdit={(task) => setEditingTask(task)} 
            onDelete={handleDeleteTask} 
          />
        )}
      </div>
    </div>
  );
}