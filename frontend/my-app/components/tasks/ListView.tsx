'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, MoreHorizontal, Plus, Edit2, Trash2 } from 'lucide-react';
import { TaskData } from '@/lib/api';
import { VisibleFields } from '@/app/(dashboard)/tasks/page';

interface ListViewProps {
  tasks: TaskData[];
  visibleFields: VisibleFields;
  onEdit: (task: TaskData) => void;
  onDelete: (id: number) => void;
}

export function ListView({ tasks, visibleFields, onEdit, onDelete }: ListViewProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // PRO FIX: Click-outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target as Element).closest('.action-menu-container')) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPriorityColor = (p: string) => {
    if (p === 'Urgent' || p === 'High') return 'text-red-500';
    if (p === 'Medium') return 'text-orange-500';
    return 'text-muted-foreground';
  };

  const TableHeader = () => (
    <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#e4e4e7] dark:border-[#27272a] text-[12px] font-semibold text-muted-foreground bg-[#fafafa] dark:bg-[#18181b]/50 rounded-t-[12px]">
      <div className="col-span-6">Task</div>
      {visibleFields.priority && <div className="col-span-2">Priority</div>}
      {visibleFields.members && <div className="col-span-2">Members</div>}
      <div className="col-span-2 text-right">Actions</div>
    </div>
  );

  const Section = ({ title }: { title: string }) => {
    const sectionTasks = tasks.filter(t => t.status === title);
    
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 px-2 text-[14px] font-semibold text-foreground tracking-tight cursor-pointer w-max hover:text-muted-foreground transition-colors">
          <ChevronDown size={15} /> {title}
        </div>
        
        <div className="border border-[#e4e4e7] dark:border-[#27272a] rounded-[12px] bg-white dark:bg-[#09090b] overflow-visible shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
          <TableHeader />
          {sectionTasks.map((row) => (
            <div key={row.id} className="grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-[#e4e4e7] dark:border-[#27272a] last:border-0 items-center hover:bg-[#fafafa] dark:hover:bg-[#18181b]/50 transition-colors">
              <div className="col-span-6 text-[13px] font-medium text-foreground">{row.title}</div>
              
              {visibleFields.priority && (
                <div className={`col-span-2 flex items-center gap-2 text-[13px] font-medium ${getPriorityColor(row.priority)}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 22V14M12 22V8M20 22V2" strokeLinecap="round" />
                  </svg>
                  {row.priority}
                </div>
              )}
              
              {visibleFields.members && (
                <div className="col-span-2 flex items-center">
                  {row.members && row.members.length > 0 ? (
                    row.members.map((m, i) => (
                      <div key={i} className={`w-6 h-6 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-[10px] font-bold uppercase shadow-sm ring-2 ring-white dark:ring-[#09090b] ${i > 0 ? '-ml-2' : ''}`}>
                        {m.charAt(0)}
                      </div>
                    ))
                  ) : <span className="text-muted-foreground text-[12px]">-</span>}
                </div>
              )}
              
              <div className="col-span-2 flex justify-end text-muted-foreground relative action-menu-container">
                <button onClick={() => setOpenMenuId(openMenuId === row.id ? null : row.id)} className="p-1.5 hover:bg-muted rounded-md focus:outline-none hover:text-foreground transition-colors">
                  <MoreHorizontal size={15}/>
                </button>
                
                {openMenuId === row.id && (
                  <div className="absolute right-0 top-8 w-[140px] bg-white dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] rounded-[12px] shadow-xl py-1.5 z-[100] animate-in fade-in zoom-in-95 duration-200">
                    <button onClick={() => { onEdit(row); setOpenMenuId(null); }} className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[13px] font-medium hover:bg-muted transition-colors text-foreground">
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => { onDelete(row.id); setOpenMenuId(null); }} className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[13px] font-medium hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 transition-colors">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          <div className="px-6 py-3.5 flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:bg-[#fafafa] dark:hover:bg-[#18181b]/50 cursor-pointer rounded-b-[12px] transition-colors border-t border-[#e4e4e7] dark:border-[#27272a]">
            <Plus size={15} /> Add Task
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto pr-2 pb-10">
      <Section title="Backlog" />
      <Section title="To Do" />
      <Section title="Doing" />
      <Section title="Completed" />
      <Section title="On Hold" />
    </div>
  );
}