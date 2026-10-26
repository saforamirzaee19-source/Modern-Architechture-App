import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Icon from "./Icon.jsx";
import Avatar from "./Avatar.jsx";
import useTheme from "./useTheme.js";
import confirmAction from "./Alerts.js";
import { IMG, BRAND } from "../data/index.js";

const NAV_ITEMS = [
  { to: "/dashboard", icon: "home", label: "Dashboard" },
  { to: "/schedule", icon: "calendar", label: "Site Schedule" },
  { to: "/find-specialist", icon: "ruler", label: "Find Specialist" },
  { to: "/find-site", icon: "pin", label: "Find Site" },
  { to: "/chat", icon: "message", label: "Chat" },
  { to: "/materials", icon: "box", label: "Materials" },
  { to: "/contractors", icon: "hardhat", label: "Contractors" },
  { to: "/my-projects", icon: "folder", label: "My Projects" },
  { to: "/document", icon: "card", label: "Documents" },
  { to: "/timeline", icon: "calendar", label: "Timeline" },
  { to: "/billing", icon: "card", label: "Billing" },
  { to: "/settings", icon: "sliders", label: "Settings" },
];

const NOTIFICATIONS = [
  {
    title: "New message from Emma Rodriguez",
    time: "13 minutes ago",
    photo: IMG.emma,
  },
  {
    title: "Concrete delivery confirmed for Modern Villa",
    time: "1 day ago",
    icon: "truck",
  },
  {
    title: "Invoice INV-2041 paid successfully",
    time: "2 days ago",
    icon: "card",
  },
];

function Notifications() {
  return (
    <div className="information">
      {NOTIFICATIONS.map((n) => (
        <article className="information-item" key={n.title}>
          {n.photo ? (
            <Avatar src={n.photo} name="" size={40} />
          ) : (
            <span className="information-icon">
              <Icon name={n.icon} size={18} />
            </span>
          )}
          <div>
            <p>{n.title}</p>
            <small>{n.time}</small>
          </div>
        </article>
      ))}
    </div>
  );
}

function Sidebar({ collapsed, open, onNavigate }) {
  return (
    <aside
      className={`sidebar${collapsed ? " collapsed" : ""}${open ? " open" : ""}`}
      id="sidebar"
    >
      <div className="sidebar-logo">
        <img src={IMG.logo} alt="Luxe Studio" className="logo-badge" />
        <span className="logo-text">
          <b>{BRAND.name}</b>
          <small>{BRAND.sub}</small>
        </span>
      </div>
      <nav>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            title={item.label}
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            <Icon name={item.icon} />
            <span className="label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-help">
        Need help? <br /> Ask your project manager!
      </div>
      <button
        className="sidebar-help-mini"
        type="button"
        aria-label="Need help?"
        title="Need help?"
      >
        <Icon name="help" size={18} />
      </button>
    </aside>
  );
}

function Topbar({
  crumb,
  title,
  onToggleSidebar,
  expanded,
  theme,
  onToggleTheme,
  onLogout,
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Search this page": finds visible text blocks in the main content.
  useEffect(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const page = document.querySelector(".main");
    if (!terms.length || !page) return setResults([]);
    const found = [];
    Array.from(page.querySelectorAll("*"))
      .reverse()
      .forEach((el) => {
        if (
          el.closest(
            ".topbar, .site-footer, [hidden], script, style, input, textarea, select, option, svg",
          ) ||
          el.getClientRects().length === 0
        )
          return;
        const text = (el.innerText || el.textContent || "")
          .replace(/\s+/g, " ")
          .trim();
        if (!text || !terms.every((t) => text.toLowerCase().includes(t)))
          return;
        if (found.some((f) => el.contains(f.el))) return;
        found.push({ el, text });
      });
    setResults(found.reverse().slice(0, 8));
  }, [query]);

  const go = (el) => {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setQuery("");
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button
          className="sidebar-toggle"
          type="button"
          aria-label="Toggle sidebar"
          aria-expanded={expanded}
          aria-controls="sidebar"
          onClick={onToggleSidebar}
        >
          <Icon name="menu" />
        </button>
        <div>
          <div className="crumbs">
            <Link
              to="/dashboard"
              className="topbar-home-link"
              aria-label="Go to dashboard"
            >
              <Icon name="home" size={14} />
            </Link>{" "}
            / {crumb}
          </div>
          <h2>{title}</h2>
        </div>
      </div>
      <div className="topbar-right">
        <div className="topbar-search">
          <Icon name="search" size={16} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search this page..."
            aria-label="Search this page"
          />
          {query.trim() && (
            <div
              className="topbar-search-results"
              role="region"
              aria-live="polite"
            >
              {results.length ? (
                results.map(({ el, text }, i) => (
                  <button
                    className="topbar-search-result"
                    key={i}
                    type="button"
                    onClick={() => go(el)}
                  >
                    {text.length > 140 ? `${text.slice(0, 137)}...` : text}
                  </button>
                ))
              ) : (
                <p className="topbar-search-empty">
                  No results found on this page.
                </p>
              )}
            </div>
          )}
        </div>
        <button
          className="theme-toggle"
          type="button"
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          onClick={onToggleTheme}
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
          <span className="toggle-text">
            {theme === "dark" ? "Light" : "Dark"}
          </span>
        </button>
        <div className="notification-menu">
          <button
            className="notification-toggle"
            type="button"
            aria-label="Show notifications"
            aria-expanded={notifOpen}
            onClick={() => setNotifOpen((o) => !o)}
          >
            <Icon name="bell" size={18} />
            <span className="notification-count">3</span>
          </button>
          {notifOpen && (
            <section className="notification-panel" aria-label="Notifications">
              <h3>Notifications</h3>
              <Notifications />
            </section>
          )}
        </div>
        <button className="logout" type="button" onClick={onLogout}>
          <Icon name="lock" size={16} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        © 2026 <strong>Luxe Studio</strong>. Creating extraordinary spaces.
      </div>
      <div className="links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">FAQs</a>
      </div>
    </footer>
  );
}

export default function AppShell({ crumb, title, children }) {
  const navigate = useNavigate();
  const [theme, toggleTheme] = useTheme();
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return (
        window.innerWidth > 1000 &&
        localStorage.getItem("sidebarCollapsed") === "1"
      );
    } catch (e) {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onResize = () => setMobileOpen(false);
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("resize", onResize);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleSidebar = () => {
    if (window.innerWidth <= 1000) return setMobileOpen((o) => !o);
    setCollapsed((c) => {
      try {
        localStorage.setItem("sidebarCollapsed", c ? "0" : "1");
      } catch (e) {
        /* ignore */
      }
      return !c;
    });
  };

  const logout = async () => {
    await confirmAction("logout");
    navigate("/");
  };

  return (
    <div className="dashboard-layout">
      <div
        className={`sidebar-backdrop${mobileOpen ? " show" : ""}`}
        onClick={() => setMobileOpen(false)}
      />
      <Sidebar
        collapsed={collapsed}
        open={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
      />
      <div className="main">
        <Topbar
          crumb={crumb}
          title={title}
          onToggleSidebar={toggleSidebar}
          expanded={window.innerWidth <= 1000 ? mobileOpen : !collapsed}
          theme={theme}
          onToggleTheme={toggleTheme}
          onLogout={logout}
        />
        {children}
      </div>
    </div>
  );
}
