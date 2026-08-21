'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Lock, Eye, Share, MoreHorizontal, PanelRightClose, PanelLeftClose, 
  Plus, Settings, ChevronDown, Paperclip, Send, History, Tag, Trash2, Check, X,
  Calendar, ChevronLeft, ChevronRight, Users
} from 'lucide-react';
import { api, TaskData } from '@/lib/api';

interface ExtendedTaskData extends TaskData {
  startDate?: string;
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  
  const [task, setTask] = useState<ExtendedTaskData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [calendarMode, setCalendarMode] = useState<'start' | 'end' | null>(null);
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [isEditingMembers, setIsEditingMembers] = useState(false);
  const [editMembers, setEditMembers] = useState('');
  
  const [subtasks, setSubtasks] = useState([
    { id: 1, title: 'Subtask 1', priority: 'High', date: '12 Sep 2026', members: 'avatar' },
    { id: 2, title: 'Subtask 2', priority: 'Low', date: '15 Sep 2026', members: 'CN' },
    { id: 3, title: 'Subtask 3', priority: 'Medium', date: '18 Sep 2026', members: '+' },
  ]);

  useEffect(() => {
    if (!taskId) return;
    api.getTaskById(taskId)
      .then(data => {
        setTask(data);
        setEditTitle(data.title);
        setEditMembers(data.members?.join(', ') || '');
      })
      .catch(err => {
        console.error("Failed to load task:", err);
        router.push('/tasks');
      })
      .finally(() => setIsLoading(false));
  }, [taskId, router]);

  const handleUpdateTask = async (field: string, value: any) => {
    if (!task) return;
    const originalTask = { ...task };
    setTask({ ...task, [field]: value });
    try {
      await api.updateTask(task.id, { [field]: value });
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
      setTask(originalTask); 
    }
  };

  const handleSelectDate = (day: number, monthName: string, year: number) => {
    const formattedDate = `${day.toString().padStart(2, '0')} ${monthName} ${year}`;
    if (calendarMode === 'start') {
      handleUpdateTask('startDate', formattedDate);
    } else {
      handleUpdateTask('dueDate', formattedDate);
    }
    setCalendarMode(null);
  };

  const formatShortDate = (dateStr?: string, fallback = 'Set') => {
    if (!dateStr) return fallback;
    try {
      const parts = dateStr.split(' ');
      if (parts.length === 3) return `${parts[1]} ${parseInt(parts[0])}`;
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const saveTitle = () => {
    if (editTitle.trim() && editTitle !== task?.title) handleUpdateTask('title', editTitle);
    setIsEditingTitle(false);
  };

  const handleAddLabel = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newLabel.trim()) {
      const currentTags = task?.tags || [];
      handleUpdateTask('tags', [...currentTags, newLabel.trim()]);
      setNewLabel('');
      setIsAddingLabel(false);
    }
  };

  const removeLabel = (labelToRemove: string) => {
    const updatedTags = task?.tags?.filter(t => t !== labelToRemove) || [];
    handleUpdateTask('tags', updatedTags);
  };

  const saveMembers = () => {
    const membersArray = editMembers.split(',').map(m => m.trim()).filter(Boolean);
    handleUpdateTask('members', membersArray);
    setIsEditingMembers(false);
  };

