import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/editProducts.css"; // Ensure you have this CSS for responsiveness

function EditProducts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    category: "",
    type: "",
    price: 0,
    description: "",
    image: "",
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URI}/api/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  const handleInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`${import.meta.env.VITE_BACKEND_URI}/api/products/${id}`, product)
      .then(() => {
        navigate("/products");
      })
      .catch((err) => console.error("Error updating product:", err));
  };

  return (
    <div className="container mt-4 edit-product-container">
      <h2 className="text-center">Edit Product</h2>

      {/* Image Preview */}
      {product.image && (
        <div className="image-preview">
          <img src={product.image} alt="Product Preview" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="edit-form">
        {/* Product Name */}
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Category */}
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            name="category"
            value={product.category}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Type */}
        <div className="mb-3">
          <label className="form-label">Type</label>
          <input
            type="text"
            className="form-control"
            name="type"
            value={product.type}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Price */}
        <div className="mb-3">
          <label className="form-label">Price (₹)</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={product.price}
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
            value={product.description}
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
            value={product.image}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-100">
          Update Product
        </button>
      </form>
    </div>
  );
}

export default EditProducts;
