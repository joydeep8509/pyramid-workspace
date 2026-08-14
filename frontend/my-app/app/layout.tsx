// app/layout.tsx
import './globals.css';
import { ThemeWrapper } from '@/components/ThemeWrapper';

export const metadata = {
  title: 'Task Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased text-foreground bg-background">
        <ThemeWrapper>
          {children}
        </ThemeWrapper>
      </body>
    </html>
  );
}