import { useState } from "react";
import AppShell, { SiteFooter } from "../components/AppShell.jsx";
import Icon from "../components/Icon.jsx";
import { PROJECTS, money } from "../data/index.js";

const INITIAL_CARDS = [
  {
    id: 1,
    brand: "Visa",
    number: "•••• •••• •••• 4821",
    holder: "Pro Murtaza",
    exp: "09/28",
  },
  {
    id: 2,
    brand: "Mastercard",
    number: "•••• •••• •••• 1903",
    holder: "Luxe Studio Client",
    exp: "02/27",
  },
];

const INVOICES = [
  {
    id: "INV-2041",
    date: "Oct 12, 2026",
    project: "Modern Villa",
    note: "Foundation & slab — milestone 3",
    amount: 42000,
    status: "Paid",
  },
  {
    id: "INV-2038",
    date: "Sep 28, 2026",
    project: "Luxury Penthouse",
    note: "Interior joinery supply",
    amount: 18650,
    status: "Paid",
  },
  {
    id: "INV-2032",
    date: "Sep 03, 2026",
    project: "Corporate Headquarters",
    note: "Structural design phase",
    amount: 96000,
    status: "Paid",
  },
  {
    id: "INV-2047",
    date: "Nov 02, 2026",
    project: "Boutique Hotel",
    note: "Facade design — milestone 2",
    amount: 54000,
    status: "Pending",
  },
  {
    id: "INV-2049",
    date: "Nov 15, 2026",
    project: "Modern Villa",
    note: "Roof structure — milestone 4",
    amount: 38500,
    status: "Pending",
  },
];

const BILLING_INFO = [
  {
    name: "Luxe Studio Client",
    company: "Murtaza Holdings",
    email: "client@luxestudio.com",
    vat: "AF2910485",
  },
  {
    name: "Boutique Hotel Dev.",
    company: "Khair Khana Hospitality",
    email: "billing@kkhospitality.com",
    vat: "AF8815203",
  },
];

export default function Billing() {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    brand: "Visa",
    number: "",
    holder: "",
    exp: "",
  });
  const [err, setErr] = useState("");

  const budget = PROJECTS.reduce((a, p) => a + p.budget, 0);
  const spent = PROJECTS.reduce((a, p) => a + p.spent, 0);
  const pending = INVOICES.filter((i) => i.status === "Pending").reduce(
    (a, i) => a + i.amount,
    0,
  );

  const addCard = (e) => {
    e.preventDefault();
    const digits = form.number.replace(/\D/g, "");
    if (digits.length !== 16) return setErr("Card number must have 16 digits.");
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.exp))
      return setErr("Expiry must look like MM/YY.");
    if (!form.holder.trim()) return setErr("Enter the card holder name.");
    setCards((c) => [
      ...c,
      {
        id: Date.now(),
        brand: form.brand,
        number: `•••• •••• •••• ${digits.slice(-4)}`,
        holder: form.holder.trim(),
        exp: form.exp,
      },
    ]);
    setForm({ brand: "Visa", number: "", holder: "", exp: "" });
    setErr("");
    setAdding(false);
  };

  return (
    <AppShell crumb="Billing" title="Billing">
      <div className="page billing-page">
        <header className="page-header">
          <div>
            <p className="eyebrow">Payments & invoices</p>
            <h1>Project billing</h1>
            <p>
              Milestone payments, invoices and saved payment methods for all
              your projects.
            </p>
          </div>
        </header>

        <div className="kpi-row">
          <div className="kpi">
            <span>Total contract value</span>
            <strong>{money(budget)}</strong>
          </div>
          <div className="kpi">
            <span>Paid to date</span>
            <strong>{money(spent)}</strong>
            <small>{Math.round((spent / budget) * 100)}% of contracts</small>
          </div>
          <div className="kpi">
            <span>Pending invoices</span>
            <strong>{money(pending)}</strong>
            <small>
              {INVOICES.filter((i) => i.status === "Pending").length} awaiting
              payment
            </small>
          </div>
        </div>

        <div className="billing-grid">
          <section className="card">
            <div className="card-header">
              <h2>Payment method</h2>
              <button
                className="btn-gold small"
                onClick={() => setAdding((a) => !a)}
              >
                <Icon name="plus" size={14} /> Add card
              </button>
            </div>
            {adding && (
              <form className="card-form" onSubmit={addCard}>
                <select
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                >
                  <option>Visa</option>
                  <option>Mastercard</option>
                </select>
                <input
                  placeholder="Card number"
                  inputMode="numeric"
                  value={form.number}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      number: e.target.value
                        .replace(/[^\d ]/g, "")
                        .slice(0, 19),
                    })
                  }
                />
                <input
                  placeholder="Card holder"
                  value={form.holder}
                  onChange={(e) => setForm({ ...form, holder: e.target.value })}
                />
                <input
                  placeholder="MM/YY"
                  maxLength={5}
                  value={form.exp}
                  onChange={(e) => setForm({ ...form, exp: e.target.value })}
                />
                {err && (
                  <p className="field-error" role="alert">
                    {err}
                  </p>
                )}
                <button className="btn-gold" type="submit">
                  Save card
                </button>
              </form>
            )}
            <ul className="card-list">
              {cards.map((c) => (
                <li key={c.id} className={`pay-card ${c.brand.toLowerCase()}`}>
                  <span className="pay-brand">{c.brand}</span>
                  <strong>{c.number}</strong>
                  <div>
                    <small>{c.holder}</small>
                    <small>Exp {c.exp}</small>
                  </div>
                  <button
                    className="icon-btn"
                    aria-label="Remove card"
                    onClick={() =>
                      setCards((cs) => cs.filter((x) => x.id !== c.id))
                    }
                  >
                    <Icon name="trash" size={16} />
                  </button>
                </li>
              ))}
              {!cards.length && <p className="empty-state">No saved cards.</p>}
            </ul>
          </section>

          <section className="card">
            <div className="card-header">
              <h2>Invoices</h2>
              <a href="#" className="link-gold">
                View all
              </a>
            </div>
            <ul className="invoice-list">
              {INVOICES.map((inv) => (
                <li key={inv.id}>
                  <span className="invoice-icon">
                    <Icon name="file" size={18} />
                  </span>
                  <div className="invoice-main">
                    <strong>
                      {inv.id} · {inv.project}
                    </strong>
                    <small>
                      {inv.note} · {inv.date}
                    </small>
                  </div>
                  <div className="invoice-end">
                    <strong>{money(inv.amount)}</strong>
                    <span className={`status-pill ${inv.status.toLowerCase()}`}>
                      {inv.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="card billing-info">
            <div className="card-header">
              <h2>Billing information</h2>
            </div>
            {BILLING_INFO.map((b) => (
              <div className="billing-row" key={b.email}>
                <h3>{b.name}</h3>
                <dl>
                  <dt>Company</dt>
                  <dd>{b.company}</dd>
                  <dt>Email</dt>
                  <dd>{b.email}</dd>
                  <dt>Tax ID</dt>
                  <dd>{b.vat}</dd>
                </dl>
              </div>
            ))}
          </section>
        </div>
      </div>

      <SiteFooter />
    </AppShell>
  );
}
