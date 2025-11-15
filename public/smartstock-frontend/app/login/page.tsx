"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export default function LoginPage(){
  const [email,setEmail] = useState('admin@example.com');
  const [password,setPassword] = useState('admin123');
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<string|null>(null);
  const router = useRouter();
  const { login } = useAuth();

  async function submit(e:React.FormEvent){
    e.preventDefault(); setLoading(true); setError(null);
    try { await login(email,password); router.push('/inventory'); }
    catch(err:any){ setError(err.message); }
    finally{ setLoading(false); }
  }

  return (
    <div className="relative min-h-[calc(100vh-2rem)] flex items-center justify-center overflow-hidden">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-96 w-96 bg-emerald-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 h-[22rem] w-[22rem] bg-cyan-500/10 blur-3xl rounded-full" />
      </div>

      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 glass w-full max-w-md rounded-2xl p-8 space-y-4 border border-slate-800/60 shadow-xl"
      >
        <h1 className="text-2xl font-bold">Entrar</h1>
        <p className="text-sm text-slate-400">Use as credenciais seed: <span className="text-emerald-300">admin@example.com / admin123</span></p>
        {error && <div className="text-red-400 bg-red-900/20 border border-red-800 px-3 py-2 rounded">{error}</div>}
        <div className="space-y-2">
          <label className="text-sm text-slate-300">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" className="w-full bg-slate-900/40 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-300">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" className="w-full bg-slate-900/40 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <button disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold py-2 rounded transition disabled:opacity-50">{loading? 'Entrando...' : 'Entrar'}</button>
        <p className="text-sm text-slate-400">Não tem conta? <a href="/register" className="text-emerald-400 hover:underline">Criar conta</a></p>
      </motion.form>
    </div>
  );
}
