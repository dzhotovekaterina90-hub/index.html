import KeywordForm from '@/components/KeywordForm';

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl p-6 md:p-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">GEO 内容自动化控制台</h1>
        <p className="mt-2 text-slate-300">输入关键词即可生成文章与 FAQ，并支持 WordPress 发布与定时批量任务。</p>
      </header>
      <KeywordForm />
    </main>
  );
}
