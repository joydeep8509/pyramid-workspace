'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { TaskData } from '@/lib/api';
import { VisibleFields } from '@/app/(dashboard)/tasks/page';

interface BoardViewProps {
  tasks: TaskData[];
  onUpdate: () => void;
  visibleFields: VisibleFields;
  onEdit: (task: TaskData) => void;  // <-- Added this
  onDelete: (id: number) => void;    // <-- Added this
}

export function BoardView({ tasks, onUpdate, visibleFields, onEdit, onDelete }: BoardViewProps) {
  // Tracks which card's dropdown menu is currently open
  const [openMenuId, setOpenMenuId] = useState<number | null>(null); 

  const columns = [
    { title: 'To Do', icon: '∷' }, 
    { title: 'Doing', icon: '∷' }, 
    { title: 'Completed', icon: '∷' }, 
    { title: 'On Hold', icon: '∷' }
  ];

  return (
    <div className="flex h-full gap-6 overflow-x-auto pb-4 items-start">
      {columns.map(col => (
        <div key={col.title} className="w-[300px] shrink-0 flex flex-col gap-3">
          
          {/* Column Header */}
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
              <span className="text-muted-foreground">{col.icon}</span> {col.title}
              <span className="bg-muted px-2 py-0.5 rounded text-[11px] ml-1">
                {tasks.filter(t => t.status === col.title).length}
              </span>
            </div>
          </div>

          {/* Kanban Cards */}
          {tasks.filter(t => t.status === col.title).map(task => (
            <div key={task.id} className="bg-white dark:bg-[#09090b] border border-border p-3.5 rounded-xl shadow-sm group">
              
              <div className="flex justify-between items-start mb-2 relative">
                <h3 className="text-[14px] font-medium leading-snug pr-6">{task.title}</h3>
                
                {/* ACTION MENU BUTTON */}
                <button 
                  onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)} 
                  className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-primary transition-opacity absolute right-0 top-0 p-1"
                >
                  <MoreHorizontal size={14}/>
                </button>

                {/* DROPDOWN MENU */}
                {openMenuId === task.id && (
                  <div className="absolute right-0 top-6 w-32 bg-white dark:bg-[#18181b] border border-border rounded-lg shadow-lg py-1 z-[100]">
                    <button 
                      onClick={() => { onEdit(task); setOpenMenuId(null); }} 
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] hover:bg-muted transition-colors text-foreground"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button 
                      onClick={() => { onDelete(task.id); setOpenMenuId(null); }} 
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 transition-colors"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-4">
                {visibleFields.members && (
                  <div className="flex items-center gap-1.5">
                    <img src="/avatar.png" alt="" className="w-5 h-5 rounded-full border border-background bg-gray-200" />
                    <span className="text-[12px] text-muted-foreground">{task.members?.[0] || 'Unassigned'}</span>
                  </div>
                )}
                {visibleFields.dueDate && task.dueDate && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-red-50 dark:bg-red-950/30 text-red-600 rounded text-[11px] font-medium">
                    📅 {task.dueDate}
                  </div>
                )}
              </div>

              {/* Tags & Priority Row */}
              <div className="flex flex-wrap gap-2 mt-3 items-center">
                {visibleFields.priority && task.priority !== 'No Priority' && (
                  <span className="text-[11px] font-semibold text-red-500 border border-red-200 dark:border-red-900 px-1.5 py-0.5 rounded">
                    {task.priority}
                  </span>
                )}
                {visibleFields.tags && task.tags?.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-muted rounded-[6px] text-[11px] text-muted-foreground">
                    <span className="w-2 h-2 rounded-full border border-current opacity-50" /> {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}