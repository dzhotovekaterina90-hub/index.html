from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from markdown_it import MarkdownIt

from app.models import GenerateRequest, PublishRequest, ScheduleRequest, Settings
from app.services.generator import generate_geo_article
from app.services.scheduler import JobManager
from app.services.storage import ContentStorage
from app.services.wordpress import publish_to_wordpress

settings = Settings()
storage = ContentStorage()
job_manager = JobManager(storage)
md = MarkdownIt()


@asynccontextmanager
async def lifespan(_: FastAPI):
    job_manager.start()
    yield
    job_manager.stop()


app = FastAPI(title="GEO Content Automation API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.post("/api/generate")
async def generate_content(req: GenerateRequest):
    content = generate_geo_article(req.keyword, req.audience, req.tone)
    storage.add(content)
    return content


@app.get("/api/contents")
async def list_contents():
    return storage.list_all()


@app.post("/api/publish")
async def publish_content(req: PublishRequest):
    result = await publish_to_wordpress(settings, req.title, req.content_html, req.status)
    return result


@app.post("/api/schedule")
async def create_schedule(req: ScheduleRequest):
    job = job_manager.create_job(req)
    return job


@app.get("/api/schedule")
async def list_schedules():
    return job_manager.list_jobs()


@app.post("/api/markdown-to-html")
async def markdown_to_html(payload: dict):
    markdown = payload.get("markdown", "")
    return {"html": md.render(markdown)}
