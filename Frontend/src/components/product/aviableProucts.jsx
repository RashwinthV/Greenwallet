import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/AvailableProducts.css";  

function AvailableProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const isMobile = windowWidth < 768;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Available Products</h2>

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

              <div className="product-grid">
                {categoryProducts.map((product, index) => {
                  if (isMobile && index >= 4) return null; // Limit to 4 items on mobile

                  return (
                    <div key={product._id} className="product-card">
                      <div className="card h-100">
                        <img
                          src={product.image}
                          className="card-img-top"
                          alt={product.name}
                          loading="lazy"
                        />
                        <div className="card-body">
                          <h5 className="card-title">{product.name}</h5>
                          <p className="text-muted">Category: {product.category}</p>
                          <p className="card-text">Price: ${product.price}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default AvailableProducts;
