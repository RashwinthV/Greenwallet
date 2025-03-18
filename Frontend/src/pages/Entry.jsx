import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Entry = ({ language, id }) => {
  const userId = id;
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`${import.meta.env.VITE_BACKEND_URI}/user/products/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products.");
      });
  }, [userId, token]);

  const handleSelect = (product) => {
    setProductId(product._id);
    setSelectedProduct(product);  // Only set the selected product without submitting the form
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  // This prevents the default form submission behavior

    if (!userId) {
      toast.error("User ID is missing!");
      return;
    }

    const newRecord = { date, amount, type, productId, userId };

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URI}/user/records/${userId}`, newRecord, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Record added successfully!");

      // Reset form
      setDate("");
      setAmount("");
      setType("expense");
      setProductId("");
      setSelectedProduct(null); // Reset selected product
    } catch (error) {
      console.error("Error adding record:", error);
      toast.error("Failed to add record.");
    }
  };

  return (
    <div className="container mt-4" style={{ marginBottom: "88px" }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-center">Add Record</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Amount</label>
          <input
            type="number"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Type</label>
          <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        {/* Product Dropdown */}
        <div className="mb-3">
          <label className="form-label">Product</label>
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              {selectedProduct ? (
                <>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    style={{ width: 30, height: 30, marginRight: 8, borderRadius: "50%" }}
                  />
                  {selectedProduct.name}
                </>
              ) : (
                "Select Product"
              )}
            </button>

            <ul className="dropdown-menu">
              {products.map((product) => (
                <li key={product._id}>
                  <button
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => handleSelect(product)} // Select product without submitting
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: 30, height: 30, marginRight: 8, borderRadius: "50%" }}
                    />
                    {product.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Entry;
