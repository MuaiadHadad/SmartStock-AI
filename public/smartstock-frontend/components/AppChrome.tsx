"use client";
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function AppChrome({ children }: { children: React.ReactNode }){
  const pathname = usePathname();
  const publicPaths = ['/', '/login', '/register'];
  const isPublic = publicPaths.includes(pathname);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {!isPublic && <Sidebar />}
      <main className={`${!isPublic ? 'lg:ml-64' : ''} transition-all duration-300 p-6 md:p-8`}>
        {children}
      </main>
    </div>
  );
}

