"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Boxes, TrendingUp, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface HeroForecastResponse {
  product_id: number;
  rupture_date: string | null;
  data: { date: string; predicted_stock: number }[];
}

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [heroForecast, setHeroForecast] = useState<HeroForecastResponse | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [forecastLoading, setForecastLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/inventory");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let active = true;
    const bootstrap = async () => {
      const token = window.localStorage.getItem("ss_token");
      if (!active) return;
      if (!token) {
        setHasToken(false);
        setHeroForecast(null);
        return;
      }
      setHasToken(true);
      const demoProduct = Number(process.env.NEXT_PUBLIC_DEMO_PRODUCT_ID || 1);
      setForecastLoading(true);
      try {
        const data = await api.forecast(demoProduct, 14);
        if (!active) return;
        setHeroForecast(data);
      } catch {
        if (!active) return;
        setHeroForecast(null);
      } finally {
        if (active) {
          setForecastLoading(false);
        }
      }
    };
    bootstrap();
    return () => {
      active = false;
    };
  }, []);

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
          <HeroForecastCard forecast={heroForecast} loading={forecastLoading} hasToken={hasToken} />
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

function HeroForecastCard({
  forecast,
  loading,
  hasToken,
}: {
  forecast: HeroForecastResponse | null;
  loading: boolean;
  hasToken: boolean;
}) {
  const points = forecast?.data ?? [];
  const max = Math.max(...points.map((p) => p.predicted_stock), 1);
  const min = 0;
  const path = points
    .map((pt, idx) => {
      const x = (idx / Math.max(points.length - 1, 1)) * 100;
      const y = ((max - pt.predicted_stock) / Math.max(max - min, 1)) * 100;
      return `${idx === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Visão executiva</p>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Previsão em tempo real</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Curvas alimentadas pelos endpoints /ai/forecast.</p>
      </div>
      {loading ? (
        <div className="h-48 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-900/60" />
      ) : points.length ? (
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-inner dark:border-slate-800/70 dark:bg-slate-900/70">
          <svg viewBox="0 0 100 100" className="h-40 w-full overflow-visible">
            <defs>
              <linearGradient id="heroLine" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
              <linearGradient id="heroFill" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#34d39933" />
                <stop offset="100%" stopColor="#22d3ee00" />
              </linearGradient>
            </defs>
            <path d={`${path} L100,100 L0,100 Z`} fill="url(#heroFill)" stroke="none" />
            <path d={path} fill="none" stroke="url(#heroLine)" strokeWidth={2.4} strokeLinecap="round" />
          </svg>
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
            <span>Produto #{forecast?.product_id}</span>
            <span>
              Ruptura prevista: {forecast?.rupture_date ? new Date(forecast.rupture_date).toLocaleDateString() : "Sem risco"}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {hasToken
            ? "Selecione um produto autenticado para destravar o gráfico de previsão."
            : "Entre na plataforma para alimentar este gráfico com dados reais do seu stock."}
        </p>
      )}
    </div>
  );
}
