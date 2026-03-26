export type GeneratedArticle = {
  title: string;
  metaDescription: string;
  articleMarkdown: string;
};

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

function buildPrompt(keyword: string) {
  return [
    'You are an expert SEO and GEO content strategist.',
    `Write a long-form article of about 1000 words targeting the keyword: "${keyword}".`,
    'Return valid JSON with exactly these keys: title, metaDescription, articleMarkdown.',
    'Requirements for articleMarkdown:',
    '- Professional SEO tone.',
    '- Human-like and natural writing style, not robotic.',
    '- Include clear H2 and H3 headings in markdown format.',
    '- Integrate the target keyword naturally and contextually.',
    '- Include practical insights and examples.',
    '- End with a concise conclusion section.',
    'Requirements for metaDescription:',
    '- 140 to 160 characters.',
    '- Compelling and click-worthy.',
    '- Includes the target keyword naturally.',
    'Do not wrap the JSON in markdown fences.'
  ].join('\n');
}

export async function generateArticleFromAI(keyword: string): Promise<GeneratedArticle> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set.');
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'You generate production-quality SEO/GEO marketing content.'
        },
        {
          role: 'user',
          content: buildPrompt(keyword)
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${errorText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('OpenAI response did not contain content.');
  }

  const parsed = JSON.parse(content) as Partial<GeneratedArticle>;

  if (!parsed.title || !parsed.metaDescription || !parsed.articleMarkdown) {
    throw new Error('OpenAI response missing required fields.');
  }

  return {
    title: parsed.title,
    metaDescription: parsed.metaDescription,
    articleMarkdown: parsed.articleMarkdown
  };
}
