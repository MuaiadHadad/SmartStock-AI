'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    TrendingUp,
    Brain,
    User,
    LogOut,
    Menu,
    ChevronLeft,
    Moon,
    Sun,
    Boxes,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

interface MenuItem {
    icon: LucideIcon;
    label: string;
    href: string;
    badge?: number;
}

const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Boxes, label: 'Inventário', href: '/inventory' },
    { icon: TrendingUp, label: 'Movimentos', href: '/movements' },
    { icon: User, label: 'Utilizadores', href: '/users' },
];

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const { logout } = useAuth();

    // Hide sidebar on public pages
    const publicPaths = ['/', '/login', '/register'];
    if (publicPaths.includes(pathname)) return null;

    return (
        <>
            {/* Overlay para mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-screen
                    glass-strong backdrop-blur-xl
                    border border-slate-200/70 dark:border-slate-800/80
                    transition-all duration-300 ease-in-out
                    ${isOpen ? 'w-64' : 'w-20'}
                `}
            >
                {/* Header com Logo */}
                <div className="flex h-16 items-center justify-between border-b border-slate-200/70 px-4 dark:border-slate-800/80">
                    <div className={`flex items-center gap-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg">
                            <Brain className="h-5 w-5 text-slate-900" />
                        </div>
                        {isOpen && (
                            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                <span className="text-emerald-500">Smart</span>
                                <span>Stock</span>
                            </h1>
                        )}
                    </div>

                    {/* Botão Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="rounded-full p-2 text-slate-500 transition-colors duration-200 hover:bg-slate-200/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100"
                        aria-label="Toggle menu"
                    >
                        <ChevronLeft
                            className={`h-5 w-5 transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`}
                        />
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="py-4 px-2 space-y-1">
                    {menuItems.map((item) => {
                        const IconComponent = item.icon;
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-3 py-3 rounded-lg
                                    transition-all duration-200
                                    ${active
                                        ? 'bg-emerald-500/15 text-emerald-600 shadow-lg shadow-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-300'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 hover:text-slate-900 dark:hover:bg-slate-800/70 dark:hover:text-slate-200'
                                    }
                                `}
                            >
                                {/* Icon */}
                                <IconComponent
                                    className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110' : ''}`}
                                />

                                {/* Label */}
                                {isOpen && (
                                    <span className="font-medium transition-opacity duration-300">
                                        {item.label}
                                    </span>
                                )}

                                {/* Active Indicator */}
                                {active && (
                                    <div className="ml-auto h-6 w-1 rounded-full bg-emerald-500 dark:bg-emerald-300" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 space-y-2 border-t border-slate-200/70 p-4 dark:border-slate-800/80">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`
                            w-full flex items-center gap-3 px-3 py-3 rounded-lg
                            text-slate-600 dark:text-slate-400
                            hover:bg-slate-200/70 dark:hover:bg-slate-800/70
                            hover:text-slate-900 dark:hover:text-slate-100
                            transition-all duration-200 group
                        `}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-180" />
                        ) : (
                            <Moon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                        )}
                        {isOpen && (
                            <span className="font-medium">
                                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                            </span>
                        )}
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={logout}
                        className={`
                            w-full flex items-center gap-3 px-3 py-3 rounded-lg
                            text-red-400 hover:bg-red-500/20 transition-all duration-200
                            group
                        `}
                    >
                        <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                        {isOpen && (
                            <span className="font-medium">Sair</span>
                        )}
                    </button>
                </div>
            </aside>

            {/* Botão Mobile Toggle (quando sidebar fechada) */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed top-4 left-4 lg:hidden p-3 rounded-lg bg-slate-100 dark:bg-slate-900 text-emerald-400 shadow-lg z-30 hover:scale-110 transition-transform duration-200"
                    aria-label="Abrir menu"
                >
                    <Menu className="w-6 h-6" />
                </button>
            )}
        </>
    );
}
