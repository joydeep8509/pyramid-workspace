'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Search, User, Sun, Moon, Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

// TAILWIND FIX: Full string names so Tailwind compiler doesn't purge the CSS
const colorMap: Record<string, string> = {
  amber: 'bg-amber-500',
  blue: 'bg-blue-500',
  pink: 'bg-pink-500',
  rose: 'bg-rose-500',
  emerald: 'bg-emerald-500',
  black: 'bg-zinc-800 dark:bg-zinc-200',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme, colorMode, setColorMode } = useAppStore();
  
  const [activeMenu, setActiveMenu] = useState<'theme' | 'color' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click-Outside Listener to ensure options disappear when touching elsewhere
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#fafafa] dark:bg-[#09090b]">
      
      {/* Settings Navigation Sidebar */}
      <aside className="w-[260px] border-r border-[#e4e4e7] dark:border-[#27272a] h-full flex flex-col bg-white dark:bg-[#09090b] shrink-0 relative z-40">
        
        {/* Back to App */}
        <div className="p-4 border-b border-[#e4e4e7] dark:border-[#27272a]">
          <Link href="/tasks" className="flex items-center gap-2 text-[13px] font-medium text-foreground hover:opacity-70 transition-opacity">
            <ArrowLeft size={16} /> Back to app
          </Link>
        </div>

        {/* Local Settings Nav */}
        <div className="p-3 flex-1 space-y-4 mt-2">
          
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search settings..." 
              className="w-full pl-8 pr-4 py-1.5 border border-[#e4e4e7] dark:border-[#27272a] rounded-lg bg-[#fafafa] dark:bg-[#18181b] text-[13px] focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-sm"
            />
          </div>

          <nav className="space-y-0.5" ref={menuRef}>
            <Link href="/settings/profile" className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors",
              pathname.includes('/profile') || pathname === '/settings' ? "bg-[#f4f4f5] dark:bg-[#27272a] text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}>
              <User size={16} /> Profile
            </Link>
            
            {/* Theme Toggle Button & Popover */}
            <div className="relative">
              <button 
                onClick={() => setActiveMenu(activeMenu === 'theme' ? null : 'theme')}
                className={cn("w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium transition-colors", activeMenu === 'theme' ? "bg-[#f4f4f5] dark:bg-[#27272a] text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground")}
              >
                <div className="flex items-center gap-2.5">
                  <Sun size={16} className="block dark:hidden" />
                  <Moon size={16} className="hidden dark:block" />
                  Theme
                </div>
                <ChevronRight size={14} className={cn("opacity-50 transition-transform duration-200", activeMenu === 'theme' && "rotate-90")} />
              </button>
              
              {activeMenu === 'theme' && (
                <div className="absolute left-[240px] top-0 w-[180px] bg-white dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Theme</div>
                  <button onClick={() => { setTheme('light'); setActiveMenu(null); }} className="w-full flex items-center justify-between px-2 py-1.5 text-[13px] rounded-md hover:bg-muted transition-colors text-foreground font-medium">
                    <div className="flex items-center gap-2"><Sun size={14}/> Light</div>
                    {theme === 'light' && <Check size={14} />}
                  </button>
                  <button onClick={() => { setTheme('dark'); setActiveMenu(null); }} className="w-full flex items-center justify-between px-2 py-1.5 text-[13px] rounded-md hover:bg-muted transition-colors text-foreground font-medium">
                    <div className="flex items-center gap-2"><Moon size={14}/> Dark</div>
                    {theme === 'dark' && <Check size={14} />}
                  </button>
                </div>
              )}
            </div>
            
            {/* Color Mode Button & Popover */}
            <div className="relative">
              <button 
                onClick={() => setActiveMenu(activeMenu === 'color' ? null : 'color')}
                className={cn("w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium transition-colors", activeMenu === 'color' ? "bg-[#f4f4f5] dark:bg-[#27272a] text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground")}
              >
                <div className="flex items-center gap-2.5">
                  <div className={cn("w-4 h-4 rounded-[4px] shadow-sm", colorMap[colorMode])} /> Color
                </div>
                <ChevronRight size={14} className={cn("opacity-50 transition-transform duration-200", activeMenu === 'color' && "rotate-90")} />
              </button>

              {activeMenu === 'color' && (
                <div className="absolute left-[240px] top-0 w-[160px] bg-white dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200 space-y-0.5">
                  <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Color Mode</div>
                  {Object.keys(colorMap).map((colorKey) => (
                    <button 
                      key={colorKey}
                      onClick={() => { setColorMode(colorKey as any); setActiveMenu(null); }} 
                      className="w-full flex items-center justify-between px-2 py-1.5 text-[13px] rounded-md hover:bg-muted capitalize transition-colors text-foreground font-medium"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={cn("w-3.5 h-3.5 rounded-[4px] shadow-sm border border-black/10 dark:border-white/10", colorMap[colorKey])} />
                        {colorKey}
                      </div>
                      {colorMode === colorKey && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Settings Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#fafafa] dark:bg-[#09090b]">
        {children}
      </main>
    </div>
  );
}