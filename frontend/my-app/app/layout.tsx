import './globals.css';
import { ThemeWrapper } from '@/components/ThemeWrapper';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata = {
  title: 'Task Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased text-foreground bg-background">
        <AuthProvider>
          <ThemeWrapper>
            {children}
          </ThemeWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}