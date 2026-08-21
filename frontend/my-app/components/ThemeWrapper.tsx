'use client'; 
import { useEffect, useState } from 'react'; 
import { useAppStore } from '@/lib/store'; 

export function ThemeWrapper({ children }: { children: React.ReactNode }) {   
  const [mounted, setMounted] = useState(false);   
  const { theme, colorMode } = useAppStore();   

  useEffect(() => {     
    setMounted(true);   
  }, []);   

  useEffect(() => {     
    if (!mounted) return;          
    const root = document.documentElement;          
    
    // 1. Handle Light/Dark Mode     
    if (theme === 'dark') {       
      root.classList.add('dark');     
    } else {       
      root.classList.remove('dark');     
    }     
    
    // 2. Handle Accent Color
    root.setAttribute('data-color-mode', colorMode);        
  }, [theme, colorMode, mounted]);   

  if (!mounted) {     
    return <div className="min-h-screen bg-[#fafafa]" />;    
  }
  return <>{children}</>;
}