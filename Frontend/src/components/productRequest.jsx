import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import translations from "../translation";

function ProductRequest({ closeForm }) {
  // Add closeForm prop to receive callback from parent
  const language = localStorage.getItem("language");
  const t = translations[language];
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    category: "",
  });
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(user);

    const userId = user._id;
    const type = "request";
    const token = localStorage.getItem("token");

    if (!userId) {
      toast.error(t.userIdMissing);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/user/products-request/${userId}`,
        {
          ...formData,
          type,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message || t.recordAdded);

      setFormData({
        productName: "",
        productType: "",
        category: "",
      });

      closeForm(); 
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error(t.recordFailed);
    }
  };

  return (
    <div
      className="container mt-4 p-4 border rounded text-white"
      style={{ backdropFilter: "blur(2px" }}
    >
      <h4 className="mb-4">{t.addRecord}</h4>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">{t.product}</label>
          <input
            type="text"
            name="productName"
            className="form-control"
            placeholder={t.product}
            value={formData.productName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">{t.selectCategory}</label>
          <select
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">{t.selectCategory}</option>
            <option value="consumable">{t.consumable}</option>
            <option value="fertilizer">{t.fertilizer}</option>
            <option value="pesticide">{t.pesticide}</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">{t.type}</label>
          <select
            name="productType"
            className="form-select"
            value={formData.productType}
            onChange={handleChange}
            required
          >
            <option value="">{t.selecttype}</option>
            <option value="vegetable">{t.vegetable}</option>
            <option value="fruit">{t.fruit}</option>
            <option value="coconut">{t.coconut}</option>
            <option value="chemical">{t.chemical}</option>
            <option value="organic">{t.organic}</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          {t.submit}
        </button>
      </form>
    </div>
  );
}

export default ProductRequest;
