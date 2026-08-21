'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { api, UserProfile } from '@/lib/api';
import { Check, Loader2, Pencil, AlertTriangle } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export default function ProfilePage() {
  const router = useRouter();
  const { logout } = useAppStore();
  const { data: session } = useSession();

  const [profile, setProfile] = useState<UserProfile>({
    name: 'Dexter',
    email: 'dexter@gmail.com',
    title: 'Designer',
    username: 'Dexuser',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [editingField, setEditingField] = useState<keyof UserProfile | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  useEffect(() => {
    api.getProfile()
      .then(data => {
        if (data) {
          setProfile({
            ...data,
            name: session?.user?.name || data.name || 'Dexter',
            email: session?.user?.email || data.email || 'dexter@gmail.com',
          });
        }
      })
      .catch(err => console.error("Error loading profile:", err))
      .finally(() => setIsLoading(false));
  }, [session]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditingField(null);
    setIsSaving(true);
    setSuccessMessage(false);

    try {
      const updated = await api.updateProfile(profile);
      setProfile(updated);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Failed to save profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmLeaveWorkspace = async () => {
    logout();
    if (session) {
      await signOut({ redirect: false });
    }
    router.push('/login');
  };

  const renderEditableField = (key: keyof UserProfile, label: string, description?: string, type = 'text') => {
    const isEditing = editingField === key;
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-[#e4e4e7] dark:border-[#27272a] group gap-3 sm:gap-0">
        <div>
          <div className="text-[14px] font-medium text-foreground">{label}</div>
          {description && <div className="text-[12px] text-muted-foreground mt-0.5">{description}</div>}
        </div>
        
        <div className="w-full sm:w-[320px]">
          {isEditing ? (
            <input
              autoFocus
              type={type}
              value={profile[key] || ''}
              onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
              className="w-full text-[14px] text-foreground font-medium bg-[#fafafa] dark:bg-[#18181b] border border-primary rounded-lg px-4 py-2 outline-none shadow-sm transition-all"
            />
          ) : (
            <div className="flex items-center justify-between w-full px-4 py-2 border border-transparent rounded-lg hover:bg-muted/50 transition-colors">
              <span className="text-[14px] font-medium text-foreground truncate">{profile[key]}</span>
              <button
                type="button"
                onClick={() => setEditingField(key)}
                className="text-muted-foreground opacity-100 sm:opacity-0 group-hover:opacity-100 hover:text-foreground transition-all p-1.5 rounded-md hover:bg-white dark:hover:bg-[#27272a] shadow-sm border border-transparent hover:border-border cursor-pointer"
                title={`Edit ${label}`}
              >
                <Pencil size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">Loading profile...</div>;
  }

  return (
    <div className="max-w-[760px] mx-auto p-4 sm:p-8 md:p-12 h-full relative">
      
      {isLeaveModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#09090b] border border-[#e4e4e7] dark:border-[#27272a] w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-4">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Leave Workspace?</h2>
              <p className="text-[14px] text-muted-foreground mb-6 leading-relaxed">
                Are you sure you want to leave this workspace? You will be immediately logged out and lose access to all active projects and tasks.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 rounded-[8px] text-[13px] font-medium hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmLeaveWorkspace}
                  className="px-4 py-2 bg-red-500 text-white rounded-[8px] text-[13px] font-medium hover:bg-red-600 transition-colors shadow-sm cursor-pointer"
                >
                  Yes, Leave Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-8">
        <h1 className="text-[28px] font-semibold tracking-tight text-foreground">Profile</h1>
        {successMessage && (
          <span className="flex items-center w-max gap-1.5 text-emerald-600 dark:text-emerald-400 text-[13px] font-medium bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900 animate-in fade-in">
            <Check size={14} /> Changes saved successfully!
          </span>
        )}
      </div>

      <form onSubmit={handleSave}>
        <div className="bg-white dark:bg-[#09090b] border border-[#e4e4e7] dark:border-[#27272a] rounded-[16px] shadow-sm mb-10 overflow-hidden">
          
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#e4e4e7] dark:border-[#27272a]">
            <span className="text-[14px] font-medium text-foreground">Profile picture</span>
            
            {session?.user?.image ? (
              <img src={session.user.image} alt="Google Profile" referrerPolicy="no-referrer" className="w-10 h-10 rounded-full border border-border object-cover shadow-sm" />
            ) : (
              <img src="/avatar.png" alt="Guest Avatar" className="w-10 h-10 rounded-full border border-border object-cover bg-gray-200 shadow-sm" />
            )}
          </div>

          {renderEditableField('email', 'Email', undefined, 'email')}
          {renderEditableField('name', 'Full name')}
          {renderEditableField('title', 'Title', 'Your job title or role')}
          {renderEditableField('username', 'Username', 'One word nickname')}
        </div>

        <div className="flex justify-end mb-10">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-[14px] font-medium shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>

      <h2 className="text-[16px] font-semibold tracking-tight mb-4 text-foreground">Workspace access</h2>
      <div className="bg-white dark:bg-[#09090b] border border-[#e4e4e7] dark:border-[#27272a] rounded-[16px] p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 sm:gap-0 shadow-sm">
        <span className="text-[14px] text-muted-foreground font-medium">Remove yourself from the workspace</span>
        <button
          type="button"
          onClick={() => setIsLeaveModalOpen(true)}
          className="w-full sm:w-auto text-[#ef4444] bg-[#fef2f2] dark:bg-[#451a1a] dark:text-[#f87171] font-medium px-4 py-2 rounded-[8px] text-[13px] hover:bg-[#fee2e2] dark:hover:bg-[#7f1d1d] transition-colors border border-transparent dark:border-[#7f1d1d]/50 cursor-pointer"
        >
          Leave Workspace
        </button>
      </div>
      
    </div>
  );
}