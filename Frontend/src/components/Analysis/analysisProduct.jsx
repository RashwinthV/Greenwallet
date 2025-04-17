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
      const { productName, category, kg, quantity, price } = record;
      if (acc[productName]) {
        acc[productName].totalKg += kg || 0;
        acc[productName].totalQuantity += quantity || 0;
        acc[productName].totalPrice += price || 0;
      } else {
        acc[productName] = {
          productName,
          category,
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
    <div className="container mt-4">
      <div className="row g-4">
        {summarizedProducts.length > 0 ? (
          summarizedProducts.map(
            ({ productName, category, totalKg, totalQuantity, totalPrice }) => (
              <div
                key={productName}
                className="col-12 col-sm-6 col-md-4 col-lg-3"
              >
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
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
          )
        ) : (
          <p>No products to display.</p>
        )}
      </div>
    </div>
  );
};

export default ProductSummaryCards;
