import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import translations from "../translation"; 
import "../styles/enrty.css";

const Entry = ({ language, id }) => {
  const userId = id;
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [kgs, setKgs] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [productType, setProductType] = useState("");
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [otherCategory, setOtherCategory] = useState(""); // Custom category state

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId || !category || category === "other") return;
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URI}/user/products/${userId}/${category}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => setProducts(response.data))
      .catch((error) => {
        console.error("❌ Error fetching products:", error);
        toast.error(translations[language]?.fetchError || "Failed to load products.");
      });
  }, [userId, category, token, language]);

  const handleSelect = (product) => {
    setProductId(product._id);
    setSelectedProduct(product);
    setCategory(product.category);
    setProductType(product.category === "consumable" ? product.type || "" : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error(translations[language]?.userIdMissing || "User ID is missing!");
      return;
    }

    if (!productId && category !== "other") {
      toast.error("Please select a product before submitting!");
      return;
    }

    const calculatedAmount = rate * kgs;

    const newRecord = {
      date,
      amount: calculatedAmount,
      rate,
      kgs,
      type,
      productId:productId?productId:null,
      Expense: category === "other" ? otherCategory : "",
      productType,
      userId,
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/user/record/${userId}`,
        newRecord,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(translations[language]?.recordAdded || "Record added successfully!");

      // Reset form
      setDate("");
      setAmount("");
      setRate("");
      setKgs("");
      setType("expense");
      setCategory("");
      setProductType("");
      setProductId("");
      setSelectedProduct(null);
      setOtherCategory(""); // Reset other category field
    } catch (error) {
      console.error("❌ Error adding record:", error);
      toast.error(translations[language]?.recordFailed || "Failed to add record.");
    }
  };

  return (
    <div className="container mt-4" style={{ marginBottom: "88px" }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-center">{translations[language]?.addRecord || "Add Record"}</h2>

      <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
        <div className="mb-3">
          <label className="form-label">{translations[language]?.date || "Date"}</label>
          <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Rate</label>
            <input type="number" className="form-control" value={rate} onChange={(e) => setRate(e.target.value)} />
          </div>
          <div className="col">
            <label className="form-label">Kgs</label>
            <input type="number" className="form-control" value={kgs} onChange={(e) => setKgs(e.target.value)} />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">{translations[language]?.type || "Type"}</label>
          <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">{translations[language]?.expense || "Expense"}</option>
            <option value="income">{translations[language]?.income || "Income"}</option>
          </select>
        </div>

        {/* Horizontal Scrollable Category Selection */}
        <div className="mb-3">
          <label className="form-label">{translations[language]?.selectCategory || "Select Category"}</label>
          <div className="d-flex justify-content-start gap-2 flex-nowrap overflow-auto">
          {["consumable", "fertilizer", "pesticide"].map((cat) => (
              <button
                key={cat}
                className={`btn ${category === cat ? "btn-primary" : "btn-outline-secondary"} mx-1 px-5`}
                onClick={() => {
                  setCategory(cat);
                  setProductId("");
                  setSelectedProduct(null);
                  setOtherCategory("");
                }}
                type="button"
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
            <button
              className={`btn ${category === "other" ? "btn-primary" : "btn-outline-secondary"} mx-1`}
              onClick={() => {
                setCategory("other");
                setProductId("");
                setSelectedProduct(null);
              }}
              type="button"
            >
              Other
            </button>
          </div>
        </div>

        {/* Input Field for "Other" Category */}
        {category === "other" && (
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter work"
              value={otherCategory}
              onChange={(e) => setOtherCategory(e.target.value)}
              required
            />
          </div>
        )}

        {/* Product Dropdown */}
        {category && category !== "other" && (
          <div className="mb-3">
            <label className="form-label">{translations[language]?.product || "Product"}</label>
            <div className="dropdown">
              <button className="btn btn-outline-secondary dropdown-toggle w-100" type="button" data-bs-toggle="dropdown">
                {selectedProduct ? (
                  <>
                    <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: 30, height: 30, marginRight: 8, borderRadius: "50%" }} />
                    {selectedProduct.name}
                  </>
                ) : (
                  translations[language]?.selectProduct || "Select Product"
                )}
              </button>

              {/* Dropdown Menu */}
              <ul className="dropdown-menu w-100 custom-scroll">
                {products.map((product) => (
                  <li key={product._id}>
                    <button className="dropdown-item d-flex align-items-center" onClick={() => handleSelect(product)}>
                      <img src={product.image} alt={product.name} style={{ width: 30, height: 30, marginRight: 10, borderRadius: "50%" }} />
                      {product.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary w-100">{translations[language]?.submit || "Submit"}</button>
      </form>
    </div>
  );
};

export default Entry;
