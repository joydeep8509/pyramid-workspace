'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Folder, Settings, Sun, Moon, ChevronRight, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';

const colorMap: Record<string, string> = {
  amber: 'bg-amber-500', blue: 'bg-blue-500', pink: 'bg-pink-500',
  rose: 'bg-rose-500', emerald: 'bg-emerald-500', black: 'bg-zinc-800 dark:bg-zinc-200',
};

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme, colorMode, setColorMode } = useAppStore();
  const { data: session } = useSession();
  
  const [activeMenu, setActiveMenu] = useState<'theme' | 'color' | null>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  // Click-outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target as Element).closest('.settings-popover-container')) {
        setActiveMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const avatarSrc = session?.user?.image || "/avatar.png";
  const userName = session?.user?.name || "Dexter";
  const userEmail = session?.user?.email || "Dexter@gmail.com";

  return (
    <aside ref={sidebarRef} className="w-[240px] border-r border-[#e4e4e7] dark:border-[#27272a] h-screen flex flex-col bg-[#fafafa] dark:bg-[#09090b] shrink-0 relative z-40 transition-colors">
      
      {/* Profile Header */}
      <Link href="/settings/profile" className="p-5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors block border-b border-[#e4e4e7] dark:border-[#27272a]">
        <div className="flex flex-col items-center mx-auto text-center gap-2">
          <img src={avatarSrc} alt="Profile" referrerPolicy="no-referrer" className="w-12 h-12 rounded-full border border-border object-cover bg-gray-200 shadow-sm" />
          <div>
            <div className="font-semibold text-[14px] text-foreground tracking-tight">{userName}</div>
            <div className="text-[12px] text-muted-foreground truncate w-[200px]">{userEmail}</div>
          </div>
        </div>
      </Link>

      {/* Primary Navigation */}
      <div className="px-3 py-5 flex-1">
        <div className="mb-2 px-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex justify-between items-center hover:text-foreground transition-colors">
          Workspace <ChevronRight size={14} className="rotate-90" />
        </div>
        <nav className="space-y-0.5 mt-2">
          <Link href="/tasks" className={cn("flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors", pathname.includes('/tasks') ? "bg-[#e4e4e7]/60 dark:bg-[#27272a]/60 text-foreground shadow-sm" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground")}>
            <LayoutGrid size={16} /> Tasks
          </Link>
          <Link href="/projects" className={cn("flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors", pathname.includes('/projects') ? "bg-[#e4e4e7]/60 dark:bg-[#27272a]/60 text-foreground shadow-sm" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground")}>
            <Folder size={16} /> Projects
          </Link>
        </nav>
      </div>

      {/* Bottom Settings Menu */}
      <div className="p-3 space-y-0.5 mt-auto border-t border-[#e4e4e7] dark:border-[#27272a]">
        
        {/* THEME BUTTON - Forced Arrow (cursor-default) */}
        <div className="relative settings-popover-container">
          <button 
            onClick={() => setActiveMenu(activeMenu === 'theme' ? null : 'theme')} 
            className={cn("w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-default", activeMenu === 'theme' ? "bg-black/5 dark:bg-white/5 text-foreground" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground")}
          >
            <div className="flex items-center gap-2.5"><Sun size={16} className="block dark:hidden" /><Moon size={16} className="hidden dark:block" /> Change Theme</div>
            <ChevronRight size={14} className={cn("transition-transform duration-200", activeMenu === 'theme' && "rotate-90")} />
          </button>
          
          {activeMenu === 'theme' && (
            <div className="absolute left-[245px] bottom-0 w-[180px] bg-white dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-3 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Theme</div>
              <button onClick={() => { setTheme('light'); setActiveMenu(null); }} className="w-full flex items-center justify-between px-3 py-2 text-[13px] rounded-md hover:bg-muted transition-colors text-foreground font-medium cursor-default">
                <div className="flex items-center gap-2"><Sun size={14}/> Light</div>{theme === 'light' && <Check size={14} />}
              </button>
              <button onClick={() => { setTheme('dark'); setActiveMenu(null); }} className="w-full flex items-center justify-between px-3 py-2 text-[13px] rounded-md hover:bg-muted transition-colors text-foreground font-medium cursor-default">
                <div className="flex items-center gap-2"><Moon size={14}/> Dark</div>{theme === 'dark' && <Check size={14} />}
              </button>
            </div>
          )}
        </div>

        {/* COLOR MODE BUTTON - Forced Arrow (cursor-default) */}
        <div className="relative settings-popover-container">
          <button 
            onClick={() => setActiveMenu(activeMenu === 'color' ? null : 'color')} 
            className={cn("w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-default", activeMenu === 'color' ? "bg-black/5 dark:bg-white/5 text-foreground" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground")}
          >
            <div className="flex items-center gap-2.5">
              <div className={cn("w-4 h-4 rounded-[4px] shadow-sm border border-black/10 dark:border-white/10", colorMap[colorMode] || colorMap['blue'])} /> Color Mode
            </div>
            <ChevronRight size={14} className={cn("transition-transform duration-200", activeMenu === 'color' && "rotate-90")} />
          </button>

          {activeMenu === 'color' && (
            <div className="absolute left-[245px] bottom-0 w-[180px] bg-white dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200 space-y-0.5">
              <div className="px-3 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Color Mode</div>
              {Object.keys(colorMap).map((colorKey) => (
                <button key={colorKey} onClick={() => { setColorMode(colorKey as any); setActiveMenu(null); }} className="w-full flex items-center justify-between px-3 py-2 text-[13px] rounded-md hover:bg-muted capitalize transition-colors text-foreground font-medium cursor-default">
                  <div className="flex items-center gap-2.5">
                    <div className={cn("w-3.5 h-3.5 rounded-[4px] shadow-sm border border-black/10 dark:border-white/10", colorMap[colorKey])} /> {colorKey}
                  </div>
                  {colorMode === colorKey && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>

        <Link href="/settings/profile" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground transition-colors cursor-default">
          <Settings size={16} /> Settings
        </Link>
      </div>
    </aside>
  );
}