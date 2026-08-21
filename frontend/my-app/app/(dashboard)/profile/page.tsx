import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-10 h-full">
      <Link href="/tasks" className="flex items-center gap-2 text-sm text-gray-500 hover:text-foreground mb-8 transition-colors w-max">
        <ArrowLeft size={16} /> Back to app
      </Link>
      <h1 className="text-3xl font-semibold mb-8">Profile</h1>
      
      <div className="bg-white dark:bg-[#18181b] border border-border rounded-xl p-4 sm:p-6 shadow-sm mb-8 space-y-6">
        
        <div className="flex items-center justify-between border-b border-border pb-6">
          <span className="text-sm font-medium">Profile picture</span>
          <img src="/avatar.png" alt="Profile" className="w-10 h-10 rounded-full border border-border" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-6 gap-3 sm:gap-0">
          <span className="text-sm font-medium">Email</span>
          <div className="flex items-center gap-2 text-sm">
            dexter@gmail.com 
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-6 gap-3 sm:gap-0">
          <div>
            <div className="text-sm font-medium">Full name</div>
          </div>
          <input
            type="text"
            defaultValue="Dexter"
            className="text-sm bg-gray-50 dark:bg-gray-900 border border-border rounded-md px-3 py-1.5 w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-3 sm:gap-0">
          <div>
            <div className="text-sm font-medium">Username</div>
            <div className="text-xs text-gray-500 mt-1">One word, like a nickname or first name</div>
          </div>
          <input
            type="text"
            defaultValue="Dexuser"
            className="text-sm bg-gray-50 dark:bg-gray-900 border border-border rounded-md px-3 py-1.5 w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Workspace access</h2>
      <div className="bg-white dark:bg-[#18181b] border border-border rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 sm:gap-0">
        <span className="text-sm text-gray-600 dark:text-gray-400">Remove yourself from the workspace</span>
        <button className="w-full sm:w-auto text-red-500 bg-red-50 dark:bg-red-950/30 font-medium px-4 py-2 rounded-md text-sm hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
          Leave Workspace
        </button>
      </div>
    </div>
  );
}