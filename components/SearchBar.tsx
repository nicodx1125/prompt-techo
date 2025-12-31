'use client';

import { Search, X } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onClear?: () => void;
}

export default function SearchBar({ value, onChange, onClear }: SearchBarProps) {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={20} />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-lg leading-5 bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-200 shadow-sm"
                placeholder="キーワードまたはタグで検索..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {value && (
                <button
                    onClick={() => {
                        onChange('');
                        onClear?.();
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    title="検索をクリア"
                >
                    <X size={18} />
                </button>
            )}
        </div>
    );
}
