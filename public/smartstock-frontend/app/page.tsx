"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Boxes, TrendingUp, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/inventory");
    }
  }, [loading, user, router]);

  if (loading || user) {
    return null;
  }

  return (
    <div className="relative flex min-h-[calc(100vh-2rem)] items-center overflow-hidden bg-slate-100 px-6 py-12 text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-cyan-400/20 blur-3xl animate-float-slow dark:bg-cyan-500/10" />
      </div>

      <div className="relative z-10 grid w-full items-center gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-emerald-600 shadow-sm backdrop-blur dark:text-emerald-300">
            <Brain className="h-4 w-4" />
            <span className="text-xs font-medium">AI-Driven Inventory</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold tracking-tight md:text-6xl"
          >
            Gestão de Estoque com Inteligência
            <span className="text-emerald-500 dark:text-emerald-400"> em Tempo Real</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="max-w-xl text-slate-600 dark:text-slate-300"
          >
            Previsões, recomendações e operações simplificadas para controlar seu inventário com precisão e velocidade.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-wrap gap-3"
          >
            <Link
              href="/login"
              className="rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="rounded-lg border border-slate-300/70 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-slate-700/70 dark:text-slate-200"
            >
              Criar conta
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3"
          >
            <Feature icon={<Boxes className="h-5 w-5" />} title="Inventário" desc="Visualize stock e mínimos" />
            <Feature icon={<TrendingUp className="h-5 w-5" />} title="Movimentos" desc="Registe entradas/saídas" />
            <Feature icon={<Shield className="h-5 w-5" />} title="Segurança" desc="Autenticação JWT" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="glass rounded-2xl border border-transparent p-6 shadow-xl"
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gradient-to-br from-white/80 via-slate-100/80 to-slate-200/80 shadow-inner dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950">
            <div className="absolute inset-0 grid place-items-center">
              <div className="space-y-2 text-center">
                <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 shadow-sm dark:text-emerald-300">
                  <Boxes className="h-6 w-6" />
                </div>
                <p className="text-lg font-semibold">Dashboard Inteligente</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Demonstração visual do seu stock e recomendações</p>
              </div>
            </div>
            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200/60 bg-white/70 p-4 text-slate-700 shadow-sm transition dark:border-slate-800/70 dark:bg-slate-900/40 dark:text-slate-200">
      <div className="mt-1 text-emerald-500 dark:text-emerald-300">{icon}</div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
      </div>
    </div>
  );
}
