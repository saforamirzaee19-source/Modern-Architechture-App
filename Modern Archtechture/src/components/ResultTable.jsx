import { useMemo, useState } from "react";
import { money } from "../data/index.js";

const columns = [
  { key: "name", label: "Item" },
  { key: "category", label: "Category" },
  { key: "serviceName", label: "Supplied by" },
  { key: "discount", label: "Discount" },
  { key: "price", label: "Price" },
  { key: "id", label: "Code" },
];

const sortOptions = [
  { value: "default", label: "Recommended", key: null, dir: "asc" },
  {
    value: "discount-desc",
    label: "Highest discount",
    key: "discount",
    dir: "desc",
  },
  { value: "price-asc", label: "Price: low to high", key: "price", dir: "asc" },
  {
    value: "price-desc",
    label: "Price: high to low",
    key: "price",
    dir: "desc",
  },
  { value: "name-asc", label: "Name: A to Z", key: "name", dir: "asc" },
  { value: "name-desc", label: "Name: Z to A", key: "name", dir: "desc" },
  {
    value: "serviceName-asc",
    label: "Supplier: A to Z",
    key: "serviceName",
    dir: "asc",
  },
  {
    value: "category-asc",
    label: "Category: A to Z",
    key: "category",
    dir: "asc",
  },
];

export default function ResultsTable({
  title,
  eyebrow = "MARKETPLACE OFFERS",
  noun = "offers",
  rows = [],
  pageSizeOptions = [5, 10, 25],
  defaultPageSize = 10,
  onRowClick,
}) {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sort, setSort] = useState({ key: null, dir: "asc" });
  const selected =
    sortOptions.find((o) => o.key === sort.key && o.dir === sort.dir)?.value ??
    "default";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let out = rows;
    if (q)
      out = out.filter((r) =>
        [r.name, r.category, r.serviceName, r.discount, r.price, r.id]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    if (sort.key) {
      out = [...out].sort((a, b) => {
        const x = a[sort.key],
          y = b[sort.key];
        const num = !isNaN(x) && !isNaN(y);
        const c = num
          ? Number(x) - Number(y)
          : String(x).localeCompare(String(y));
        return sort.dir === "asc" ? c : -c;
      });
    }
    return out;
  }, [rows, search, sort]);

  const visible = filtered.slice(0, pageSize);
  const headSort = (key) =>
    setSort((p) =>
      p.key === key
        ? { key, dir: p.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );

  return (
    <section className="results-panel">
      <div className="results-panel__heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="results-panel__title">{title}</h2>
        </div>
        <span className="results-panel__count">
          {filtered.length} {noun}
        </span>
      </div>

      <div className="results-toolbar">
        <label className="results-search">
          <span className="sr-only">Search</span>
          <input
            type="search"
            placeholder={`Search ${noun} or suppliers`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label className="results-control">
          <span>Sort by</span>
          <select
            value={selected}
            onChange={(e) => {
              const o = sortOptions.find((i) => i.value === e.target.value);
              if (o) setSort({ key: o.key, dir: o.dir });
            }}
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="results-control">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="results-table-wrap">
        <table className="results-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  aria-sort={
                    sort.key === c.key
                      ? sort.dir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <button type="button" onClick={() => headSort(c.key)}>
                    {c.label}
                    <span aria-hidden="true">
                      {sort.key === c.key
                        ? sort.dir === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td className="results-empty" colSpan={columns.length}>
                  No results found
                </td>
              </tr>
            ) : (
              visible.map((r) => (
                <tr
                  key={r.rowKey ?? r.id}
                  onClick={() => onRowClick?.(r)}
                  className={
                    onRowClick
                      ? "results-row results-row--clickable"
                      : "results-row"
                  }
                >
                  <td>
                    <div className="results-product">
                      <img src={r.image} alt="" />
                      <span>{r.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="results-category">{r.category}</span>
                  </td>
                  <td>
                    <div className="results-provider">
                      <img src={r.serviceLogo} alt="" />
                      <span>{r.serviceName}</span>
                    </div>
                  </td>
                  <td>
                    {Number(r.discount) > 0 ? (
                      <span className="results-discount">
                        {r.discount}% off
                      </span>
                    ) : (
                      <span className="results-no-discount">No discount</span>
                    )}
                  </td>
                  <td>
                    <span className="results-price">{money(r.price)}</span>
                  </td>
                  <td>
                    <span className="results-id">{r.id}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="results-footer">
        Showing {filtered.length === 0 ? 0 : 1}-{visible.length} of{" "}
        {filtered.length} {noun}
      </div>
    </section>
  );
}
