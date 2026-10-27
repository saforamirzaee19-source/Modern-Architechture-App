import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import useTheme from "../components/useTheme.js";
import confirmAction from "../components/Alerts.js";
import { IMG, BRAND } from "../data/index.js";

export default function Signup() {
  const navigate = useNavigate();
  const [theme, toggleTheme] = useTheme();
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(f.email)))
      return setError("Enter a valid email address.");
    if (String(f.password).length < 8)
      return setError("Password must be at least 8 characters.");
    if (f.password !== f.confirm) return setError("Passwords do not match.");
    setError("");
    await confirmAction("signup");
    navigate("/");
  };

  return (
    <div className="auth-layout">
      <header
        className="login-hero compact"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(20,17,12,.55), rgba(20,17,12,.82)), url(${IMG.aboutImg})`,
        }}
      >
        <div className="auth-topbar">
          <div className="auth-logo">
            <b>{BRAND.name}</b>
            <small>{BRAND.sub}</small>
          </div>
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
            <span className="toggle-text">
              {theme === "dark" ? "Light" : "Dark"}
            </span>
          </button>
        </div>
        <div className="login-hero-copy">
          <p className="eyebrow light"></p>
        </div>
      </header>

      <main className="login-card signup-card">
        <h2>Create your account</h2>
        {error && (
          <p className="error-msg show" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={submit} className="signup-grid">
          <label className="signup-field">
            <span>First name</span>
            <input name="first" required placeholder="Sarah" />
          </label>
          <label className="signup-field">
            <span>Last name</span>
            <input name="last" required placeholder="Johnson" />
          </label>
          <label className="signup-field">
            <span>Email</span>
            <input
              name="email"
              type="email"
              required
              placeholder="hello@luxestudio.com"
            />
          </label>
          <label className="signup-field">
            <span>I am a…</span>
            <select name="role" defaultValue="Homeowner">
              <option>Homeowner</option>
              <option>Business Owner</option>
              <option>Developer</option>
              <option>Architect / Designer</option>
              <option>Contractor</option>
            </select>
          </label>
          <label className="signup-field full">
            <span>Phone number</span>
            <input name="phone" type="tel" placeholder="(555) 123-4567" />
          </label>
          <label className="signup-field full">
            <span>Project type</span>
            <select name="ptype" defaultValue="Residential Architecture">
              <option>Residential Architecture</option>
              <option>Commercial Architecture</option>
              <option>Interior Design</option>
              <option>Consultation</option>
            </select>
          </label>
          <label className="signup-field full">
            <span>Password</span>
            <input
              name="password"
              type="password"
              required
              placeholder="At least 8 characters"
            />
          </label>
          <label className="signup-field full">
            <span>Confirm password</span>
            <input
              name="confirm"
              type="password"
              required
              placeholder="Repeat your password"
            />
          </label>
          <label className="signup-consent full">
            <input type="checkbox" required /> I agree to the Terms of Service
            and Privacy Policy.
          </label>
          <button type="submit" className="btn btn-signin full">
            CREATE ACCOUNT
          </button>
          <p className="signup-back full">
            Already have an account? <Link to="/">Sign in</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
