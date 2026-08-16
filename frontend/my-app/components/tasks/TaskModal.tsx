'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api, TaskData } from '@/lib/api';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  initialData?: TaskData | null;
}

export function TaskModal({ isOpen, onClose, onRefresh, initialData }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('No Priority');
  const [status, setStatus] = useState('Backlog'); // Default to Backlog
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [members, setMembers] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setTitle(''); setPriority('No Priority'); setStatus('Backlog'); 
    setDueDate(''); setTags(''); setMembers('');
  };

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setPriority(initialData.priority);
      setStatus(initialData.status);
      if (initialData.dueDate) {
        try {
          setDueDate(new Date(initialData.dueDate).toISOString().split('T')[0]);
        } catch { setDueDate(''); }
      } else { setDueDate(''); }
      setTags(initialData.tags?.join(', ') || '');
      setMembers(initialData.members?.join(', ') || '');
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let formattedDate = '';
    if (dueDate) {
      formattedDate = new Date(dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    const payload = {
      title, priority, status, dueDate: formattedDate,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      members: members.split(',').map(m => m.trim()).filter(Boolean),
    };

    try {
      if (initialData) await api.updateTask(initialData.id, payload);
      else await api.createTask(payload);
      onRefresh();
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error saving task", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#09090b] border border-[#e4e4e7] dark:border-[#27272a] w-full max-w-lg rounded-[24px] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-5 border-b border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#18181b]/50">
          <h2 className="font-semibold text-foreground text-[15px]">
            {initialData ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X size={18} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div>
            <label className="block text-[13px] font-medium text-foreground mb-1.5">Task Title <span className="text-red-500">*</span></label>
            <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-[#e4e4e7] dark:border-[#27272a] rounded-[8px] px-3 py-2 text-[13px] bg-transparent focus:outline-none focus:ring-1 focus:ring-primary transition-all" placeholder="e.g., Design the Homepage" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-foreground mb-1.5">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-[#e4e4e7] dark:border-[#27272a] rounded-[8px] px-3 py-2 text-[13px] bg-transparent focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer">
                {/* 🛑 Added Backlog Option Here */}
                <option value="Backlog">Backlog</option>
                <option value="To Do">To Do</option>
                <option value="Doing">Doing</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-foreground mb-1.5">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full border border-[#e4e4e7] dark:border-[#27272a] rounded-[8px] px-3 py-2 text-[13px] bg-transparent focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer">
                <option value="No Priority">No Priority</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-foreground mb-1.5">Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border border-[#e4e4e7] dark:border-[#27272a] rounded-[8px] px-3 py-2 text-[13px] bg-transparent focus:outline-none focus:ring-1 focus:ring-primary dark:[color-scheme:dark]" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-foreground mb-1.5">Assign Members</label>
              <input type="text" value={members} onChange={(e) => setMembers(e.target.value)} className="w-full border border-[#e4e4e7] dark:border-[#27272a] rounded-[8px] px-3 py-2 text-[13px] bg-transparent focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g., Dexter, Admin" />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-foreground mb-1.5">Tags (Comma separated)</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full border border-[#e4e4e7] dark:border-[#27272a] rounded-[8px] px-3 py-2 text-[13px] bg-transparent focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g., Frontend, Deployment" />
          </div>

          <div className="pt-4 flex justify-end gap-3 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-[8px] text-[13px] font-medium hover:bg-muted text-muted-foreground transition-colors">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-5 py-2 bg-primary text-primary-foreground rounded-[8px] text-[13px] font-medium shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity">
              {isLoading ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}