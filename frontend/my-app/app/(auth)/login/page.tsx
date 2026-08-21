'use client';

import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; 
import Link from 'next/link';

export default function LoginPage() {
  const { loginAsGuest } = useAppStore();
  const router = useRouter();

  const handleGuestLogin = () => {
    loginAsGuest();
    router.push('/tasks');
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/tasks' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-black p-4">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        
        <div className="mb-6 flex items-center gap-2 font-bold text-[20px] tracking-tight text-foreground">
          <div className="bg-[#09090b] dark:bg-white text-white dark:text-black p-1.5 rounded-md flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 22h20L12 2 2 22z" /></svg>
          </div>
          Pyramid
        </div>

        <div className="w-full bg-white dark:bg-[#09090b] border border-[#e4e4e7] dark:border-[#27272a] rounded-[24px] p-6 sm:p-8 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] text-center">
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground mb-1.5">Let's get back on track</h1>
          <p className="text-[14px] text-muted-foreground mb-8">Enter your email below to login to your account.</p>
          
          <div className="space-y-3">
            <button type="button" onClick={handleGuestLogin} className="w-full bg-[#09090b] dark:bg-white text-white dark:text-black text-[14px] font-medium py-[11px] rounded-full hover:bg-black/80 dark:hover:bg-white/80 transition-colors">
              Continue as Guest
            </button>
            
            <button type="button" onClick={handleGoogleLogin} className="w-full bg-white dark:bg-[#09090b] text-foreground border border-[#e4e4e7] dark:border-[#27272a] text-[14px] font-medium py-[11px] rounded-full hover:bg-[#fafafa] dark:hover:bg-[#18181b] transition-colors flex items-center justify-center gap-2.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Login with Google
            </button>
          </div>
        </div>

        <p className="mt-6 text-[12px] text-muted-foreground text-center px-4 sm:px-8">
          By clicking continue, you agree to our <Link href="#" className="underline hover:text-foreground underline-offset-2">Terms of Service</Link> and <Link href="#" className="underline hover:text-foreground underline-offset-2">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}