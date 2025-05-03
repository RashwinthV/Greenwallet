import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import translations from "../translation";
import "../styles/enrty.css";

const Entry = ({ language, id }) => {
  const userId = id;
  const [date, setDate] = useState("");
  const [rate, setRate] = useState("");
  const [kgs, setKgs] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [productType, setProductType] = useState("");
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [otherCategory, setOtherCategory] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId || !category || category === "other") return;
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_URI
        }/user/products/${userId}/${category}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => setProducts(response.data))
      .catch((error) => {
        console.error("❌ Error fetching products:", error);
        toast.error(translations[language]?.fetchError);
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
      toast.error(translations[language]?.userIdMissing);
      return;
    }

    if (!productId && category !== "other") {
      toast.error(translations[language]?.selectProductError);
      return;
    }

    const calculatedAmount = rate * kgs;

    const newRecord = {
      date,
      amount: calculatedAmount,
      rate,
      kgs,
      type,
      productId: productId || null,
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
      toast.success(translations[language]?.recordAdded);

      setDate("");
      setRate("");
      setKgs("");
      setType("expense");
      setCategory("");
      setProductType("");
      setProductId("");
      setSelectedProduct(null);
      setOtherCategory("");
    } catch (error) {
      console.error("❌ Error adding record:", error);
      toast.error(translations[language]?.recordFailed);
    }
  };

  return (
    <div className="container mt-4" style={{ marginBottom: "88px" }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-center">{translations[language]?.addRecord}</h2>

      <form className="p-4 border rounded bg-light">
        <div className="mb-3">
          <label className="form-label">{translations[language]?.date}</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">{translations[language]?.rate}</label>
            <input
              type="number"
              className="form-control"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>
          <div className="col">
            <label className="form-label">
              {translations[language]?.kgsOrQty}
            </label>
            <input
              type="number"
              className="form-control"
              value={kgs}
              onChange={(e) => setKgs(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">{translations[language]?.type}</label>
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="expense">{translations[language]?.expense}</option>
            <option value="income">{translations[language]?.income}</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">
            {translations[language]?.selectCategory}
          </label>
          <div className="row g-2">
            {["consumable", "fertilizer", "pesticide"].map((cat) => (
              <div className="col-6 col-md-3" key={cat}>
                <button
                  type="button"
                  className={`btn w-100 ${
                    category === cat ? "btn-primary" : "btn-outline-secondary"
                  }`}
                  onClick={() => {
                    setCategory(cat);
                    setProductId("");
                    setSelectedProduct(null);
                    setOtherCategory("");
                  }}
                >
                  {translations[language]?.[cat]}
                </button>
              </div>
            ))}

            <div className="col-6 col-md-3">
              <button
                type="button"
                className={`btn w-100 ${
                  category === "other" ? "btn-primary" : "btn-outline-secondary"
                }`}
                onClick={() => {
                  setCategory("other");
                  setProductId("");
                  setSelectedProduct(null);
                }}
              >
                {translations[language]?.other}
              </button>
            </div>
          </div>
        </div>

        {category === "other" && (
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder={translations[language]?.enterWork}
              value={otherCategory}
              onChange={(e) => setOtherCategory(e.target.value)}
              required
            />
          </div>
        )}

        {category && category !== "other" && (
          <div className="mb-3">
            <label className="form-label">
              {translations[language]?.product}
            </label>
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle w-100"
                type="button"
                data-bs-toggle="dropdown"
              >
                {selectedProduct ? (
                  <>
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      style={{
                        width: 30,
                        height: 30,
                        marginRight: 8,
                        borderRadius: "50%",
                      }}
                    />
                    {selectedProduct.name}
                  </>
                ) : (
                  translations[language]?.selectProduct
                )}
              </button>

              <ul className="dropdown-menu w-100 custom-scroll">
                {products.map((product) => (
                  <li key={product._id}>
                    <button
                    type="button"
                      className="dropdown-item d-flex align-items-center"
                      onClick={() => handleSelect(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: 30,
                          height: 30,
                          marginRight: 10,
                          borderRadius: "50%",
                        }}
                      />
                      {product.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <button onClick={handleSubmit} className="btn btn-primary w-100">
          {translations[language]?.submit}
        </button>
      </form>
    </div>
  );
};

export default Entry;
