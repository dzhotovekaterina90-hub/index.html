from collections import deque
from typing import Deque, List

from app.models import GeneratedContent


class ContentStorage:
    def __init__(self, max_items: int = 200):
        self._items: Deque[GeneratedContent] = deque(maxlen=max_items)

    def add(self, item: GeneratedContent) -> None:
        self._items.appendleft(item)

    def list_all(self) -> List[GeneratedContent]:
        return list(self._items)
