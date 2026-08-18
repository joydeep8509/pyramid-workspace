'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api, ProjectData } from '@/lib/api';

interface ProjectModalProps { isOpen: boolean; onClose: () => void; onRefresh: () => void; initialData?: ProjectData | null; }

export function ProjectModal({ isOpen, onClose, onRefresh, initialData }: ProjectModalProps) {

  const [name, setName] = useState('');
  const [priority, setPriority] = useState('High');
  const [dueDate, setDueDate] = useState('');
  const [lead, setLead] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name); setPriority(initialData.priority); setLead(initialData.lead);
      if (initialData.dueDate) {
        try { setDueDate(new Date(initialData.dueDate).toISOString().split('T')[0]); } catch { setDueDate(''); }
      }
    } else {
      setName(''); setPriority('High'); setDueDate(''); setLead('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    let formattedDate = '';
    if (dueDate) formattedDate = new Date(dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    try {
      if (initialData) await api.updateProject(initialData.id, { name, priority, lead: lead || 'Admin', dueDate: formattedDate });
      else await api.createProject({ name, priority, lead: lead || 'Admin', dueDate: formattedDate });
      onRefresh(); onClose();
    } catch (error) { console.error("Error", error); } finally { setIsLoading(false); }
  };

  return (
    // PRO FIX: Smooth backdrop blur and CSS Entry Animations
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#09090b] border border-[#e4e4e7] dark:border-[#27272a] w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-5 border-b border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#18181b]/50">
          <h2 className="font-semibold text-foreground text-[15px] tracking-tight">
            {initialData ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-md text-muted-foreground hover:bg-[#e4e4e7] dark:hover:bg-[#27272a] hover:text-foreground transition-colors"><X size={16} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[13px] font-semibold text-foreground mb-2">Project Name <span className="text-red-500">*</span></label>
            <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-[#e4e4e7] dark:border-[#27272a] rounded-[8px] px-3.5 py-2.5 text-[13px] bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-foreground" placeholder="e.g., Q3 Marketing Site" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-foreground mb-2">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full border border-[#e4e4e7] dark:border-[#27272a] rounded-[8px] px-3.5 py-2.5 text-[13px] bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer font-medium text-foreground">
                <option value="Urgent">Urgent</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-foreground mb-2">Project Lead</label>
              <input type="text" value={lead} onChange={(e) => setLead(e.target.value)} className="w-full border border-[#e4e4e7] dark:border-[#27272a] rounded-[8px] px-3.5 py-2.5 text-[13px] bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium text-foreground" placeholder="e.g., Dexter" />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-foreground mb-2">Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border border-[#e4e4e7] dark:border-[#27272a] rounded-[8px] px-3.5 py-2.5 text-[13px] bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 dark:[color-scheme:dark] font-medium text-foreground" />
          </div>

          <div className="pt-4 flex justify-end gap-3 mt-2 border-t border-[#e4e4e7] dark:border-[#27272a] border-opacity-50">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-[8px] text-[13px] font-semibold hover:bg-muted text-muted-foreground transition-colors">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-[8px] text-[13px] font-semibold shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:opacity-90 disabled:opacity-50 transition-opacity">
              {isLoading ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Project')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}