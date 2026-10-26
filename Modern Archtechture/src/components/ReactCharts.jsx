import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js";

// Charts follow the active light/dark coluors through CSS variables.
const css = (name, fallback) =>
  getComputedStyle(document.body).getPropertyValue(name).trim() || fallback;

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
        type={type}
        data={{ labels, datasets }}
        options={merged}
        plugins={type === "bar" ? [barValueLabels] : []}
      />
    </div>
  );
}
