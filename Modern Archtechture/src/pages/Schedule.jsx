import { useMemo, useState } from "react";
import AppShell, { SiteFooter } from "../components/AppShell.jsx";
import ReactCharts from "../components/ReactCharts.jsx";
import Avatar from "../components/Avatar.jsx";
import Icon from "../components/Icon.jsx";
import { TEAM, PROJECTS, PALETTE, IMG } from "../data/index.js";
import scheduleImage from "../assets/images/sitScatual.png";

const TYPES = {
  visit: { label: "Site Visit", color: PALETTE.gold },
  inspection: { label: "Inspection", color: PALETTE.brick },
  review: { label: "Design Review", color: PALETTE.olive },
  client: { label: "Client Meeting", color: PALETTE.bronze },
};
const TYPE_KEYS = Object.keys(TYPES);
const PEOPLE = TEAM.map((t) => t.name);
const photoOf = (n) => TEAM.find((t) => t.name === n)?.photo;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const pad = (n) => String(n).padStart(2, "0");
const toKey = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromKey = (k) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const fmtLong = (k) =>
  fromKey(k).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
const fmtShort = (k) =>
  fromKey(k).toLocaleDateString("en-US", { month: "short", day: "numeric" });

function buildSeed() {
  let s = 42;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const now = new Date();
  const list = [];
  let id = 1;
  for (let m = -5; m <= 2; m++) {
    const count = m <= 0 ? 14 : 5;
    for (let i = 0; i < count; i++) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() + m,
        1 + Math.floor(rnd() * 27),
      );
      list.push({
        id: id++,
        person: PEOPLE[Math.floor(rnd() * PEOPLE.length)],
        project: PROJECTS[Math.floor(rnd() * PROJECTS.length)].name,
        type: TYPE_KEYS[Math.floor(rnd() * TYPE_KEYS.length)],
        date: toKey(date),
      });
    }
  }
  return list;
}

