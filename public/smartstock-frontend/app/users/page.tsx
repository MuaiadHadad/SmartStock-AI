"use client";
import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Protected from '@/components/Protected';
import { motion } from 'framer-motion';
import { Users, Sparkles, ShieldCheck } from 'lucide-react';

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
      <motion.div className="space-y-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/60 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-2xl">
          <div className="absolute -top-16 right-12 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-8 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-300">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.3em]">Administração</span>
              </div>
              <h1 className="text-3xl font-bold">Gestão de utilizadores</h1>
              <p className="max-w-xl text-sm text-slate-300">
                Defina perfis com animações de feedback instantâneas e mantenha a governação do acesso alinhada ao seu fluxo operacional.
              </p>
            </div>
            <div className="glass-light border-gradient flex items-center gap-3 rounded-2xl px-5 py-3 text-slate-900">
              <Users className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-emerald-500">Sessão</p>
                <p className="font-semibold text-slate-900">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <motion.div className="glass rounded-3xl border border-slate-800/60 p-6 shadow-xl max-w-2xl" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Nome completo</label>
                <input
                  value={name}
                  onChange={e=>setName(e.target.value)}
                  placeholder="Nome"
                  className="w-full rounded-2xl border border-slate-800/60 bg-slate-950/70 px-4 py-3 text-sm text-slate-200 focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Email corporativo</label>
                <input
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                  placeholder="email@empresa.com"
                  className="w-full rounded-2xl border border-slate-800/60 bg-slate-950/70 px-4 py-3 text-sm text-slate-200 focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  placeholder="Password provisória"
                  className="w-full rounded-2xl border border-slate-800/60 bg-slate-950/70 px-4 py-3 text-sm text-slate-200 focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Função</label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { value: 'operator', label: 'Operador' },
                      { value: 'manager', label: 'Gestor' },
                      { value: 'admin', label: 'Admin' },
                    ] as const
                  ).map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRole(option.value)}
                      className={`rounded-2xl border px-3 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                        role === option.value
                          ? 'border-emerald-400/80 bg-emerald-500/20 text-emerald-200'
                          : 'border-slate-800/60 bg-slate-950/70 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="shine flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg"
            >
              <ShieldCheck className="h-4 w-4" />
              Criar utilizador
            </motion.button>
          </form>

          {message && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {message}
            </motion.div>
          )}
          {error && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </Protected>
  );
}
