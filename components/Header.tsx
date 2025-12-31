import Link from 'next/link';
import Image from 'next/image';
import { Plus } from 'lucide-react';

interface HeaderProps {
    onCreateClick?: () => void;
}

export default function Header({ onCreateClick }: HeaderProps) {
    return (
        <header className="border-b border-slate-200 bg-white/80 text-slate-700 p-4 sticky top-0 z-40 backdrop-blur-md">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-3 text-xl font-bold hover:text-indigo-600 transition-colors">
                    <Image src="/icon.png" alt="Logo" width={32} height={32} className="rounded-lg shadow-sm" />
                    <span className="text-slate-800">プロンプト手帳</span>
                </Link>
                <nav>
                    {onCreateClick && (
                        <button
                            onClick={onCreateClick}
                            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-full transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">新規作成</span>
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}
