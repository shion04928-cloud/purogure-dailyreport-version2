import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '日報テンプレ',
  description: '介護日報テンプレート自動コピーツール',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
