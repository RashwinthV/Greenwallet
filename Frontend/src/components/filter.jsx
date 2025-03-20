import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import translations from "../translation";

const MonthFilter = ({ transactions, setFilteredTransactions, language }) => {
  const [selectedMonth, setSelectedMonth] = useState("none");

  // List of months
  const months = [
    { value: "none", label: translations[language]?.none || "None" },
    { value: "", label: translations[language]?.allMonths || "All Months" },
    { value: "01", label: translations[language]?.january || "January" },
    { value: "02", label: translations[language]?.february || "February" },
    { value: "03", label: translations[language]?.march || "March" },
    { value: "04", label: translations[language]?.april || "April" },
    { value: "05", label: translations[language]?.may || "May" },
    { value: "06", label: translations[language]?.june || "June" },
    { value: "07", label: translations[language]?.july || "July" },
    { value: "08", label: translations[language]?.august || "August" },
    { value: "09", label: translations[language]?.september || "September" },
    { value: "10", label: translations[language]?.october || "October" },
    { value: "11", label: translations[language]?.november || "November" },
    { value: "12", label: translations[language]?.december || "December" },
  ];

  const handleMonthChange = (selectedValue) => {
    setSelectedMonth(selectedValue);

    if (selectedValue === "none" || selectedValue === "") {
      setFilteredTransactions(transactions); // Show all transactions
      return;
    }

    const currentYear = new Date().getFullYear();
    const filteredData = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getFullYear() === currentYear &&
        transactionDate.getMonth() === parseInt(selectedValue, 10) - 1
      );
    });

    setFilteredTransactions(filteredData);
  };

  return (
    <Dropdown className="w-80">
      <Dropdown.Toggle variant="primary">
        {months.find((m) => m.value === selectedMonth)?.label || "Select Month"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {months.map((month) => (
          <Dropdown.Item
            key={month.value}
            onClick={() => handleMonthChange(month.value)}
          >
            {month.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MonthFilter;
