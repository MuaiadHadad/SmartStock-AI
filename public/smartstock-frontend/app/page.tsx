"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, Boxes, TrendingUp, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-2rem)] flex items-center">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] bg-cyan-500/10 blur-3xl rounded-full animate-float-slow" />
      </div>

      <div className="relative z-10 grid lg:grid-cols-2 items-center gap-10 w-full">
        {/* Hero copy */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-300">
            <Brain className="h-4 w-4" />
            <span className="text-xs font-medium">AI-Driven Inventory</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
          >
            Gestão de Estoque com Inteligência
            <span className="text-emerald-400"> em Tempo Real</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-slate-400 max-w-xl"
          >
            Previsões, recomendações e operações simplificadas para controlar seu inventário com precisão e velocidade.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-wrap gap-3"
          >
            <Link href="/login" className="px-5 py-3 rounded-lg bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-400 transition">Entrar</Link>
            <Link href="/register" className="px-5 py-3 rounded-lg border border-emerald-500/30 hover:border-emerald-400/60 text-emerald-300 transition">Criar conta</Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4"
          >
            <Feature icon={<Boxes className="h-5 w-5" />} title="Inventário" desc="Visualize stock e mínimos" />
            <Feature icon={<TrendingUp className="h-5 w-5" />} title="Movimentos" desc="Registe entradas/saídas" />
            <Feature icon={<Shield className="h-5 w-5" />} title="Segurança" desc="Autenticação JWT" />
          </motion.div>
        </div>

        {/* Showcase card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="glass rounded-2xl p-6 border border-slate-800/60 shadow-2xl"
        >
          <div className="aspect-[16/10] rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden relative">
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 mb-2">
                  <Boxes className="w-6 h-6" />
                </div>
                <p className="text-lg font-semibold">Dashboard Inteligente</p>
                <p className="text-slate-400 text-sm">Demonstração visual do seu stock e recomendações</p>
              </div>
            </div>
            <div className="absolute -bottom-12 -left-12 h-48 w-48 bg-emerald-500/10 blur-3xl rounded-full" />
            <div className="absolute -top-12 -right-12 h-48 w-48 bg-cyan-500/10 blur-3xl rounded-full" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }){
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-emerald-300">{icon}</div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-slate-400">{desc}</p>
      </div>
    </div>
  );
}
