"use client";
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Protected from '@/components/Protected';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeftRight, ClipboardCheck } from 'lucide-react';

interface Product { id:number; name:string; }

export default function MovementsPage(){
  const [products,setProducts]=useState<Product[]>([]);
  const [productId,setProductId]=useState<number|''>('');
  const [type,setType]=useState<'IN'|'OUT'>('IN');
  const [quantity,setQuantity]=useState(1);
  const [reason,setReason]=useState('compra');
  const [message,setMessage]=useState<string|null>(null);
  const [error,setError]=useState<string|null>(null);

  async function loadProducts(){ try { const res = await api.products({}); setProducts(res.data||[]); } catch(err:any){ setError(err.message); } }
  useEffect(()=>{ loadProducts(); },[]);

  async function submit(e:React.FormEvent){
    e.preventDefault(); setMessage(null); setError(null);
    if(!productId) { setError('Selecione produto'); return; }
    try { const res = await api.createMovement({product_id:Number(productId), type, quantity, reason}); setMessage(`Movimento criado. Stock atual: ${res.current_stock}`); }
    catch(err:any){ setError(err.message); }
  }

  return (
    <Protected>
      <motion.div className="space-y-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/60 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-2xl">
          <div className="absolute -top-14 right-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-300">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.3em]">Fluxo operacional</span>
              </div>
              <h1 className="text-3xl font-bold">Registo de movimentos</h1>
              <p className="max-w-2xl text-sm text-slate-300">
                Lançamentos animados para entradas (IN) e saídas (OUT) com feedback imediato do stock restante.
              </p>
            </div>
            <div className="glass-light border-gradient flex items-center gap-3 rounded-2xl px-5 py-3 text-slate-900">
              <ArrowLeftRight className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-emerald-500">Movimento atual</p>
                <p className="font-semibold text-slate-900">{type === 'IN' ? 'Entrada' : 'Saída'} de stock</p>
              </div>
            </div>
          </div>
        </div>

        <motion.div className="glass rounded-3xl border border-slate-800/60 p-6 shadow-xl" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Produto</label>
                <div className="relative">
                  <select
                    value={productId}
                    onChange={e=>setProductId(e.target.value?Number(e.target.value):'')}
                    className="w-full rounded-2xl border border-slate-800/60 bg-slate-950/70 px-4 py-3 text-sm text-slate-200 focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="">Selecione um produto</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-4 grid place-items-center text-xs uppercase tracking-[0.25em] text-slate-500">SKU</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Tipo</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['IN', 'OUT'] as const).map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setType(option)}
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                        type === option
                          ? 'border-emerald-400/80 bg-emerald-500/20 text-emerald-200'
                          : 'border-slate-800/60 bg-slate-950/70 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {option === 'IN' ? 'Entrada (IN)' : 'Saída (OUT)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Quantidade</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={e=>setQuantity(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-800/60 bg-slate-950/70 px-4 py-3 text-sm text-slate-200 focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Motivo</label>
                <input
                  value={reason}
                  onChange={e=>setReason(e.target.value)}
                  className="w-full rounded-2xl border border-slate-800/60 bg-slate-950/70 px-4 py-3 text-sm text-slate-200 focus:border-emerald-400 focus:outline-none"
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
