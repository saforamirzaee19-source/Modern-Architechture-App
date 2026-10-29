import { useMemo, useRef, useState } from "react";
import AppShell, { SiteFooter } from "../components/AppShell.jsx";
import Avatar from "../components/Avatar.jsx";
import Icon from "../components/Icon.jsx";
import { PROJECTS, PHASES, TEAM } from "../data/index.js";
import { buildTasks, STATUSES, startOfToday } from "../data/tasks.js";

const DAY = 86400000;
const PX = 7; // pixels per day on the Gantt
const LABEL_W = 270;
const PHASE_STYLE = {
  discovery: {
    bar: "from-[#8f8a80] to-[#6f6a62]",
    dot: "bg-[#8f8a80]",
    text: "text-[#8f8a80]",
  },
  concept: {
    bar: "from-[#d7b08f] to-[#c69b7b]",
    dot: "bg-bronze",
    text: "text-bronze",
  },
  design: {
    bar: "from-[#a3a874] to-[#8a8f5b]",
    dot: "bg-olive",
    text: "text-olive",
  },
  execution: {
    bar: "from-[#e6bd68] to-[#d4a44b]",
    dot: "bg-gold",
    text: "text-gold-dark",
  },
};
const PRI = {
  high: "bg-brick/15 text-brick",
  med: "bg-gold/20 text-gold-dark",
  low: "bg-olive/20 text-olive",
};
const photoOf = (n) => TEAM.find((t) => t.name === n)?.photo;
const fmt = (d) =>
  d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
const dayDiff = (a, b) => Math.round((a - b) / DAY);

function Stat({ label, value, sub, accent }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">
        {label}
      </p>
      <p
        className={`mt-1 font-display text-3xl ${accent ? "text-gold" : "text-white"}`}
      >
        {value}
      </p>
      <p className="text-xs text-white/55">{sub}</p>
    </div>
  );
}

