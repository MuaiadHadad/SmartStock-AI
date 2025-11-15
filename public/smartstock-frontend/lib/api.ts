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

export const fetchForecast = (productId: number, days = 30) =>
  request<any>(`/ai/forecast/${productId}?days=${days}`);

export const fetchRecommendations = () => request<any>('/ai/recommendations');

export const api = {
  login: (email: string, password: string) => request<{ token: string; user: any }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  me: () => request<any>('/auth/me'),
  products: (params: Record<string, string | number | boolean> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) query.set(k, String(v));
    });
    return request<any>(`/products?${query.toString()}`);
  },
  createMovement: (data: { product_id: number; type: 'IN' | 'OUT'; quantity: number; reason: string }) =>
    request<any>('/stock-movements', { method: 'POST', body: JSON.stringify(data) }),
  forecast: fetchForecast,
  recommendations: fetchRecommendations,
  register: (data: { name: string; email: string; password: string }) =>
    request<{ token: string; user: any }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request<any>('/auth/logout', { method: 'POST' }),
  createUser: (data: { name: string; email: string; password: string; role: 'admin' | 'manager' | 'operator' }) =>
    request<any>('/users', { method: 'POST', body: JSON.stringify(data) }),
};
