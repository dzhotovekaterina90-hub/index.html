'use client';

import { useState } from 'react';
import { createSchedule, generateContent, markdownToHtml, publishWordPress } from '@/lib/api';

export default function KeywordForm() {
  const [keyword, setKeyword] = useState('');
  const [audience, setAudience] = useState('跨境电商团队');
  const [tone, setTone] = useState('Professional');
  const [result, setResult] = useState<string>('');
  const [faq, setFaq] = useState<Array<{ question: string; answer: string }>>([]);
  const [status, setStatus] = useState<string>('');
  const [batchKeywords, setBatchKeywords] = useState('SEO, GEO, AI内容营销');
  const [intervalMinutes, setIntervalMinutes] = useState(30);

  const onGenerate = async () => {
    setStatus('正在生成...');
    const data = await generateContent({ keyword, audience, tone });
    setResult(data.article_markdown);
    setFaq(data.faq);
    setStatus('生成成功');
  };

  const onPublish = async () => {
    setStatus('正在发布到 WordPress...');
    const html = await markdownToHtml(result);
    const response = await publishWordPress({
      title: `${keyword} 自动化文章`,
      content_html: html,
      status: 'draft'
    });
    setStatus(response.success ? `发布成功：${response.post_url || '草稿已创建'}` : `发布失败：${response.message}`);
  };

  const onSchedule = async () => {
    setStatus('正在创建定时任务...');
    const keywords = batchKeywords
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);

    await createSchedule({ keywords, interval_minutes: intervalMinutes, audience, tone });
    setStatus('定时任务创建成功');
  };

  return (
    <div className="grid gap-4">
      <div className="card space-y-3">
        <h2 className="text-xl font-semibold">1) 关键词生成 GEO 文章</h2>
        <input className="w-full rounded bg-slate-800 px-3 py-2" placeholder="输入关键词" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <input className="w-full rounded bg-slate-800 px-3 py-2" placeholder="受众" value={audience} onChange={(e) => setAudience(e.target.value)} />
        <input className="w-full rounded bg-slate-800 px-3 py-2" placeholder="风格" value={tone} onChange={(e) => setTone(e.target.value)} />
        <button className="rounded bg-primary px-4 py-2 font-medium" onClick={onGenerate}>生成文章 + FAQ</button>
      </div>

      <div className="card space-y-3">
        <h2 className="text-xl font-semibold">2) 自动发布 WordPress</h2>
        <button className="rounded bg-emerald-600 px-4 py-2 font-medium disabled:opacity-50" onClick={onPublish} disabled={!result}>发布为草稿</button>
      </div>

      <div className="card space-y-3">
        <h2 className="text-xl font-semibold">3) 定时批量生成</h2>
        <input
          className="w-full rounded bg-slate-800 px-3 py-2"
          placeholder="批量关键词，用英文逗号分隔"
          value={batchKeywords}
          onChange={(e) => setBatchKeywords(e.target.value)}
        />
        <input
          className="w-full rounded bg-slate-800 px-3 py-2"
          type="number"
          min={1}
          value={intervalMinutes}
          onChange={(e) => setIntervalMinutes(Number(e.target.value))}
        />
        <button className="rounded bg-purple-600 px-4 py-2 font-medium" onClick={onSchedule}>创建定时任务</button>
      </div>

      {status && <p className="text-sm text-slate-300">状态：{status}</p>}

      {result && (
        <div className="card">
          <h3 className="mb-2 text-lg font-semibold">文章 Markdown 预览</h3>
          <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-slate-200">{result}</pre>
        </div>
      )}

      {faq.length > 0 && (
        <div className="card">
          <h3 className="mb-2 text-lg font-semibold">自动 FAQ</h3>
          <ul className="space-y-2">
            {faq.map((item, idx) => (
              <li key={idx} className="rounded bg-slate-800 p-2">
                <p className="font-medium">Q: {item.question}</p>
                <p className="text-slate-300">A: {item.answer}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
