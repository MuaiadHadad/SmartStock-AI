'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    TrendingUp,
    Brain,
    Settings,
    User,
    LogOut,
    Menu,
    ChevronLeft,
    Moon,
    Sun,
    Boxes
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
                    fixed top-0 left-0 h-screen
                    bg-slate-50 dark:bg-slate-900/95
                    backdrop-blur-md
                    border-r border-slate-200 dark:border-slate-800
                    shadow-2xl z-50
                    transition-all duration-300 ease-in-out
                    ${isOpen ? 'w-64' : 'w-20'}
                `}
            >
                {/* Header com Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
                    <div className={`flex items-center gap-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg">
                            <Brain className="w-5 h-5 text-slate-900" />
                        </div>
                        {isOpen && (
                            <h1 className="text-lg font-bold">
                                <span className="text-emerald-400">Smart</span>
                                <span className="text-slate-900 dark:text-slate-50">Stock</span>
                            </h1>
                        )}
                    </div>

                    {/* Botão Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-200"
                        aria-label="Toggle menu"
                    >
                        <ChevronLeft
                            className={`w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`}
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
                                        ? 'bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
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
                                    <div className="ml-auto w-1 h-6 bg-emerald-400 rounded" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`
                            w-full flex items-center gap-3 px-3 py-3 rounded-lg
                            text-slate-600 dark:text-slate-400
                            hover:bg-slate-200 dark:hover:bg-slate-800
                            hover:text-slate-900 dark:hover:text-slate-200
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
