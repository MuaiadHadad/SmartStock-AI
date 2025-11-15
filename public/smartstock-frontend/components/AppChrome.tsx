"use client";
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AppChrome({ children }: { children: React.ReactNode }){
  const pathname = usePathname();
  const publicPaths = ['/', '/login', '/register'];
  const isPublic = publicPaths.includes(pathname);

  return (
    <div className={`relative min-h-screen overflow-hidden bg-slate-100 text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-slate-100`}>
      <ThemeToggle
        className={`fixed right-6 top-6 z-50 shadow-lg hover:shadow-xl dark:shadow-none ${isPublic ? '' : 'lg:hidden'}`}
        label="Alternar modo de cor"
      />
      {!isPublic && (
        <>
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <motion.div
              aria-hidden
              className="absolute -top-20 left-32 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ duration: 0.8 }}
            />
            <motion.div
              aria-hidden
              className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.5, scale: 1 }}
              transition={{ duration: 0.9 }}
            />
          </div>
          <Sidebar />
        </>
      )}
      {isPublic && (
        <>
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-radial-fade" />
          </div>
          <Sidebar />
        </>
      )}
      <main className={`relative z-10 ${!isPublic ? 'lg:ml-64' : ''} transition-all duration-500 p-6 md:p-10`}>{children}</main>
    </div>
  );
}

