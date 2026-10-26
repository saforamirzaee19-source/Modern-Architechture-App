import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell, { SiteFooter } from "../components/AppShell.jsx";
import Avatar from "../components/Avatar.jsx";
import Icon from "../components/Icon.jsx";
import { SERVICES, TEAM, SPECIALTIES, STUDIO_STATS } from "../data/index.js";

export default function FindSpecialist() {
  const [q, setQ] = useState("");
  const [where, setWhere] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [status, setStatus] = useState("");

  const term = (q + " " + specialty).trim().toLowerCase();
  const services = useMemo(
    () =>
      SERVICES.filter(
        (s) =>
          !term ||
          term
            .split(/\s+/)
            .every((t) =>
              (s.title + " " + s.text + " " + s.search)
                .toLowerCase()
                .includes(t),
            ),
      ),
    [term],
  );
  const people = useMemo(
    () =>
      TEAM.filter((p) => {
        if (specialty && p.discipline !== specialty) return false;
        const hay = `${p.name} ${p.role} ${p.discipline}`.toLowerCase();
        return (
          !q.trim() ||
          q
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .every((t) => hay.includes(t))
        );
      }),
    [q, specialty],
  );

  const useLocation = () => {
    if (!navigator.geolocation)
      return setStatus("Location is not supported in this browser.");
    setStatus("Finding specialists near you…");
    navigator.geolocation.getCurrentPosition(
      () => {
        setWhere("Current location");
        setStatus("Showing specialists near your location.");
      },
      () => setStatus("We couldn't get your location. Enter an area instead."),
    );
  };

  return (
    <AppShell crumb="Find Specialist" title="Find Specialist">
      <main className="content find-page">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">
              Visionary design, exceptional craftsmanship
            </p>
            <h1>Find the right specialist for your build</h1>
            <p>
              Compare architects, engineers, interior designers and project
              managers — and book them for your next design review or site
              visit.
            </p>
            <div className="hero-highlights">
              {STUDIO_STATS.map((s) => (
                <span key={s.label}>
                  <strong>{s.value}</strong> {s.label.toLowerCase()}
                </span>
              ))}
            </div>
          </div>
          <div className="hero-mark" aria-hidden="true">
            <Icon name="ruler" size={44} />
            <small>Design starts here</small>
          </div>
        </section>

        <form
          className="search-panel"
          onSubmit={(e) => {
            e.preventDefault();
            setStatus(
              `${people.length} specialists and ${services.length} services found.`,
            );
          }}
        >
          <div className="search-field wide">
            <label htmlFor="sq">What are you looking for?</label>
            <input
              id="sq"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Name, discipline, or service"
              autoComplete="off"
            />
          </div>
          <div className="search-field">
            <label htmlFor="sw">Where?</label>
            <input
              id="sw"
              type="text"
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              placeholder="District or neighborhood"
            />
          </div>
          <button className="btn-gold" type="submit">
            <Icon name="search" size={16} /> Search specialists
          </button>
          <button className="btn-ghost" type="button" onClick={useLocation}>
            <Icon name="locate" size={16} /> Use my location
          </button>
          <p className="search-status" role="status" aria-live="polite">
            {status}
          </p>
        </form>

        <section>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Comprehensive design solutions</p>
              <h2>Our services</h2>
            </div>
            <span className="count-chip">{services.length} services</span>
          </div>
          <div className="service-grid">
            {services.map((s) => (
              <article className="card service-card" key={s.id}>
                <Link to="/find-site">
                  <span>
                    <img src={s.image} alt={s.title} />
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </Link>
              </article>
            ))}
          </div>

          {!services.length && (
            <p className="empty-note">
              No services match that search. Try a different discipline.
            </p>
          )}
        </section>

        <section>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Recommended for you</p>
              <h2>Available specialists</h2>
            </div>
            <span className="count-chip">{people.length} specialists</span>
          </div>
          <div className="person-grid">
            {people.map((p) => (
              <article className="card person-card" key={p.id}>
                <Avatar
                  src={p.photo}
                  name={p.name}
                  size={64}
                  className={`ring-${p.color}`}
                />
                <div className="person-main">
                  <h3>{p.name}</h3>
                  <p className="person-role">{p.role}</p>
                  <p className="person-meta">
                    <Icon name="star" size={14} /> {p.rating} · {p.jobs}{" "}
                    projects
                  </p>
                  <p className="person-next">
                    <Icon name="clock" size={14} /> Next: {p.next}
                  </p>
                </div>
                <Link className="btn-gold small" to="/schedule">
                  Book meeting
                </Link>
              </article>
            ))}
          </div>
          {!people.length && (
            <p className="empty-note">
              No specialists match that search. Try another discipline.
            </p>
          )}
        </section>

        <section className="specialty-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Browse by discipline</p>
              <h2>Specialists by discipline</h2>
            </div>
          </div>
          <div className="specialty-list">
            {SPECIALTIES.map((s) => (
              <button
                key={s}
                type="button"
                className={`specialty${specialty === s ? " active" : ""}`}
                onClick={() => setSpecialty(specialty === s ? "" : s)}
              >
                {s} <Icon name="arrow" size={14} />
              </button>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </AppShell>
  );
}
