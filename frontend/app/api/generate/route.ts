import { NextResponse } from 'next/server';
import { generateArticleFromAI } from '@/lib/ai';

type GenerateRequestBody = {
  keyword?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequestBody;
    const keyword = body.keyword?.trim();

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword is required.' }, { status: 400 });
    }

    const generated = await generateArticleFromAI(keyword);

    return NextResponse.json({
      title: generated.title,
      metaDescription: generated.metaDescription,
      articleMarkdown: generated.articleMarkdown
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate article.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
