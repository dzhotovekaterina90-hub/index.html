from typing import Optional

import httpx

from app.models import PublishResponse, Settings


def _wp_base(url: str) -> str:
    return url.rstrip("/")


async def publish_to_wordpress(
    settings: Settings,
    title: str,
    content_html: str,
    status: str = "draft",
) -> PublishResponse:
    if not settings.wordpress_url or not settings.wordpress_username or not settings.wordpress_app_password:
        return PublishResponse(success=False, message="WordPress 配置缺失，请检查环境变量。")

    endpoint = f"{_wp_base(settings.wordpress_url)}/wp-json/wp/v2/posts"

    payload = {
        "title": title,
        "content": content_html,
        "status": status,
    }

    auth = (settings.wordpress_username, settings.wordpress_app_password)

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(endpoint, json=payload, auth=auth)
            resp.raise_for_status()
            data = resp.json()
            return PublishResponse(
                success=True,
                message="发布成功",
                post_id=data.get("id"),
                post_url=data.get("link"),
            )
    except httpx.HTTPStatusError as e:
        return PublishResponse(success=False, message=f"WordPress 返回错误: {e.response.text}")
    except Exception as e:
        return PublishResponse(success=False, message=f"发布失败: {str(e)}")
