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
import MonthFilter from "../filter"; // Update this import path if needed

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

const RateECGChart = ({ records, language = "en" }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("");

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

  const generateColor = (index, total) => {
    const hue = (index * 360) / total;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const filteredRecords = useMemo(() => {
    if (!selectedYear) return [];

    const filtered = sortedRecords.filter((r) => {
      
      const date = new Date(r.date);
      const yearMatches = date.getFullYear() === Number(selectedYear);
      const monthMatches =
        selectedMonth === "" || selectedMonth === "none"
          ? true
          : date.getMonth() === parseInt(selectedMonth, 10) - 1;
      return yearMatches && monthMatches;
    });

    return filtered;
  }, [selectedYear, selectedMonth, sortedRecords]);

  const recordsByProduct = useMemo(() => {
    const grouped = {};
    filteredRecords.forEach((r) => {
      
      const key = r.productName || "Unknown Product";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push({ x: r.alignedDate, y: r.rate });
    });
    return grouped;
  }, [filteredRecords]);

  
  const datasets = useMemo(() => {
    const total = Object.keys(recordsByProduct).length;

    return Object.entries(recordsByProduct).map(([product, data], i) => ({
      label: product,
      data,
      borderColor: generateColor(i, total),
      backgroundColor: generateColor(i, total),
      borderWidth: 2,
      pointRadius: 2,
      tension: 0.3,
    }));
  }, [recordsByProduct]);

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

  // Reset filters
  const handleReset = () => {
    setSelectedYear(new Date().getFullYear());
    setSelectedMonth("");
  };

  const dynamicChartWidth = Math.max(900, filteredRecords.length * 100);

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        color: "#333",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
      className="h-90"
    >
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-3">
        <h4 className="m-0">📊 Rate Analysis</h4>
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

          <MonthFilter
            transactions={records}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            setFilteredTransactions={() => {}}
            language={language}
          />

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
        <p className="text-muted">No data available for selected filters.</p>
      )}
    </div>
  );
};

export default RateECGChart;
