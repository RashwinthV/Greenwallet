import React, { useState, useEffect } from "react";
import { Container, Row, Col, Dropdown, Table } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import translations from "../translation";
import {Link} from 'react-router-dom'
import MonthFilter from "../components/filter";
import LoadingSpinner from "../components/Loading/Loadong";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ language }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("none");
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState("none");

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
        
      } catch (error) {
        console.error(
          "❌ Error fetching transactions:",
          error.response?.data || error
        );
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  useEffect(() => {
    try {
      if (filterMode === "none") {
        setFilteredTransactions([]);
        return;
      }

      let filteredData = transactions;

      if (filterMode === "all") {
        setSelectedYear(new Date().getFullYear());
        setSelectedMonth("none");
        filteredData = transactions;
      } else {
        if (selectedYear && selectedYear !== "none") {
          filteredData = filteredData.filter((t) => {
            const transactionDate = new Date(t.date);
            return transactionDate.getFullYear() === selectedYear;
          });
        }

        if (selectedMonth && selectedMonth !== "none") {
          filteredData = filteredData.filter((t) => {
            const transactionDate = new Date(t.date);
            return (
              transactionDate.getFullYear() === selectedYear &&
              transactionDate.getMonth() === parseInt(selectedMonth, 10) - 1
            );
          });
        }
      }

      if (filteredData.length === 0 && selectedYear !== "none") {
        setSelectedMonth("none");
      }

      setFilteredTransactions(filteredData);
    } catch (error) {
      console.error("Error applying year/month filter:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedMonth, transactions, filterMode]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  

  const handleNoneClick = () => {
    setFilterMode("none");
    setSelectedYear("none");
    setSelectedMonth("none");
    setFilteredTransactions([]);
  };

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalKg = filteredTransactions.reduce((acc, t) => {
    if (t.productCategory === "consumable") {
      return acc + (t.kgs || 0);
    }
    return acc;
  }, 0);

  const tons = Math.floor(totalKg / 1000);
  const remainingKg = totalKg % 1000;
  const totalKgs=`${tons>0? `${tons} tons` : ""} ${remainingKg} kg`
  
  

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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container id="con" fluid className="p-3 ">
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
            {/* Filter Mode Dropdown */}
            <Dropdown>
              <Dropdown.Toggle variant="primary" className="w-100">
                {translations[language]?.filter || "Filter"}:{" "}
                {filterMode === "all"
                  ? translations[language]?.all || "All"
                  : filterMode === "none"
                  ? translations[language]?.none || "None"
                  : `${translations[language]?.year || "Year"}: ${selectedYear}, ${
                      translations[language]?.month || "Month"
                    }: ${selectedMonth}`}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setFilterMode("all")}>
                  {translations[language]?.all || "All"}
                </Dropdown.Item>
                <Dropdown.Item onClick={handleNoneClick}>
                  {translations[language]?.none || "None"}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Year Dropdown */}
            <Dropdown>
              <Dropdown.Toggle variant="primary" className="w-100">
                {translations[language]?.year || "Year"}: {selectedYear}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {[...Array(10)].map((_, index) => {
                  const year = new Date().getFullYear() - index;
                  return (
                    <Dropdown.Item
                      key={year}
                      onClick={() => {
                        setSelectedYear(year);
                        setSelectedMonth("none");
                        setFilterMode("custom");
                      }}
                    >
                      {year}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>

            {/* Month Filter */}
            <MonthFilter
              transactions={transactions}
              setFilteredTransactions={setFilteredTransactions}
              language={language}
              selectedMonth={selectedMonth}
              setSelectedMonth={(month) => {
                setSelectedMonth(month);
                setFilterMode("custom");
              }}
              selectedYear={selectedYear}
            />
          </div>
        </Col>

        <Col xs={12} md={6}>
        <div className="d-flex mx-auto">
          <h4>
            {translations[language]?.transactionHistory || "Transaction History"}
          </h4>
          <Link to={"/edit-records"} className="mx-auto bg-danger rounded text-white p-2 " style={{textDecoration:"none",marginBottom:"10px"}}>{translations[language].EditRecords}</Link>
        </div>
          
          <div
            style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}
          >
            <Table striped bordered hover responsive className="text-nowrap">
              <thead>
                <tr>
                  <th>{translations[language].date}</th>
                  <th>{translations[language].rate} (₹/kg)</th>
                  <th>{translations[language].kgsOrQty}</th>
                  <th>{translations[language].product}</th>
                  <th>{translations[language].income} (₹)</th>
                  <th>{translations[language].expense} (₹)</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                  <tr key={transaction._id || transaction.id}>
                     <td>{formatDate(transaction.date)}</td>

                      <td>₹{transaction.rate || "N/A"}</td>
                      <td>{transaction.kgs || "N/A"}</td>
                      <td>{transaction.productName || "N/A"}</td>
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
                      {filterMode === "none"
                        ? "Please select a filter to view transactions."
                        : "No transactions available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Totals */}
          {filteredTransactions.length > 0 && (
            <div className="mt-3 text-center">
              <p>
                <strong>Total Kgs: {totalKgs}</strong>
              </p>
              <p className="text-success">
                <strong>{translations[language].income}: ₹{totalIncome.toFixed(2)}</strong>
              </p>
              <p className="text-danger">
                <strong>{translations[language].expense}: ₹{totalExpense.toFixed(2)}</strong>
              </p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
