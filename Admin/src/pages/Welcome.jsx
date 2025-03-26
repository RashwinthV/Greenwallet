import React, { useState, useEffect } from "react";
import "../styles/welcome.css"; // Import CSS file for styling

const quotes = [
  '"Leadership is not about being in charge. It is about taking care of those in your charge." - Simon Sinek',
  '"The secret of getting ahead is getting started." - Mark Twain',
  '"The best way to predict the future is to create it." - Peter Drucker',
  '"Opportunities don\'t happen. You create them." - Chris Grosser',
  '"Success is not in what you have, but who you are." - Bo Bennett',
];

function Welcome() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 10000); // Change quote every 10 seconds

    return () => clearInterval(quoteInterval);
  }, []);

  return (
    <div className="welcome-page">
        <h1>Welcome to the Admin Panel</h1>
      {/* Success Image with Overlaid Quotes */}
      <div className="image-container">
        <img
          src="https://static.vecteezy.com/system/resources/previews/005/205/623/non_2x/silhouette-of-businessman-on-mountain-top-over-sunset-sky-background-business-success-leadership-and-achievement-concept-free-photo.jpg"
          alt="Success"
        />
        <div className="quote-overlay">
          <p className="quote-text">{quotes[currentQuoteIndex]}</p>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
