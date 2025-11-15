"use client";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import Protected from "@/components/Protected";
import { AnimatePresence, motion } from "framer-motion";
import { Boxes, AlertTriangle, TrendingUp } from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku: string;
  current_stock: number;
  min_stock: number;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);

  async function filterProducts() {
    setIsFiltering(true);
    setError(null);
    try {
      const res = await api.products({ search });
      setProducts(res.data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar';
      setError(msg);
    } finally {
      setIsFiltering(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.products({});
        if (mounted) setProducts(res.data || []);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erro ao carregar';
        if (mounted) setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const metrics = useMemo(() => {
    const totalProducts = products.length;
    const lowStock = products.filter((p) => p.current_stock <= p.min_stock).length;
    const totalUnits = products.reduce((acc, p) => acc + p.current_stock, 0);
    const coverage = totalProducts ? Math.round((1 - lowStock / Math.max(totalProducts, 1)) * 100) : 100;
    return { totalProducts, lowStock, totalUnits, coverage };
  }, [products]);

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
          />
          <MetricCard
            icon={<AlertTriangle className="h-5 w-5" />}
            label="Alertas de stock"
            value={metrics.lowStock}
            accent="from-red-500/15 to-transparent"
            valueClassName={metrics.lowStock > 0 ? "text-red-500 dark:text-red-300" : "text-emerald-600 dark:text-emerald-300"}
          />
          <MetricCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Unidades disponíveis"
            value={metrics.totalUnits}
            accent="from-cyan-400/15 to-transparent"
          />
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
              onClick={() => filterProducts()}
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
                  </tr>
                </thead>
                <AnimatePresence initial={false}>
                  <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/60">
                    {products.map((p) => {
                      const low = p.current_stock <= p.min_stock;
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
  valueClassName,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  accent: string;
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
          <p className={`${valueClassName ?? "text-slate-900 dark:text-slate-100"} text-3xl font-bold`}>{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-emerald-600 shadow-sm dark:bg-slate-900/70 dark:text-emerald-300">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
