import React, { useState, useEffect } from "react";

const formatQuantity = (category, kg, quantity) => {
  if (category === "consumable") {
    const tons = Math.floor(kg / 1000);
    const remainingKg = kg % 1000;
    return `${tons > 0 ? `${tons} ton` : ""} ${remainingKg} kg`;
  } else {
    return `${quantity} units`;
  }
};

const ProductSummaryCards = ({ product }) => {
  const [summarizedProducts, setSummarizedProducts] = useState([]);

  if (!product || !Array.isArray(product)) {
    return <p>No product data available.</p>;
  }

  useEffect(() => {
    const groupedProducts = product.reduce((acc, record) => {
      const { productImage, productName, category, kg, quantity, price } =
        record;

      if (acc[productName]) {
        acc[productName].totalKg += kg || 0;
        acc[productName].totalQuantity += quantity || 0;
        acc[productName].totalPrice += price || 0;
      } else {
        acc[productName] = {
          productName,
          category,
          productImage,
          totalKg: kg || 0,
          totalQuantity: quantity || 0,
          totalPrice: price || 0,
        };
      }

      return acc;
    }, {});

    const summarized = Object.values(groupedProducts);
    setSummarizedProducts(summarized);
  }, [product]);

  return (
    <div className="container mt-4 mb-5">
      {/* Horizontal scroll container only on small screens */}
      <div className="d-block d-sm-none overflow-auto">
        <div className="d-flex flex-nowrap gap-3 pb-2">
          {summarizedProducts.map(
            ({
              productImage,
              productName,
              category,
              totalKg,
              totalQuantity,
              totalPrice,
            }) => (
              <div
                key={productName}
                className="card shadow-sm"
                style={{ minWidth: "48%", flex: "0 0 auto" }}
              >
                <div className="card-body">
                  <img
                    src={productImage}
                    alt={productName}
                    className="img-fluid rounded shadow-sm mb-2"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                  />
                  <h6 className="card-title">{productName}</h6>
                  <p className="card-text small">
                    <strong>Category:</strong> {category}
                    <br />
                    <strong>Quantity:</strong>{" "}
                    {formatQuantity(category, totalKg, totalQuantity)}
                    <br />
                    <strong>₹</strong> {totalPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
  
      {/* Grid layout for larger screens */}
      <div className="row g-4 d-none d-sm-flex">
        {summarizedProducts.map(
          ({
            productImage,
            productName,
            category,
            totalKg,
            totalQuantity,
            totalPrice,
          }) => (
            <div
              key={productName}
              className="col-6 col-md-4 col-lg-3"
            >
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <img
                    src={productImage}
                    alt={productName}
                    className="img-fluid rounded shadow-sm mb-2"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                  />
                  <h5 className="card-title">{productName}</h5>
                  <p className="card-text">
                    <strong>Category:</strong> {category}
                    <br />
                    <strong>Quantity:</strong>{" "}
                    {formatQuantity(category, totalKg, totalQuantity)}
                    <br />
                    <strong>Total Price:</strong> ₹
                    {totalPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
  
};

export default ProductSummaryCards;
