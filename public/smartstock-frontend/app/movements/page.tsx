"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Protected from "@/components/Protected";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeftRight, ClipboardCheck } from "lucide-react";

interface Product {
  id: number;
  name: string;
}

export default function MovementsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState<number | "">("");
  const [type, setType] = useState<"IN" | "OUT">("IN");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("compra");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadProducts() {
    try {
      const res = await api.products({});
      setProducts(res.data || []);
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    if (!productId) {
      setError("Selecione produto");
      return;
    }
    try {
      const res = await api.createMovement({ product_id: Number(productId), type, quantity, reason });
      setMessage(`Movimento criado. Stock atual: ${res.current_stock}`);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <Protected>
      <motion.div
        className="space-y-6 text-slate-900 transition-colors duration-500 dark:text-slate-100"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/70">
          <div className="absolute -top-14 right-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-28 w-28 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-emerald-600 backdrop-blur dark:text-emerald-300">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.3em]">Fluxo operacional</span>
              </div>
              <h1 className="text-3xl font-bold">Registo de movimentos</h1>
              <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                Lançamentos animados para entradas (IN) e saídas (OUT) com feedback imediato do stock restante.
              </p>
            </div>
            <div className="glass flex items-center gap-3 rounded-2xl border border-transparent px-5 py-3 text-slate-900 shadow-lg dark:text-slate-100">
              <ArrowLeftRight className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-300">Movimento atual</p>
                <p className="font-semibold">{type === "IN" ? "Entrada" : "Saída"} de stock</p>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          className="glass rounded-3xl border border-transparent p-6 shadow-xl"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Produto</label>
                <div className="relative">
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value ? Number(e.target.value) : "")}
                    className="w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800/70 dark:bg-slate-900/60 dark:text-slate-100"
                  >
                    <option value="">Selecione um produto</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-4 grid place-items-center text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                    SKU
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Tipo</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["IN", "OUT"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setType(option)}
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                        type === option
                          ? "border-emerald-500/70 bg-emerald-500/15 text-emerald-600 shadow-sm dark:border-emerald-400/80 dark:bg-emerald-500/20 dark:text-emerald-200"
                          : "border-slate-200/80 bg-white/70 text-slate-600 hover:border-emerald-400/60 dark:border-slate-800/70 dark:bg-slate-900/60 dark:text-slate-300"
                      }`}
                    >
                      {option === "IN" ? "Entrada (IN)" : "Saída (OUT)"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Quantidade</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800/70 dark:bg-slate-900/60 dark:text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Motivo</label>
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800/70 dark:bg-slate-900/60 dark:text-slate-100"
                  placeholder="Ex: compra, venda, ajuste"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="shine flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg"
            >
              <ClipboardCheck className="h-4 w-4" />
              Registar movimento
            </motion.button>
          </form>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-2xl border border-emerald-200/70 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-600 shadow-sm dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
            >
              {message}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-2xl border border-red-200/70 bg-red-50/80 px-4 py-3 text-sm text-red-600 shadow-sm dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
            >
              {error}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </Protected>
  );
}
