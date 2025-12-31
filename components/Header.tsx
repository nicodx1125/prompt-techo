import Link from 'next/link';
import Image from 'next/image';
import { Plus, LogIn, LogOut } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface HeaderProps {
    onCreateClick?: () => void;
    user?: User | null;
    onLoginClick?: () => void;
    onLogoutClick?: () => void;
    loading?: boolean;
}

export default function Header({ onCreateClick, user, onLoginClick, onLogoutClick, loading }: HeaderProps) {
    return (
        <header className="border-b border-slate-200 bg-white/80 text-slate-700 p-4 sticky top-0 z-40 backdrop-blur-md">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-3 text-xl font-bold hover:text-indigo-600 transition-colors">
                    <Image src="/icon.png" alt="Logo" width={32} height={32} className="rounded-lg shadow-sm" />
                    <span className="text-slate-800">プロンプト手帳</span>
                </Link>
                <nav className="flex items-center gap-2">
                    {onCreateClick && (
                        <button
                            onClick={onCreateClick}
                            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-full transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">新規作成</span>
                        </button>
                    )}

                    <div className="h-6 w-px bg-slate-300 mx-1 hidden sm:block"></div>

                    {loading ? (
                        <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
                    ) : user ? (
                        <div className="flex items-center gap-2">
                            <div className="hidden md:flex flex-col items-end mr-1">
                                <span className="text-xs font-medium text-slate-700">{user.email}</span>
                            </div>
                            <button
                                onClick={onLogoutClick}
                                title="ログアウト"
                                className="flex items-center space-x-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 font-medium py-2 px-4 rounded-full transition-colors"
                            >
                                <LogOut size={18} />
                                <span className="hidden sm:inline text-sm">ログアウト</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onLoginClick}
                            className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-4 rounded-full transition-colors"
                        >
                            <LogIn size={18} />
                            <span className="hidden sm:inline">ログイン</span>
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}
