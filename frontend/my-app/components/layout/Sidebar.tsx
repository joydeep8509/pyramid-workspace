'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Folder, Settings, Sun, Moon, ChevronRight, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

// Tailwind Purge Fix: Explicitly map colors so they are included in the final CSS build
const colorMap: Record<string, string> = {
  amber: 'bg-amber-500',
  blue: 'bg-blue-500',
  pink: 'bg-pink-500',
  rose: 'bg-rose-500',
  emerald: 'bg-emerald-500',
  black: 'bg-zinc-800 dark:bg-zinc-200',
};

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme, colorMode, setColorMode } = useAppStore();
  
  const [activeMenu, setActiveMenu] = useState<'theme' | 'color' | null>(null);

  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {

      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarRef]);

  return (
    <aside 
      ref={sidebarRef}
      className="w-[240px] border-r border-[#e4e4e7] dark:border-[#27272a] h-screen flex flex-col bg-[#fafafa] dark:bg-[#09090b] shrink-0 relative z-40"
    >
      
      {/* Profile Header */}
      <div className="p-4 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors">
        <div className="flex items-center gap-2.5">
          <img src="/avatar.png" alt="Dexter" className="w-7 h-7 rounded-full border border-border object-cover bg-gray-200" />
          <span className="font-semibold text-[14px]">Dexter</span>
        </div>
        <ChevronRight size={16} className="text-muted-foreground rotate-90" />
      </div>

      {/* Primary Navigation */}
      <div className="px-3 py-4 flex-1">
        <div className="mb-2 px-2 text-[12px] font-medium text-muted-foreground flex justify-between items-center cursor-pointer hover:text-foreground">
          Workspace <ChevronRight size={14} className="rotate-90" />
        </div>
        <nav className="space-y-0.5">
          <Link href="/tasks" className={cn(
            "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] font-medium transition-colors",
            pathname.includes('/tasks') ? "bg-[#e4e4e7]/50 dark:bg-[#27272a]/50 text-foreground" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
          )}>
            <LayoutGrid size={16} /> Tasks
          </Link>
          <Link href="/projects" className={cn(
            "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] font-medium transition-colors",
            pathname.includes('/projects') ? "bg-[#e4e4e7]/50 dark:bg-[#27272a]/50 text-foreground" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
          )}>
            <Folder size={16} /> Projects
          </Link>
        </nav>
      </div>

      {/* Bottom Settings & Theming Menu */}
      <div className="p-3 space-y-0.5 mt-auto border-t border-[#e4e4e7] dark:border-[#27272a]">
        
        {/* Theme Menu Item & Popover */}
        <div className="relative">
          <button 
            onClick={() => setActiveMenu(activeMenu === 'theme' ? null : 'theme')}
            className={cn(
              "w-full flex items-center justify-between px-2 py-1.5 rounded-md text-[13px] font-medium transition-colors",
              activeMenu === 'theme' ? "bg-black/5 dark:bg-white/5 text-foreground" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Sun size={16} className="block dark:hidden" />
              <Moon size={16} className="hidden dark:block" />
              Change Theme
            </div>
            <ChevronRight size={14} className={cn("transition-transform duration-200", activeMenu === 'theme' && "rotate-90")} />
          </button>
          
          {activeMenu === 'theme' && (
            <div className="absolute left-[230px] bottom-0 w-[180px] bg-white dark:bg-[#09090b] border border-[#e4e4e7] dark:border-[#27272a] rounded-xl shadow-lg p-1.5 z-50">
              <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Theme</div>
              <button 
                onClick={() => { setTheme('light'); setActiveMenu(null); }} 
                className="w-full flex items-center justify-between px-2 py-1.5 text-[13px] rounded-md hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] transition-colors"
              >
                <div className="flex items-center gap-2"><Sun size={14}/> Light</div>
                {theme === 'light' && <Check size={14} className="text-foreground" />}
              </button>
              <button 
                onClick={() => { setTheme('dark'); setActiveMenu(null); }} 
                className="w-full flex items-center justify-between px-2 py-1.5 text-[13px] rounded-md hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] transition-colors"
              >
                <div className="flex items-center gap-2"><Moon size={14}/> Dark</div>
                {theme === 'dark' && <Check size={14} className="text-foreground" />}
              </button>
            </div>
          )}
        </div>

        {/* Color Mode Menu Item & Popover */}
        <div className="relative">
          <button 
            onClick={() => setActiveMenu(activeMenu === 'color' ? null : 'color')}
            className={cn(
              "w-full flex items-center justify-between px-2 py-1.5 rounded-md text-[13px] font-medium transition-colors",
              activeMenu === 'color' ? "bg-black/5 dark:bg-white/5 text-foreground" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className={cn("w-4 h-4 rounded-sm shadow-inner border border-black/10 dark:border-white/10", colorMap[colorMode] || colorMap['blue'])} />
              Color Mode
            </div>
            <ChevronRight size={14} className={cn("transition-transform duration-200", activeMenu === 'color' && "rotate-90")} />
          </button>

          {activeMenu === 'color' && (
            <div className="absolute left-[230px] bottom-0 w-[160px] bg-white dark:bg-[#09090b] border border-[#e4e4e7] dark:border-[#27272a] rounded-xl shadow-lg p-1.5 z-50 space-y-0.5">
              <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Color Mode</div>
              {Object.keys(colorMap).map((colorKey) => (
                <button 
                  key={colorKey}
                  onClick={() => { setColorMode(colorKey as any); setActiveMenu(null); }} 
                  className="w-full flex items-center justify-between px-2 py-1.5 text-[13px] rounded-md hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] capitalize transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={cn("w-3.5 h-3.5 rounded-sm shadow-inner border border-black/10 dark:border-white/10", colorMap[colorKey])} />
                    {colorKey}
                  </div>
                  {colorMode === colorKey && <Check size={14} className="text-foreground" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Settings Link */}
        <Link 
          href="/settings/profile" 
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] font-medium text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground transition-colors"
        >
          <Settings size={16} /> Settings
        </Link>
      </div>
    </aside>
  );
}