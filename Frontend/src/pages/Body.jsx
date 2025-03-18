import React from "react";
import "../styles/Body.css";

const vegetableData = {
  en: [
    { name: "Carrot", benefits: "Rich in beta-carotene, good for eyesight." },
    { name: "Spinach", benefits: "High in iron and vitamins, boosts immunity." },
    { name: "Tomato", benefits: "Contains lycopene, great for skin and heart health." },
    { name: "Broccoli", benefits: "Packed with fiber and antioxidants, fights diseases." },
    { name: "Potato", benefits: "Good source of energy and potassium." },
    { name: "Cucumber", benefits: "Hydrating and helps in digestion." }
  ],
  ta: [
    { name: "கேரட்", benefits: "பீட்டா-கரோட்டீன் நிறைந்தது, கண்களுக்கு நன்மை." },
    { name: "கீரை", benefits: "இரும்புச்சத்து மற்றும் விட்டமின்கள் அதிகம், நோய் எதிர்ப்பை அதிகரிக்கும்." },
    { name: "தக்காளி", benefits: "லைகோபீன் உள்ளது, தோல் மற்றும் இதய ஆரோக்கியத்திற்கு சிறப்பு." },
    { name: "ப்ரோக்கோலி", benefits: "நார்சத்து மற்றும் ஆன்டிஆக்ஸிடன்கள் நிறைந்தது, நோய்களை எதிர்க்க உதவும்." },
    { name: "உருளைக்கிழங்கு", benefits: "ஆற்றல் மற்றும் பொட்டாசியம் அதிகம் கொண்டது." },
    { name: "வெள்ளரிக்காய்", benefits: "ஈரப்பதம் அதிகரிக்கும், செரிமானத்திற்கு உதவும்." }
  ]
};

const Body = ({ language }) => {
  return (
    <div className="body-container text-white py-5">
      <div className="container text-center">
        <h1 className="display-4 fw-bold">{language === "en" ? "Healthy Vegetables" : "ஆரோக்கியமான காய்கறிகள்"}</h1>
        <p className="lead">{language === "en" ? "Eat fresh, stay healthy!" : "பசுமையாக உணவும், ஆரோக்கியமாக இருங்கள்!"}</p>

        <div className="row mt-4">
          {vegetableData[language].map((veg, index) => (
            <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <div className="card bg-dark text-light shadow-lg">
                <div className="card-body">
                  <h3 className="card-title text-warning">{veg.name}</h3>
                  <p className="card-text">{veg.benefits}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Body;
