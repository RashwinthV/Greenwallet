import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/product.css"; // Ensure this is correctly imported
import { FaTrash, FaEdit } from "react-icons/fa"; // Import delete and edit icons
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { ThemeContext } from "../Context/ThemeContext";

function Products() {
  const [products, setProducts] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null); // Track product to delete
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "consumable",
    type: "vegetable",
    image: "",
    price: 0,
    description: "",
  });
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate(); // Initialize navigation hook

  useEffect(() => {
    fetchProducts();
  }, []);


  const fetchProducts = () => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URI}/api/getproducts`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${import.meta.env.VITE_BACKEND_URI}/api/products`, newProduct)
      .then(() => {
        setNewProduct({
          name: "",
          category: "consumable",
          type: "vegetable",
          image: "",
        });
        fetchProducts();
        document.getElementById("closeModal").click();
      })
      .catch((err) => console.error("Error adding product:", err));
  };
  const handleDelete = () => {
    if (!deleteProductId) return;

    axios
      .delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/products/${deleteProductId}`
      )
      .then(() => {
        fetchProducts();
        setDeleteProductId(null);
      })
      .catch((err) => console.error("Error deleting product:", err));
  };

  const confirmDelete = (productId) => {
    setDeleteProductId(productId);
  };

  const cancelDelete = () => {
    setDeleteProductId(null);
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    document.body.classList.add("modal-open");
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
    document.body.classList.remove("modal-open");
  };

  const handleEdit = (productId) => {
    navigate(`/edit-products/${productId}`); // Redirect to edit page
  };

  return (
    <div
      className={`mt-5 product-container
        ${darkMode ? "bg-dark text-light" : "bg-white text-dark"}`}
    >
      <h2 className="text-center">Products</h2>
      <button
        className="btn btn-success d-block mx-auto mb-4"
        data-bs-toggle="modal"
        data-bs-target="#addProductModal"
      >
        + Add Product
      </button>

      {Object.keys(products).length === 0 ? (
        <p className="text-center text-muted">No products available.</p>
      ) : (
        Object.keys(products).map((category) => (
          <div key={category} className="mb-5 can">
            <h3 className="text-center text-uppercase text-primary">
              {category}
            </h3>
            <div className="product-list">
              {products[category].map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(product._id)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => confirmDelete(product._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.name}
                    onClick={() => openProductDetails(product)}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">{product.name}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Floating Product Details Modal */}
      {selectedProduct && (
        <div className="product-details-overlay" onClick={closeProductDetails}>
          <div
            className="product-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={closeProductDetails}>
              &times;
            </button>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="modal-img"
            />
            <div className="modal-content">
              <h3 className="text-center">{selectedProduct.name}</h3>
              <p>
                <strong>Type:</strong> {selectedProduct.type || "N/A"}
              </p>
              <p>
                <strong>Price:</strong> ₹{selectedProduct.price || "N/A"}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {selectedProduct.description || "No description available"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteProductId && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <p>Are you sure you want to delete this product?</p>
            <div className="delete-confirm-buttons">
              <button className="btn btn-danger" onClick={handleDelete}>
                Yes, Delete
              </button>
              <button className="btn btn-secondary" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bootstrap Modal for Adding Products */}
      <div
        className={`modal w-100 fade  ${darkMode ? "bg-dark text-light" : "bg-white text-dark"}`}
        id="addProductModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title">Add Product</h5>
              <button
                type="button"
                className={`btn-close ${darkMode? "btn-close-white":"btn-close-dark"}`}
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModal"
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                {/* Product Name */}
                <div className="mb-3">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Category Dropdown */}
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="consumable">Consumable</option>
                    <option value="fertilizer">Fertilizer</option>
                    <option value="pesticide">Pesticide</option>
                  </select>
                </div>

                {/* Type Dropdown */}
                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    name="type"
                    value={newProduct.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="vegetable">Vegetable</option>
                    <option value="Fruit">Fruit</option>
                    <option value="Coconut">Coconut</option>
                    <option value="chemical">Chemical</option>
                    <option value="organic">Organic</option>
                  </select>
                </div>

                {/* Price Input */}
                <div className="mb-3">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Image URL */}
                <div className="mb-3">
                  <label className="form-label">Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    name="image"
                    value={newProduct.image}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Save Button */}
                <button type="submit" className="btn btn-primary w-100">
                  Save Product
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
