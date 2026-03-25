# GEO 内容自动化系统（Next.js + FastAPI + WordPress）

一个可直接运行的全栈项目，支持：

1. 输入关键词生成 GEO 文章
2. 自动生成 FAQ 结构
3. 自动发布到 WordPress
4. 定时批量生成内容

## 目录结构

```text
.
├── backend
│   ├── app
│   │   ├── main.py
│   │   ├── models.py
│   │   └── services
│   │       ├── faq.py
│   │       ├── generator.py
│   │       ├── scheduler.py
│   │       ├── storage.py
│   │       └── wordpress.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend
│   ├── app
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   └── KeywordForm.tsx
│   ├── lib
│   │   └── api.ts
│   ├── Dockerfile
│   ├── next.config.js
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── .env.example
└── docker-compose.yml
```

## 快速启动

1. 复制环境变量：

```bash
cp .env.example .env
```

2. 启动项目：

```bash
docker compose up --build
```

3. 访问：
- 前端：http://localhost:3000
- 后端文档：http://localhost:8000/docs

## 本地开发（不使用 Docker）

### 后端

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 前端

```bash
cd frontend
npm install
npm run dev
```

## WordPress 发布说明

推荐使用 WordPress Application Password：

1. WordPress 后台 -> Users -> Profile
2. 创建 Application Password
3. 将站点地址、用户名、App Password 填入 `.env`

发布接口会调用 `wp-json/wp/v2/posts`。

## 定时任务说明

- 通过前端提交批量关键词、发布时间间隔（分钟）
- 后端使用 APScheduler 在后台循环生成并入库（内存）
- 可随时查看任务状态
