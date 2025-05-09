import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

function AvailableProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/user/products`
        );
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products", error);
        toast.error("Failed to load products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = category
    ? products.filter((product) => product.category === category)
    : products;

  const categories = Array.from(
    new Set(filteredProducts.map((product) => product.category))
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Available Products</h2>

      {/* Category Filter */}
      <div className="mb-3">
        <label className="form-label">Filter by Category</label>
        <select
          className="form-select"
          onChange={(e) => setCategory(e.target.value)}
          value={category}
        >
          <option value="">All Categories</option>
          
          <option value="consumable">consumable</option>
          <option value="fertilizer">fertilizer</option>
          <option value="pesticide">pesticide</option>
        </select>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        categories.map((category) => {
          const categoryProducts = filteredProducts.filter(
            (product) => product.category === category
          );

          return (
            <div key={category}>
              <h3 className="mb-3">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>

              {/* Product Cards */}
              <div
                className="d-flex flex-wrap justify-content-start"
                style={{
                  gap: "10px",
                  flexDirection: "column", 
                  overflowY: "auto", 
                  maxHeight: "500px", 
                  paddingBottom: "10px",
                }}
              >
                {categoryProducts.map((product) => (
                  <div
                    key={product._id}
                    className="card mb-4"
                    style={{
                      width: "15rem",
                      height: "auto",
                      flex: "0 0 auto",
                      minWidth: "150px",
                    }}
                  >
                    <img
                      src={product.image}
                      className="card-img-top"
                      style={{
                        objectFit: "cover", 
                                                height: "200px",
                        width: "100%", 
                      }}
                      alt={product.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="text-muted">Category: {product.category}</p>
                      <p className="card-text">Price: ${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default AvailableProducts;
