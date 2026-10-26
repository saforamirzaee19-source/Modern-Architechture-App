import { useMemo, useRef, useState } from "react";
import AppShell, { SiteFooter } from "../components/AppShell.jsx";
import Avatar from "../components/Avatar.jsx";
import Icon from "../components/Icon.jsx";
import { IMG, PROJECTS, TEAM } from "../data/index.js";

const FOLDERS = [
  { key: "Drawings", icon: "ruler", hint: "Plans, sections, elevations" },
  { key: "Renders", icon: "image", hint: "3D visuals & walkthroughs" },
  { key: "Contracts", icon: "file", hint: "Agreements & change orders" },
  { key: "Permits", icon: "shield", hint: "Municipal approvals" },
  { key: "Site Photos", icon: "pin", hint: "Progress documentation" },
  { key: "Reports", icon: "list", hint: "Inspections & minutes" },
];
const STATUS = {
  Draft: "bg-mute/15 text-mute",
  "In Review": "bg-gold/20 text-gold-dark",
  Approved: "bg-olive/20 text-olive",
};
const FLOW = ["Draft", "In Review", "Approved"];
const photoOf = (n) => TEAM.find((t) => t.name === n)?.photo;

const v = (n, date, by, note) => ({ v: n, date, by, note });
const SEED = [
  {
    id: 1,
    name: "Villa_Ground_Floor_Plan",
    ext: "DWG",
    folder: "Drawings",
    project: "Modern Villa",
    size: 4200,
    by: "Michael Chen",
    status: "Approved",
    updated: "Oct 22, 2026",
    versions: [
      v(3, "Oct 22", "Michael Chen", "Client comments applied"),
      v(2, "Oct 05", "Michael Chen", "Kitchen layout revised"),
      v(1, "Sep 18", "Michael Chen", "First issue"),
    ],
  },
  {
    id: 2,
    name: "Villa_Facade_Elevations",
    ext: "PDF",
    folder: "Drawings",
    project: "Modern Villa",
    size: 2800,
    by: "Michael Chen",
    status: "In Review",
    updated: "Oct 24, 2026",
    versions: [
      v(2, "Oct 24", "Michael Chen", "Glazing ratio updated"),
      v(1, "Oct 10", "Michael Chen", "First issue"),
    ],
  },
  {
    id: 3,
    name: "Villa_Structural_Calculations",
    ext: "PDF",
    folder: "Reports",
    project: "Modern Villa",
    size: 1900,
    by: "Ahmad Karimi",
    status: "Approved",
    updated: "Oct 15, 2026",
    versions: [v(1, "Oct 15", "Ahmad Karimi", "Issued for construction")],
  },
  {
    id: 4,
    name: "Villa_Exterior_Render_Dusk",
    ext: "JPG",
    folder: "Renders",
    project: "Modern Villa",
    size: 5400,
    by: "Laila Noori",
    status: "Approved",
    updated: "Oct 18, 2026",
    thumb: IMG.modern,
    versions: [
      v(2, "Oct 18", "Laila Noori", "Lighting pass"),
      v(1, "Oct 11", "Laila Noori", "Base render"),
    ],
  },
  {
    id: 5,
    name: "HQ_Concept_Massing",
    ext: "PDF",
    folder: "Drawings",
    project: "Corporate Headquarters",
    size: 6100,
    by: "Michael Chen",
    status: "In Review",
    updated: "Oct 23, 2026",
    versions: [
      v(2, "Oct 23", "Michael Chen", "Core relocated"),
      v(1, "Oct 02", "Michael Chen", "Initial massing"),
    ],
  },
  {
    id: 6,
    name: "HQ_Curtain_Wall_Render",
    ext: "JPG",
    folder: "Renders",
    project: "Corporate Headquarters",
    size: 7200,
    by: "Laila Noori",
    status: "Draft",
    updated: "Oct 25, 2026",
    thumb: IMG.glass,
    versions: [v(1, "Oct 25", "Laila Noori", "Work in progress")],
  },
  {
    id: 7,
    name: "HQ_Design_Services_Agreement",
    ext: "DOCX",
    folder: "Contracts",
    project: "Corporate Headquarters",
    size: 640,
    by: "Sarah Johnson",
    status: "Approved",
    updated: "Aug 30, 2026",
    versions: [
      v(2, "Aug 30", "Sarah Johnson", "Signed"),
      v(1, "Aug 20", "Sarah Johnson", "Draft for client"),
    ],
  },
  {
    id: 8,
    name: "Penthouse_Interior_Moodboard",
    ext: "PDF",
    folder: "Renders",
    project: "Luxury Penthouse",
    size: 3300,
    by: "Emma Rodriguez",
    status: "Approved",
    updated: "Oct 12, 2026",
    thumb: IMG.penthouse,
    versions: [
      v(2, "Oct 12", "Emma Rodriguez", "Approved by client"),
      v(1, "Oct 01", "Emma Rodriguez", "Options A/B/C"),
    ],
  },
  {
    id: 9,
    name: "Penthouse_Joinery_Details",
    ext: "DWG",
    folder: "Drawings",
    project: "Luxury Penthouse",
    size: 3100,
    by: "Emma Rodriguez",
    status: "In Review",
    updated: "Oct 21, 2026",
    versions: [v(1, "Oct 21", "Emma Rodriguez", "Issued for pricing")],
  },
  {
    id: 10,
    name: "Penthouse_Site_Progress_Oct",
    ext: "JPG",
    folder: "Site Photos",
    project: "Luxury Penthouse",
    size: 8800,
    by: "Bilal Ahmadi",
    status: "Approved",
    updated: "Oct 20, 2026",
    thumb: IMG.sofa,
    versions: [v(1, "Oct 20", "Bilal Ahmadi", "Weekly photo set")],
  },
  {
    id: 11,
    name: "Hotel_Municipal_Building_Permit",
    ext: "PDF",
    folder: "Permits",
    project: "Boutique Hotel",
    size: 1200,
    by: "Sarah Johnson",
    status: "In Review",
    updated: "Oct 19, 2026",
    versions: [v(1, "Oct 19", "Sarah Johnson", "Submitted to municipality")],
  },
  {
    id: 12,
    name: "Hotel_Lobby_Render",
    ext: "JPG",
    folder: "Renders",
    project: "Boutique Hotel",
    size: 6600,
    by: "Laila Noori",
    status: "Draft",
    updated: "Oct 24, 2026",
    thumb: IMG.wind,
    versions: [v(1, "Oct 24", "Laila Noori", "First look")],
  },
  {
    id: 13,
    name: "Contemporary_Home_Site_Visit_Minutes",
    ext: "DOCX",
    folder: "Reports",
    project: "Contemporary Home",
    size: 420,
    by: "Sarah Johnson",
    status: "Approved",
    updated: "Oct 08, 2026",
    versions: [v(1, "Oct 08", "Sarah Johnson", "Minutes issued")],
  },
  {
    id: 14,
    name: "Urban_Complex_Soil_Survey",
    ext: "PDF",
    folder: "Reports",
    project: "Urban Complex",
    size: 9100,
    by: "Ahmad Karimi",
    status: "Approved",
    updated: "Oct 04, 2026",
    versions: [v(1, "Oct 04", "Ahmad Karimi", "Geotechnical report")],
  },
  {
    id: 15,
    name: "Urban_Complex_Master_Plan",
    ext: "DWG",
    folder: "Drawings",
    project: "Urban Complex",
    size: 12400,
    by: "Michael Chen",
    status: "Draft",
    updated: "Oct 25, 2026",
    versions: [v(1, "Oct 25", "Michael Chen", "Early concept")],
  },
  {
    id: 16,
    name: "Villa_Foundation_Pour_Photos",
    ext: "JPG",
    folder: "Site Photos",
    project: "Modern Villa",
    size: 9400,
    by: "Bilal Ahmadi",
    status: "Approved",
    updated: "Oct 17, 2026",
    thumb: IMG.urban,
    versions: [v(1, "Oct 17", "Bilal Ahmadi", "Slab pour day 2")],
  },
];

