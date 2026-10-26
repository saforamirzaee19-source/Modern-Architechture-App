import { useState } from "react";
import AppShell, { SiteFooter } from "../components/AppShell.jsx";
import MarketCard from "../components/MarketCard.jsx";
import ResultsTable from "../components/ResultTable.jsx";
import { CONTRACTOR_ITEMS, CONTRACTOR_ROWS } from "../data/index.js";

export default function Contractors() {
  const [booked, setBooked] = useState([]);
  return (
    <AppShell crumb="Contractors" title="Contractors & Equipment">
      <main className="offers-page">
        <section>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Execution phase</p>
              <h2 className="offers-title">
                Hire contractors and rent equipment for your site
              </h2>
            </div>
            <span className="count-chip">{booked.length} requested</span>
          </div>
          <div className="offers-grid">
            {CONTRACTOR_ITEMS.map((c) => (
              <MarketCard
                key={c.id}
                {...c}
                buttonText="REQUEST QUOTE"
                onBuy={() => setBooked((b) => [...b, c.supplier])}
              />
            ))}
          </div>
        </section>
        <ResultsTable
          title="Other results for contractors & equipment"
          eyebrow="CONTRACTOR OFFERS"
          noun="offers"
          rows={CONTRACTOR_ROWS}
        />
      </main>
      <SiteFooter />
    </AppShell>
  );
}