export default function Timeline() {
  const [projectId, setProjectId] = useState(PROJECTS[0].id);
  const [store, setStore] = useState({});
  const [view, setView] = useState("gantt");
  const [phase, setPhase] = useState("all");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    title: "",
    owner: TEAM[0].name,
    phase: "design",
    days: 14,
    pri: "med",
  });
  const [dragId, setDragId] = useState(null);
  const [toast, setToast] = useState("");
  const scroller = useRef(null);

  const project = PROJECTS.find((p) => p.id === projectId);
  const tasks = store[projectId] ?? buildTasks(project);
  const setTasks = (fn) =>
    setStore((s) => ({
      ...s,
      [projectId]: fn(s[projectId] ?? buildTasks(project)),
    }));
  const today = startOfToday();
  const flash = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 2200);
  };

  const visible = tasks.filter((t) => phase === "all" || t.phase === phase);

  const stats = useMemo(() => {
    const done = tasks.filter((t) => t.status === "done").length;
    const late = tasks.filter(
      (t) => t.status !== "done" && t.end < today && !t.milestone,
    ).length;
    const last = tasks.reduce((m, t) => (t.end > m ? t.end : m), tasks[0].end);
    return {
      done,
      late,
      total: tasks.length,
      pct: Math.round(tasks.reduce((a, t) => a + t.progress, 0) / tasks.length),
      left: dayDiff(last, today),
      last,
    };
  }, [tasks]);

  // Gantt range
  const range = useMemo(() => {
    const min = new Date(Math.min(...tasks.map((t) => +t.start)) - 3 * DAY);
    const max = new Date(Math.max(...tasks.map((t) => +t.end)) + 10 * DAY);
    return { min, days: dayDiff(max, min) };
  }, [tasks]);
  const chartW = range.days * PX;
  const weeks = Array.from(
    { length: Math.ceil(range.days / 14) },
    (_, i) => new Date(range.min.getTime() + i * 14 * DAY),
  );
  const todayX = dayDiff(today, range.min) * PX;

  const grouped = PHASES.map((ph) => ({
    ph,
    items: visible.filter((t) => t.phase === ph.key),
  })).filter((g) => g.items.length);

  const move = (id, status) => {
    setTasks((ts) =>
      ts.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              progress:
                status === "done"
                  ? 100
                  : status === "todo"
                    ? 0
                    : Math.max(t.progress, status === "review" ? 85 : 20),
            }
          : t,
      ),
    );
    flash(`Moved to ${STATUSES.find((s) => s.key === status).label}`);
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const start = new Date(today);
    setTasks((ts) => [
      ...ts,
      {
        id: `${projectId}-n${Date.now()}`,
        project: projectId,
        phase: form.phase,
        title: form.title.trim(),
        owner: form.owner,
        pri: form.pri,
        status: "todo",
        progress: 0,
        start,
        end: new Date(start.getTime() + Number(form.days) * DAY),
      },
    ]);
    setForm({ ...form, title: "" });
    setAdding(false);
    flash("Task added");
  };

  const jumpToday = () =>
    scroller.current?.scrollTo({
      left: Math.max(0, todayX - 200),
      behavior: "smooth",
    });

  return (
    <AppShell crumb="Timeline & Tasks" title="Timeline & Tasks">
      <div className="tw-page flex flex-col gap-6 px-4 pb-4 pt-7 font-body text-ink lg:px-8">
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-[#1d1914] via-[#2b2418] to-[#4a3a1c] p-6 shadow-luxe sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-gold-light">
                Plan · Track · Deliver
              </p>
              <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl">
                From first sketch to <em className="text-gold">handover</em>
              </h1>
              <p className="mt-3 text-sm text-white/70">
                Follow every phase of{" "}
                <strong className="text-white">{project.name}</strong> — who is
                doing what, what is late, and when the keys change hands.
              </p>
            </div>
            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 lg:w-auto">
              <Stat
                label="Progress"
                value={`${stats.pct}%`}
                sub={`${stats.done}/${stats.total} tasks done`}
                accent
              />
              <Stat
                label="Handover"
                value={fmt(stats.last)}
                sub={`${stats.left} days to go`}
              />
              <Stat
                label="At risk"
                value={stats.late}
                sub={stats.late ? "tasks overdue" : "all on track"}
              />
              <Stat
                label="Phase"
                value={PHASES.find((p) => p.key === project.phase).label}
                sub={project.area.split(",")[0]}
              />
            </div>
          </div>
          {/* project selector */}
          <div className="relative mt-6 flex gap-2 overflow-x-auto pb-1">
            {PROJECTS.map((p) => (
              <button
                key={p.id}
                onClick={() => setProjectId(p.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${p.id === projectId ? "border-gold bg-gold text-[#1d1608] shadow-glow" : "border-white/20 text-white/80 hover:border-gold hover:text-gold"}`}
              >
                <img
                  src={p.image}
                  alt=""
                  className="h-6 w-6 rounded-full object-cover"
                />
                {p.name}
              </button>
            ))}
          </div>
        </section>

        {/* ---------- Toolbar ---------- */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full border border-line bg-surface p-1">
            {[
              ["gantt", "gantt", "Gantt"],
              ["board", "columns", "Board"],
            ].map(([k, ic, l]) => (
              <button
                key={k}
                onClick={() => setView(k)}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm transition ${view === k ? "bg-gold font-medium text-[#1d1608] shadow-glow" : "text-mute hover:text-ink"}`}
              >
                <Icon name={ic} size={16} />
                {l}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[{ key: "all", label: "All phases" }, ...PHASES].map((p) => (
              <button
                key={p.key}
                onClick={() => setPhase(p.key)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${phase === p.key ? "border-gold bg-gold/15 text-gold-dark" : "border-line bg-surface text-mute hover:border-gold"}`}
              >
                {p.label}
              </button>
            ))}
            <button
              onClick={() => setAdding((a) => !a)}
              className="flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-medium text-[#1d1608] shadow-glow transition hover:-translate-y-0.5"
            >
              <Icon name="plus" size={16} /> Add task
            </button>
          </div>
        </div>

        {adding && (
          <form
            onSubmit={addTask}
            className="grid gap-3 rounded-2xl border border-line bg-surface p-5 shadow-luxe sm:grid-cols-2 lg:grid-cols-6"
          >
            <input
              autoFocus
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Task title"
              className="rounded-xl border border-line bg-surface2 px-4 py-2.5 text-sm text-ink outline-none focus:border-gold sm:col-span-2 lg:col-span-2"
            />
            <select
              value={form.owner}
              onChange={(e) => setForm({ ...form, owner: e.target.value })}
              className="rounded-xl border border-line bg-surface2 px-3 py-2.5 text-sm text-ink"
            >
              {TEAM.map((t) => (
                <option key={t.id}>{t.name}</option>
              ))}
            </select>
            <select
              value={form.phase}
              onChange={(e) => setForm({ ...form, phase: e.target.value })}
              className="rounded-xl border border-line bg-surface2 px-3 py-2.5 text-sm text-ink"
            >
              {PHASES.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
            <select
              value={form.pri}
              onChange={(e) => setForm({ ...form, pri: e.target.value })}
              className="rounded-xl border border-line bg-surface2 px-3 py-2.5 text-sm text-ink"
            >
              <option value="high">High</option>
              <option value="med">Medium</option>
              <option value="low">Low</option>
            </select>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="120"
                value={form.days}
                onChange={(e) => setForm({ ...form, days: e.target.value })}
                aria-label="Duration in days"
                className="w-20 rounded-xl border border-line bg-surface2 px-3 py-2.5 text-sm text-ink"
              />
              <button
                type="submit"
                className="flex-1 rounded-xl bg-charcoal px-4 text-sm font-medium text-gold"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* ---------- Gantt ---------- */}
        {view === "gantt" && (
        <section className="timeline-gantt overflow-hidden rounded-3xl border border-line bg-surface shadow-luxe">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
              <div className="flex flex-wrap gap-4 text-xs text-mute">
                {PHASES.map((p) => (
                  <span key={p.key} className="flex items-center gap-2">
                    <i
                      className={`h-2.5 w-2.5 rounded-sm ${PHASE_STYLE[p.key].dot}`}
                    />
                    {p.label}
                  </span>
                ))}
                <span className="flex items-center gap-2">
                  <i className="h-2.5 w-2.5 rotate-45 bg-charcoal ring-1 ring-gold" />
                  Milestone
                </span>
              </div>
              <button
                onClick={jumpToday}
                className="flex items-center gap-1.5 rounded-full border border-gold/50 px-3 py-1 text-xs font-medium text-gold-dark hover:bg-gold/10"
              >
                <Icon name="flag" size={13} /> Today
              </button>
            </div>
            <div className="timeline-mobile-list">
              {grouped.map(({ ph, items }) => (
                <div className="timeline-mobile-phase" key={ph.key}>
                  <h3 className={PHASE_STYLE[ph.key].text}>
                    <i className={PHASE_STYLE[ph.key].dot} />
                    {ph.label}
                    <span>{items.length}</span>
                  </h3>
                  {items.map((t) => {
                    const overdue =
                      t.status !== "done" && t.end < today && !t.milestone;
                    const statusLabel =
                      STATUSES.find((s) => s.key === t.status)?.label ?? t.status;
                    return (
                      <article className="timeline-mobile-task" key={t.id}>
                        <div className="timeline-mobile-task__top">
                          <strong>{t.title}</strong>
                          {overdue && <span className="timeline-mobile-late">Late</span>}
                          {t.milestone && <span className="timeline-mobile-milestone">Milestone</span>}
                        </div>
                        <div className="timeline-mobile-owner">
                          <Avatar src={photoOf(t.owner)} name={t.owner} size={26} />
                          <span>{t.owner}</span>
                        </div>
                        <div className="timeline-mobile-dates">
                          <span>{fmt(t.start)}{t.milestone ? "" : ` – ${fmt(t.end)}`}</span>
                          <span>{statusLabel}</span>
                        </div>
                        {!t.milestone && (
                          <div className="timeline-mobile-progress" aria-label={`${t.progress}% complete`}>
                            <i style={{ width: `${t.progress}%` }} />
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              ))}
            </div>
            <div ref={scroller} className="timeline-gantt__scroller overflow-x-auto">
              <div style={{ width: LABEL_W + chartW }} className="relative">
                {/* header */}
                <div className="sticky top-0 z-20 flex border-b border-line bg-surface2">
                  <div
                    style={{ width: LABEL_W }}
                    className="sticky left-0 z-30 shrink-0 border-r border-line bg-surface2 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-mute"
                  >
                    Task
                  </div>
                  <div style={{ width: chartW }} className="relative h-11">
                    {weeks.map((w, i) => (
                      <span
                        key={i}
                        style={{ left: i * 14 * PX + 8 }}
                        className="absolute top-3 text-[11px] text-mute"
                      >
                        {fmt(w)}
                      </span>
                    ))}
                  </div>
                </div>
                {/* rows */}
                {grouped.map(({ ph, items }) => (
                  <div key={ph.key}>
                    <div className="flex border-b border-line bg-surface2/60">
                      <div
                        style={{ width: LABEL_W }}
                        className="sticky left-0 z-10 flex shrink-0 items-center gap-2 border-r border-line bg-surface2 px-5 py-2"
                      >
                        <i
                          className={`h-2.5 w-2.5 rounded-sm ${PHASE_STYLE[ph.key].dot}`}
                        />
                        <span
                          className={`font-display text-[15px] ${PHASE_STYLE[ph.key].text}`}
                        >
                          {ph.label}
                        </span>
                        <span className="ml-auto text-[11px] text-mute">
                          {items.length}
                        </span>
                      </div>
                      <div style={{ width: chartW }} />
                    </div>
                    {items.map((t) => {
                      const left = dayDiff(t.start, range.min) * PX;
                      const width = Math.max(dayDiff(t.end, t.start) * PX, 16);
                      const overdue =
                        t.status !== "done" && t.end < today && !t.milestone;
                      return (
                        <div
                          key={t.id}
                          className="group flex border-b border-line/70 hover:bg-gold/5"
                        >
                          <div
                            style={{ width: LABEL_W }}
                            className="sticky left-0 z-10 flex shrink-0 items-center gap-3 border-r border-line bg-surface px-5 py-2.5 group-hover:bg-surface2"
                          >
                            <Avatar
                              src={photoOf(t.owner)}
                              name={t.owner}
                              size={28}
                            />
                            <div className="min-w-0">
                              <p className="truncate text-[13px] font-medium">
                                {t.title}
                              </p>
                              <p className="truncate text-[11px] text-mute">
                                {t.owner.split(" ")[0]} · {fmt(t.start)}
                                {t.milestone ? "" : ` → ${fmt(t.end)}`}
                              </p>
                            </div>
                          </div>
                          <div
                            style={{ width: chartW, "--week": `${7 * PX}px` }}
                            className="gantt-grid relative h-[54px]"
                          >
                            {t.milestone ? (
                              <span
                                title={t.title}
                                style={{ left: left - 2 }}
                                className="absolute top-[17px] h-5 w-5 rotate-45 bg-charcoal ring-2 ring-gold"
                              />
                            ) : (
                              <div
                                title={`${t.title} — ${t.progress}%`}
                                style={{ left, width }}
                                className={`absolute top-3 h-7 overflow-hidden rounded-lg bg-gradient-to-r shadow-sm ${PHASE_STYLE[t.phase].bar} ${overdue ? "ring-2 ring-brick" : ""}`}
                              >
                                <div
                                  style={{ width: `${t.progress}%` }}
                                  className="h-full bg-black/25"
                                />
                                {width > 70 && (
                                  <span className="absolute inset-0 flex items-center px-2 text-[11px] font-medium text-white drop-shadow">
                                    {t.progress}%
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                {/* today line */}
                <div
                  style={{ left: LABEL_W + todayX }}
                  className="pointer-events-none absolute bottom-0 top-0 z-[5] w-px bg-gold"
                >
                  <span className="absolute -top-0 -translate-x-1/2 rounded-b-md bg-gold px-2 py-0.5 text-[10px] font-semibold text-[#1d1608]">
                    TODAY
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ---------- Board ---------- */}
        {view === "board" && (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {STATUSES.map((col) => {
              const items = visible.filter((t) => t.status === col.key);
              return (
                <div
                  key={col.key}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragId) move(dragId, col.key);
                    setDragId(null);
                  }}
                  className="flex min-h-[320px] flex-col rounded-3xl border border-line bg-surface2/60 p-3"
                >
                  <div className="mb-3 flex items-center justify-between px-2 pt-1">
                    <h3 className="font-display text-lg">{col.label}</h3>
                    <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-semibold text-gold-dark">
                      {items.length}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3">
                    {items.map((t) => {
                      const next =
                        STATUSES[
                          STATUSES.findIndex((s) => s.key === t.status) + 1
                        ];
                      return (
                        <article
                          key={t.id}
                          draggable
                          onDragStart={() => setDragId(t.id)}
                          className="cursor-grab rounded-2xl border border-line bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-gold hover:shadow-luxe active:cursor-grabbing"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span
                              className={`text-[11px] font-semibold uppercase tracking-wider ${PHASE_STYLE[t.phase].text}`}
                            >
                              {PHASES.find((p) => p.key === t.phase).label}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${PRI[t.pri]}`}
                            >
                              {t.pri}
                            </span>
                          </div>
                          <p className="text-sm font-medium leading-snug">
                            {t.title}
                          </p>
                          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
                            <div
                              style={{ width: `${t.progress}%` }}
                              className="h-full rounded-full bg-gradient-to-r from-gold to-bronze"
                            />
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar
                                src={photoOf(t.owner)}
                                name={t.owner}
                                size={26}
                              />
                              <span className="text-xs text-mute">
                                {fmt(t.end)}
                              </span>
                            </div>
                            {next && (
                              <button
                                onClick={() => move(t.id, next.key)}
                                className="rounded-full border border-line px-3 py-1 text-[11px] text-mute hover:border-gold hover:text-gold-dark"
                              >
                                → {next.label}
                              </button>
                            )}
                          </div>
                        </article>
                      );
                    })}
                    {!items.length && (
                      <p className="m-auto text-center text-xs text-mute">
                        Drop tasks here
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {toast && (
          <div
            className="fixed bottom-7 left-1/2 z-[300] -translate-x-1/2 rounded-full border border-gold bg-charcoal px-6 py-2.5 text-sm text-white shadow-luxe"
            role="status"
          >
            {toast}
          </div>
        )}
      </div>
      <SiteFooter />
    </AppShell>
  );
}
