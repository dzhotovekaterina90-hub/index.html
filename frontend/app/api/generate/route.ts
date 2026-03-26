import { NextResponse } from 'next/server';

type GenerateRequestBody = {
  keyword?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as GenerateRequestBody;
  const keyword = body.keyword?.trim();

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword is required.' }, { status: 400 });
  }

  const content = `# ${keyword}: GEO-Optimized Guide

## Introduction
${keyword} is rapidly becoming a strategic lever for brands that want visibility in both classic search and AI-generated responses.

## Why ${keyword} Matters
- Increases discoverability across generative engines.
- Improves authority signals with structured and intent-matched content.
- Supports consistent messaging across channels.

## Implementation Framework
1. Map user intent clusters around ${keyword}.
2. Build semantically rich sections with clear entities.
3. Add concise FAQ blocks that answer natural-language queries.
4. Include actionable examples and platform-specific tips.

## Conclusion
A focused ${keyword} strategy can improve organic reach and strengthen brand presence in AI-assisted discovery workflows.`;

  return NextResponse.json({ content });
}
