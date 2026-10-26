import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell, { SiteFooter } from "../components/AppShell.jsx";
import ProjectMap from "../components/ProjectMap.jsx";
import Icon from "../components/Icon.jsx";
import { PROJECTS, PHASES, money } from "../data/index.js";

const FILTERS = ["Online scheduling", "Site open today"];

export default function FindSite() {
  const [query, setQuery] = useState("");
  const [loc, setLoc] = useState("");
  const [type, setType] = useState("");
  const [filters, setFilters] = useState([]);
  const [view, setView] = useState("map");
  const [satellite, setSatellite] = useState(false);
  const [selected, setSelected] = useState(null);
  const [full, setFull] = useState(false);
  const [status, setStatus] = useState("");

  const results = useMemo(
    () =>
      PROJECTS.filter((p) => {
        const q = query.trim().toLowerCase();
        if (q && !`${p.name} ${p.kind} ${p.type}`.toLowerCase().includes(q))
          return false;
        const l = loc.trim().toLowerCase();
        if (l && !p.area.toLowerCase().includes(l)) return false;
        if (type && p.type !== type) return false;
        return filters.every((f) => p.services.includes(f));
      }),
    [query, loc, type, filters],
  );

  const toggle = (f) =>
    setFilters((a) => (a.includes(f) ? a.filter((x) => x !== f) : [...a, f]));
  const clear = () => {
    setFilters([]);
    setType("");
    setQuery("");
    setLoc("");
  };
  const locate = () => {
    if (!navigator.geolocation)
      return setStatus("Location is not supported in this browser.");
    navigator.geolocation.getCurrentPosition(
      () => setStatus("Showing project sites near your location."),
      () => setStatus("We couldn't get your location."),
    );
  };

  return (
    <AppShell crumb="Find Site" title="Find Site">
      <main className="content site-page">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Projects across the city</p>
            <h1>Find a project site near you</h1>
            <p>
              Browse live construction sites, check their phase and budget, and
              arrange a visit with the site team.
            </p>
          </div>
          <div className="site-search">
            <label>
              <span>Project or type</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Villa, hotel, interior…"
              />
            </label>
            <label>
              <span>Location</span>
              <input
                type="text"
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                placeholder="Neighborhood, e.g. Taimani"
              />
            </label>
            <button className="btn-ghost" type="button" onClick={locate}>
              <Icon name="locate" size={16} /> Use location
            </button>
            <p className="search-status" role="status">
              {status}
            </p>
          </div>
        </section>

        <div className="view-buttons" role="tablist">
          <button
            className={`view-btn${view === "map" ? " active" : ""}`}
            onClick={() => setView("map")}
            role="tab"
            aria-selected={view === "map"}
          >
            <Icon name="pin" size={16} /> Map
          </button>
          <button
            className={`view-btn${view === "list" ? " active" : ""}`}
            onClick={() => setView("list")}
            role="tab"
            aria-selected={view === "list"}
          >
            <Icon name="list" size={16} /> List
          </button>
        </div>

        <section className="site-content">
          <aside className="filters card" aria-label="Site filters">
            <h2>Refine results</h2>
            <label htmlFor="ptype">Project type</label>
            <select
              id="ptype"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">All project types</option>
              {[...new Set(PROJECTS.map((p) => p.type))].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <h3>Services</h3>
            {FILTERS.map((f) => (
              <label className="checkbox" key={f}>
                <input
                  type="checkbox"
                  checked={filters.includes(f)}
                  onChange={() => toggle(f)}
                />
                <span>{f}</span>
              </label>
            ))}
            <button className="btn-ghost" type="button" onClick={clear}>
              Clear filters
            </button>
          </aside>

          <div className="site-results">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Nearby sites</p>
                <h2>Projects near you</h2>
              </div>
              <span className="count-chip">{results.length} sites</span>
            </div>
            {view === "map" && (
              <div className={`map-view${full ? " is-full" : ""}`}>
                <div className="map-toolbar">
                  <button
                    className={!satellite ? "active" : ""}
                    onClick={() => setSatellite(false)}
                  >
                    Street
                  </button>
                  <button
                    className={satellite ? "active" : ""}
                    onClick={() => setSatellite(true)}
                  >
                    Satellite
                  </button>
                  <button
                    className="fullscreen"
                    aria-label="Toggle fullscreen map"
                    onClick={() => setFull((f) => !f)}
                  >
                    <Icon name="expand" size={16} />
                  </button>
                </div>
                <ProjectMap
                  projects={results}
                  satellite={satellite}
                  height={full ? "100%" : 420}
                  selectedId={selected}
                  onSelect={setSelected}
                />
              </div>
            )}
            <div className="site-list">
              {results.map((p) => (
                <article
                  key={p.id}
                  className={`card site-card${selected === p.id ? " selected" : ""}`}
                  onClick={() => {
                    setSelected(p.id);
                    if (view === "list") setView("map");
                  }}
                >
                  <img src={p.image} alt={p.name} />
                  <div className="site-card-main">
                    <h3>{p.name}</h3>
                    <p className="muted">
                      {p.kind} · {p.area}
                    </p>
                    <p className="site-card-meta">
                      <span className={`phase-pill phase-${p.phase}`}>
                        {PHASES.find((x) => x.key === p.phase).label}
                      </span>{" "}
                      <span>{money(p.budget)}</span>{" "}
                      <span>{p.progress}% complete</span>
                    </p>
                  </div>
                  <Link
                    className="btn-gold small"
                    to="/schedule"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Book visit
                  </Link>
                </article>
              ))}
            </div>
            {!results.length && (
              <p className="empty-note">
                No sites match these filters. Try another search.
              </p>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </AppShell>
  );
}
