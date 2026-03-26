'use client';

import { FormEvent, useState } from 'react';
import AppShell from '@/components/layout/app-shell';
import { platforms } from '@/lib/mock-data';

type GeneratedPayload = {
  title: string;
  metaDescription: string;
  articleMarkdown: string;
};

export default function GeneratorPage() {
  const [keyword, setKeyword] = useState('');
  const [platform, setPlatform] = useState(platforms[0]);
  const [title, setTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [status, setStatus] = useState('');

  const onGenerate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!keyword.trim()) {
      setStatus('Please enter a keyword to generate content.');
      return;
    }

    setIsGenerating(true);
    setStatus('Generating content...');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword })
      });

      const data = (await response.json()) as GeneratedPayload | { error: string };

      if (!response.ok || 'error' in data) {
        throw new Error('error' in data ? data.error : 'Unable to generate content.');
      }

      setTitle(data.title);
      setMetaDescription(data.metaDescription);
      setContent(data.articleMarkdown);
      setStatus(`Article generated for ${platform}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const onPublish = async () => {
    if (!content.trim() || !title.trim() || !metaDescription.trim()) {
      setStatus('Generate and review title, meta description, and content before publishing.');
      return;
    }

    setIsPublishing(true);
    setStatus(`Publishing to ${platform}...`);

    await new Promise((resolve) => setTimeout(resolve, 900));

    setIsPublishing(false);
    setStatus(`Successfully published to ${platform} (mock).`);
  };

  return (
    <AppShell>
      <section className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Core Workflow</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">AI GEO Generator</h2>
        <p className="mt-2 text-sm text-slate-400">Generate, edit, and publish SEO/GEO-optimized articles from one workspace.</p>
      </section>

      <form className="card space-y-4" onSubmit={onGenerate}>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="keyword">
            Keyword
          </label>
          <input
            id="keyword"
            className="input"
            placeholder="e.g. AI SEO tools for ecommerce"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="platform">
            Platform
          </label>
          <select id="platform" className="input" value={platform} onChange={(event) => setPlatform(event.target.value)}>
            {platforms.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="btn btn-primary" type="submit" disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={onPublish}
            disabled={isPublishing || !content.trim() || !title.trim() || !metaDescription.trim()}
          >
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>

      <section className="card mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="title">
            Title
          </label>
          <input id="title" className="input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Generated title" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="meta-description">
            Meta Description
          </label>
          <textarea
            id="meta-description"
            className="input min-h-[90px]"
            value={metaDescription}
            onChange={(event) => setMetaDescription(event.target.value)}
            placeholder="Generated meta description"
          />
        </div>

        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Article Content (Markdown)</h3>
          <span className="text-xs uppercase tracking-wide text-slate-500">Editable</span>
        </div>
        <textarea
          className="min-h-[320px] w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-100 outline-none focus:border-cyan-400"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Generated article appears here..."
        />
      </section>

      {status ? <p className="mt-4 text-sm text-cyan-300">{status}</p> : null}
    </AppShell>
  );
}
