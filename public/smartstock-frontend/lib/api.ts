export interface ApiConfig { baseUrl: string; token?: string; }

let config: ApiConfig = { baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api' };

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
    let data: any = null;
    try { data = await res.json(); } catch {}
    throw new Error(data?.error || `Erro ${res.status}`);
  }
  return res.json();
}

export const api = {
  login: (email: string, password: string) => request<{token:string; user:any}>('/auth/login', { method:'POST', body: JSON.stringify({email,password}) }),
  me: () => request<any>('/auth/me'),
  products: (params: Record<string,string|number|boolean> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k,v]) => { if (v!==undefined && v!==null) query.set(k,String(v)); });
    return request<any>(`/products?${query.toString()}`);
  },
  createMovement: (data: {product_id:number; type:'IN'|'OUT'; quantity:number; reason:string}) => request<any>('/stock-movements', { method:'POST', body: JSON.stringify(data) }),
  forecast: (productId:number, days=30) => request<any>(`/ai/forecast/${productId}?days=${days}`),
  recommendations: () => request<any>('/ai/recommendations'),
  register: (data: {name:string; email:string; password:string}) => request<{token:string; user:any}>('/auth/register', { method:'POST', body: JSON.stringify(data) }),
  logout: () => request<any>('/auth/logout', { method:'POST' }),
  createUser: (data: {name:string; email:string; password:string; role:'admin'|'manager'|'operator'}) => request<any>('/users', { method:'POST', body: JSON.stringify(data) }),
};
