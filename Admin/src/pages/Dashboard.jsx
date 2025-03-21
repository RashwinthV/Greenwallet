import React, { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    usersCount: 0,
    recordsCount: 0,
    entriesCount: 0,
    productCategories: {},
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URI}/api/dashboard-stats`)
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dashboard stats:", error);
      });
  }, []);

  const getChartData = (label, value, color) => ({
    labels: [label],
    datasets: [
      {
        data: [90, 30], // Adjusted for better visibility
        backgroundColor: [color, "#FFFFFF"],
        hoverBackgroundColor: ["#EDEDED", color],
        borderWidth: 0,
        cutout: "80%",
        spacing: 6,
        borderRadius: 20,
      },
    ],
  });

  const getNormalChartData = (labels, values, colors) => ({
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        hoverBackgroundColor: colors.map((color) => color + "CC"),
        borderWidth: 2,
        cutout: "60%",
      },
    ],
  });

  return (
    <div className="container mt-4">
      <h2 className="text-center">Dashboard</h2>

      {/* Donut Charts for Users, Records, Entries */}
      <div className="row d-flex justify-content-center text-center mt-3">
        {[
          { label: "Users", count: stats.usersCount, color: "#36A2EB" },
          { label: "Records", count: stats.recordsCount, color: "#FF0000" },
          { label: "Entries", count: stats.entriesCount, color: "#8BC34A" },
        ].map((item, index) => (
          <div
            key={index}
            className="col-lg-4 col-md-6 col-sm-12 mb-4 d-flex justify-content-center"
          >
            <div className="card shadow-sm p-3 w-100">
              <h5>{item.label}</h5>
              <div className="chart-container">
                <Doughnut
                  data={getChartData(item.label, item.count, item.color)}
                  options={{
                    maintainAspectRatio: false,
                    rotation: 220,
                    plugins: {
                      tooltip: { enabled: false },
                      legend: { display: false },
                    },
                  }}
                />
                <div className="chart-label">{item.count}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Categories Section */}
      <h4 className="mt-5 text-center">Products by Category</h4>
      <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center gap-4 flex-wrap mt-3">
        {/* Product Categories Donut Chart */}
        <div className="category-chart">
          <Doughnut
            data={getNormalChartData(
              Object.keys(stats.productCategories),
              Object.values(stats.productCategories),
              ["#4CAF50", "#FF9800", "#9C27B0"]
            )}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "bottom" },
              },
            }}
          />
        </div>

        {/* Product Categories List */}
        <ul className="category-list">
          {Object.keys(stats.productCategories).map((category) => (
            <li key={category} className="category-item">
              <strong>{category}</strong>
              <span>{stats.productCategories[category]}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
