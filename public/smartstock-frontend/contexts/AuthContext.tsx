'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { api, clearToken, setToken } from '@/lib/api';

interface AuthContextType {
  user: any|null;
  loading: boolean;
  login: (email:string, password:string)=>Promise<void>;
  register: (name:string, email:string, password:string)=>Promise<void>;
  logout: ()=>Promise<void>;
}

const AuthContext = createContext<AuthContextType|undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }){
  const [user,setUser] = useState<any|null>(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    (async ()=>{
      try { const u = await api.me(); setUser(u); } catch { /* not logged */ }
      setLoading(false);
    })();
  },[]);

  async function login(email:string, password:string){
    const { token, user } = await api.login(email,password);
    setToken(token);
    setUser(user);
  }

  async function register(name:string, email:string, password:string){
    const { token, user } = await api.register({ name,email,password });
    setToken(token);
    setUser(user);
  }

  async function logout(){
    try { await api.logout(); } catch {}
    clearToken();
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth(){
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
