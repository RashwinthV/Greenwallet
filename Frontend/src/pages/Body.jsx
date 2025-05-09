import React, { useState, useEffect } from "react";
import ProductRequest from "../components/productRequest";
import "../styles/Body.css"
import AvailableProducts from "../components/product/aviableProucts";

const vegetableData = {
  en: [
    { name: "Carrot", benefits: "Rich in beta-carotene, good for eyesight." },
    {
      name: "Spinach",
      benefits: "High in iron and vitamins, boosts immunity.",
    },
    {
      name: "Tomato",
      benefits: "Contains lycopene, great for skin and heart health.",
    },
    {
      name: "Broccoli",
      benefits: "Packed with fiber and antioxidants, fights diseases.",
    },
    { name: "Potato", benefits: "Good source of energy and potassium." },
    { name: "Cucumber", benefits: "Hydrating and helps in digestion." },
  ],
  ta: [
    {
      name: "கேரட்",
      benefits: "பீட்டா-கரோட்டீன் நிறைந்தது, கண்களுக்கு நன்மை.",
    },
    {
      name: "கீரை",
      benefits:
        "இரும்புச்சத்து மற்றும் விட்டமின்கள் அதிகம், நோய் எதிர்ப்பை அதிகரிக்கும்.",
    },
    {
      name: "தக்காளி",
      benefits: "லைகோபீன் உள்ளது, தோல் மற்றும் இதய ஆரோக்கியத்திற்கு சிறப்பு.",
    },
    {
      name: "ப்ரோக்கோலி",
      benefits:
        "நார்சத்து மற்றும் ஆன்டிஆக்ஸிடன்கள் நிறைந்தது, நோய்களை எதிர்க்க உதவும்.",
    },
    {
      name: "உருளைக்கிழங்கு",
      benefits: "ஆற்றல் மற்றும் பொட்டாசியம் அதிகம் கொண்டது.",
    },
    {
      name: "வெள்ளரிக்காய்",
      benefits: "ஈரப்பதம் அதிகரிக்கும், செரிமானத்திற்கு உதவும்.",
    },
  ],
};

const styles = {
  button: {
    transition: "transform 0.3s ease-in-out",
  },
};

const Body = ({ language }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showform, setshowform] = useState(false);

  useEffect(() => {
    setIsAnimating(true);

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Function to close the form and reset the state
  const closeForm = () => {
    setshowform(false);
  };

  return (
    <div className="bod">
      {!showform ? (
        <button
          id="add-product"
          className={`btn btn-primary mt-3 ${
            isAnimating ? "animate-jump" : ""
          }`}
          style={styles.button}
          onClick={() => setshowform(true)}
        >
          Request Product
        </button>
      ) : (
        <button
          id="add-product"
          className={`btn btn-danger mt-3 ${isAnimating ? "animate-jump" : ""}`}
          style={styles.button}
          onClick={() => setshowform(false)}
        >
          Cancel Request
        </button>
      )}
      {showform && <ProductRequest closeForm={closeForm} />}{" "}

      <div className="body-container text-white py-5">
        
        <div className="container text-center">
          <AvailableProducts/>
        </div>
      </div>
    </div>
  );
};

export default Body;
