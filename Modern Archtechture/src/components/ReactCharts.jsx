import { useEffect, useState } from "react";
import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js";

// Charts follow the active light/dark coluors through CSS variables.
const css = (name, fallback) =>
  getComputedStyle(document.body).getPropertyValue(name).trim() || fallback;

// Very dark chart colours disappear on the dark theme, so swap them for a light tone.
const DARK_SWAP = { "#222222": "#d9d0c1", "#222": "#d9d0c1", "#1a1815": "#d9d0c1" };
const swap = (c) => (typeof c === "string" ? DARK_SWAP[c.toLowerCase()] || c : c);
const COLOR_KEYS = ["backgroundColor", "borderColor", "pointBackgroundColor"];

function themedDatasets(datasets, dark) {
  if (!dark) return datasets;
  return datasets.map((ds) => {
    const copy = { ...ds };
    COLOR_KEYS.forEach((k) => {
      if (copy[k] !== undefined) copy[k] = Array.isArray(copy[k]) ? copy[k].map(swap) : swap(copy[k]);
    });
    return copy;
  });
}

// true while <body> has the "dark-theme" class; updates when the user toggles the theme
function useDarkTheme() {
  const read = () => document.body.classList.contains("dark-theme");
  const [dark, setDark] = useState(read);
  useEffect(() => {
    const watcher = new MutationObserver(() => setDark(read()));
    watcher.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => watcher.disconnect();
  }, []);
  return dark;
}

const barValueLabels = {
  id: "barValueLabels",
  afterDatasetsDraw(chart) {
    if (chart.config.type !== "bar") return;
    const { ctx } = chart;
    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.font = "600 10px Poppins, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    chart.data.datasets.forEach((ds, i) => {
      chart.getDatasetMeta(i).data.forEach((bar, idx) => {
        const v = ds.data[idx];
        if (!v) return;
        const { x, y } = bar.getCenterPoint();
        ctx.fillText(String(v), x, y);
      });
    });
    ctx.restore();
  },
};

export default function ReactCharts({
  type = "line",
  labels,
  datasets,
  height,
  options = {},
  className = "react-chart",
  ariaLabel = "Chart",
}) {
  const dark = useDarkTheme();
  ChartJS.defaults.color = css("--muted", "#6f6a62");
  ChartJS.defaults.borderColor = css("--line", "#e7dfd2");
  ChartJS.defaults.font.family = "Poppins, Arial, sans-serif";

  const merged = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 650 },
    interaction: { intersect: false, mode: "index" },
    ...options,
    plugins: {
      tooltip: { enabled: true, padding: 12 },
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, padding: 16 },
      },
      ...options.plugins,
    },
  };

  return (
    <div
      className={className}
      style={height ? { height } : undefined}
      role="img"
      aria-label={ariaLabel}
    >
      <Chart
        key={dark ? "dark" : "light"}
        type={type}
        data={{ labels, datasets: themedDatasets(datasets, dark) }}
        options={merged}
        plugins={type === "bar" ? [barValueLabels] : []}
      />
    </div>
  );
}
