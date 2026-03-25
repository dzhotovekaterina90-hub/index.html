from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    wordpress_url: Optional[str] = None
    wordpress_username: Optional[str] = None
    wordpress_app_password: Optional[str] = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


class GenerateRequest(BaseModel):
    keyword: str = Field(..., min_length=2, max_length=120)
    audience: str = Field(default="General")
    tone: str = Field(default="Professional")


class FAQItem(BaseModel):
    question: str
    answer: str


class GeneratedContent(BaseModel):
    keyword: str
    title: str
    slug: str
    article_markdown: str
    faq: List[FAQItem]
    created_at: datetime


class PublishRequest(BaseModel):
    title: str
    content_html: str
    status: str = Field(default="draft")


class PublishResponse(BaseModel):
    success: bool
    message: str
    post_id: Optional[int] = None
    post_url: Optional[str] = None


class ScheduleRequest(BaseModel):
    keywords: List[str] = Field(..., min_length=1)
    interval_minutes: int = Field(default=30, ge=1, le=1440)
    audience: str = Field(default="General")
    tone: str = Field(default="Professional")


class ScheduleJob(BaseModel):
    job_id: str
    keywords: List[str]
    interval_minutes: int
    audience: str
    tone: str
    next_run_time: Optional[datetime] = None
