import { useState } from "react";
import AppShell, { SiteFooter } from "../components/AppShell.jsx";
import MarketCard from "../components/MarketCard.jsx";
import ResultsTable from "../components/ResultTable.jsx";
import { MATERIALS, MATERIAL_ROWS } from "../data/index.js";

export default function Materials() {
  const [cart, setCart] = useState([]);
  const add = (name) => setCart((c) => [...c, name]);
  return (
    <AppShell crumb="Materials" title="Materials Marketplace">
      <main className="offers-page">
        <section>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Sourcing</p>
              <h2 className="offers-title">
                Search suppliers and order the materials you need
              </h2>
            </div>
            <span className="count-chip">{cart.length} in order</span>
          </div>
          <div className="offers-grid">
            {MATERIALS.map((m) => (
              <MarketCard
                key={m.id}
                {...m}
                unit={m.category === "Furniture" ? "pc" : "m²"}
                onBuy={() => add(m.supplier)}
              />
            ))}
          </div>
        </section>
        <ResultsTable
          title="Other results for construction materials"
          eyebrow="MATERIAL OFFERS"
          noun="offers"
          rows={MATERIAL_ROWS}
        />
      </main>
      <SiteFooter />
    </AppShell>
  );
}
