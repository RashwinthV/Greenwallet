import React, { useMemo, useState } from "react";
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
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const RateECGChart = ({ records }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const availableYears = useMemo(() => {
    const years = new Set();
    records.forEach((r) => years.add(new Date(r.date).getFullYear()));
    return Array.from(years).sort();
  }, [records]);

  const sortedRecords = useMemo(() => {
    return records
      .map((r) => ({
        ...r,
        alignedDate: new Date(r.date),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [records]);

  const limitMonthlyData = (data) => {
    const monthGrouped = {};
    let maxCount = 0;

    data.forEach((r) => {
      const month = new Date(r.date).getMonth();
      if (!monthGrouped[month]) monthGrouped[month] = [];
      monthGrouped[month].push(r);
    });

    const limited = Object.values(monthGrouped).flatMap((entries) => {
      maxCount = Math.max(maxCount, entries.length);
      if (entries.length <= 10) return entries;
      const step = Math.floor(entries.length / 10);
      return entries.filter((_, i) => i % step === 0).slice(0, 10);
    });

    return { limited, maxCount };
  };

  const { limited, maxCount } = useMemo(() => {
    if (!selectedYear) return { limited: [], maxCount: 0 };

    const filteredData = sortedRecords.filter(
      (r) => new Date(r.date).getFullYear() === Number(selectedYear)
    );

    return limitMonthlyData(filteredData);
  }, [selectedYear, sortedRecords]);

  const datasets = useMemo(() => {
    if (!limited || limited.length === 0) return [];

    return [
      {
        label: `Rate ${selectedYear}`,
        data: limited.map((r) => ({
          x: r.alignedDate,
          y: r.rate,
        })),
        borderColor: "#007bff",
        backgroundColor: "#007bff",
        borderWidth: 2,
        pointRadius: 2,
        tension: 0,
      },
    ];
  }, [limited, selectedYear]);

  const chartData = {
    datasets,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month",
          tooltipFormat: "MMM dd",
          displayFormats: {
            month: "MMM",
          },
        },
        ticks: { color: "#333" },
        grid: { color: "#eee" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#333" },
        grid: { color: "#eee" },
      },
    },
    plugins: {
      legend: {
        labels: { color: "#333" },
      },
      tooltip: {
        mode: "nearest",
        intersect: false,
      },
    },
  };

  const handleReset = () => {
    setSelectedYear(new Date().getFullYear());
  };

  const dynamicChartWidth = Math.max(900, maxCount * 100);

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        color: "#333",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-3">
        <h4 className="m-0">📊  Rate Analysis</h4>
        <div className="d-flex gap-2 flex-wrap">
          <select
            className="form-select form-select-sm"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Select Year</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button className="btn btn-outline-dark btn-sm" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {datasets.length > 0 ? (
        <div style={{ overflowX: "auto", width: "100%" }}>
          <div style={{ minWidth: `${dynamicChartWidth}px`, height: "400px" }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      ) : (
        <p className="text-muted">Select a year to display data.</p>
      )}
    </div>
  );
};

export default RateECGChart;
