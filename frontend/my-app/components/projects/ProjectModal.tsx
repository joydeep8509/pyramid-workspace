'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api, ProjectData } from '@/lib/api';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  initialData?: ProjectData | null;
}

export function ProjectModal({ isOpen, onClose, onRefresh, initialData }: ProjectModalProps) {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState('High');
  const [dueDate, setDueDate] = useState('');
  const [lead, setLead] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill the form if we are editing an existing project
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPriority(initialData.priority);
      setLead(initialData.lead);
      
      // Convert "10 Aug 2026" back to "YYYY-MM-DD" for the HTML date picker
      if (initialData.dueDate) {
        try {
          setDueDate(new Date(initialData.dueDate).toISOString().split('T')[0]);
        } catch {
          setDueDate('');
        }
      }
    } else {
      setName('');
      setPriority('High');
      setDueDate('');
      setLead('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let formattedDate = '';
    if (dueDate) {
      formattedDate = new Date(dueDate).toLocaleDateString('en-GB', { 
        day: '2-digit', month: 'short', year: 'numeric' 
      });
    }

    const payload = {
      name,
      priority,
      lead: lead || 'Admin',
      dueDate: formattedDate
    };

    try {
      if (initialData) {
        await api.updateProject(initialData.id, payload); // Edit existing
      } else {
        await api.createProject(payload); // Create new
      }
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error saving project", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#09090b] border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-5 border-b border-border bg-muted/30">
          <h2 className="font-semibold text-foreground text-[15px]">
            {initialData ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X size={18} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div>
            <label className="block text-[13px] font-medium text-foreground mb-1.5">Project Name <span className="text-red-500">*</span></label>
            <input 
              required 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full border border-border rounded-lg px-3 py-2 text-[13px] bg-transparent focus:outline-none focus:ring-1 focus:ring-primary transition-all" 
              placeholder="e.g., Q3 Marketing Site"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-foreground mb-1.5">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-[13px] bg-transparent focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer">
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-foreground mb-1.5">Project Lead</label>
              <input 
                type="text" 
                value={lead} 
                onChange={(e) => setLead(e.target.value)} 
                className="w-full border border-border rounded-lg px-3 py-2 text-[13px] bg-transparent focus:outline-none focus:ring-1 focus:ring-primary" 
                placeholder="e.g., Dexter"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-foreground mb-1.5">Due Date</label>
            <input 
              type="date" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)} 
              className="w-full border border-border rounded-lg px-3 py-2 text-[13px] bg-transparent focus:outline-none focus:ring-1 focus:ring-primary dark:[color-scheme:dark]" 
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-muted text-muted-foreground transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-medium shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity">
              {isLoading ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Project')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}