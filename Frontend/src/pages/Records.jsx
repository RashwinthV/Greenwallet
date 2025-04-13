import React, { useState, useEffect } from "react";
import { Container, Row, Col, Dropdown, Table } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import translations from "../translation";
import MonthFilter from "../components/filter";
import LoadingSpinner from "../components/Loadong";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ language }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filter, setFilter] = useState("today");
  const [selectedMonth, setSelectedMonth] = useState("none");
  const [isLoading, setIsLoading] = useState(true);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?._id || "";

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/user/records/${userId}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTransactions(res.data.records || []);
        setFilteredTransactions(res.data.records || []);
      } catch (error) {
        console.error(
          "❌ Error fetching transactions:",
          error.response?.data || error
        );
        setTransactions([]);
        setFilteredTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  // 🧮 Totals and Chart Data
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalKgs = filteredTransactions.reduce((acc, t) => {
    if (t.productCategory === "consumable") return acc + (t.kgs || 0);
    return acc;
  }, 0);

  const netTotal = totalIncome - totalExpense;
  const status =
    totalIncome > totalExpense
      ? translations[language]?.profit || "Profit"
      : translations[language]?.loss || "Loss";
  const netTotalColor = netTotal >= 0 ? "#28a745" : "#dc3545";

  const chartData = {
    labels: [
      translations[language]?.income || "Income",
      translations[language]?.expense || "Expense",
    ],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ["#28a745", "#dc3545"],
        hoverOffset: 5,
        borderRadius: 25,
        spacing: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "80%",
  };

  // ⏳ Show spinner while loading
  if (isLoading) return <LoadingSpinner />;

  return (
    <Container id="con" fluid className="p-3">
      <Row className="justify-content-center">
        <Col xs={12} md={6} className="text-center mb-4">
          <div className="d-flex justify-content-center">
            <div
              style={{
                width: "100%",
                maxWidth: "280px",
                height: "280px",
                position: "relative",
              }}
            >
              <Doughnut data={chartData} options={chartOptions} />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: netTotalColor,
                  whiteSpace: "nowrap",
                }}
              >
                {status} ₹{netTotal.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="d-flex flex-wrap align-items-center w-100 gap-3 mt-3 justify-content-center">
            <Dropdown>
              <Dropdown.Toggle variant="primary" className="w-100">
                {translations[language]?.filter || "Filter"}:{" "}
                {translations[language]?.[filter] || filter}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {["today", "week", "month", "year", "all"].map((time) => (
                  <Dropdown.Item key={time} onClick={() => setFilter(time)}>
                    {translations[language]?.[time] || time}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <MonthFilter
              transactions={transactions}
              setFilteredTransactions={setFilteredTransactions}
              language={language}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          </div>
        </Col>

        <Col xs={12} md={6}>
          <h4>{translations[language]?.transactionHistory || "Transaction History"}</h4>
          <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}>
            <Table striped bordered hover responsive className="text-nowrap">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Rate (₹/kg)</th>
                  <th>Kgs</th>
                  <th>Product</th>
                  <th>Income (₹)</th>
                  <th>Expense (₹)</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction._id || transaction.id}>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>₹{transaction.rate || "N/A"}</td>
                      <td>{transaction.kgs || "N/A"}</td>
                      <td>{transaction.productName || "N/A"}</td>
                      <td className="text-success">
                        {transaction.type === "income" ? `₹${transaction.amount}` : "-"}
                      </td>
                      <td className="text-danger">
                        {transaction.type === "expense" ? `₹${transaction.amount}` : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No transactions available
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <div className="mt-3 text-center">
            <p>
              <strong>Total Kgs: {totalKgs.toFixed(2)} kg</strong>
            </p>
            <p className="text-success">
              <strong>Income: ₹{totalIncome.toFixed(2)}</strong>
            </p>
            <p className="text-danger">
              <strong>Expense: ₹{totalExpense.toFixed(2)}</strong>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
