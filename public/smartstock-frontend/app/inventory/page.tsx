"use client";
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Protected from '@/components/Protected';
import { motion } from 'framer-motion';

interface Product { id:number; name:string; sku:string; current_stock:number; min_stock:number; }

export default function InventoryPage(){
  const [products,setProducts] = useState<Product[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<string|null>(null);
  const [search,setSearch] = useState('');

  async function load(){
    setLoading(true); setError(null);
    try { const res = await api.products({ search }); setProducts(res.data || []); }
    catch(err:any){ setError(err.message); }
    finally { setLoading(false); }
  }

  useEffect(()=>{ load(); },[]);

  return (
    <Protected>
      <motion.div className="space-y-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div>
          <h1 className="text-2xl font-bold">Inventário</h1>
          <p className="text-slate-400">Lista de produtos com estado de stock.</p>
        </div>
        <motion.div className="glass rounded-xl p-4 space-y-3" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05, duration: 0.35 }}>
          <div className="flex gap-2">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Pesquisar por nome/SKU" className="w-full bg-slate-900/40 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <button onClick={load} className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold px-4 py-2 rounded">Filtrar</button>
          </div>
          {error && <div className="text-red-400">{error}</div>}
          {loading ? (<div>Carregando...</div>) : (
            <motion.div className="overflow-auto rounded border border-slate-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <table className="min-w-full text-sm">
                <thead className="bg-slate-900/60 text-slate-300">
                  <tr>
                    <th className="p-3 text-left">Nome</th>
                    <th className="p-3 text-left">SKU</th>
                    <th className="p-3 text-left">Stock</th>
                    <th className="p-3 text-left">Min</th>
                    <th className="p-3 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-t border-slate-800 hover:bg-slate-900/30">
                      <td className="p-3">{p.name}</td>
                      <td className="p-3">{p.sku}</td>
                      <td className="p-3">{p.current_stock}</td>
                      <td className="p-3">{p.min_stock}</td>
                      <td className="p-3">{p.current_stock <= p.min_stock ? <span className="text-red-400">Baixo</span> : <span className="text-emerald-400">OK</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </Protected>
  );
}
