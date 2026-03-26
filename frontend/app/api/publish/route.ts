import { NextResponse } from 'next/server';

type PublishRequestBody = {
  title?: string;
  content?: string;
  wordpress_url?: string;
  username?: string;
  application_password?: string;
};

type WordPressPostResponse = {
  id?: number;
  link?: string;
  guid?: { rendered?: string };
};

function normalizeWordPressUrl(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PublishRequestBody;

    const title = body.title?.trim();
    const content = body.content?.trim();
    const wordpressUrl = body.wordpress_url?.trim();
    const username = body.username?.trim();
    const applicationPassword = body.application_password?.trim();

    if (!title || !content || !wordpressUrl || !username || !applicationPassword) {
      return NextResponse.json(
        { error: 'title, content, wordpress_url, username, and application_password are required.' },
        { status: 400 }
      );
    }

    const endpoint = `${normalizeWordPressUrl(wordpressUrl)}/wp-json/wp/v2/posts`;
    const token = Buffer.from(`${username}:${applicationPassword}`).toString('base64');

    const wpResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${token}`
      },
      body: JSON.stringify({
        title,
        content,
        status: 'publish'
      })
    });

    if (!wpResponse.ok) {
      const errorText = await wpResponse.text();
      return NextResponse.json({ error: `WordPress publish failed: ${errorText}` }, { status: wpResponse.status });
    }

    const wpData = (await wpResponse.json()) as WordPressPostResponse;
    const postUrl = wpData.link || wpData.guid?.rendered;

    if (!postUrl) {
      return NextResponse.json({ error: 'WordPress publish succeeded but no post URL was returned.' }, { status: 502 });
    }

    return NextResponse.json({ postUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to publish article.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
