import { useState } from "react";
import AppShell, { SiteFooter } from "../components/AppShell.jsx";
import Avatar from "../components/Avatar.jsx";
import Icon from "../components/Icon.jsx";
import { IMG } from "../data/index.js";

const TABS = [
  { key: "profile", label: "Profile", icon: "user" },
  { key: "basic", label: "Basic Info", icon: "file" },
  { key: "password", label: "Change Password", icon: "lock" },
  { key: "2fa", label: "2FA", icon: "shield" },
  { key: "sessions", label: "Sessions", icon: "clock" },
  { key: "delete", label: "Delete Account", icon: "trash" },
];

const SESSIONS = [
  {
    id: 1,
    title: "Kabul, Afghanistan · 37.19.20.14",
    detail: "Current session",
    icon: "pin",
  },
  {
    id: 2,
    title: "Chrome on Windows",
    detail: "Last active 2 hours ago",
    icon: "list",
  },
  {
    id: 3,
    title: "Safari on iPhone",
    detail: "Last active yesterday",
    icon: "phone",
  },
];

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`switch${checked ? " on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <i />
    </button>
  );
}

export default function Settings() {
  const [tab, setTab] = useState("profile");
  const [visible, setVisible] = useState(true);
  const [msg, setMsg] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [info, setInfo] = useState({
    first: "Safora",
    last: "Mirzaee",
    role: "Homeowner",
    email: "saforamirzaee19@gmail.com",
    location: "Kabul, Afghanistan",
    phone: "+93 79 1717 268",
    company: "Safora Holdings",
  });
  const [pw, setPw] = useState({ cur: "", next: "", conf: "" });
  const [methods, setMethods] = useState({ sms: true, app: false });
  const [sessions, setSessions] = useState(SESSIONS);
  const [confirmDel, setConfirmDel] = useState(false);

  const flash = (m) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 2500);
  };
  const setI = (k) => (e) => setInfo((i) => ({ ...i, [k]: e.target.value }));

  const savePw = (e) => {
    e.preventDefault();
    if (pw.next.length < 8)
      return flash("New password must be at least 8 characters.");
    if (pw.next !== pw.conf) return flash("Passwords do not match.");
    setPw({ cur: "", next: "", conf: "" });
    flash("Password updated");
  };

  return (
    <AppShell crumb="Settings" title="Settings">
      <div className="page settings-page">
        <section
          className="settings-hero"
          style={{ backgroundImage: `url("${IMG.sittingImage}")` }}
        >
          <div className="settings-hero-content">
            <p className="eyebrow">Your studio, your way</p>
            <h1>Make your project space feel like yours.</h1>
            <p>
              Keep your profile, preferences, and project access in one place
              while your vision takes shape.
            </p>
            <span className="settings-hero-tag">
              <Icon name="shield" size={15} />
              A space designed around you
            </span>
          </div>
        </section>
        <nav className="settings-nav card" aria-label="Settings sections">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={tab === t.key ? "active" : ""}
              onClick={() => setTab(t.key)}
            >
              <Icon name={t.icon} size={18} />
              {t.label}
            </button>
          ))}
        </nav>

        <section className="settings-panel card">
          {tab === "profile" && (
            <div>
              <div className="profile-head">
                <Avatar src={avatar || IMG.safora} name="Profile" size={92} />
                <div>
                  <h2>
                    {info.first} {info.last}
                  </h2>
                  <p className="muted">
                    {info.role} · {info.company}
                  </p>
                  <label className="btn-ghost small upload">
                    Change photo
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        setAvatar(URL.createObjectURL(e.target.files[0]))
                      }
                    />
                  </label>
                </div>
              </div>
              <div className="setting-row">
                <div>
                  <h3>Profile visibility</h3>
                  <p className="muted">
                    Let your project team see your profile and contact details.
                  </p>
                </div>
                <Toggle
                  checked={visible}
                  onChange={setVisible}
                  label="Toggle profile visibility"
                />
              </div>
            </div>
          )}

          {tab === "basic" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                flash("Information saved");
              }}
            >
              <h2>Basic Info</h2>
              <div className="form-grid">
                <label>
                  First name
                  <input value={info.first} onChange={setI("first")} />
                </label>
                <label>
                  Last name
                  <input value={info.last} onChange={setI("last")} />
                </label>
                <label>
                  I'm a
                  <select value={info.role} onChange={setI("role")}>
                    <option>Homeowner</option>
                    <option>Business Owner</option>
                    <option>Developer</option>
                    <option>Architect / Designer</option>
                  </select>
                </label>
                <label>
                  Company
                  <input value={info.company} onChange={setI("company")} />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={info.email}
                    onChange={setI("email")}
                  />
                </label>
                <label>
                  Phone number
                  <input value={info.phone} onChange={setI("phone")} />
                </label>
                <label className="full">
                  Your location
                  <input value={info.location} onChange={setI("location")} />
                </label>
              </div>
              <button className="btn-gold" type="submit">
                Save changes
              </button>
            </form>
          )}

          {tab === "password" && (
            <form onSubmit={savePw}>
              <h2>Change Password</h2>
              <div className="form-grid single">
                <label>
                  Current password
                  <input
                    type="password"
                    value={pw.cur}
                    onChange={(e) => setPw({ ...pw, cur: e.target.value })}
                    autoComplete="current-password"
                  />
                </label>
                <label>
                  New password
                  <input
                    type="password"
                    value={pw.next}
                    onChange={(e) => setPw({ ...pw, next: e.target.value })}
                    autoComplete="new-password"
                  />
                </label>
                <label>
                  Confirm new password
                  <input
                    type="password"
                    value={pw.conf}
                    onChange={(e) => setPw({ ...pw, conf: e.target.value })}
                    autoComplete="new-password"
                  />
                </label>
              </div>
              <div className="pw-rules">
                <h3>Password requirements</h3>
                <ul>
                  <li>At least 8 characters</li>
                  <li>One number or symbol</li>
                  <li>Different from your last passwords</li>
                </ul>
              </div>
              <button className="btn-gold" type="submit">
                Update password
              </button>
            </form>
          )}

          {tab === "2fa" && (
            <div>
              <h2>Two-factor authentication</h2>
              <p className="muted">
                Add an extra layer of security to protect your project documents
                and payments.
              </p>
              {[
                { id: "sms", label: "SMS verification" },
                { id: "app", label: "Authenticator app" },
              ].map((m) => (
                <div className="setting-row" key={m.id}>
                  <div>
                    <h3>{m.label}</h3>
                  </div>
                  <Toggle
                    checked={methods[m.id]}
                    onChange={(v) => setMethods((x) => ({ ...x, [m.id]: v }))}
                    label={m.label}
                  />
                </div>
              ))}
            </div>
          )}

          {tab === "sessions" && (
            <div>
              <h2>Sessions</h2>
              <ul className="session-list">
                {sessions.map((s) => (
                  <li key={s.id}>
                    <span className="invoice-icon">
                      <Icon name={s.icon} size={18} />
                    </span>
                    <div>
                      <strong>{s.title}</strong>
                      <small>{s.detail}</small>
                    </div>
                    {s.id !== 1 && (
                      <button
                        className="btn-ghost small"
                        onClick={() =>
                          setSessions((l) => l.filter((x) => x.id !== s.id))
                        }
                      >
                        Sign out
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === "delete" && (
            <div>
              <h2>Delete Account</h2>
              <p className="muted">
                Once you delete your account, all projects, drawings and
                invoices are permanently removed. This cannot be undone.
              </p>
              <div className="setting-row">
                <div>
                  <h3>Confirm account deletion</h3>
                </div>
                <Toggle
                  checked={confirmDel}
                  onChange={setConfirmDel}
                  label="Confirm account deletion"
                />
              </div>
              <button
                className="btn-danger"
                disabled={!confirmDel}
                onClick={() => flash("Deletion request sent to the studio")}
              >
                Delete account
              </button>
            </div>
          )}
        </section>
        {msg && (
          <div className="toast" role="status">
            {msg}
          </div>
        )}
      </div>
      <SiteFooter />
    </AppShell>
  );
}
