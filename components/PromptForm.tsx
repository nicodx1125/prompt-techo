'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { savePrompt, getAllTags, updatePrompt } from '@/utils/storage';
import { Plus, X, Tag, Loader2, Link } from 'lucide-react';
import { Prompt } from '@/types';

interface PromptFormProps {
    onSuccess?: () => void;
    initialData?: Prompt | null;
}

export default function PromptForm({ onSuccess, initialData }: PromptFormProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [sourceUrl, setSourceUrl] = useState('');
    const [sourceTitle, setSourceTitle] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFetchingMeta, setIsFetchingMeta] = useState(false);

    // Autocomplete State
    const [existingTags, setExistingTags] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getAllTags().then(setExistingTags);

        if (initialData) {
            setTitle(initialData.title);
            setContent(initialData.content);
            setSourceUrl(initialData.sourceUrl || '');
            setSourceTitle(initialData.sourceTitle || '');
            setTags(initialData.tags || []);
        }

        // Close suggestions when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [initialData]);

    const fetchMetadata = async (url: string) => {
        if (!url) return;
        try {
            new URL(url); // Validate URL format
        } catch {
            return;
        }

        setIsFetchingMeta(true);
        try {
            const res = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
            const data = await res.json();
            if (data.title) {
                setSourceTitle(data.title);
            }
        } catch (error) {
            console.error("Failed to fetch metadata", error);
        } finally {
            setIsFetchingMeta(false);
        }
    };

    const handleUrlBlur = () => {
        if (sourceUrl && !sourceTitle) { // Only fetch if title is empty or maybe always? User might have edited it. Let's fetch if URL changed? For simpler UX, fetch if title is empty OR if user wants. But usually fetch on blur is good.
            fetchMetadata(sourceUrl);
        }
    };

    const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTagInput(value);

        if (value.trim()) {
            const filtered = existingTags.filter(tag =>
                tag.toLowerCase().includes(value.toLowerCase()) && !tags.includes(tag)
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const addTag = (tagToAdd: string) => {
        const trimmed = tagToAdd.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
            setTagInput('');
            setShowSuggestions(false);
        }
    };

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(tagInput);
        }
    };

    const handleSuggestionClick = (tag: string) => {
        addTag(tag);
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));

            const promptData = {
                title,
                content,
                sourceUrl,
                sourceTitle,
                tags,
            };

            if (initialData) {
                await updatePrompt({
                    ...initialData,
                    ...promptData
                });
            } else {
                await savePrompt(promptData);
            }

            if (!initialData) {
                setTitle('');
                setContent('');
                setSourceUrl('');
                setSourceTitle('');
                setTags([]);
            }

            // Update existing tags for next time
            getAllTags().then(setExistingTags);

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error saving prompt:', error);
            alert('保存に失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                    タイトル <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="title"
                    required
                    className="w-full bg-white border border-slate-200 rounded-md p-2 text-slate-800 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all placeholder-slate-400 shadow-sm"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="プロンプトのタイトル"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="sourceUrl" className="block text-sm font-medium text-slate-700 mb-1">
                    参照元URL (任意)
                </label>
                <div className="relative mb-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Link size={16} className="text-slate-400" />
                    </div>
                    <input
                        type="url"
                        id="sourceUrl"
                        className="w-full bg-white border border-slate-200 rounded-md py-2 pl-10 pr-8 text-slate-800 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all placeholder-slate-400 shadow-sm"
                        value={sourceUrl}
                        onChange={(e) => setSourceUrl(e.target.value)}
                        onBlur={handleUrlBlur}
                        placeholder="https://x.com/..."
                    />
                    {isFetchingMeta && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Loader2 size={16} className="text-indigo-500 animate-spin" />
                        </div>
                    )}
                </div>
                {sourceUrl && (
                    <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs text-slate-600 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                        value={sourceTitle}
                        onChange={(e) => setSourceTitle(e.target.value)}
                        placeholder="ページタイトル (自動取得)"
                    />
                )}
            </div>

            <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">
                    プロンプト内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="content"
                    required
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 font-mono text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all placeholder-slate-400 custom-scrollbar shadow-sm"
                    placeholder="ここにプロンプトを入力してください..."
                />
            </div>

            <div className="mb-4">
                <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-1">
                    タグ (Enterで追加)
                </label>
                <div className="relative" ref={suggestionRef}>
                    <div className="flex items-center bg-white border border-slate-200 rounded-md p-2 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all shadow-sm">
                        <Tag size={18} className="text-slate-400 mr-2" />
                        <input
                            type="text"
                            id="tags"
                            className="bg-transparent text-slate-800 outline-none flex-grow placeholder-slate-400"
                            value={tagInput}
                            onChange={handleTagInput}
                            onKeyDown={handleTagKeyDown}
                            onFocus={() => {
                                if (tagInput) setShowSuggestions(true);
                            }}
                            placeholder="タグを入力..."
                            autoComplete="off"
                        />
                    </div>

                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-40 overflow-y-auto custom-scrollbar">
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none transition-colors"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-sm flex items-center border border-indigo-200"
                        >
                            <span className="mr-1">#</span>
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-2 hover:text-indigo-900 focus:outline-none"
                            >
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-full transition-colors flex items-center justify-center shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        保存中...
                    </>
                ) : (
                    initialData ? '更新する' : '保存する'
                )}
            </button>
        </form>
    );
}
