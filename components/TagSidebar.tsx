
import React from 'react';
import { Tag } from 'lucide-react';

interface TagSidebarProps {
    tagCounts: { [tag: string]: number };
    selectedTag: string | null;
    onTagClick: (tag: string | null) => void;
}

export default function TagSidebar({ tagCounts, selectedTag, onTagClick }: TagSidebarProps) {
    // Sort tags by count (descending), then alphabetical
    const sortedTags = Object.entries(tagCounts).sort((a, b) => {
        if (b[1] !== a[1]) {
            return b[1] - a[1];
        }
        return a[0].localeCompare(b[0]);
    });

    return (
        <div className="w-64 flex-shrink-0 hidden lg:block pr-6 border-r border-slate-200">
            <div className="sticky top-24">
                <h3 className="text-slate-400 font-medium text-sm mb-4 px-2">タグ一覧</h3>
                <div className="space-y-1">
                    <button
                        onClick={() => onTagClick(null)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center justify-between group ${selectedTag === null
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                    >
                        <span className="text-sm font-medium">すべて</span>
                    </button>

                    {sortedTags.map(([tag, count]) => (
                        <button
                            key={tag}
                            onClick={() => onTagClick(tag === selectedTag ? null : tag)}
                            className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center justify-between group ${selectedTag === tag
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                                }`}
                        >
                            <span className="text-sm truncate mr-2" title={tag}>
                                {tag}
                            </span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedTag === tag
                                ? 'bg-indigo-200 text-indigo-800'
                                : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300'
                                }`}>
                                {count}
                            </span>
                        </button>
                    ))}

                    {sortedTags.length === 0 && (
                        <div className="text-slate-400 text-sm px-3 py-2">
                            タグが見つかりません
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
