'use client'; 
import { useState, useEffect } from 'react'; 
import { Plus, MoreHorizontal, Edit2, Trash2 } from 'lucide-react'; 
import { TaskData } from '@/lib/api'; 
import { VisibleFields } from '@/app/(dashboard)/tasks/page'; 

interface BoardViewProps {   
  tasks: TaskData[];   
  onUpdate: () => void;   
  visibleFields: VisibleFields;   
  onEdit: (task: TaskData) => void;   
  onDelete: (id: number) => void; 
}

export function BoardView({ tasks, onUpdate, visibleFields, onEdit, onDelete }: BoardViewProps) {   
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);    
  
  useEffect(() => {     
    const handleClickOutside = (e: MouseEvent) => {       
      if (!(e.target as Element).closest('.action-menu-container')) {         
        setOpenMenuId(null);       
      }     
    };     
    document.addEventListener('mousedown', handleClickOutside);     
    return () => document.removeEventListener('mousedown', handleClickOutside);   
  }, []);   

  const columns = [     
    { title: 'Backlog', icon: ' ', dot: 'bg-gray-400' },     
    { title: 'To Do', icon: ' ', dot: 'bg-[#e4e4e7] dark:bg-[#27272a]' },      
    { title: 'Doing', icon: ' ', dot: 'bg-primary' },      
    { title: 'Completed', icon: ' ', dot: 'bg-emerald-500' },      
    { title: 'On Hold', icon: ' ', dot: 'bg-orange-500' }   
  ];   

  return (     
    <div className="flex h-full gap-4 md:gap-6 overflow-x-auto pb-4 items-start snap-x snap-mandatory md:snap-none">       
      {columns.map(col => (         
        <div key={col.title} className="w-[280px] md:w-[310px] shrink-0 flex flex-col gap-3 snap-center">                      
          <div className="flex items-center justify-between group mb-1">             
            <div className="flex items-center gap-2 text-[14px] font-semibold text-foreground tracking-tight">               
              <span className="text-muted-foreground/50">{col.icon}</span> {col.title}               
              <span className="text-muted-foreground font-normal text-[12px] ml-1">                 
                {tasks.filter(t => t.status === col.title).length}               
              </span>             
            </div>             
            <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">               
              <button className="p-1.5 hover:bg-[#e4e4e7] dark:hover:bg-[#27272a] rounded-md text-muted-foreground transition-colors"><Plus size={15}/></button>               
              <button className="p-1.5 hover:bg-[#e4e4e7] dark:hover:bg-[#27272a] rounded-md text-muted-foreground transition-colors"><MoreHorizontal size={15}/></button>             
            </div>           
          </div>           
          {tasks.filter(t => t.status === col.title).map(task => (             
            <div key={task.id} className="bg-white dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] p-[16px] rounded-[12px] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] group hover:shadow-md transition-all duration-200">                                        
              <div className="flex justify-between items-start mb-3 relative action-menu-container">                 
                <h3 className="text-[14px] font-semibold leading-snug pr-8 text-foreground">{task.title}</h3>                                  
                <button                    
                  onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}                    
                  className="text-muted-foreground opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:text-foreground transition-opacity absolute -right-2 -top-2 p-1.5 rounded-md hover:bg-muted"                 
                >                   
                  <MoreHorizontal size={15}/>                 
                </button>                 
                {openMenuId === task.id && (                   
                  <div className="absolute right-0 top-6 w-[140px] bg-white dark:bg-[#09090b] border border-[#e4e4e7] dark:border-[#27272a] rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">                     
                    <button                        
                      onClick={() => { onEdit(task); setOpenMenuId(null); }}                        
                      className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[13px] font-medium hover:bg-muted transition-colors text-foreground"                     
                    >                       
                      <Edit2 size={14} /> Edit                     
                    </button>                     
                    <button                        
                      onClick={() => { onDelete(task.id); setOpenMenuId(null); }}                        
                      className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[13px] font-medium hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 transition-colors"                     
                    >                       
                      <Trash2 size={14} /> Delete                     
                    </button>                   
                  </div>                 
                )}               
              </div>                              
              <div className="flex items-center justify-between mt-4 mb-1">                 
                {visibleFields.members && (                   
                  <div className="flex items-center gap-1.5">                     
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-[10px] font-bold uppercase shadow-sm">                       
                      {task.members?.[0] ? task.members[0].charAt(0) : 'A'}                     
                    </div>                     
                    <span className="text-[12px] font-medium text-muted-foreground">{task.members?.[0] || 'Unassigned'}</span>                   
                  </div>                 
                )}                 
                {visibleFields.dueDate && task.dueDate && (                   
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-[#fafafa] dark:bg-[#27272a] text-muted-foreground rounded-md text-[11px] font-medium border border-[#e4e4e7] dark:border-[#27272a]">                       
                    {task.dueDate}                   
                  </div>                 
                )}               
              </div>               
              <div className="flex flex-wrap gap-2 mt-3 items-center">                 
                {visibleFields.priority && task.priority !== 'No Priority' && (                   
                  <span className={`text-[11px] font-semibold px-2 py-1 rounded-[6px] ${task.priority === 'Urgent' || task.priority === 'High' ? 'bg-red-50 dark:bg-red-950/30 text-red-500 border border-red-100 dark:border-red-900/50' : 'bg-orange-50 dark:bg-orange-950/30 text-orange-500 border border-orange-100 dark:border-orange-900/50'}`}>                     
                    {task.priority}                   
                  </span>                 
                )}                 
                {visibleFields.tags && task.tags?.map(tag => (                   
                  <span key={tag} className="flex items-center gap-1.5 px-2.5 py-1 bg-[#fafafa] dark:bg-[#27272a] border border-[#e4e4e7] dark:border-[#3f3f46] rounded-[6px] text-[11px] font-medium text-muted-foreground">                     
                    <span className="w-1.5 h-1.5 rounded-full border border-current opacity-50" /> {tag}                   
                  </span>                 
                ))}               
              </div>             
            </div>           
          ))}           
          <button className="w-full py-2.5 flex items-center justify-center gap-2 text-[13px] font-medium text-muted-foreground hover:bg-[#e4e4e7]/50 dark:hover:bg-[#27272a]/50 rounded-[12px] transition-colors border border-dashed border-[#e4e4e7] dark:border-[#27272a] mt-1">             
            <Plus size={14} /> Add Task           
          </button>         
        </div>       
      ))}     
    </div>   
  );
}
