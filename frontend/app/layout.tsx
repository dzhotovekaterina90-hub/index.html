import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GEO 内容自动化平台',
  description: '关键词生成 GEO 文章、FAQ、发布 WordPress、定时批处理'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
