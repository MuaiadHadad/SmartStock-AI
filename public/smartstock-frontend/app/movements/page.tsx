"use client";
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Protected from '@/components/Protected';
import { motion } from 'framer-motion';

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
      <motion.div className="space-y-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div>
          <h1 className="text-2xl font-bold">Movimentos de Stock</h1>
          <p className="text-slate-400">Registe entradas (IN) e saídas (OUT).</p>
        </div>
        <motion.div className="glass rounded-xl p-4 space-y-3 max-w-xl" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05, duration: 0.35 }}>
          <form onSubmit={submit} className="space-y-3">
            <select value={productId} onChange={e=>setProductId(e.target.value?Number(e.target.value):'')} className="w-full bg-slate-900/40 border border-slate-700 rounded px-3 py-2">
              <option value="">-- Produto --</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <div className="flex gap-2">
              <select value={type} onChange={e=>setType(e.target.value as any)} className="w-40 bg-slate-900/40 border border-slate-700 rounded px-3 py-2">
                <option value="IN">Entrada (IN)</option>
                <option value="OUT">Saída (OUT)</option>
              </select>
              <input type="number" min={1} value={quantity} onChange={e=>setQuantity(Number(e.target.value))} className="flex-1 bg-slate-900/40 border border-slate-700 rounded px-3 py-2" />
            </div>
            <input value={reason} onChange={e=>setReason(e.target.value)} className="w-full bg-slate-900/40 border border-slate-700 rounded px-3 py-2" placeholder="Motivo" />
            <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold px-4 py-2 rounded">Registar</button>
          </form>
          {message && <div className="text-emerald-400">{message}</div>}
          {error && <div className="text-red-400">{error}</div>}
        </motion.div>
      </motion.div>
    </Protected>
  );
}
