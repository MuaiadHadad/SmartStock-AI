export interface ApiConfig { baseUrl: string; token?: string; }

// Domain types
export type Role = 'admin' | 'manager' | 'operator';
export interface User { id: number; name: string; email: string; role?: Role; active?: boolean }
export interface Product { id: number; name: string; sku: string; current_stock: number; min_stock: number }
export interface StockMovement { id: number; product_id: number; type: 'IN' | 'OUT'; quantity: number; reason: string; occurred_at: string }
export interface Paginated<T> { data: T[]; [key: string]: unknown }

const config: ApiConfig = { baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api' };

if (typeof window !== 'undefined') {
  const saved = window.localStorage.getItem('ss_token');
  if (saved) config.token = saved;
}

export function setToken(token: string) {
  config.token = token;
  if (typeof window !== 'undefined') window.localStorage.setItem('ss_token', token);
}
export function clearToken(){
  config.token = undefined;
  if (typeof window !== 'undefined') window.localStorage.removeItem('ss_token');
}

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string,string> = { 'Accept': 'application/json' };
  if (!(opts.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  if (config.token) headers['Authorization'] = `Bearer ${config.token}`;
  const res = await fetch(`${config.baseUrl}${path}`, { ...opts, headers });
  if (!res.ok) {
    let data: unknown = null;
    try {
      const text = await res.text();
      data = text ? JSON.parse(text) : null;
    } catch {}
    const message = typeof data === 'object' && data && 'error' in (data as Record<string, unknown>) && typeof (data as Record<string, unknown>).error === 'string'
      ? String((data as Record<string, unknown>).error)
      : `Erro ${res.status}`;
    throw new Error(message);
  }
  // No content
  if (res.status === 204) return undefined as unknown as T;
  // Try JSON, fallback to text
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json() as Promise<T>;
  } else {
    const text = await res.text();
    return (text as unknown) as T;
  }
}

export const api = {
  login: (email: string, password: string) => request<{token:string; user: User}>('/auth/login', { method:'POST', body: JSON.stringify({email,password}) }),
  me: () => request<User>('/auth/me'),
  products: (params: Record<string,string|number|boolean> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k,v]) => { if (v!==undefined && v!==null) query.set(k,String(v)); });
    return request<Paginated<Product>>(`/products?${query.toString()}`);
  },
  createMovement: (data: {product_id:number; type:'IN'|'OUT'; quantity:number; reason:string}) => request<{ movement: StockMovement; current_stock: number }>(
    '/stock-movements', { method:'POST', body: JSON.stringify(data) }
  ),
  _forecast: (productId:number, days=30) => request<{ product_id:number; days:number; cmd:number; data: Array<{date:string; predicted_stock:number}>; rupture_date: string | null }>(`/ai/forecast/${productId}?days=${days}`),
  _recommendations: () => request<Array<{ product_id:number; sku:string; name:string; current_stock:number; min_stock:number; cmd:number; recommended_purchase_qty:number; reason:string }>>('/ai/recommendations'),
  register: (data: {name:string; email:string; password:string}) => request<{token:string; user: User}>('/auth/register', { method:'POST', body: JSON.stringify(data) }),
  logout: () => request<void>('/auth/logout', { method:'POST' }),
  createUser: (data: {name:string; email:string; password:string; role:Role}) => request<User>('/users', { method:'POST', body: JSON.stringify(data) }),
};