  const updateSubtask = (id: number, field: string, value: string) => {
    setSubtasks(subtasks.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const cycleSubtaskPriority = (id: number, currentPriority: string) => {
    const map: Record<string, string> = { 'High': 'Medium', 'Medium': 'Low', 'Low': 'High' };
    updateSubtask(id, 'priority', map[currentPriority] || 'High');
  };

  const addEmptySubtask = () => {
    setSubtasks([...subtasks, { id: Date.now(), title: '', priority: 'Low', date: '', members: '+' }]);
  };

  if (isLoading || !task) return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading task details...</div>;

  const PriorityIcon = ({ p, className = "" }: { p: string, className?: string }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
      <path d="M4 22V14M12 22V8M20 22V2" strokeLinecap="round" />
    </svg>
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#09090b] overflow-hidden">
      
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#09090b] shrink-0 overflow-x-auto">
        <button type="button" onClick={() => router.push('/tasks')} className="p-1.5 text-muted-foreground hover:bg-muted rounded-md transition-colors shrink-0">
          <PanelLeftClose size={18} />
        </button>
        <div className="flex items-center gap-2 min-w-max">
          <button type="button" className="p-1.5 border border-[#e4e4e7] dark:border-[#27272a] rounded-[8px] text-muted-foreground hover:bg-muted"><Lock size={15}/></button>
          <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 border border-primary/20 rounded-[8px] text-primary bg-primary/5 text-[13px] font-semibold transition-colors">
            <Eye size={15} /> 1
          </button>
          <button type="button" className="p-1.5 border border-[#e4e4e7] dark:border-[#27272a] rounded-[8px] text-muted-foreground hover:bg-muted hidden sm:block"><Share size={15}/></button>
          <button type="button" className="p-1.5 border border-[#e4e4e7] dark:border-[#27272a] rounded-[8px] text-muted-foreground hover:bg-muted"><MoreHorizontal size={15}/></button>
          <div className="w-[1px] h-5 bg-[#e4e4e7] dark:bg-[#27272a] mx-1"></div>
          <button type="button" className="p-1.5 border border-[#e4e4e7] dark:border-[#27272a] rounded-[8px] text-muted-foreground hover:bg-muted"><PanelRightClose size={15} className="rotate-180"/></button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        <div className="flex-1 overflow-y-auto p-4 md:p-10 md:pr-6">
          
          <div className="mb-8">
            {isEditingTitle ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <input
                  type="text" autoFocus
                  value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
                  className="text-[26px] font-semibold tracking-tight text-foreground bg-transparent border-b-2 border-primary focus:outline-none w-full max-w-2xl"
                />
                <div className="flex gap-2">
                  <button onClick={saveTitle} className="p-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"><Check size={16}/></button>
                  <button onClick={() => { setIsEditingTitle(false); setEditTitle(task.title); }} className="p-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80"><X size={16}/></button>
                </div>
              </div>
            ) : (
              <h1 onClick={() => setIsEditingTitle(true)} className="text-[26px] font-semibold tracking-tight text-foreground cursor-pointer hover:bg-muted/30 p-1 -ml-1 rounded-lg w-max max-w-full truncate transition-colors">
                {task.title}
              </h1>
            )}
          </div>

          <p className="text-[14px] text-muted-foreground mb-10 leading-relaxed max-w-3xl">
            Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.((Hover over the text for editing))
          </p>

          <div className="space-y-4 mb-10 text-[13px]">
            <div className="grid grid-cols-[100px_1fr] items-center">
              <span className="font-semibold text-foreground">Properties</span>
              <div className="flex flex-wrap items-center gap-2">
                 <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#fafafa] dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] rounded-[6px] text-foreground font-medium">
                   <div className="w-4 h-4 rounded-full bg-[#e4e4e7] dark:bg-[#27272a] flex items-center justify-center font-bold text-[10px] text-muted-foreground">A</div> Designer
                 </div>
                 <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 dark:bg-red-950/30 text-red-600 rounded-[6px] font-medium border border-red-100 dark:border-red-900/50">
                     31 Jul
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-start sm:items-center min-h-[30px]">
              <span className="font-semibold text-foreground mt-1.5 sm:mt-0">Labels</span>
              <div className="flex items-center gap-2 flex-wrap mt-1 sm:mt-0">
                 {task.tags?.map(label => (
                   <span key={label} className="group flex items-center gap-1.5 px-2.5 py-1 bg-[#fafafa] dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] rounded-[6px] text-muted-foreground font-medium">
                     <Tag size={12} className="opacity-50" /> {label}
                     <button onClick={() => removeLabel(label)} className="opacity-100 sm:opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"><X size={12}/></button>
                   </span>
                 ))}
                 
                 {isAddingLabel ? (
                    <input
                      type="text" autoFocus
                      value={newLabel} onChange={(e) => setNewLabel(e.target.value)}
                      onKeyDown={handleAddLabel} onBlur={() => setIsAddingLabel(false)}
                      placeholder="Type & Enter..."
                      className="border border-primary rounded-md px-2 py-1 bg-transparent focus:outline-none w-28 text-[12px]"
                    />
                 ) : (
                    <button onClick={() => setIsAddingLabel(true)} className="flex items-center gap-1 px-2.5 py-1 border border-dashed border-border rounded-[6px] text-muted-foreground hover:bg-muted transition-colors text-[12px] font-medium">
                      <Plus size={12} /> Add label
                    </button>
                 )}
              </div>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center">
              <span className="font-semibold text-foreground">Resources</span>
              <span className="text-muted-foreground cursor-pointer hover:text-foreground">@ Add document or link...</span>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-center gap-2 font-semibold text-[15px] mb-4 text-foreground tracking-tight">
              <ChevronDown size={16} /> Subtasks
            </div>
            
            <div className="border border-[#e4e4e7] dark:border-[#27272a] rounded-[12px] bg-white dark:bg-[#09090b] shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#e4e4e7] dark:border-[#27272a] text-[12px] font-semibold text-muted-foreground bg-[#fafafa] dark:bg-[#18181b]/50">
                  <div className="col-span-5">Task</div>
                  <div className="col-span-2">Priority</div>
                  <div className="col-span-2">Members</div>
                  <div className="col-span-2">Due Date</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                
                {subtasks.map(sub => (
                  <div key={sub.id} className="grid grid-cols-12 gap-4 px-5 py-2.5 border-b border-[#e4e4e7] dark:border-[#27272a] last:border-0 items-center text-[13px] hover:bg-[#fafafa] dark:hover:bg-[#18181b]/50 transition-colors group">
                    <div className="col-span-5">
                      <input
                        value={sub.title} onChange={(e) => updateSubtask(sub.id, 'title', e.target.value)}
                        placeholder="Task name..."
                        className="bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-border rounded px-1 w-full font-medium text-foreground"
                      />
                    </div>
                    <div className="col-span-2">
                      <button onClick={() => cycleSubtaskPriority(sub.id, sub.priority)} className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-muted ${sub.priority === 'High' ? 'text-red-500' : sub.priority === 'Medium' ? 'text-orange-500' : 'text-muted-foreground'} font-medium w-full text-left`}>
                        <PriorityIcon p={sub.priority} /> {sub.priority}
                      </button>
                    </div>
                    <div className="col-span-2">
                        {sub.members === 'avatar' ? <img src="/avatar.png" className="w-6 h-6 rounded-full border border-background bg-primary/20" alt="member" /> :
                        sub.members === 'CN' ? <div className="w-6 h-6 rounded-full bg-[#e4e4e7] dark:bg-[#27272a] flex items-center justify-center text-[10px] font-bold text-foreground">CN</div> :
                        <div className="w-6 h-6 rounded-full border border-dashed border-[#e4e4e7] dark:border-[#27272a] flex items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted"><Plus size={12}/></div>}
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={sub.date} onChange={(e) => updateSubtask(sub.id, 'date', e.target.value)}
                        placeholder="DD MMM YYYY"
                        className="bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-border rounded px-1 w-full text-muted-foreground"
                      />
                    </div>
                    <div className="col-span-1 flex justify-end text-muted-foreground">
                      <button type="button" onClick={() => setSubtasks(subtasks.filter(s => s.id !== sub.id))} className="opacity-100 md:opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all p-1.5"><Trash2 size={15}/></button>
                    </div>
                  </div>
                ))}
                
                <div onClick={addEmptySubtask} className="px-5 py-3 flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:bg-[#fafafa] dark:hover:bg-[#18181b]/50 cursor-pointer transition-colors">
                  <Plus size={15} /> Add Subtasks
                </div>
              </div>
            </div>
          </div>

          <h3 className="font-semibold text-[15px] mb-4 text-foreground tracking-tight">Updates</h3>
          <div className="space-y-4">
            <div className="flex gap-3 sm:gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center text-[12px] font-bold text-primary shrink-0">A</div>
              <div className="flex-1 border border-[#e4e4e7] dark:border-[#27272a] rounded-[12px] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] bg-white dark:bg-[#09090b]">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-[13px] font-semibold text-foreground">Ankit Dutta</span>
                    <span className="text-[12px] text-muted-foreground">just now</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <History size={15} /> <MoreHorizontal size={15} />
                  </div>
                </div>
                <p className="text-[13px] text-foreground mb-5">dsds</p>
                <div className="flex items-center gap-3 relative">
                  <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 absolute left-2 top-1/2 -translate-y-1/2">D</div>
                  <input type="text" placeholder="Leave a reply..." className="w-full text-[13px] bg-[#fafafa] dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] rounded-full py-2 pl-12 pr-12 focus:outline-none focus:ring-1 focus:ring-primary transition-all" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
                    <Paperclip size={15} /> <Send size={15} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative border border-[#e4e4e7] dark:border-[#27272a] rounded-[12px] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] bg-white dark:bg-[#09090b] mt-6">
               <input type="text" placeholder="Add a comment..." className="w-full text-[13px] bg-transparent focus:outline-none py-1" />
               <div className="flex justify-between items-center mt-10 pt-2 border-t border-transparent">
                 <div />
                 <div className="flex items-center gap-3 text-muted-foreground">
                   <Paperclip size={16} className="cursor-pointer hover:text-foreground" />
                   <Send size={16} className="cursor-pointer hover:text-foreground" />
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[340px] border-t lg:border-t-0 lg:border-l border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#09090b] p-4 md:p-5 overflow-y-auto space-y-5 shrink-0">
          
          <div className="bg-white dark:bg-[#09090b] border border-[#e4e4e7] dark:border-[#27272a] rounded-[12px] shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] overflow-visible">
            <div className="flex items-center justify-between p-3.5 border-b border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#18181b]/50 rounded-t-[12px]">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground tracking-tight">
                <ChevronDown size={16} /> Details
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Plus size={15} className="cursor-pointer hover:text-foreground" />
                <Settings size={15} className="cursor-pointer hover:text-foreground" />
              </div>
            </div>
            <div className="p-4 space-y-5 text-[13px] font-medium">
              
              <div className="grid grid-cols-[90px_1fr] items-center relative">
                <span className="text-muted-foreground">Status</span>
                <button type="button" onClick={() => setStatusOpen(!statusOpen)} className="flex w-max items-center gap-2 -ml-2 px-2 py-1.5 rounded-md transition-colors hover:bg-muted text-foreground">
                  <span className={`w-2.5 h-2.5 rounded-full ${task.status === 'Completed' ? 'bg-emerald-500' : task.status === 'Doing' ? 'bg-blue-500' : task.status === 'On Hold' ? 'bg-orange-500' : 'bg-orange-500'}`} />
                  {task.status || 'Backlog'}
                </button>
                {statusOpen && (
                  <div className="absolute left-0 md:left-[90px] top-full mt-1 w-[160px] bg-white dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] rounded-[12px] shadow-lg py-2 z-50 animate-in fade-in zoom-in-95">
                    {['Backlog', 'To Do', 'Doing', 'Completed', 'On Hold'].map(s => (
                      <button type="button" key={s} onClick={() => { setStatusOpen(false); handleUpdateTask('status', s); }} className="w-full flex items-center gap-3 px-4 py-2 text-[13px] font-medium transition-colors hover:bg-muted text-foreground">
                        <span className={`w-2 h-2 rounded-full ${s === 'Completed' ? 'bg-emerald-500' : s === 'Doing' ? 'bg-blue-500' : s === 'Backlog' || s === 'On Hold' ? 'bg-orange-500' : 'bg-gray-400'}`} /> {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-[90px_1fr] items-center relative">
                <span className="text-muted-foreground">Priority</span>
                <button type="button" onClick={() => setPriorityOpen(!priorityOpen)} className={`flex w-max items-center gap-2 -ml-2 px-2 py-1.5 rounded-md transition-colors ${task.priority === 'Urgent' || task.priority === 'High' ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30' : task.priority === 'Medium' ? 'text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30' : 'text-muted-foreground hover:bg-muted'}`}>
                  <PriorityIcon p={task.priority} />
                  {task.priority} <ChevronDown size={14} className="text-muted-foreground opacity-50 ml-1" />
                </button>
                {priorityOpen && (
                  <div className="absolute left-0 md:left-[90px] top-full mt-1 w-[180px] bg-white dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] rounded-[12px] shadow-lg py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-1.5 text-[11px] text-muted-foreground font-semibold mb-1">Priority</div>
                    {[ { name: 'No Priority', color: 'text-muted-foreground', dot: true }, { name: 'Urgent', color: 'text-red-500' }, { name: 'High', color: 'text-orange-500' }, { name: 'Medium', color: 'text-yellow-500' }, { name: 'Low', color: 'text-muted-foreground' } ].map(p => (
                      <button type="button" key={p.name} onClick={() => { setPriorityOpen(false); handleUpdateTask('priority', p.name); }} className={`w-full flex items-center justify-between px-4 py-2 text-[13px] font-medium transition-colors ${task.priority === p.name ? (p.name === 'Urgent' ? 'bg-red-50 dark:bg-red-950/30 text-red-600' : 'bg-muted text-foreground') : `hover:bg-[#fafafa] dark:hover:bg-[#27272a] ${p.color}`}`}>
                        <div className="flex items-center gap-3">
                          {p.dot ? <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground ml-1"/> : <PriorityIcon p={p.name} />}
                          {p.name}
                        </div>
                        {task.priority === p.name && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-[90px_1fr] items-center">
                <span className="text-muted-foreground">Members</span>
                {isEditingMembers ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text" autoFocus
                      value={editMembers} onChange={(e) => setEditMembers(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveMembers()}
                      placeholder="E.g., Dexter"
                      className="border border-[#e4e4e7] dark:border-[#27272a] rounded-md px-2 py-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary w-full"
                    />
                    <button onClick={saveMembers} className="p-1 bg-emerald-500 text-white rounded"><Check size={14}/></button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-1.5 cursor-pointer text-foreground hover:bg-muted p-1 -ml-1 rounded-md transition-colors w-max" onClick={() => setIsEditingMembers(true)}>
                    {task.members?.length ? (
                      <div className="flex flex-wrap items-center gap-2">
                        {task.members.map(m => (
                          <div key={m} className="flex items-center gap-1.5 bg-muted px-2 py-0.5 rounded text-foreground">
                            <div className="w-4 h-4 bg-primary/20 text-primary rounded-full flex items-center justify-center text-[9px] font-bold">{m.charAt(0)}</div>
                            {m}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <><Users size={14} className="text-foreground" /> Add members</>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-[90px_1fr] items-center relative">
                <span className="text-muted-foreground">Dates</span>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                  <button onClick={() => setCalendarMode(calendarMode === 'start' ? null : 'start')} className={`flex items-center gap-1.5 px-2.5 py-1.5 border rounded-[6px] text-[12px] transition-colors ${calendarMode === 'start' ? 'bg-muted border-border text-foreground' : 'bg-white dark:bg-[#18181b] border-[#e4e4e7] dark:border-[#27272a] text-foreground hover:bg-muted'}`}>
                    <Calendar size={12} className="text-muted-foreground" />
                    {formatShortDate(task.startDate, 'Jan 10')}
                  </button>
                  <span className="text-muted-foreground text-[12px] hidden sm:block"> </span>
                  <button onClick={() => setCalendarMode(calendarMode === 'end' ? null : 'end')} className={`flex items-center gap-1.5 px-2.5 py-1.5 border rounded-[6px] text-[12px] transition-colors ${calendarMode === 'end' ? 'bg-muted border-border text-foreground' : 'bg-white dark:bg-[#18181b] border-[#e4e4e7] dark:border-[#27272a] text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                    <Calendar size={12} className="opacity-50" />
                    {formatShortDate(task.dueDate, 'End')}
                  </button>
                </div>
                
                {calendarMode && (
                  <div className="absolute right-0 top-full mt-2 w-[260px] bg-white dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] rounded-[12px] shadow-lg p-4 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between mb-4">
                      <button className="p-1 hover:bg-muted rounded-md text-muted-foreground"><ChevronLeft size={16} /></button>
                      <span className="text-[13px] font-semibold text-foreground tracking-tight">January 2026</span>
                      <button className="p-1 hover:bg-muted rounded-md text-muted-foreground"><ChevronRight size={16} /></button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground mb-2">
                      <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-[12px] font-medium text-foreground">
                      {[30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3].map((day, i) => {
                        const isCurrentMonth = i >= 1 && i <= 31;
                        const isSelected = (calendarMode === 'start' && day === 10 && isCurrentMonth) || (calendarMode === 'end' && day === 24 && isCurrentMonth);
                        const isToday = day === 24 && isCurrentMonth;
                        return (
                          <button
                            key={i}
                            onClick={() => isCurrentMonth && handleSelectDate(day, 'Jan', 2026)}
                            className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center transition-colors
                              ${!isCurrentMonth ? 'text-muted-foreground/30 cursor-default' : 'hover:bg-muted'}
                              ${isSelected ? 'bg-black text-white dark:bg-white dark:text-black font-semibold' : ''}
                              ${isToday && !isSelected ? 'bg-muted/50 border border-border' : ''}
                            `}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-[90px_1fr] items-center">
                <span className="text-muted-foreground">Labels</span>
                <span className="text-muted-foreground">--</span>
              </div>
              <div className="grid grid-cols-[90px_1fr] items-center">
                <span className="text-muted-foreground">Teams</span>
                <span className="text-muted-foreground">--</span>
              </div>
              <div className="grid grid-cols-[90px_1fr] items-center">
                <span className="text-muted-foreground">Reporter</span>
                <div className="flex items-center gap-2 text-foreground">
                  <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[9px] font-bold">A</div> Admin
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#09090b] border border-[#e4e4e7] dark:border-[#27272a] rounded-[12px] shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] overflow-hidden">
             <div className="flex items-center justify-between p-3.5 border-b border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#18181b]/50">
               <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground tracking-tight">
                 <ChevronDown size={16} /> Updates
               </div>
             </div>
             <div className="p-4 space-y-5">
               <div className="flex gap-3">
                 <div className="w-7 h-7 rounded-full bg-red-50 dark:bg-red-950/30 text-red-500 flex items-center justify-center shrink-0">
                   <PriorityIcon p="Urgent" />
                 </div>
                 <div className="text-[13px] leading-snug">
                   <span className="font-semibold text-foreground">You </span>
                   <span className="text-muted-foreground">changed priority from No priority to Urgent</span>
                 </div>
               </div>
               <div className="flex gap-3">
                 <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">D</div>
                 <div className="text-[13px] leading-snug">
                   <span className="font-semibold text-foreground">You </span>
                   <span className="text-muted-foreground">posted an update Aug 2026</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
