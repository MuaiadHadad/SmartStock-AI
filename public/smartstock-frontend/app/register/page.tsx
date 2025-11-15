"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserPlus, Sparkles, ClipboardList } from 'lucide-react';

export default function RegisterPage(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const router = useRouter();
  const { register, user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/inventory');
    }
  }, [authLoading, user, router]);

  async function submit(e:React.FormEvent){
    e.preventDefault(); setLoading(true); setError(null);
    try { await register(name,email,password); router.push('/inventory'); }
    catch(err: unknown){
      const message = err instanceof Error ? err.message : 'Erro ao registar';
      setError(message);
    }
    finally { setLoading(false); }
  }

  if (authLoading || user) {
    return null; // aguardando auth ou já redirecionando
  }

  const benefits = [
    'Perfis de equipa em segundos, com permissões alinhadas ao seu fluxo.',
    'Dashboards prontos com métricas essenciais para gestores e operadores.',
    'Alertas inteligentes para níveis críticos de stock e movimentos atípicos.',
  ];

  return (
    <div className="relative min-h-[calc(100vh-2rem)] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-radial-fade" />
        <motion.div
          aria-hidden
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/25 blur-3xl animate-blob"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.8, scale: 1 }}
        />
        <motion.div
          aria-hidden
          className="absolute bottom-0 right-0 h-[22rem] w-[22rem] rounded-full bg-cyan-500/20 blur-3xl animate-blob-delayed"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.7, scale: 1 }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <motion.section
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-300">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs uppercase tracking-[0.2em]">Primeiro acesso</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold leading-tight text-white">
                Registe a sua equipa e desbloqueie um <span className="text-emerald-300">dashboard inteligente</span>
              </h1>
              <p className="text-slate-400 max-w-xl">
                SmartStock AI combina previsões com fluxos ágeis para garantir que todos saibam exatamente o que fazer quando o stock oscila.
              </p>
            </div>
            <motion.ul
              className="space-y-3"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {benefits.map((benefit) => (
                <motion.li
                  key={benefit}
                  variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                  className="flex items-start gap-3 rounded-xl border border-slate-800/50 bg-slate-900/50 px-4 py-3 text-sm text-slate-300"
                >
                  <ClipboardList className="mt-1 h-4 w-4 text-emerald-300" />
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.section>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass border-gradient relative overflow-hidden rounded-3xl p-8 shadow-2xl"
          >
            <div className="absolute inset-0 opacity-35">
              <div className="absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl" />
              <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent" />
            </div>

            <div className="relative space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
                  <UserPlus className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Criar conta</p>
                  <h2 className="text-2xl font-bold text-white">Comece agora</h2>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-red-900/60 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Nome</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Nome completo"
                  className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 px-4 py-3 text-sm text-slate-200 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Email</label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@empresa.com"
                  className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 px-4 py-3 text-sm text-slate-200 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Crie uma password"
                  className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 px-4 py-3 text-sm text-slate-200 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="shine w-full rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/25 transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'A criar…' : 'Criar conta gratuita'}
              </motion.button>

              <p className="text-sm text-slate-400">
                Já tem conta?{' '}
                <Link href="/login" className="text-emerald-300 underline-offset-4 hover:underline">
                  Entrar
                </Link>
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
