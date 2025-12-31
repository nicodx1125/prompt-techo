'use client';

import React, { useState, useEffect } from 'react';
import { extractVariables, replaceVariables } from '@/utils/textUtils';
import { Copy, Check, Sparkles, AlertCircle } from 'lucide-react';

interface VariableInjectorProps {
    template: string;
}

export default function VariableInjector({ template }: VariableInjectorProps) {
    const [variables, setVariables] = useState<string[]>([]);
    const [values, setValues] = useState<Record<string, string>>({});
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const extracted = extractVariables(template);
        setVariables(extracted);

        // Initialize values object if new variables found, preserving existing values if possible
        setValues(prev => {
            const next = { ...prev };
            extracted.forEach(v => {
                if (next[v] === undefined) next[v] = '';
            });
            return next;
        });
    }, [template]);

    useEffect(() => {
        setResult(replaceVariables(template, values));
    }, [template, values]);

    const handleInputChange = (variable: string, value: string) => {
        setValues(prev => ({
            ...prev,
            [variable]: value
        }));
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (variables.length === 0) {
        return null;
    }

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-indigo-700 font-medium">
                <Sparkles size={18} />
                <h3>変数入力</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {variables.map(variable => (
                    <div key={variable}>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">
                            {variable}
                        </label>
                        <input
                            type="text"
                            value={values[variable] || ''}
                            onChange={(e) => handleInputChange(variable, e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all shadow-sm placeholder-slate-300"
                            placeholder={`${variable} を入力...`}
                        />
                    </div>
                ))}
            </div>

            <div className="border-t border-slate-200 pt-5">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-slate-400">プレビュー (完成したプロンプト)</span>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'コピーしました' : 'コピーする'}
                    </button>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4 text-sm text-slate-700 font-mono whitespace-pre-wrap leading-relaxed shadow-inner max-h-[300px] overflow-y-auto custom-scrollbar">
                    {result}
                </div>
            </div>
        </div>
    );
}