const sizeLabel = (kb) =>
  kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
const extColor = {
  DWG: "bg-[#2a241b] text-gold",
  PDF: "bg-brick/15 text-brick",
  JPG: "bg-olive/20 text-olive",
  PNG: "bg-olive/20 text-olive",
  DOCX: "bg-[#3b6ea5]/15 text-[#3b6ea5]",
};

function Thumb({ doc, large = false }) {
  const h = large ? "h-56" : "h-36";
  if (doc.thumb)
    return (
      <img src={doc.thumb} alt="" className={`${h} w-full object-cover`} />
    );
  if (doc.folder === "Drawings") {
    return (
      <div className={`blueprint relative ${h} w-full`}>
        <svg
          viewBox="0 0 160 100"
          className="absolute inset-0 h-full w-full p-5"
          fill="none"
          stroke="#d4a44b"
          strokeWidth="1.2"
        >
          <path d="M20 15h120v70H20z M20 45h50 M70 15v45 M70 60h70 M105 60v25 M45 45v40" />
          <path d="M20 15h12M140 85h-12" strokeWidth="2.4" />
          <circle cx="45" cy="30" r="5" strokeDasharray="2 2" />
        </svg>
        <span className="absolute bottom-2 right-3 font-logo text-xs tracking-[0.2em] text-gold/70">
          LUXE STUDIO · 1:100
        </span>
      </div>
    );
  }
  return (
    <div
      className={`relative ${h} w-full bg-gradient-to-br from-[#f7f1e6] to-[#eadfc9] p-5`}
    >
      <div className="space-y-2">
        <div className="h-2 w-2/3 rounded bg-[#1a1815]/70" />
        {[100, 92, 96, 70, 88, 60].map((w, i) => (
          <div
            key={i}
            style={{ width: `${w}%` }}
            className="h-1.5 rounded bg-[#1a1815]/15"
          />
        ))}
      </div>
      <span className="absolute bottom-3 right-4 rotate-[-8deg] rounded border-2 border-gold-dark/60 px-2 py-0.5 font-logo text-sm tracking-widest text-gold-dark/70">
        {doc.status.toUpperCase()}
      </span>
    </div>
  );
}

