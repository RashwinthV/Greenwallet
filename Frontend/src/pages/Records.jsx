import React, { useState, useEffect } from "react";
import { Container, Row, Col, Dropdown, Table } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import translations from "../translation";
import MonthFilter from "../components/filter";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ language }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filter, setFilter] = useState("today");
  const [selectedMonth, setSelectedMonth] = useState("none");

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
      }
    };

    fetchTransactions();
  }, [userId]);

  useEffect(() => {
    let filteredData = transactions;

    if (filter !== "all") {
      const today = new Date();
      filteredData = transactions.filter((transaction) => {
        if (!transaction.date) return false;
        const transactionDate = new Date(transaction.date);

        switch (filter) {
          case "today":
            return transactionDate.toDateString() === today.toDateString();
          case "week":
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(today.getDate() - 7);
            return transactionDate >= oneWeekAgo;
          case "month":
            return (
              transactionDate.getMonth() === today.getMonth() &&
              transactionDate.getFullYear() === today.getFullYear()
            );
          case "year":
            return transactionDate.getFullYear() === today.getFullYear();
          default:
            return true;
        }
      });
    } else {
      setSelectedMonth("none"); // Reset month filter when "All" is selected
    }

    if (selectedMonth && selectedMonth !== "none") {
      const currentYear = new Date().getFullYear();
      filteredData = filteredData.filter((t) => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getFullYear() === currentYear &&
          transactionDate.getMonth() === parseInt(selectedMonth, 10) - 1
        );
      });
    }

    setFilteredTransactions(filteredData);
  }, [filter, selectedMonth, transactions]);

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalKgs = filteredTransactions.reduce(
    (acc, t) => acc + (t.kgs || 0),
    0
  );
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
    cutout: 160,
  };

  return (
    <Container fluid className="p-4">
      <Row>
        <Col md={6} className="text-center">
          <div
            style={{
              width: "400px",
              height: "500px",
              margin: "0 auto",
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
                fontSize: "22px",
                fontWeight: "bold",
                color: netTotalColor,
              }}
            >
              {status} ₹{netTotal.toFixed(2)}
            </div>
          </div>
          <div className="d-flex align-items-center w-100 gap-3  mt-3" style={{marginLeft:"250px"}}>
            <Dropdown>
              <Dropdown.Toggle variant="primary">
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

        <Col md={6}>
          <h4>
            {translations[language]?.transactionHistory ||
              "Transaction History"}
          </h4>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>{translations[language]?.date || "Date"}</th>
                  <th>{translations[language]?.rate || "Rate (₹/kg)"}</th>
                  <th>{translations[language]?.kgs || "Kgs"}</th>
                  <th>{translations[language]?.product || "Product"}</th>
                  <th>{translations[language]?.income || "Income"} (₹)</th>
                  <th>{translations[language]?.expense || "Expense"} (₹)</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction._id || transaction.id}>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>₹{transaction.rate || "N/A"}</td>
                      <td>{transaction.kgs || "N/A"}</td>
                      <td>{transaction.product || "N/A"}</td>
                      <td className="text-success">
                        {transaction.type === "income"
                          ? `₹${transaction.amount}`
                          : "-"}
                      </td>
                      <td className="text-danger">
                        {transaction.type === "expense"
                          ? `₹${transaction.amount}`
                          : "-"}
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

          <p>
            <strong>
              {"Total Kgs"}: {totalKgs.toFixed(2)} kg
            </strong>
          </p>

          <p className="text-success">
            <strong>
              {translations[language]?.income || "Income"}: ₹
              {totalIncome.toFixed(2)}
            </strong>
          </p>
          <p className="text-danger">
            <strong>
              {translations[language]?.expense || "Expense"}: ₹
              {totalExpense.toFixed(2)}
            </strong>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
