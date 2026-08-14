'use client';

import { useState } from 'react';
import { Lock, Eye, Share, MoreHorizontal, PanelRightClose, Plus, Paperclip, Send, Clock, History } from 'lucide-react';

export default function TaskDetailPage() {
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#09090b] overflow-hidden">
      
      {/* Top Action Bar */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-border">
        <div className="flex items-center gap-2 text-[14px] text-muted-foreground">
          <PanelRightClose size={18} className="cursor-pointer hover:text-foreground transition-colors" />
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors"><Lock size={14}/></button>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 border border-border rounded-lg text-primary bg-primary/10 text-[13px] font-medium transition-colors">
            <Eye size={14} /> 1
          </button>
          <button className="p-1.5 border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors"><Share size={14}/></button>
          <button className="p-1.5 border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors"><MoreHorizontal size={14}/></button>
          <div className="w-[1px] h-4 bg-border mx-1"></div>
          <button className="p-1.5 border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors"><PanelRightClose size={14} className="rotate-180"/></button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Details & Subtasks */}
        <div className="flex-1 overflow-y-auto p-8 pr-4">
          <h1 className="text-[28px] font-semibold tracking-tight mb-2 text-foreground">Write API Documentation</h1>
          <p className="text-[14px] text-muted-foreground mb-8 leading-relaxed">
            Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.
          </p>

          {/* Inline Properties */}
          <div className="space-y-4 mb-8 text-[13px]">
            <div className="flex items-center gap-8">
              <span className="w-24 font-medium text-foreground">Properties</span>
              <div className="flex items-center gap-2">
                 <div className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-md text-muted-foreground"><div className="w-4 h-4 rounded-full bg-gray-200 text-[10px] flex items-center justify-center font-bold text-black">A</div> Designer</div>
                 <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 dark:bg-red-950/30 text-red-600 rounded-md">📅 31 Jul</div>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <span className="w-24 font-medium text-foreground">Labels</span>
              <div className="flex items-center gap-2 flex-wrap">
                 {['Research', 'Design', 'Development', 'Testing', 'Deployment'].map(label => (
                   <span key={label} className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-md text-muted-foreground"><span className="w-2 h-2 border border-current rounded-full opacity-50" /> {label}</span>
                 ))}
              </div>
            </div>
            <div className="flex items-center gap-8">
              <span className="w-24 font-medium text-foreground">Resources</span>
              <span className="text-muted-foreground cursor-pointer hover:text-foreground">@ Add document or link...</span>
            </div>
          </div>

          {/* Subtasks Accordion */}
          <div className="mb-8">
            <div className="flex items-center gap-2 font-semibold text-[14px] mb-4 text-foreground cursor-pointer">
              <span className="w-4 h-4 flex items-center justify-center border border-border rounded shadow-sm text-[10px]">▼</span> Subtasks
            </div>
            
            <div className="border border-border rounded-xl bg-white dark:bg-[#09090b] overflow-hidden shadow-sm">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-border text-[12px] font-medium text-muted-foreground bg-muted/30">
                <div className="col-span-5">Task</div>
                <div className="col-span-2">Priority</div>
                <div className="col-span-2">Members</div>
                <div className="col-span-2">Due Date</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
              
              {/* Subtask Rows */}
              {[
                { id: 1, title: 'Subtask 1', priority: 'High', pColor: 'text-red-500', members: 'avatar', date: '12 Sep 2026' },
                { id: 2, title: 'Subtask 2', priority: 'Low', pColor: 'text-gray-400', members: 'CN', date: '15 Sep 2026' },
                { id: 3, title: 'Subtask 3', priority: 'Medium', pColor: 'text-orange-500', members: '+', date: '18 Sep 2026' },
              ].map(sub => (
                <div key={sub.id} className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border last:border-0 items-center text-[13px] hover:bg-muted/50 transition-colors">
                  <div className="col-span-5 font-medium">{sub.title}</div>
                  <div className={`col-span-2 flex items-center gap-1.5 ${sub.pColor}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 22V14M12 22V8M20 22V2" strokeLinecap="round" /></svg>
                    {sub.priority}
                  </div>
                  <div className="col-span-2">
                     {sub.members === 'avatar' ? <img src="/avatar.png" className="w-5 h-5 rounded-full border border-background" /> :
                      sub.members === 'CN' ? <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-600">CN</div> :
                      <div className="w-5 h-5 rounded-full border border-dashed border-border flex items-center justify-center text-muted-foreground"><Plus size={10}/></div>}
                  </div>
                  <div className="col-span-2 text-muted-foreground">{sub.date}</div>
                  <div className="col-span-1 flex justify-end text-muted-foreground"><MoreHorizontal size={14}/></div>
                </div>
              ))}
              <div className="px-4 py-2 flex items-center gap-2 text-[13px] text-muted-foreground hover:bg-muted/50 cursor-pointer font-medium">
                <Plus size={14} /> Add Subtasks
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <h3 className="font-semibold text-[14px] mb-4 text-foreground">Subtasks</h3>
          <div className="space-y-4 mb-8">
            <div className="flex gap-3">
              <img src="/avatar.png" className="w-8 h-8 rounded-full border border-border" />
              <div className="flex-1 border border-border rounded-xl p-3 shadow-sm bg-white dark:bg-[#09090b]">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-foreground">Ankit Dutta</span>
                    <span className="text-[12px] text-muted-foreground">just now</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <History size={14} /> <MoreHorizontal size={14} />
                  </div>
                </div>
                <p className="text-[13px] text-foreground mb-4">dsds</p>
                <div className="flex items-center gap-2 relative">
                  <img src="/avatar.png" className="w-6 h-6 rounded-full absolute left-2 top-1/2 -translate-y-1/2 border border-border" />
                  <input type="text" placeholder="Leave a reply..." className="w-full text-[13px] bg-muted/50 border border-border rounded-full py-1.5 pl-10 pr-10 focus:outline-none focus:ring-1 focus:ring-primary" />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-muted-foreground">
                    <Paperclip size={14} /> <Send size={14} />
                  </div>
                </div>
              </div>
            </div>
            {/* Main Comment Input */}
            <div className="relative border border-border rounded-xl p-3 shadow-sm bg-white dark:bg-[#09090b]">
               <input type="text" placeholder="Add a comment..." className="w-full text-[13px] bg-transparent focus:outline-none py-1" />
               <div className="flex justify-between items-center mt-8 pt-2">
                 <div />
                 <div className="flex items-center gap-3 text-muted-foreground">
                   <Paperclip size={16} className="cursor-pointer hover:text-foreground" />
                   <Send size={16} className="cursor-pointer hover:text-foreground" />
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details Panel */}
        <div className="w-[320px] border-l border-border bg-[#fafafa] dark:bg-[#09090b] flex flex-col">
           {/* Rendered in Step 8 below */}
           <DetailsPanel sidebarPriorityOpen={priorityOpen} setSidebarPriorityOpen={setPriorityOpen} dateOpen={dateOpen} setDateOpen={setDateOpen} />
        </div>
      </div>
    </div>
  );
}