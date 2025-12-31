'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PromptForm from '@/components/PromptForm';
import PromptCard from '@/components/PromptCard';
import SearchBar from '@/components/SearchBar';
import Modal from '@/components/Modal';
import MarkdownView from '@/components/MarkdownView';
import TagSidebar from '@/components/TagSidebar';
import VariableInjector from '@/components/VariableInjector';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { Prompt } from '@/types';
import { getPrompts, deletePrompt } from '@/utils/storage';
import { Copy, Check, X, Loader2, AlertCircle, ExternalLink, Tag, Edit, Trash2 } from 'lucide-react';

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  // Auth state
  const { user, loading: authLoading, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Tag Counts
  const tagCounts = prompts.reduce((acc, prompt) => {
    prompt.tags?.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as { [key: string]: number });

  const handleSidebarTagClick = (tag: string | null) => {
    if (tag === null) {
      handleClearSearch();
    } else {
      handleTagClick(tag);
    }
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Detail Modal State
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailCopied, setDetailCopied] = useState(false);

  // Edit State
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  // Delete Confirmation State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null);

  // Search Mode State
  const [searchMode, setSearchMode] = useState<'keyword' | 'tag'>('keyword');

  const fetchPrompts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = await getPrompts();
      setPrompts(data);
    } catch (err: any) {
      console.error('Error fetching prompts:', err);
      setError('データの読み込みに失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchPrompts();
    }
  }, [authLoading, user]);

  const handleCreateSuccess = () => {
    fetchPrompts();
    setIsModalOpen(false);
    setEditingPrompt(null);
  };

  const handleCreateClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setEditingPrompt(null);
    setIsModalOpen(true);
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setSearchMode('tag');
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setSearchMode('keyword');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchMode('keyword');
  };

  const handleExpand = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsDetailOpen(true);
  };

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setPromptToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!promptToDelete) return;
    try {
      await deletePrompt(promptToDelete);
      await fetchPrompts();
      setIsDeleteModalOpen(false);
      setPromptToDelete(null);
    } catch (err) {
      console.error("Failed to delete", err);
      alert("削除に失敗しました");
    }
  };

  const handleDetailCopy = async () => {
    if (!selectedPrompt) return;
    try {
      await navigator.clipboard.writeText(selectedPrompt.content);
      setDetailCopied(true);
      setTimeout(() => setDetailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const filteredPrompts = prompts.filter((prompt) => {
    if (!searchQuery) return true;

    if (searchMode === 'tag') {
      return prompt.tags?.includes(searchQuery);
    }

    const query = searchQuery.toLowerCase();
    const titleMatch = prompt.title.toLowerCase().includes(query);
    const contentMatch = prompt.content.toLowerCase().includes(query);
    const tagsMatch = prompt.tags?.some((tag) => tag.toLowerCase().includes(query));
    return titleMatch || contentMatch || tagsMatch;
  });

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40">
        <Header
          onCreateClick={handleCreateClick}
          user={user}
          loading={authLoading}
          onLoginClick={() => setIsAuthModalOpen(true)}
          onLogoutClick={signOut}
        />
      </div>

      <div className="pt-20 max-w-7xl mx-auto pb-10">
        <div className="flex px-4 sm:px-6 lg:px-8 gap-8">
          <TagSidebar
            tagCounts={tagCounts}
            selectedTag={searchMode === 'tag' ? searchQuery : null}
            onTagClick={handleSidebarTagClick}
          />

          <main className="flex-1 min-w-0">
            <div className=" mb-8">
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                onClear={handleClearSearch}
              />
            </div>

            {error && (
              <div className="text-center text-rose-600 py-10 bg-rose-50 rounded-lg border border-rose-200">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrompts.length > 0 ? (
                  filteredPrompts.map((prompt) => {
                    const isOwner = user && prompt.user_id === user.id;
                    return (
                      <PromptCard
                        key={prompt.id}
                        prompt={prompt}
                        onTagClick={handleTagClick}
                        onExpand={handleExpand}
                        onEdit={isOwner ? handleEdit : undefined}
                        onDelete={isOwner ? handleDeleteClick : undefined}
                      />
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-20 text-slate-500 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                    <p className="text-xl">プロンプトが見つかりませんでした。</p>
                    <p className="text-sm mt-2">新しいプロンプトを作成するか、検索条件を変更してください。</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPrompt ? "プロンプト編集" : "新規プロンプト作成"}>
        <PromptForm onSuccess={handleCreateSuccess} initialData={editingPrompt} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="削除の確認" maxWidth="max-w-md">
        <div className="p-4">
          <p className="text-slate-600 mb-6 font-medium">
            本当にこのプロンプトを削除してもよろしいですか？<br />
            この操作は取り消せません。
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded transition-colors flex items-center shadow-lg shadow-rose-500/20"
            >
              <X size={18} className="mr-2" /> 削除する
            </button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={selectedPrompt?.title || '詳細'}
        maxWidth="max-w-4xl"
      >
        {selectedPrompt && (
          <div>
            <div className="flex items-center justify-between mb-3 gap-4">
              <div className="flex-1 min-w-0">
                {selectedPrompt.sourceUrl && (
                  <a
                    href={selectedPrompt.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center text-sm"
                    title={selectedPrompt.sourceTitle || selectedPrompt.sourceUrl}
                  >
                    <ExternalLink size={16} className="mr-1.5 flex-shrink-0" />
                    <span className="mr-1 flex-shrink-0 font-medium text-slate-600">参照元:</span>
                    <span className="truncate">
                      {selectedPrompt.sourceTitle || selectedPrompt.sourceUrl}
                    </span>
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {user && selectedPrompt.user_id === user.id && (
                  <>
                    <button
                      onClick={() => {
                        setEditingPrompt(selectedPrompt);
                        setIsModalOpen(true);
                        setIsDetailOpen(false);
                      }}
                      className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                      title="編集"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setPromptToDelete(selectedPrompt.id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                      title="削除"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200 overflow-y-auto max-h-[60vh] custom-scrollbar relative shadow-inner">
              <button
                onClick={handleDetailCopy}
                className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-500 p-2 rounded-md transition-colors border border-slate-200 z-10"
                title="コピー"
              >
                {detailCopied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
              </button>
              <MarkdownView content={selectedPrompt.content} />

              {selectedPrompt.tags && selectedPrompt.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex flex-wrap gap-2">
                    {selectedPrompt.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full cursor-pointer hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center"
                        onClick={() => {
                          handleTagClick(tag);
                          setIsDetailOpen(false);
                        }}
                      >
                        <Tag size={14} className="mr-1.5 opacity-70" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <VariableInjector template={selectedPrompt.content} />
            </div>
            <div className="mt-4 text-right text-slate-400 text-sm font-mono">
              {selectedPrompt.createdAt ? new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(selectedPrompt.createdAt)) : ''}
            </div>
          </div>
        )}
      </Modal>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
