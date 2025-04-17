import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RateECGChart = ({ records }) => {
  const rateData = {
    labels: records.map((r) => new Date(r.date).toLocaleDateString()),
    datasets: [
      {
        label: "Rate ECG",
        data: records.map((r) => r.rate),
        borderColor: "lime",
        borderWidth: 2,
        pointRadius: 2,
        tension: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#39ff14" },
        grid: { color: "#333" },
      },
      x: {
        ticks: { color: "#39ff14" },
        grid: { color: "#333" },
      },
    },
    plugins: {
      legend: {
        labels: { color: "#39ff14" },
      },
    },
  };

  return (
    <div style={{ background: "#111", padding: "20px", borderRadius: "8px" }}>
      <h3>Rate Fluctuation (ECG Style)</h3>
      <Line data={rateData} options={chartOptions} />
    </div>
  );
};

export default RateECGChart;
