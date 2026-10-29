import { useMemo } from "react";
import { Link } from "react-router-dom";
import AppShell, { SiteFooter } from "../components/AppShell.jsx";
import ReactCharts from "../components/ReactCharts.jsx";
import ProjectMap from "../components/ProjectMap.jsx";
import Avatar from "../components/Avatar.jsx";
import Icon from "../components/Icon.jsx";
import {
  PROJECTS,
  PHASES,
  TEAM,
  TESTIMONIALS,
  INSIGHTS,
  PALETTE,
  money,
} from "../data/index.js";

const phaseLabel = (k) => PHASES.find((p) => p.key === k)?.label;
const COLORS = [
  PALETTE.gold,
  PALETTE.bronze,
  PALETTE.charcoal,
  PALETTE.olive,
  PALETTE.brick,
  PALETTE.sand,
];

function DonutCard({
  title,
  labels,
  data,
  suffix = "",
  action = "MORE DETAILS",
  to = "/my-projects",
}) {
  return (
    <section className="card promotion-card">
      <div className="card-header">
        <h3>{title}</h3>
        <span className="info-mark">!</span>
      </div>
      <div className="promotion-body">
        <div className="promotion-chart">
          <ReactCharts
            type="doughnut"
            labels={labels}
            datasets={[{ data, backgroundColor: COLORS, borderWidth: 0 }]}
            options={{
              cutout: "64%",
              plugins: { legend: { display: false } },
              layout: { padding: 2 },
            }}
            ariaLabel={`${title} chart`}
          />
        </div>
        <div className="promotion-legend">
          {labels.map((l, i) => (
            <div className="promotion-legend-item" key={l}>
              <span className="promotion-name">
                <i style={{ background: COLORS[i] }} className={COLORS[i] === "#222222" ? "swatch-ink" : ""} />
                {l}
              </span>
              <strong>
                {data[i]}
                {suffix}
              </strong>
            </div>
          ))}
        </div>
      </div>
      <Link className="more-btn" to={to}>
        {action}
      </Link>
    </section>
  );
}

function Metric({ title, value, delta, data }) {
  return (
    <section className="card health-metric-card">
      <div className="card-header">
        <h3>{title}</h3>
      </div>
      <div className="health-value">
        {value}{" "}
        <span className={delta.startsWith("-") ? "down" : "up"}>{delta}</span>
      </div>
      <div className="health-chart">
        <ReactCharts
          type="line"
          labels={data.map((_, i) => i)}
          datasets={[
            {
              label: title,
              data,
              borderColor: PALETTE.gold,
              backgroundColor: "rgba(212,164,75,.12)",
              fill: true,
              tension: 0.42,
              pointRadius: 0,
              borderWidth: 2,
            },
          ]}
          options={{
            plugins: { legend: { display: false } },
            scales: {
              x: { display: false },
              y: { display: false, min: 0, max: 100 },
            },
          }}
          ariaLabel={`${title} trend`}
        />
      </div>
    </section>
  );
}

