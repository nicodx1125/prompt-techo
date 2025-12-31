'use client';

import { useState, useRef, useEffect } from 'react';
import { Prompt } from '@/types';
import { Copy, Check, Maximize2, Edit, Trash2, MoreVertical, ExternalLink, Link as LinkIcon } from 'lucide-react';

interface PromptCardProps {
    prompt: Prompt;
    onTagClick?: (tag: string) => void;
    onExpand?: (prompt: Prompt) => void;
    onEdit?: (prompt: Prompt) => void;
    onDelete?: (id: string) => void;
}

export default function PromptCard({ prompt, onTagClick, onExpand, onEdit, onDelete }: PromptCardProps) {
    const [copied, setCopied] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(prompt.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="group bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col h-full relative overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 flex justify-between items-start border-b border-slate-100 bg-slate-50/50">
                <h3
                    className="text-base font-bold text-slate-800 truncate pr-4 flex-grow leading-tight cursor-pointer hover:text-indigo-600 transition-colors"
                    title={prompt.title}
                    onClick={() => onExpand && onExpand(prompt)}
                >
                    {prompt.title}
                </h3>
                <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    {onExpand && (
                        <button
                            onClick={() => onExpand(prompt)}
                            className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-md hover:bg-slate-100 transition-all"
                            title="拡大表示"
                        >
                            <Maximize2 size={16} />
                        </button>
                    )}
                    <button
                        onClick={handleCopy}
                        className="text-slate-400 hover:text-emerald-500 p-1.5 rounded-md hover:bg-slate-100 transition-all"
                        title="コピー"
                    >
                        {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    </button>

                    {(onEdit || onDelete || prompt.sourceUrl) && (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-all"
                            >
                                <MoreVertical size={16} />
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-28 bg-white border border-slate-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                                    {onEdit && (
                                        <button
                                            onClick={() => {
                                                onEdit(prompt);
                                                setShowMenu(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 flex items-center transition-colors"
                                        >
                                            <Edit size={14} className="mr-2" /> 編集
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => {
                                                onDelete(prompt.id);
                                                setShowMenu(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-xs text-rose-500 hover:bg-rose-50 flex items-center transition-colors"
                                        >
                                            <Trash2 size={14} className="mr-2" /> 削除
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Preview */}
            <div className="px-5 py-4 flex-grow min-h-[160px] bg-white">
                <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-mono max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                    {prompt.content}
                </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 mt-auto flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {prompt.sourceUrl && (
                        <a
                            href={prompt.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1.5"
                            title="参照元を開く"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink size={12} />
                            <span className="text-[11px] font-medium">参照元</span>
                        </a>
                    )}
                </div>
                <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-mono">
                        {prompt.createdAt ? new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(prompt.createdAt)) : ''}
                    </span>
                </div>
            </div>
        </div>
    );
}
