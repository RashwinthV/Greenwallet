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
  const [groupedByCategory, setGroupedByCategory] = useState({});

  useEffect(() => {
    if (!product || !Array.isArray(product)) return;

    const groupedProducts = product.reduce((acc, record) => {
      const { productImage, productName, category, kg, quantity, price } =
        record;

      if (!acc[productName]) {
        acc[productName] = {
          productName,
          category,
          productImage,
          totalKg: kg || 0,
          totalQuantity: quantity || 0,
          totalPrice: price || 0,
        };
      } else {
        acc[productName].totalKg += kg || 0;
        acc[productName].totalQuantity += quantity || 0;
        acc[productName].totalPrice += price || 0;
      }

      return acc;
    }, {});

    // Group by category
    const byCategory = {
      consumable: [],
      fertilizer: [],
      pesticide: [],
    };

    Object.values(groupedProducts).forEach((item) => {
      if (byCategory[item.category]) {
        byCategory[item.category].push(item);
      }
    });

    setGroupedByCategory(byCategory);
  }, [product]);

  if (!product || !Array.isArray(product)) {
    return <p>No product data available.</p>;
  }

  const renderCard = ({
    productImage,
    productName,
    category,
    totalKg,
    totalQuantity,
    totalPrice,
  }) => (
    <div key={productName} className="col-6 col-md-4 col-lg-3">
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
    </div>
  );

  return (
    <div className="container mt-4 mb-5">
      {["consumable", "fertilizer", "pesticide"].map((category) =>
        groupedByCategory[category]?.length > 0 ? (
          <div key={category} className="mb-5">
            <h4 className="mb-3 text-capitalize">{category}</h4>

            {/* 👉 Scrollable on mobile */}
            <div className="d-block d-sm-none overflow-auto">
              <div className="d-flex flex-nowrap gap-3 pb-2">
                {groupedByCategory[category].map((item) => (
                  <div
                    key={item.productName}
                    className="card shadow-sm"
                    style={{ minWidth: "75%", flex: "0 0 auto" }}
                  >
                    <div className="card-body d-flex flex-column justify-content-center">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="img-fluid rounded mx-5 shadow-sm mb-2"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                      <h6 className="card-title">{item.productName}</h6>
                      <p className="card-text small">
                        <strong>Category:</strong> {item.category}
                        <br />
                        <strong>Quantity:</strong>{" "}
                        {formatQuantity(
                          item.category,
                          item.totalKg,
                          item.totalQuantity
                        )}
                        <br />
                        <strong>Amount: ₹</strong> {item.totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 👉 Grid layout for desktop */}
            <div className="row g-4 d-none d-sm-flex">
              {groupedByCategory[category].map((item) => renderCard(item))}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
};

export default ProductSummaryCards;
