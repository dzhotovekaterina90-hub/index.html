const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export type FAQItem = {
  question: string;
  answer: string;
};

export type GeneratedContent = {
  keyword: string;
  title: string;
  slug: string;
  article_markdown: string;
  faq: FAQItem[];
  created_at: string;
};

export async function generateContent(payload: { keyword: string; audience: string; tone: string }) {
  const resp = await fetch(`${API_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!resp.ok) throw new Error(await resp.text());
  return (await resp.json()) as GeneratedContent;
}

export async function publishWordPress(payload: { title: string; content_html: string; status: string }) {
  const resp = await fetch(`${API_BASE}/api/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!resp.ok) throw new Error(await resp.text());
  return resp.json();
}

export async function markdownToHtml(markdown: string) {
  const resp = await fetch(`${API_BASE}/api/markdown-to-html`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ markdown })
  });
  if (!resp.ok) throw new Error(await resp.text());
  const data = await resp.json();
  return data.html as string;
}

export async function createSchedule(payload: {
  keywords: string[];
  interval_minutes: number;
  audience: string;
  tone: string;
}) {
  const resp = await fetch(`${API_BASE}/api/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!resp.ok) throw new Error(await resp.text());
  return resp.json();
}
