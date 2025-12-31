'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import Modal from '@/components/Modal';
import { Loader2, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type AuthMode = 'signin' | 'signup';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [mode, setMode] = useState<AuthMode>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (mode === 'signup') {
                const { error, data } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                // Check if email confirmation is required (depends on Supabase settings, usually requires confirmation by default)
                if (data.user && !data.session) {
                    setMessage('確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。');
                } else {
                    setMessage('登録が完了しました。');
                    // Auto close or switch to login? If session exists, header will update automatically.
                    setTimeout(onClose, 1500);
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onClose();
            }
        } catch (err: any) {
            console.error('Auth Error:', err);
            setError(err.message || '認証に失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setMode(mode === 'signin' ? 'signup' : 'signin');
        setError(null);
        setMessage(null);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="max-w-sm">
            <div className="p-6">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">
                        {mode === 'signin' ? 'ログイン' : '新規登録'}
                    </h2>
                    <p className="text-sm text-slate-500 mt-2">
                        {mode === 'signin'
                            ? '保存したプロンプトにアクセスするにはログインしてください。'
                            : 'アカウントを作成して、あなたのプロンプト手帳を始めましょう。'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm flex items-start">
                        <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {message && (
                    <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-600 text-sm flex items-start">
                        <CheckCircle2 size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                        <span>{message}</span>
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">メールアドレス</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail size={16} className="text-slate-400" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none text-slate-800 placeholder-slate-400 shadow-sm transition-all"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">パスワード</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={16} className="text-slate-400" />
                            </div>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none text-slate-800 placeholder-slate-400 shadow-sm transition-all"
                                placeholder="6文字以上"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md shadow-indigo-500/20 transition-all flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (mode === 'signin' ? 'ログイン' : '登録する')}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-slate-500">
                        {mode === 'signin' ? 'アカウントをお持ちでないですか？' : 'すでにアカウントをお持ちですか？'}
                    </span>
                    <button
                        onClick={toggleMode}
                        className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-colors"
                    >
                        {mode === 'signin' ? '新規登録' : 'ログイン'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
