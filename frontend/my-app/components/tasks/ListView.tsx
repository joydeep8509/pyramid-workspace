import { useState } from 'react';
import { ChevronDown, MoreHorizontal, Plus, Edit2, Trash2 } from 'lucide-react';
import { TaskData, api } from '@/lib/api';
import { VisibleFields } from '@/app/(dashboard)/tasks/page';

interface ListViewProps {
  tasks: TaskData[];
  visibleFields: VisibleFields;
  onEdit: (task: TaskData) => void;
  onDelete: (id: number) => void;
}

export function ListView({ tasks, visibleFields, onEdit, onDelete }: ListViewProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null); // Tracks which menu is open

  const getPriorityColor = (p: string) => {
    if (p === 'Urgent' || p === 'High') return 'text-red-500';
    if (p === 'Medium') return 'text-orange-500';
    return 'text-gray-400';
  };

  const TableHeader = () => (
    <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-border text-[12px] font-medium text-muted-foreground">
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
        <div className="flex items-center gap-2 mb-2 px-2 text-[14px] font-semibold text-foreground">
          <ChevronDown size={14} /> {title} <span className="text-muted-foreground font-normal text-[12px]">({sectionTasks.length})</span>
        </div>
        <div className="border border-border rounded-xl bg-white dark:bg-[#09090b] overflow-visible">
          <TableHeader />
          {sectionTasks.map((row) => (
            <div key={row.id} className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border last:border-0 items-center hover:bg-muted/50 transition-colors">
              <div className="col-span-6 text-[13px] font-medium">{row.title}</div>
              
              {visibleFields.priority && (
                <div className="col-span-2 flex items-center gap-1.5 text-[13px]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={getPriorityColor(row.priority)}>
                    <path d="M4 22V14M12 22V8M20 22V2" strokeLinecap="round" />
                  </svg>
                  <span className={getPriorityColor(row.priority)}>{row.priority}</span>
                </div>
              )}
              
              {visibleFields.members && (
                <div className="col-span-2">
                  <img src="/avatar.png" className="w-6 h-6 rounded-full border border-background bg-gray-200" alt="member" />
                </div>
              )}
              
              {/* ACTION MENU */}
              <div className="col-span-2 flex justify-end text-muted-foreground relative">
                <button onClick={() => setOpenMenuId(openMenuId === row.id ? null : row.id)} className="p-1 hover:bg-border rounded focus:outline-none">
                  <MoreHorizontal size={14}/>
                </button>
                
                {openMenuId === row.id && (
                  <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-[#18181b] border border-border rounded-lg shadow-lg py-1 z-[100]">
                    <button onClick={() => { onEdit(row); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] hover:bg-muted transition-colors text-foreground">
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => { onDelete(row.id); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 transition-colors">
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
  };

  return (
    <div className="h-full overflow-y-auto pr-2 pb-10">
      <Section title="To Do" />
      <Section title="Doing" />
      <Section title="Completed" />
    </div>
  );
}