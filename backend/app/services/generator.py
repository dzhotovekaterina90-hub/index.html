from datetime import datetime

from slugify import slugify

from app.models import GeneratedContent
from app.services.faq import build_faq


ARTICLE_TEMPLATE = """# {title}

## 一、为什么 {keyword} 值得投入？

在 GEO（Generative Engine Optimization）时代，内容不再只服务传统搜索结果，也需要被 AI 引擎理解、引用和推荐。

## 二、{keyword} 的实操策略

1. 明确目标用户与查询意图
2. 采用问题驱动型结构（Q&A + Checklist）
3. 使用可验证数据和案例增强可信度
4. 在结尾加入下一步行动建议

## 三、内容发布与迭代建议

- 发布后追踪核心指标（曝光、阅读、转化）
- 结合 FAQ 持续补充长尾问题
- 每月进行小版本更新，维持内容新鲜度

## 结论

围绕 **{keyword}** 建立结构化内容资产，可以显著提升品牌在 AI 时代的内容可见性和业务线索获取能力。
"""


def generate_geo_article(keyword: str, audience: str, tone: str) -> GeneratedContent:
    title = f"{keyword} 全面指南：面向 {audience} 的 GEO 内容策略"
    article = ARTICLE_TEMPLATE.format(title=title, keyword=keyword)
    faq = build_faq(keyword)

    return GeneratedContent(
        keyword=keyword,
        title=title,
        slug=slugify(title),
        article_markdown=article + f"\n\n> 写作风格：{tone}\n",
        faq=faq,
        created_at=datetime.utcnow(),
    )
