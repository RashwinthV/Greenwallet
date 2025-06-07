import React, { useContext, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ThemeContext } from "../Context/ThemeContext";
import axios from "axios";

const AddProduct = () => {
  const { darkMode } = useContext(ThemeContext);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    type: "",
    price: "",
    description: "",
    image: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const resetProductForm = () =>
    setNewProduct({
      name: "",
      category: "",
      type: "",
      price: "",
      description: "",
      image: "",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/products`,
        newProduct,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      resetProductForm();

      // Close modal
      const modalEl = document.getElementById("addProductModal");
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance?.hide();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="container mt-5 vh-100">
      <button
        id="openAddProductModalBtn"
        type="button"
        className="d-none"
        data-bs-toggle="modal"
        data-bs-target="#addProductModal"
      ></button>

      {/* Add Product Modal */}
      <div
        className="modal fade"
        id="addProductModal"
        tabIndex="-1"
        aria-labelledby="addProductModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div
            className={`modal-content ${
              darkMode ? "bg-dark text-light" : "bg-white text-dark"
            }`}
          >
            <div className="modal-header">
              <h5 className="modal-title" id="addProductModalLabel">
                Add Product
              </h5>
              <button
                type="button"
                className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Input Fields */}
                {[
                  { label: "Product Name", name: "name", type: "text" },
                  {
                    label: "Category",
                    name: "category",
                    type: "select",
                    options: ["consumable", "fertilizer", "pesticide"],
                  },
                  {
                    label: "Type",
                    name: "type",
                    type: "select",
                    options: [
                      "vegetable",
                      "Fruit",
                      "Coconut",
                      "chemical",
                      "organic",
                    ],
                  },
                  { label: "Price", name: "price", type: "number" },
                  {
                    label: "Description",
                    name: "description",
                    type: "textarea",
                  },
                  { label: "Image URL", name: "image", type: "text" },
                ].map(({ label, name, type, options }) => (
                  <div className="mb-3" key={name}>
                    <label htmlFor={name} className="form-label">
                      {label}
                    </label>
                    {type === "textarea" ? (
                      <textarea
                        id={name}
                        name={name}
                        className="form-control"
                        rows="3"
                        value={newProduct[name]}
                        onChange={handleInputChange}
                      />
                    ) : type === "select" ? (
                      <select
                        id={name}
                        name={name}
                        className="form-select"
                        value={newProduct[name]}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select {label}</option>
                        {options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={name}
                        name={name}
                        type={type}
                        className="form-control"
                        value={newProduct[name]}
                        onChange={handleInputChange}
                        required={name !== "image" && name !== "description"}
                        min={name === "price" ? "0" : undefined}
                        step={name === "price" ? "0.01" : undefined}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Add Product
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