export default function Documents() {
  const [docs, setDocs] = useState(SEED);
  const [project, setProject] = useState("All projects");
  const [folder, setFolder] = useState("All");
  const [status, setStatus] = useState("All");
  const [q, setQ] = useState("");
  const [layout, setLayout] = useState("grid");
  const [selId, setSelId] = useState(2);
  const [toast, setToast] = useState("");
  const fileRef = useRef(null);

  const flash = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 2200);
  };
  const inProject = docs.filter(
    (d) => project === "All projects" || d.project === project,
  );
  const shown = inProject.filter(
    (d) =>
      (folder === "All" || d.folder === folder) &&
      (status === "All" || d.status === status) &&
      (!q.trim() ||
        `${d.name} ${d.ext} ${d.by}`
          .toLowerCase()
          .includes(q.trim().toLowerCase())),
  );
  const sel = docs.find((d) => d.id === selId);
  const counts = useMemo(
    () =>
      Object.fromEntries(
        FOLDERS.map((f) => [
          f.key,
          inProject.filter((d) => d.folder === f.key).length,
        ]),
      ),
    [inProject],
  );
  const pending = docs.filter((d) => d.status === "In Review").length;

  const advance = (id) =>
    setDocs((l) =>
      l.map((d) => {
        if (d.id !== id) return d;
        const next = FLOW[Math.min(FLOW.indexOf(d.status) + 1, 2)];
        flash(next === "Approved" ? "Document approved" : "Sent for approval");
        return { ...d, status: next };
      }),
    );
  const remove = (id) => {
    setDocs((l) => l.filter((d) => d.id !== id));
    setSelId(null);
    flash("Document deleted");
  };

  const upload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const added = files.map((f, i) => {
      const ext = (f.name.split(".").pop() || "FILE").toUpperCase().slice(0, 4);
      const guess = ["JPG", "JPEG", "PNG", "WEBP"].includes(ext)
        ? "Site Photos"
        : ["DWG", "DXF"].includes(ext)
          ? "Drawings"
          : ["DOC", "DOCX"].includes(ext)
            ? "Contracts"
            : "Reports";
      return {
        id: Date.now() + i,
        name: f.name.replace(/\.[^.]+$/, ""),
        ext,
        folder: folder !== "All" ? folder : guess,
        project: project !== "All projects" ? project : PROJECTS[0].name,
        size: Math.max(1, Math.round(f.size / 1024)),
        by: "Pro Murtaza",
        status: "Draft",
        updated: "Just now",
        thumb: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
        versions: [v(1, "Today", "Pro Murtaza", "Uploaded")],
      };
    });
    setDocs((l) => [...added, ...l]);
    setSelId(added[0].id);
    flash(`${added.length} file${added.length > 1 ? "s" : ""} uploaded`);
    e.target.value = "";
  };

  return (
    <AppShell crumb="Documents" title="Documents & Drawings">
      <div className="tw-page flex flex-col gap-6 px-4 pb-4 pt-7 font-body text-ink lg:px-8">
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden rounded-3xl border border-gold/30 shadow-luxe">
          <div className="blueprint absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#14110d] via-[#14110d]/85 to-transparent" />
          <div className="relative flex flex-wrap items-center justify-between gap-6 p-6 sm:p-9">
            <div className="max-w-xl">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-gold-light">
                Single source of truth
              </p>
              <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl">
                Every drawing, <em className="text-gold">approved</em> and in
                one place
              </h1>
              <p className="mt-3 text-sm text-white/70">
                Versioned plans, renders, permits and contracts for all{" "}
                {PROJECTS.length} projects — with a clear approval trail.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-[#1d1608] shadow-glow transition hover:-translate-y-0.5"
                >
                  <Icon name="upload" size={16} /> Upload files
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  hidden
                  onChange={upload}
                />
                <span className="flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm text-white/80">
                  <Icon name="clock" size={15} /> {pending} awaiting approval
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                [docs.length, "Files"],
                [
                  docs.filter((d) => d.status === "Approved").length,
                  "Approved",
                ],
                [docs.reduce((a, d) => a + d.versions.length, 0), "Versions"],
              ].map(([n, l]) => (
                <div
                  key={l}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur"
                >
                  <p className="font-display text-3xl text-gold">{n}</p>
                  <p className="text-[11px] uppercase tracking-widest text-white/60">
                    {l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Folders ---------- */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {FOLDERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFolder(folder === f.key ? "All" : f.key)}
              className={`group rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-luxe ${folder === f.key ? "border-gold bg-gold/10 shadow-glow" : "border-line bg-surface"}`}
            >
              <span
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition ${folder === f.key ? "bg-gold text-[#1d1608]" : "bg-gold/15 text-gold-dark group-hover:bg-gold group-hover:text-[#1d1608]"}`}
              >
                <Icon name={f.icon} size={18} />
              </span>
              <p className="font-display text-base">{f.key}</p>
              <p className="text-[11px] text-mute">
                {counts[f.key]} files · {f.hint}
              </p>
            </button>
          ))}
        </section>

        {/* ---------- Toolbar ---------- */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-mute focus-within:border-gold">
            <Icon name="search" size={16} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search drawings, authors, file types…"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-mute"
            />
          </label>
          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="rounded-full border border-line bg-surface px-4 py-2.5 text-sm text-ink"
          >
            <option>All projects</option>
            {PROJECTS.map((p) => (
              <option key={p.id}>{p.name}</option>
            ))}
          </select>
          <div className="inline-flex rounded-full border border-line bg-surface p-1">
            {["All", ...FLOW].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-full px-4 py-1.5 text-xs transition ${status === s ? "bg-gold font-medium text-[#1d1608]" : "text-mute hover:text-ink"}`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="inline-flex rounded-full border border-line bg-surface p-1">
            {[
              ["grid", "grid"],
              ["list", "list"],
            ].map(([k, ic]) => (
              <button
                key={k}
                aria-label={`${k} view`}
                onClick={() => setLayout(k)}
                className={`flex h-8 w-9 items-center justify-center rounded-full ${layout === k ? "bg-gold text-[#1d1608]" : "text-mute"}`}
              >
                <Icon name={ic} size={15} />
              </button>
            ))}
          </div>
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* ---------- Files ---------- */}
          <section>
            <p className="mb-3 text-sm text-mute">
              {shown.length} file{shown.length !== 1 && "s"}
              {folder !== "All" && (
                <>
                  {" "}
                  in <strong className="text-ink">{folder}</strong>
                </>
              )}
            </p>
            {layout === "grid" ? (
              <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
                {shown.map((d) => (
                  <article
                    key={d.id}
                    onClick={() => setSelId(d.id)}
                    className={`cursor-pointer overflow-hidden rounded-2xl border bg-surface transition hover:-translate-y-1 hover:shadow-luxe ${selId === d.id ? "border-gold shadow-glow" : "border-line"}`}
                  >
                    <div className="relative">
                      <Thumb doc={d} />
                      <span
                        className={`absolute left-3 top-3 rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider ${extColor[d.ext] || "bg-mute/20 text-mute"} backdrop-blur`}
                      >
                        {d.ext}
                      </span>
                      <span className="absolute right-3 top-3 rounded-md bg-charcoal/80 px-2 py-0.5 text-[10px] font-semibold text-gold">
                        v{d.versions[0].v}
                      </span>
                    </div>
                    <div className="p-4">
                      <p
                        className="truncate text-sm font-medium"
                        title={d.name}
                      >
                        {d.name.replace(/_/g, " ")}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-mute">
                        {d.project} · {sizeLabel(d.size)}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar src={photoOf(d.by)} name={d.by} size={22} />
                          <span className="text-[11px] text-mute">
                            {d.updated}
                          </span>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${STATUS[d.status]}`}
                        >
                          {d.status}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-line bg-surface">
                {shown.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => setSelId(d.id)}
                    className={`flex cursor-pointer items-center gap-4 border-b border-line px-4 py-3 last:border-b-0 hover:bg-gold/5 ${selId === d.id ? "bg-gold/10" : ""}`}
                  >
                    <span
                      className={`w-12 rounded-md py-1 text-center text-[10px] font-bold ${extColor[d.ext] || "bg-mute/20 text-mute"}`}
                    >
                      {d.ext}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {d.name.replace(/_/g, " ")}
                      </p>
                      <p className="truncate text-xs text-mute">
                        {d.project} · {d.folder}
                      </p>
                    </div>
                    <span className="hidden text-xs text-mute md:block">
                      {sizeLabel(d.size)}
                    </span>
                    <span className="hidden text-xs text-mute md:block">
                      {d.updated}
                    </span>
                    <span className="text-xs font-semibold text-gold-dark">
                      v{d.versions[0].v}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${STATUS[d.status]}`}
                    >
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {!shown.length && (
              <div className="rounded-2xl border border-dashed border-line p-12 text-center text-sm text-mute">
                No documents match these filters.
              </div>
            )}
          </section>

          {/* ---------- Detail drawer ---------- */}
          <aside className="overflow-hidden rounded-3xl border border-line bg-surface shadow-luxe xl:sticky xl:top-24">
            {sel ? (
              <>
                <Thumb doc={sel} large />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-gold-dark">
                        {sel.folder} · {sel.project}
                      </p>
                      <h3 className="mt-1 break-words font-display text-xl leading-snug">
                        {sel.name.replace(/_/g, " ")}
                      </h3>
                    </div>
                    <span
                      className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold ${extColor[sel.ext] || "bg-mute/20 text-mute"}`}
                    >
                      {sel.ext}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-mute">
                    {sizeLabel(sel.size)} · Updated {sel.updated} by {sel.by}
                  </p>

                  {/* approval flow */}
                  <ol className="mt-5 flex items-center">
                    {FLOW.map((s, i) => {
                      const cur = FLOW.indexOf(sel.status);
                      return (
                        <li
                          key={s}
                          className="flex flex-1 items-center last:flex-none"
                        >
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold ${i <= cur ? "border-gold bg-gold text-[#1d1608]" : "border-line text-mute"}`}
                          >
                            {i < cur || sel.status === "Approved" ? (
                              <Icon name="check" size={13} />
                            ) : (
                              i + 1
                            )}
                          </span>
                          <span
                            className={`ml-2 text-[11px] ${i <= cur ? "text-ink" : "text-mute"}`}
                          >
                            {s}
                          </span>
                          {i < 2 && (
                            <span
                              className={`mx-2 h-px flex-1 ${i < cur ? "bg-gold" : "bg-line"}`}
                            />
                          )}
                        </li>
                      );
                    })}
                  </ol>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {sel.status !== "Approved" && (
                      <button
                        onClick={() => advance(sel.id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-[#1d1608] shadow-glow transition hover:-translate-y-0.5"
                      >
                        {sel.status === "Draft"
                          ? "Send for approval"
                          : "Approve"}
                      </button>
                    )}
                    <button
                      onClick={() => flash("Download started")}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-mute hover:border-gold hover:text-gold-dark"
                      aria-label="Download"
                    >
                      <Icon name="download" size={16} />
                    </button>
                    <button
                      onClick={() => flash("Share link copied")}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-mute hover:border-gold hover:text-gold-dark"
                      aria-label="Share"
                    >
                      <Icon name="share" size={16} />
                    </button>
                    <button
                      onClick={() => remove(sel.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-mute hover:border-brick hover:text-brick"
                      aria-label="Delete"
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  </div>

                  <h4 className="mb-3 mt-6 font-display text-base">
                    Version history
                  </h4>
                  <ul className="relative space-y-4 border-l border-line pl-5">
                    {sel.versions.map((ver, i) => (
                      <li key={ver.v} className="relative">
                        <span
                          className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-surface ${i === 0 ? "bg-gold" : "bg-line"}`}
                        />
                        <p className="text-sm">
                          <strong>v{ver.v}</strong>{" "}
                          <span className="text-mute">· {ver.date}</span>
                        </p>
                        <p className="text-xs text-mute">
                          {ver.note} — {ver.by}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="p-10 text-center text-sm text-mute">
                <Icon
                  name="file"
                  size={32}
                  className="mx-auto mb-3 text-gold"
                />
                Select a document to see its preview, approval status and
                version history.
              </div>
            )}
          </aside>
        </div>

        {toast && (
          <div
            className="fixed bottom-7 left-1/2 z-[300] -translate-x-1/2 rounded-full border border-gold bg-charcoal px-6 py-2.5 text-sm text-white shadow-luxe"
            role="status"
          >
            {toast}
          </div>
        )}
      </div>
      <SiteFooter />
    </AppShell>
  );
}
