"use client";
import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Protected from '@/components/Protected';
import { motion } from 'framer-motion';

export default function UsersPage(){
  const { user } = useAuth();
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [role,setRole]=useState<'admin'|'manager'|'operator'>('operator');
  const [message,setMessage]=useState<string|null>(null);
  const [error,setError]=useState<string|null>(null);

  if (!user) return <div className="text-slate-300">Faça login.</div>;

  async function submit(e:React.FormEvent){
    e.preventDefault(); setMessage(null); setError(null);
    try { const created = await api.createUser({ name,email,password,role }); setMessage(`Criado: ${created.email}`); setName(''); setEmail(''); setPassword(''); setRole('operator'); }
    catch(err:any){ setError(err.message); }
  }

  return (
    <Protected>
      <motion.div className="space-y-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div>
          <h1 className="text-2xl font-bold">Utilizadores (Admin)</h1>
          <p className="text-slate-400">Criar novos utilizadores.</p>
        </div>
        <motion.div className="glass rounded-xl p-4 space-y-3 max-w-xl" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05, duration: 0.35 }}>
          <form onSubmit={submit} className="space-y-3">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome" className="w-full bg-slate-900/40 border border-slate-700 rounded px-3 py-2" />
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full bg-slate-900/40 border border-slate-700 rounded px-3 py-2" />
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full bg-slate-900/40 border border-slate-700 rounded px-3 py-2" />
            <select value={role} onChange={e=>setRole(e.target.value as any)} className="w-full bg-slate-900/40 border border-slate-700 rounded px-3 py-2">
              <option value="operator">Operador</option>
              <option value="manager">Gestor</option>
              <option value="admin">Admin</option>
            </select>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold px-4 py-2 rounded">Criar</button>
          </form>
          {message && <div className="text-emerald-400">{message}</div>}
          {error && <div className="text-red-400">{error}</div>}
        </motion.div>
      </motion.div>
    </Protected>
  );
}
