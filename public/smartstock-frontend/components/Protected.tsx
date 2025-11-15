'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Protected({ children }: { children: React.ReactNode }){
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(()=>{ if (!loading && !user) router.push('/login'); },[loading,user,router]);
  if (loading) return <div className="text-slate-600 dark:text-slate-400">A carregar…</div>;
  if (!user) return null;
  return <>{children}</>;
}
