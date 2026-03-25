from typing import Dict
from uuid import uuid4

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from app.models import ScheduleJob, ScheduleRequest
from app.services.generator import generate_geo_article
from app.services.storage import ContentStorage


class JobManager:
    def __init__(self, storage: ContentStorage):
        self.scheduler = AsyncIOScheduler()
        self.storage = storage
        self.jobs: Dict[str, ScheduleJob] = {}

    def start(self) -> None:
        if not self.scheduler.running:
            self.scheduler.start()

    def stop(self) -> None:
        if self.scheduler.running:
            self.scheduler.shutdown(wait=False)

    def create_job(self, req: ScheduleRequest) -> ScheduleJob:
        job_id = str(uuid4())

        async def run_batch() -> None:
            for kw in req.keywords:
                content = generate_geo_article(kw, req.audience, req.tone)
                self.storage.add(content)

        aps_job = self.scheduler.add_job(
            run_batch,
            trigger=IntervalTrigger(minutes=req.interval_minutes),
            id=job_id,
            replace_existing=True,
        )

        schedule_job = ScheduleJob(
            job_id=job_id,
            keywords=req.keywords,
            interval_minutes=req.interval_minutes,
            audience=req.audience,
            tone=req.tone,
            next_run_time=aps_job.next_run_time,
        )
        self.jobs[job_id] = schedule_job
        return schedule_job

    def list_jobs(self):
        refreshed = []
        for job_id, metadata in self.jobs.items():
            aps_job = self.scheduler.get_job(job_id)
            if aps_job:
                refreshed.append(metadata.model_copy(update={"next_run_time": aps_job.next_run_time}))
        return refreshed
