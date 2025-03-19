import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Dropdown, Table } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import AuthContext from "../context/Authcontextt"; // ✅ Fixed import
import translations from "../translation"; 

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ language }) => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("today");

  const userId = user?._id || "";

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) return;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/user/records/${userId}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          }
        );
        setTransactions(res.data.records || []); // ✅ Ensure it's an array
      } catch (error) {
        console.error("❌ Error fetching transactions:", error.response?.data || error);
        setTransactions([]); // ✅ Prevent crashes by setting an empty array
      }
    };

    fetchTransactions();
  }, [userId]);

  // ✅ Ensure transactions is always an array before filtering
  const filteredTransactions = (transactions || []).filter((transaction) => {
    if (!transaction.date) return false;

    const transactionDate = new Date(transaction.date);
    const today = new Date();

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

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalKgs = filteredTransactions.reduce((acc, t) => acc + (t.kgs || 0), 0);

  const netTotal = totalIncome - totalExpense;
  const status = totalIncome > totalExpense
    ? translations[language]?.profit || "Profit"
    : translations[language]?.loss || "Loss";

  const netTotalColor = netTotal >= 0 ? "#28a745" : "#dc3545"; 

  const chartData = {
    labels: [translations[language]?.income || "Income", translations[language]?.expense || "Expense"],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ["#28a745", "#dc3545"],
        hoverOffset: 5,
        borderRadius: 25,
        spacing: 4,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "80%",
    plugins: {
      tooltip: { enabled: true },
      legend: { display: true, position: "bottom" },
    },
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
          <Dropdown className="mt-3">
            <Dropdown.Toggle variant="primary">
              {translations[language]?.filter || "Filter"}: {translations[language]?.[filter] || filter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {["today", "week", "month", "year", "all"].map((time) => (
                <Dropdown.Item key={time} onClick={() => setFilter(time)}>
                  {translations[language]?.[time] || time}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        {/* Transaction Table */}
        <Col md={6}>
          <h4>{translations[language]?.transactionHistory || "Transaction History"}</h4>
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
                      <td>{transaction.product || translations[language]?.notAvailable || "N/A"}</td>
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
                      {translations[language]?.noTransactions || "No transactions available"}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>{translations[language]?.total || "Total"}:</strong></td>
                  <td></td>
                  <td><strong>{totalKgs.toFixed(2)} kg</strong></td>
                  <td></td>
                  <td className="text-success"><strong>₹{totalIncome.toFixed(2)}</strong></td>
                  <td className="text-danger"><strong>₹{totalExpense.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
