import type { Metadata } from 'next';
import { Analytics } from "@vercel/analytics/react"
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://prompt-techo.vercel.app'),
  title: 'プロンプト手帳',
  description: 'デジタルなシステム手帳 - 便利で快適なプロンプト管理ツール',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'プロンプト手帳',
    description: 'デジタルなシステム手帳 - 便利で快適なプロンプト管理ツール',
    url: 'https://prompt-techo.vercel.app',
    siteName: 'プロンプト手帳',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'プロンプト手帳',
    description: 'デジタルなシステム手帳',
    images: ['/opengraph-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-slate-50 text-slate-700 min-h-screen flex flex-col`} suppressHydrationWarning={true}>
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
