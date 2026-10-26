import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import useTheme from "../components/useTheme.js";
import confirmAction from "../components/Alerts.js";
import { IMG, BRAND, STUDIO_STATS } from "../data/index.js";

export default function Login() {
  const navigate = useNavigate();
  const [theme, toggleTheme] = useTheme();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const username = String(f.get("username")).trim();
    const password = String(f.get("password"));
    if (!username || !password) return setError("Please fill in both fields.");
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
    const digits = username.replace(/\D/g, "");
    const isPhone =
      /^\+?[0-9\s().-]+$/.test(username) &&
      digits.length >= 7 &&
      digits.length <= 15;
    if (!isEmail && !isPhone)
      return setError("Enter a valid email address or phone number.");
    if (password.length < 8)
      return setError("Password must be at least 8 characters.");
    setError("");
    await confirmAction("login");
    navigate("/dashboard");
  };

  return (
    <div className="auth-layout">
      <header
        className="login-hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(20,17,12,.55), rgba(20,17,12,.82)), url(${IMG.heroImg})`,
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
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
            <span className="toggle-text">
              {theme === "dark" ? "Light" : "Dark"}
            </span>
          </button>
        </div>
        <div className="login-hero-copy">
          <p className="eyebrow light">{BRAND.product}</p>
          <h1>
            Crafting <em>Extraordinary</em> Spaces
          </h1>
          <p>
            Where architectural vision meets interior elegance — follow every
            drawing, site visit, material order and milestone of your project in
            one place.
          </p>
          <ul className="hero-stats">
            {STUDIO_STATS.map((s) => (
              <li key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <main className="login-card">
        <h2>Sign in to {BRAND.product}</h2>
        <p className="login-sub">
          Access your projects, team and site updates.
        </p>
        <div className="social-row">
          <button
            className="social-btn"
            type="button"
            title="Sign in with Facebook"
          >
            f
          </button>
          <button
            className="social-btn"
            type="button"
            title="Sign in with Google"
          >
            G
          </button>
        </div>
        {error && (
          <p className="error-msg show" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={submit} noValidate>
          <input
            type="text"
            name="username"
            placeholder="Email or Phone number"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck="false"
          />
          <div className="password-field">
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="Please enter your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => setShow((s) => !s)}
            >
              <Icon name="eye" size={18} />
            </button>
          </div>
          <button type="submit" className="btn btn-signin">
            SIGN IN
          </button>
          <div className="options-row">
            <a href="#">Forgot password?</a>
            <label>
              <input type="checkbox" /> Remember me
            </label>
          </div>
          <div className="divider">or</div>
          <Link to="/signup" className="btn btn-signup">
            SIGN UP
          </Link>
        </form>
      </main>

      <footer className="login-footer">
        <a href="#">About Us</a>
        <a href="#">Services</a>
        <a href="#">Portfolio</a>
        <a href="#">Our Blog</a>
        <a href="#">Contact</a>
      </footer>
    </div>
  );
}