function RowMenu({ onComplete, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="row-menu">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Meeting actions"
        className="icon-btn"
      >
        <Icon name="dots" size={18} />
      </button>
      {open && (
        <div className="row-menu-pop">
          {onComplete && (
            <button
              onClick={() => {
                onComplete();
                setOpen(false);
              }}
            >
              Mark as done
            </button>
          )}
          <button
            className="danger"
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function Row({ item, onDelete, onComplete }) {
  return (
    <li className="appt-row">
      <Avatar src={photoOf(item.person)} name={item.person} size={44} />
      <div className="appt-row-main">
        <p className="appt-who">{item.person}</p>
        <p className="appt-type" style={{ color: TYPES[item.type].color }}>
          {TYPES[item.type].label} · {item.project}
        </p>
      </div>
      <p className="appt-date" title={fmtLong(item.date)}>
        {fmtShort(item.date)}
      </p>
      <RowMenu onDelete={onDelete} onComplete={onComplete} />
    </li>
  );
}

function StatCard({ title, value, delta, series, categories }) {
  const options = useMemo(
    () => ({
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { display: false }, grid: { display: false } },
        y: { display: false, grid: { display: false } },
      },
    }),
    [],
  );
  return (
    <div className="card appt-stat">
      <p className="muted">{title}</p>
      <p className="stat-value">
        {value}
        <span className={delta >= 0 ? "up" : "down"}>
          {delta >= 0 ? `+${delta}` : delta}
        </span>
      </p>
      <ReactCharts
        type="line"
        height={76}
        labels={categories}
        datasets={[
          {
            label: title,
            data: series,
            borderColor: PALETTE.gold,
            backgroundColor: "rgba(212,164,75,.2)",
            fill: true,
            tension: 0.4,
            pointRadius: 2,
          },
        ]}
        options={options}
      />
    </div>
  );
}

function Calendar({ cursor, setCursor, items }) {
  const today = toKey(new Date());
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const gridStart = new Date(first);
  gridStart.setDate(1 - first.getDay());
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
  const byDay = useMemo(() => {
    const m = {};
    items.forEach((a) => (m[a.date] ||= []).push(a));
    return m;
  }, [items]);
  const shift = (n) =>
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + n, 1));

  return (
    <div className="card appt-calendar">
      <div className="appt-calendar-header">
        <h2>
          {first.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div className="appt-calendar-controls">
          <button onClick={() => setCursor(new Date())} className="pill-btn">
            today
          </button>
          <button
            onClick={() => shift(-1)}
            aria-label="Previous month"
            className="icon-btn"
          >
            <Icon name="left" size={18} />
          </button>
          <button
            onClick={() => shift(1)}
            aria-label="Next month"
            className="icon-btn"
          >
            <Icon name="right" size={18} />
          </button>
        </div>
      </div>
      <div className="appt-weekdays">
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
      <div className="appt-grid">
        {days.map((d) => {
          const key = toKey(d);
          const list = byDay[key] || [];
          return (
            <div
              key={key}
              className={`appt-day${d.getMonth() === cursor.getMonth() ? "" : " outside"}${key === today ? " is-today" : ""}`}
            >
              <p className="appt-day-number">
                <span>{d.getDate()}</span>
              </p>
              {list.slice(0, 2).map((a) => (
                <div
                  key={a.id}
                  title={`${a.person} – ${TYPES[a.type].label} – ${a.project}`}
                  className="appt-event"
                  style={{ background: TYPES[a.type].color }}
                >
                  {a.person.split(" ")[0]} · {TYPES[a.type].label}
                </div>
              ))}
              {list.length > 2 && (
                <p className="appt-more">+{list.length - 2} more</p>
              )}
            </div>
          );
        })}
      </div>
      <div className="appt-legend">
        {TYPE_KEYS.map((k) => (
          <span key={k}>
            <i style={{ background: TYPES[k].color }} />
            {TYPES[k].label}
          </span>
        ))}
      </div>
    </div>
  );
}

function BookingForm({ onSubmit, defaultDate }) {
  const [form, setForm] = useState({
    person: PEOPLE[0],
    project: PROJECTS[0].name,
    type: "visit",
    date: defaultDate,
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <div className="card booking-form">
      <h2>Schedule a meeting</h2>
      <div className="booking-fields">
        <label>
          Team member
          <select value={form.person} onChange={set("person")}>
            {PEOPLE.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label>
          Project
          <select value={form.project} onChange={set("project")}>
            {PROJECTS.map((p) => (
              <option key={p.id}>{p.name}</option>
            ))}
          </select>
        </label>
        <label>
          Meeting type
          <select value={form.type} onChange={set("type")}>
            {TYPE_KEYS.map((k) => (
              <option key={k} value={k}>
                {TYPES[k].label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Date
          <input type="date" value={form.date} onChange={set("date")} />
        </label>
        <button
          className="btn-gold"
          disabled={!form.date}
          onClick={() => onSubmit(form)}
        >
          Book meeting
        </button>
      </div>
    </div>
  );
}

export default function Schedule() {
  const [tab, setTab] = useState("overview");
  const [items, setItems] = useState(buildSeed);
  const [cursor, setCursor] = useState(() => new Date());
  const [range, setRange] = useState("Days");
  const [toast, setToast] = useState("");

  const today = startOfDay(new Date());
  const todayKey = toKey(today);

  const monthWindow = useMemo(
    () =>
      Array.from(
        { length: 6 },
        (_, i) => new Date(today.getFullYear(), today.getMonth() - 5 + i, 1),
      ),
    [todayKey],
  );
  const sameMonth = (a, m) => {
    const d = fromKey(a.date);
    return d.getFullYear() === m.getFullYear() && d.getMonth() === m.getMonth();
  };

  const stacked = useMemo(
    () =>
      TYPE_KEYS.map((k) => ({
        k,
        data: monthWindow.map(
          (m) => items.filter((a) => a.type === k && sameMonth(a, m)).length,
        ),
      })),
    [items, monthWindow],
  );

  const trend = useMemo(() => {
    const months = Array.from(
      { length: 9 },
      (_, i) => new Date(today.getFullYear(), today.getMonth() - 8 + i, 1),
    );
    const count = (keys) =>
      months.map(
        (m) =>
          items.filter((a) => keys.includes(a.type) && sameMonth(a, m)).length,
      );
    return {
      categories: months.map((m) => MONTHS[m.getMonth()]),
      visits: count(["visit", "inspection"]),
      reviews: count(["review", "client"]),
    };
  }, [items, todayKey]);
  const diff = (arr) => (arr[arr.length - 1] ?? 0) - (arr[arr.length - 2] ?? 0);

  const past = items
    .filter((a) => a.date < todayKey)
    .sort((a, b) => b.date.localeCompare(a.date));
  const upcoming = useMemo(() => {
    const limit = new Date(today);
    if (range === "Days") limit.setDate(limit.getDate() + 7);
    if (range === "Months") limit.setMonth(limit.getMonth() + 1);
    if (range === "Years") limit.setFullYear(limit.getFullYear() + 1);
    return items
      .filter((a) => a.date >= todayKey && fromKey(a.date) <= limit)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [items, range, todayKey]);

  const flash = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 2500);
  };
  const add = (f) => {
    setItems((l) => [...l, { id: Date.now(), ...f }]);
    setCursor(fromKey(f.date));
    setTab("overview");
    flash("Meeting scheduled");
  };
  const remove = (id) => {
    setItems((l) => l.filter((a) => a.id !== id));
    flash("Meeting deleted");
  };
  const done = (id) => {
    setItems((l) =>
      l.map((a) =>
        a.id === id
          ? { ...a, date: toKey(new Date(today.getTime() - 86400000)) }
          : a,
      ),
    );
    flash("Moved to previous meetings");
  };

  return (
    <AppShell crumb="Site Schedule" title="Site Schedule">
      <div className="page schedule-page">
        <header className="page-header">
          <div>
            <p className="eyebrow">Your sites, organized</p>
            <h1>Site Schedule</h1>
            <p>
              Keep track of site visits, inspections and design reviews across
              all projects.
            </p>
          </div>
          <div className="tabs">
            <button
              className={tab === "overview" ? "active" : ""}
              onClick={() => setTab("overview")}
            >
              Overview
            </button>
            <button
              className={tab === "booking" ? "active" : ""}
              onClick={() => setTab("booking")}
            >
              + New meeting
            </button>
          </div>
        </header>

        {tab === "booking" ? (
          <div className="booking-layout">
            <BookingForm onSubmit={add} defaultDate={todayKey} />
            <aside
              className="booking-promo"
              style={{ backgroundImage: `url("${IMG.glassHouse}")` }}
            >
              <div className="booking-promo-overlay">
                <p className="eyebrow">A better space starts here</p>
                <h2>Make room for what matters.</h2>
                <p>
                  Meet with our team to shape your vision into a thoughtfully
                  designed space, one step at a time.
                </p>
              </div>
            </aside>
          </div>
        ) : (
          <>
            <div className="appt-stats">
              <StatCard
                title="Site visits & inspections"
                value={trend.visits.reduce((a, b) => a + b, 0)}
                delta={diff(trend.visits)}
                series={trend.visits}
                categories={trend.categories}
              />
              <StatCard
                title="Reviews & client meetings"
                value={trend.reviews.reduce((a, b) => a + b, 0)}
                delta={diff(trend.reviews)}
                series={trend.reviews}
                categories={trend.categories}
              />
              <button
                type="button"
                onClick={() => setTab("booking")}
                className="quick-book"
              >
                <span className="quick-book-icon">
                  <Icon name="plus" />
                </span>
                <span>
                  <strong>Schedule a meeting</strong>
                  <small>Choose a team member and date</small>
                </span>
                <Icon name="arrow" />
              </button>
            </div>

            <div className="appt-layout">
              <main>
                <Calendar cursor={cursor} setCursor={setCursor} items={items} />
                <aside
                  className="schedule-promo"
                  style={{ backgroundImage: `url("${scheduleImage}")` }}
                >
                  <div className="booking-promo-overlay">
                    <p className="eyebrow">Designed around your vision</p>
                    <h2>Every great space starts with a plan.</h2>
                    <p>
                      Keep your team in sync with thoughtful site visits,
                      design reviews, and project milestones.
                    </p>
                  </div>
                </aside>
              </main>
              <aside className="appt-side">
                <div className="card">
                  <h3>Meeting activity</h3>
                  <ReactCharts
                    type="bar"
                    height={260}
                    labels={monthWindow.map((m) => MONTHS[m.getMonth()])}
                    datasets={stacked.map((s) => ({
                      label: TYPES[s.k].label,
                      data: s.data,
                      backgroundColor: TYPES[s.k].color,
                      borderRadius: 6,
                      stack: "a",
                    }))}
                    options={{
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            usePointStyle: true,
                            boxWidth: 8,
                            padding: 8,
                            font: { size: 10 },
                          },
                        },
                      },
                      scales: {
                        x: { stacked: true },
                        y: { stacked: true, beginAtZero: true },
                      },
                    }}
                  />
                </div>
                <div className="card">
                  <h3>Previous meetings</h3>
                  <ul className="appt-list">
                    {past.slice(0, 6).map((a) => (
                      <Row key={a.id} item={a} onDelete={() => remove(a.id)} />
                    ))}
                    {!past.length && (
                      <p className="empty-state">No previous meetings.</p>
                    )}
                  </ul>
                </div>
                <div className="card">
                  <h3>Upcoming meetings</h3>
                  <div className="range-tabs">
                    {["Days", "Months", "Years"].map((r) => (
                      <button
                        key={r}
                        onClick={() => setRange(r)}
                        className={range === r ? "active" : ""}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <ul className="appt-list">
                    {upcoming.map((a) => (
                      <Row
                        key={a.id}
                        item={a}
                        onDelete={() => remove(a.id)}
                        onComplete={() => done(a.id)}
                      />
                    ))}
                    {!upcoming.length && (
                      <p className="empty-state">
                        Nothing scheduled in this range. Schedule a meeting to
                        get started.
                      </p>
                    )}
                  </ul>
                </div>
              </aside>
            </div>
          </>
        )}
        {toast && (
          <div className="toast" role="status">
            {toast}
          </div>
        )}
      </div>
      <SiteFooter />
    </AppShell>
  );
}
