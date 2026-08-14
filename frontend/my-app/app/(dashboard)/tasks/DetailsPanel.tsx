import { ChevronDown, Plus, Settings } from 'lucide-react';

export function DetailsPanel({ sidebarPriorityOpen, setSidebarPriorityOpen, dateOpen, setDateOpen }: any) {
  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      
      {/* Details Section */}
      <div className="bg-white dark:bg-[#09090b] border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
            <ChevronDown size={14} /> Details
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Plus size={14} className="cursor-pointer hover:text-foreground" />
            <Settings size={14} className="cursor-pointer hover:text-foreground" />
          </div>
        </div>

        <div className="p-3 space-y-4 text-[13px]">
          {/* Status */}
          <div className="grid grid-cols-3 items-center">
            <span className="text-muted-foreground">Status</span>
            <div className="col-span-2 flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-orange-500" /> Backlog
            </div>
          </div>

          {/* Priority (With Dropdown specific to 122447_2) */}
          <div className="grid grid-cols-3 items-center relative">
            <span className="text-muted-foreground">Priority</span>
            <div className="col-span-2">
              <button 
                onClick={() => setSidebarPriorityOpen(!sidebarPriorityOpen)}
                className="flex items-center gap-1.5 text-red-500 font-medium hover:bg-muted px-1.5 py-0.5 rounded -ml-1.5 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 22V14M12 22V8M20 22V2" strokeLinecap="round" /></svg>
                High <ChevronDown size={12} className="text-muted-foreground" />
              </button>

              {/* Priority Popover */}
              {sidebarPriorityOpen && (
                <div className="absolute left-0 top-full mt-1 w-[180px] bg-white dark:bg-[#09090b] border border-border rounded-xl shadow-lg py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] text-muted-foreground font-medium mb-1">Priority</div>
                  <button className="w-full flex items-center gap-2.5 px-3 py-1.5 text-muted-foreground hover:bg-muted text-[13px] transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-gray-400"/> No Priority</button>
                  <button className="w-full flex items-center justify-between px-3 py-1.5 text-red-500 bg-red-50 dark:bg-red-950/30 text-[13px] transition-colors">
                    <div className="flex items-center gap-2.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 22V14M12 22V8M20 22V2" strokeLinecap="round" /></svg> Urgent</div>
                    <span className="text-foreground text-[10px]">✓</span>
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-3 py-1.5 text-orange-500 hover:bg-muted text-[13px] transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 22V14M12 22V8M20 22V2" strokeLinecap="round" /></svg> High</button>
                  <button className="w-full flex items-center gap-2.5 px-3 py-1.5 text-yellow-500 hover:bg-muted text-[13px] transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 22V14M12 22V8M20 22V2" strokeLinecap="round" /></svg> Medium</button>
                  <button className="w-full flex items-center gap-2.5 px-3 py-1.5 text-gray-400 hover:bg-muted text-[13px] transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 22V14M12 22V8M20 22V2" strokeLinecap="round" /></svg> Low</button>
                </div>
              )}
            </div>
          </div>

          {/* Members */}
          <div className="grid grid-cols-3 items-center">
            <span className="text-muted-foreground">Members</span>
            <div className="col-span-2 flex items-center gap-2 font-medium cursor-pointer hover:text-primary transition-colors">
              <span className="flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> Add members</span>
            </div>
          </div>

          {/* Dates & Calendar Popover (122500_2.png) */}
          <div className="grid grid-cols-3 items-center relative">
            <span className="text-muted-foreground">Dates</span>
            <div className="col-span-2 flex items-center gap-2">
              <button 
                onClick={() => setDateOpen(!dateOpen)}
                className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-md text-foreground text-[12px] hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                📅 Jan 10 
              </button>
              <span className="text-muted-foreground">→</span>
              <button className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-md text-muted-foreground text-[12px] hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                📅 End
              </button>

              {/* Exact Calendar Popover */}
              {dateOpen && (
                <div className="absolute left-0 top-full mt-1 w-[240px] bg-white dark:bg-[#09090b] border border-border rounded-xl shadow-lg p-3 z-50">
                  <div className="flex items-center justify-between mb-3 text-[13px] font-semibold">
                    <button className="text-muted-foreground hover:text-foreground">{'<'}</button>
                    January 2026
                    <button className="text-muted-foreground hover:text-foreground">{'>'}</button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-muted-foreground mb-2 font-medium">
                    <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-[12px]">
                    <div className="py-1 text-muted-foreground opacity-50">30</div>
                    <div className="py-1">1</div><div className="py-1">2</div><div className="py-1">3</div>
                    <div className="py-1">4</div><div className="py-1">5</div><div className="py-1">6</div>
                    <div className="py-1">7</div><div className="py-1">8</div><div className="py-1">9</div>
                    <div className="py-1 bg-[#09090b] text-white dark:bg-white dark:text-black rounded-full font-bold">10</div>
                    <div className="py-1">11</div><div className="py-1">12</div><div className="py-1">13</div>
                    <div className="py-1">14</div><div className="py-1">15</div><div className="py-1">16</div>
                    <div className="py-1">17</div><div className="py-1">18</div><div className="py-1">19</div>
                    <div className="py-1">20</div><div className="py-1 text-red-500 font-semibold bg-red-50 dark:bg-red-950/30 rounded-full">21</div><div className="py-1">22</div>
                    <div className="py-1">23</div><div className="py-1">24</div><div className="py-1">25</div>
                    <div className="py-1">26</div><div className="py-1">27</div><div className="py-1">28</div>
                    <div className="py-1">29</div><div className="py-1">30</div><div className="py-1">31</div>
                    <div className="py-1 text-muted-foreground opacity-50">1</div><div className="py-1 text-muted-foreground opacity-50">2</div><div className="py-1 text-muted-foreground opacity-50">3</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Labels & Teams & Reporter */}
          {['Labels', 'Teams'].map(field => (
            <div key={field} className="grid grid-cols-3 items-center">
              <span className="text-muted-foreground">{field}</span>
              <span className="col-span-2 text-muted-foreground">--</span>
            </div>
          ))}
          <div className="grid grid-cols-3 items-center">
            <span className="text-muted-foreground">Reporter</span>
            <div className="col-span-2 flex items-center gap-1.5 font-medium">
              <img src="/avatar.png" className="w-5 h-5 rounded-full border border-border" /> Admin
            </div>
          </div>
        </div>
      </div>

      {/* Updates History Feed */}
      <div className="bg-white dark:bg-[#09090b] border border-border rounded-xl shadow-sm overflow-hidden">
         <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30 text-[13px] font-semibold text-foreground">
           <ChevronDown size={14} /> Updates
         </div>
         <div className="p-4 space-y-4">
           <div className="flex gap-3">
             <div className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 22V14M12 22V8M20 22V2" strokeLinecap="round" /></svg>
             </div>
             <div className="text-[13px]">
               <span className="font-semibold text-foreground">You </span>
               <span className="text-muted-foreground">changed priority from No priority to Urgent</span>
             </div>
           </div>
           <div className="flex gap-3">
             <img src="/avatar.png" className="w-6 h-6 rounded-full border border-border shrink-0" />
             <div className="text-[13px]">
               <span className="font-semibold text-foreground">You </span>
               <span className="text-muted-foreground">posted an update · Aug 2026</span>
             </div>
           </div>
         </div>
      </div>

    </div>
  );
}