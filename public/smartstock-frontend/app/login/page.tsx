"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Brain, Fingerprint, ShieldCheck, Sparkles } from 'lucide-react';

export default function LoginPage(){
  const [email,setEmail] = useState('admin@example.com');
  const [password,setPassword] = useState('admin123');
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<string|null>(null);
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/inventory');
    }
  }, [authLoading, user, router]);

  async function submit(e:React.FormEvent){
    e.preventDefault(); setLoading(true); setError(null);
    try { await login(email,password); router.push('/inventory'); }
    catch(err: unknown){
      const message = err instanceof Error ? err.message : 'Erro ao entrar';
      setError(message);
    }
    finally{ setLoading(false); }
  }

  if (authLoading || user) {
    return null; // aguardando estado de auth ou já redirecionando
  }

  const highlights = [
    {
      icon: <ShieldCheck className="w-4 h-4" />,
      title: 'Segurança corporativa',
      description: 'Autenticação JWT, políticas de sessão e encriptação de ponta a ponta.',
    },
    {
      icon: <Fingerprint className="w-4 h-4" />,
      title: 'Acesso imediato',
      description: 'Perfis predefinidos para demo e onboarding acelerado da sua equipa.',
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-2rem)] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 bg-radial-fade" />
        <motion.div
          aria-hidden
          className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-emerald-500/25 blur-3xl animate-blob"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.8, scale: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          aria-hidden
          className="absolute bottom-0 right-0 h-[22rem] w-[22rem] rounded-full bg-cyan-500/20 blur-3xl animate-blob-delayed"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.7, scale: 1 }}
          transition={{ duration: 1.2 }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-300">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs uppercase tracking-[0.2em]">Portal SmartStock</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                <span className="text-emerald-300">Bem-vindo</span> de volta à sua torre de controlo de stock
              </h1>
              <p className="text-slate-400 max-w-lg">
                Acompanhe indicadores críticos, receba alertas inteligentes e coordene a sua equipa com uma experiência refinada para operações de stock em tempo real.
              </p>
            </div>
            <motion.ul className="grid gap-4" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}>
              {highlights.map((item) => (
                <motion.li
                  key={item.title}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  className="flex items-start gap-3 rounded-xl border border-slate-800/60 bg-slate-900/40 p-4 backdrop-blur"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-100">{item.title}</p>
                    <p className="text-sm text-slate-400">{item.description}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.section>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass border-gradient relative overflow-hidden rounded-3xl p-8 shadow-2xl"
          >
            <div className="absolute inset-0 opacity-40">
              <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-t from-emerald-500/10 via-transparent to-transparent" />
            </div>
            <div className="relative space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">SmartStock AI</p>
                  <h2 className="text-2xl font-bold">Acesso seguro</h2>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                Credenciais demo: <span className="font-medium text-emerald-300">admin@example.com / admin123</span>
              </p>

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
                <label className="text-sm text-slate-300">Email</label>
                <div className="relative">
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email@empresa.com"
                    className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 px-4 py-3 text-sm text-slate-200 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-4 grid place-items-center text-slate-500">@</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 px-4 py-3 text-sm text-slate-200 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                  <Fingerprint className="pointer-events-none absolute inset-y-0 right-4 my-auto h-4 w-4 text-slate-500" />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="shine w-full rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/25 transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Entrando…' : 'Entrar agora'}
              </motion.button>

              <p className="text-sm text-slate-400">
                Não tem conta?{' '}
                <Link href="/register" className="text-emerald-300 underline-offset-4 hover:underline">
                  Criar conta
                </Link>
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
