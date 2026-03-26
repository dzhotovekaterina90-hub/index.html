import AppShell from '@/components/layout/app-shell';
import { dashboardStats, recentActivity } from '@/lib/mock-data';

export default function DashboardPage() {
  return (
    <AppShell>
      <section className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Overview</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Dashboard</h2>
        <p className="mt-2 text-sm text-slate-400">Track GEO article output and publishing velocity.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="card">
          <p className="text-sm text-slate-400">Total Articles</p>
          <p className="mt-2 text-3xl font-bold text-white">{dashboardStats.totalArticles}</p>
        </article>
        <article className="card">
          <p className="text-sm text-slate-400">Published</p>
          <p className="mt-2 text-3xl font-bold text-emerald-400">{dashboardStats.publishedArticles}</p>
        </article>
        <article className="card">
          <p className="text-sm text-slate-400">Drafts</p>
          <p className="mt-2 text-3xl font-bold text-amber-300">{dashboardStats.draftArticles}</p>
        </article>
      </section>

      <section className="card mt-6">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <ul className="mt-4 space-y-3 text-sm text-slate-300">
          {recentActivity.map((activity) => (
            <li key={activity.id} className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3">
              <span>{activity.action}</span>
              <span className="text-xs uppercase tracking-wide text-slate-500">{activity.time}</span>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
