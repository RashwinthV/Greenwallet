import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/product.css"; // Ensure this is correctly imported
import { FaTrash, FaEdit } from "react-icons/fa"; // Import delete and edit icons
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { ThemeContext } from "../Context/ThemeContext";
import AddProductModal from "../comp/Addproduct";

function Products() {
  const [products, setProducts] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "consumable",
    type: "vegetable",
    image: "",
    price: 0,
    description: "",
  });
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate(); 

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
      const token = localStorage.getItem("token");
      const user= JSON.parse(localStorage.getItem("user"));
      const id=user?._id

    axios
      .delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/${id}/products/${deleteProductId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
     <AddProductModal
  darkMode={darkMode}
  newProduct={newProduct}
  handleInputChange={handleInputChange}
  handleSubmit={handleSubmit}
/>

    </div>
  );
}

export default Products;
