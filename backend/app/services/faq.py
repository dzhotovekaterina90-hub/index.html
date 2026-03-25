from typing import List

from app.models import FAQItem


def build_faq(keyword: str) -> List[FAQItem]:
    return [
        FAQItem(
            question=f"什么是 {keyword}？",
            answer=f"{keyword} 是一个与业务增长和搜索可见性密切相关的话题，适合通过结构化内容建立权威。",
        ),
        FAQItem(
            question=f"如何快速上手 {keyword} 内容规划？",
            answer="先确定用户搜索意图，再按问题-答案结构组织正文与 FAQ，并加入可执行步骤。",
        ),
        FAQItem(
            question=f"{keyword} 文章多久更新一次比较合适？",
            answer="建议每 2-4 周复盘一次数据（点击率、停留时长、转化率）并进行内容迭代。",
        ),
    ]