export default function Dashboard() {
  const totals = useMemo(() => {
    const budget = PROJECTS.reduce((a, p) => a + p.budget, 0);
    const spent = PROJECTS.reduce((a, p) => a + p.spent, 0);
    return { budget, spent };
  }, []);

  const byPhase = PHASES.map(
    (ph) => PROJECTS.filter((p) => p.phase === ph.key).length,
  );
  const byType = [
    "Residential",
    "Commercial",
    "Interior",
    "Hospitality",
    "Mixed-Use",
  ];
  const typeCounts = byType.map(
    (t) => PROJECTS.filter((p) => p.type === t).length,
  );

  return (
    <AppShell crumb="Dashboard" title="Dashboard">
      <div className="content">
        <h1>Welcome to Luxe Project Hub</h1>
        <p className="page-lead">
          Track every phase of your architecture and construction projects —
          budgets, progress, site visits and team activity.
        </p>

        <div className="kpi-row">
          <div className="kpi">
            <span>Active projects</span>
            <strong>{PROJECTS.length}</strong>
          </div>
          <div className="kpi">
            <span>Total budget</span>
            <strong>{money(totals.budget)}</strong>
          </div>
          <div className="kpi">
            <span>Spent to date</span>
            <strong>{money(totals.spent)}</strong>
            <small>
              {Math.round((totals.spent / totals.budget) * 100)}% of budget
            </small>
          </div>
          <div className="kpi">
            <span>Open tasks</span>
            <strong>37</strong>
            <small>9 due this week</small>
          </div>
        </div>

        <div className="dashboard-cards">
          <DonutCard
            title="Projects by phase"
            labels={PHASES.map((p) => p.label)}
            data={byPhase}
          />
          <DonutCard
            title="Projects by type"
            labels={byType}
            data={typeCounts}
            action="SEE ALL PROJECTS"
          />
          <DonutCard
            title="Budget by project"
            labels={PROJECTS.slice(0, 5).map((p) => p.name)}
            data={PROJECTS.slice(0, 5).map((p) => Math.round(p.budget / 1000))}
            suffix="k"
            action="OPEN BILLING"
            to="/billing"
          />
          <div className="health-stack">
            <Metric
              title="Overall progress"
              value="45%"
              delta="+3%"
              data={[22, 26, 31, 29, 35, 38, 36, 41, 43, 44, 45]}
            />
            <Metric
              title="Safety score"
              value="92%"
              delta="+1%"
              data={[78, 81, 80, 84, 86, 85, 89, 90, 91, 91, 92]}
            />
          </div>
        </div>
      </div>

      <main className="dashboard-grid">
        <section className="card wellness-card">
          <div className="card-header">
            <h2>Phase completion</h2>
          </div>
          <div className="chart-container">
            <ReactCharts
              type="radar"
              labels={PROJECTS.map((p) => p.name)}
              datasets={PHASES.map((ph, i) => ({
                label: ph.label,
                data: PROJECTS.map((p) => {
                  const idx = PHASES.findIndex((x) => x.key === p.phase);
                  return i < idx ? 100 : i === idx ? p.progress : 0;
                }),
                backgroundColor: COLORS[i] + "26",
                borderColor: COLORS[i],
                pointBackgroundColor: COLORS[i],
                borderWidth: 2,
              }))}
              options={{
                scales: {
                  r: {
                    min: 0,
                    max: 100,
                    ticks: { stepSize: 25, backdropColor: "transparent" },
                  },
                },
              }}
              ariaLabel="Phase completion per project"
            />
          </div>
        </section>

        <section className="card appointment-chart-card">
          <div className="card-header">
            <h2>Monthly spend</h2>
          </div>
          <div className="chart-container">
            <ReactCharts
              type="bar"
              labels={["May", "Jun", "Jul", "Aug", "Sep", "Oct"]}
              datasets={[
                {
                  label: "Structure",
                  data: [44, 55, 41, 67, 62, 58],
                  backgroundColor: COLORS[2],
                  stack: "s",
                },
                {
                  label: "Materials",
                  data: [23, 33, 30, 28, 33, 37],
                  backgroundColor: COLORS[0],
                  stack: "s",
                },
                {
                  label: "Labour",
                  data: [21, 27, 25, 33, 32, 28],
                  backgroundColor: COLORS[1],
                  stack: "s",
                },
                {
                  label: "Design",
                  data: [11, 7, 15, 13, 12, 8],
                  backgroundColor: COLORS[3],
                  borderRadius: 8,
                  stack: "s",
                },
              ]}
              options={{
                scales: {
                  x: { stacked: true, grid: { display: false } },
                  y: {
                    stacked: true,
                    beginAtZero: true,
                    title: { display: true, text: "$ thousand" },
                  },
                },
              }}
              ariaLabel="Monthly spend by category"
            />
          </div>
        </section>

        <section className="map-card">
          <div className="map-title">
            <Icon name="pin" size={16} /> Active sites in Kabul
          </div>
          <ProjectMap projects={PROJECTS} height={340} />
        </section>

        <section className="card previous-card">
          <h2>Latest site visits</h2>
          {[
            {
              m: TEAM[2],
              t: "Foundation inspection",
              d: "Tuesday, October 20",
            },
            { m: TEAM[3], t: "Structural review", d: "Friday, October 16" },
            {
              m: TEAM[0],
              t: "Interior mood-board approval",
              d: "Monday, October 12",
            },
          ].map((v) => (
            <div className="appointment" key={v.t}>
              <Avatar src={v.m.photo} name={v.m.name} size={42} />
              <div className="doctor-info">
                <h3>{v.m.name}</h3>
                <p>{v.t}</p>
              </div>
              <div className="appointment-date">
                <span>{v.d}</span>
              </div>
            </div>
          ))}
          <Link className="more-btn" to="/schedule">
            OPEN SCHEDULE
          </Link>
        </section>
      </main>

      <section className="card dashboard-projects">
        <div className="card-header">
          <h2>Project portfolio</h2>
          <Link to="/my-projects" className="link-gold">
            + New project
          </Link>
        </div>
        <ul className="project-list">
          {PROJECTS.map((p) => (
            <li key={p.id}>
              <img src={p.image} alt={p.name} />
              <div className="project-main">
                <strong>{p.name}</strong>
                <span>
                  {p.kind} · {p.area}
                </span>
              </div>
              <div className="project-field">
                <label>Phase</label>
                <span className={`phase-pill phase-${p.phase}`}>
                  {phaseLabel(p.phase)}
                </span>
              </div>
              <div className="project-field">
                <label>Budget</label>
                <span>{money(p.budget)}</span>
              </div>
              <div className="project-field project-progress">
                <label>Progress · {p.progress}%</label>
                <div className="bar">
                  <i style={{ width: `${p.progress}%` }} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="content-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Discover our work</p>
            <h2>Our simple website</h2>
            <p className="muted website-link-description">
              Visit our separate website to explore more of our work.
            </p>
          </div>
          <a
            className="btn-gold website-link-button"
            href="https://saforamirzaee19-source.github.io/Modern-Architechture/"
            target="_blank"
            rel="noreferrer"
          >
            Visit website <Icon name="arrow" size={15} />
          </a>
        </div>
      </section>

      <section className="content-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Client stories</p>
            <h2>What clients say</h2>
          </div>
        </div>
        <div className="testimonial-grid">
          {TESTIMONIALS.map((t) => (
            <article className="card testimonial" key={t.name}>
              <p>“{t.text}”</p>
              <div className="testimonial-who">
                <Avatar src={t.photo} name={t.name} size={48} />
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Blog</p>
            <h2>Design insights</h2>
          </div>
        </div>
        <div className="insight-grid">
          {INSIGHTS.map((a) => (
            <article className="card insight" key={a.title}>
              <img src={a.image} alt="" />
              <div className="insight-body">
                <span className="insight-meta">
                  {a.date} · {a.tag}
                </span>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
                <a href="#" className="link-gold">
                  Read more →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </AppShell>
  );
}
