"use client";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import Protected from "@/components/Protected";
import { AnimatePresence, motion } from "framer-motion";
import { Boxes, AlertTriangle, TrendingUp, Sparkles, CalendarClock } from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku: string;
  current_stock: number;
  min_stock: number;
}

interface Recommendation {
  product_id: number;
  name: string;
  sku: string;
  current_stock: number;
  min_stock: number;
  cmd: number;
  recommended_purchase_qty: number;
  reason: string;
}

interface ForecastPoint {
  date: string;
  predicted_stock: number;
}

interface ForecastResponse {
  product_id: number;
  cmd: number;
  rupture_date: string | null;
  data: ForecastPoint[];
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [forecastProductId, setForecastProductId] = useState<number | null>(null);
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null);
  const [forecastLoading, setForecastLoading] = useState(false);

  const loadAiInsights = useCallback(async (nextProducts: Product[]) => {
    setInsightsLoading(true);
    setAiError(null);
    try {
      const recs = await api.recommendations();
      setRecommendations(recs);
      setForecastProductId((prev) => {
        if (prev && nextProducts.some((p) => p.id === prev)) {
          return prev;
        }
        return recs[0]?.product_id ?? nextProducts[0]?.id ?? null;
      });
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Não foi possível carregar recomendações");
    } finally {
      setInsightsLoading(false);
    }
  }, []);

  const load = useCallback(async ({ showSkeleton = true, fetchAi = false } = {}) => {
    if (showSkeleton) {
      setLoading(true);
    } else {
      setIsFiltering(true);
    }
    setError(null);
    try {
      const res = await api.products({ search });
      setProducts(res.data || []);
      if (fetchAi) {
        loadAiInsights(res.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar produtos");
    } finally {
      if (showSkeleton) {
        setLoading(false);
      }
      setIsFiltering(false);
    }
  }, [loadAiInsights, search]);

  useEffect(() => {
    load({ fetchAi: true });
  }, [load]);

  useEffect(() => {
    let active = true;
    async function fetchForecast(productId: number) {
      setForecastLoading(true);
      setAiError(null);
      try {
        const res = await api.forecast(productId, 21);
        if (!active) return;
        setForecastData(res);
      } catch (err) {
        if (!active) return;
        setForecastData(null);
        setAiError(err instanceof Error ? err.message : "Falha ao projetar curva");
      } finally {
        if (active) {
          setForecastLoading(false);
        }
      }
    }

    if (forecastProductId) {
      fetchForecast(forecastProductId);
    } else {
      setForecastData(null);
    }

    return () => {
      active = false;
    };
  }, [forecastProductId]);

  const metrics = useMemo(() => {
    const totalProducts = products.length;
    const recommendedProducts = recommendations.length;
    const totalUnits = products.reduce((acc, p) => acc + p.current_stock, 0);
    const coverage = totalProducts
      ? Math.round((1 - recommendedProducts / Math.max(totalProducts, 1)) * 100)
      : 100;
    const suggestedUnits = recommendations.reduce((sum, rec) => sum + rec.recommended_purchase_qty, 0);
    return { totalProducts, recommendedProducts, totalUnits, coverage, suggestedUnits };
  }, [products, recommendations]);

  const recommendationMap = useMemo(() => {
    const map = new Map<number, Recommendation>();
    recommendations.forEach((rec) => map.set(rec.product_id, rec));
    return map;
  }, [recommendations]);

  const rowVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  return (
    <Protected>
      <motion.div
        className="space-y-6 text-slate-900 transition-colors duration-500 dark:text-slate-100"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-xl backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/70">
          <div className="absolute -top-20 -right-16 h-60 w-60 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="absolute bottom-0 left-12 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Dashboard de operações</p>
              <h1 className="text-3xl font-bold md:text-4xl">Inventário em tempo real</h1>
              <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                Monitorize níveis de stock, identifique alertas críticos e acompanhe o desempenho do armazém com animações suaves e feedback instantâneo.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="glass flex w-full max-w-sm items-center gap-4 rounded-2xl border border-transparent px-6 py-4 text-slate-900 shadow-lg dark:text-slate-100"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-300">Cobertura</p>
                <p className="text-2xl font-black">{metrics.coverage}%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Produtos acima do nível mínimo</p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            icon={<Boxes className="h-5 w-5" />}
            label="Produtos ativos"
            value={metrics.totalProducts}
            accent="from-emerald-500/10 to-transparent"
            subtitle={`${metrics.totalUnits} unidades em armazém`}
          />
          <MetricCard
            icon={<AlertTriangle className="h-5 w-5" />}
            label="Alertas preditivos"
            value={metrics.recommendedProducts}
            accent="from-red-500/15 to-transparent"
            subtitle="Sugestões de compra da IA"
            valueClassName={
              metrics.recommendedProducts > 0 ? "text-red-500 dark:text-red-300" : "text-emerald-600 dark:text-emerald-300"
            }
          />
          <MetricCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Cobertura otimizada"
            value={metrics.coverage}
            accent="from-cyan-400/15 to-transparent"
            suffix="%"
            subtitle={`${metrics.suggestedUnits} unidades sugeridas para compra`}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <motion.div
            className="glass rounded-3xl border border-transparent p-6 shadow-xl"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Recomendações IA</p>
                <h2 className="text-xl font-semibold">Itens com ruptura iminente</h2>
              </div>
              <Sparkles className="h-5 w-5 text-emerald-500 dark:text-emerald-300" />
            </div>
            {insightsLoading ? (
              <div className="space-y-3">
                {[...Array(3).keys()].map((idx) => (
                  <div key={idx} className="h-14 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/60" />
                ))}
              </div>
            ) : recommendations.length ? (
              <div className="space-y-3">
                {recommendations.slice(0, 4).map((rec) => (
                  <div
                    key={rec.product_id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-slate-200"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{rec.name}</p>
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">{rec.reason}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-300">+{rec.recommended_purchase_qty}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">CMD {rec.cmd.toFixed(1)} u/dia</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
                Todo o portfólio está acima do limite mínimo previsto.
              </div>
            )}
            {aiError && (
              <p className="mt-3 text-xs text-red-500 dark:text-red-300">{aiError}</p>
            )}
          </motion.div>

          <motion.div
            className="glass rounded-3xl border border-transparent p-6 shadow-xl"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex flex-col gap-3 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Previsão</p>
                  <h2 className="text-xl font-semibold">Curva projetada</h2>
                </div>
                <CalendarClock className="h-5 w-5 text-cyan-500" />
              </div>
              <select
                value={forecastProductId ?? ""}
                onChange={(e) => setForecastProductId(e.target.value ? Number(e.target.value) : null)}
                className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800/70 dark:bg-slate-900/60 dark:text-slate-100"
              >
                <option value="">Selecione um produto</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            {forecastLoading ? (
              <div className="h-48 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/70" />
            ) : forecastData ? (
              <ForecastPanel forecast={forecastData} product={products.find((p) => p.id === forecastData.product_id) || null} />
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">Selecione um produto para visualizar a curva prevista.</p>
            )}
          </motion.div>
        </div>

        <motion.div
          className="glass rounded-3xl border border-transparent p-6 shadow-xl"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05, duration: 0.35 }}
        >
          <div className="flex flex-col gap-3 pb-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-2 shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 dark:border-slate-800/80 dark:bg-slate-900/60">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar por nome ou SKU"
                className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              <span className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Busca</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => load({ showSkeleton: false })}
              className="shine flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg"
            >
              Filtrar
              {isFiltering && (
                <motion.span
                  className="h-2 w-2 rounded-full bg-slate-900 dark:bg-white"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
              )}
            </motion.button>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200/70 bg-red-50/80 px-4 py-2 text-sm text-red-600 shadow-sm dark:border-red-900/60 dark:bg-red-500/10 dark:text-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[...Array(5).keys()].map((idx) => (
                <div key={idx} className="h-12 animate-pulse rounded-xl bg-slate-200/70 dark:bg-slate-800/60" />
              ))}
            </div>
          ) : (
            <motion.div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm dark:border-slate-800/70">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100/80 text-slate-600 dark:bg-slate-900/80 dark:text-slate-300">
                  <tr className="text-left text-xs uppercase tracking-[0.2em]">
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Min</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Sugestão IA</th>
                  </tr>
                </thead>
                <AnimatePresence initial={false}>
                  <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/60">
                    {products.map((p) => {
                      const low = p.current_stock <= p.min_stock;
                      const rec = recommendationMap.get(p.id);
                      return (
                        <motion.tr
                          key={p.id}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className={`transition-colors duration-300 ${low ? "bg-red-50/70 dark:bg-red-500/5" : "bg-white/70 hover:bg-slate-50 dark:bg-slate-900/40 dark:hover:bg-slate-900/60"}`}
                        >
                          <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{p.name}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{p.sku}</td>
                          <td className="px-4 py-3 text-slate-900 dark:text-slate-100">{p.current_stock}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{p.min_stock}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${low ? "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-200" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200"}`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {low ? "Baixo" : "Estável"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {rec ? (
                              <div className="flex flex-col text-xs text-slate-600 dark:text-slate-300">
                                <span className="font-semibold text-slate-900 dark:text-slate-100">Comprar +{rec.recommended_purchase_qty}</span>
                                <span className="text-[11px] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">CMD {rec.cmd.toFixed(1)} u/dia</span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 dark:text-slate-500">Sem ação</span>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </AnimatePresence>
              </table>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </Protected>
  );
}

function MetricCard({
  icon,
  label,
  value,
  accent,
  suffix,
  subtitle,
  valueClassName,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  accent: string;
  suffix?: string;
  subtitle?: string;
  valueClassName?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-slate-900 shadow-lg dark:border-slate-800/70 dark:bg-slate-900/60 dark:text-slate-100`}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent}`} />
      <div className="relative flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">{label}</p>
          <p className={`text-3xl font-bold ${valueClassName ?? "text-slate-900 dark:text-slate-100"}`}>
            {value}
            {suffix}
          </p>
          {subtitle && <p className="text-xs text-slate-600 dark:text-slate-400">{subtitle}</p>}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-emerald-600 shadow-sm dark:bg-slate-900/70 dark:text-emerald-300">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function ForecastPanel({ forecast, product }: { forecast: ForecastResponse; product: Product | null }) {
  const points = forecast.data;
  if (!points.length) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Sem dados suficientes para prever este item.</p>;
  }

  const maxStock = Math.max(...points.map((p) => p.predicted_stock), product?.current_stock ?? 0, 1);
  const minStock = 0;
  const d = points
    .map((pt, idx) => {
      const x = (idx / Math.max(points.length - 1, 1)) * 100;
      const y = ((maxStock - pt.predicted_stock) / Math.max(maxStock - minStock, 1)) * 100;
      return `${idx === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-inner dark:border-slate-800/70 dark:bg-slate-900/70">
        <svg viewBox="0 0 100 100" className="h-48 w-full overflow-visible">
          <defs>
            <linearGradient id="forecastLine" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <linearGradient id="forecastFill" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#34d39933" />
              <stop offset="100%" stopColor="#22d3ee00" />
            </linearGradient>
          </defs>
          <path d={`${d} L100,100 L0,100 Z`} fill="url(#forecastFill)" stroke="none" />
          <path d={d} fill="none" stroke="url(#forecastLine)" strokeWidth={2.2} strokeLinecap="round" />
          <line
            x1="0"
            x2="100"
            y1={((maxStock - (product?.min_stock ?? 0)) / Math.max(maxStock - minStock, 1)) * 100}
            y2={((maxStock - (product?.min_stock ?? 0)) / Math.max(maxStock - minStock, 1)) * 100}
            stroke="#f87171"
            strokeDasharray="4 4"
            strokeWidth={0.8}
          />
        </svg>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Produto</p>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{product?.name ?? "—"}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Ruptura prevista</p>
          <p className="font-semibold text-rose-500 dark:text-rose-300">{forecast.rupture_date ? new Date(forecast.rupture_date).toLocaleDateString() : "Sem risco"}</p>
        </div>
      </div>
    </div>
  );
}
