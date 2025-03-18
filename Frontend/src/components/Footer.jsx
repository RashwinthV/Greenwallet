import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

const Footer = ({ language }) => {
  const texts = {
    en: {
      about: "About Us",
      contact: "Contact",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      followUs: "Follow Us",
      rights: "All rights reserved.",
    },
    ta: {
      about: "எங்களை பற்றி",
      contact: "தொடர்பு கொள்ள",
      privacy: "தனியுரிமை கொள்கை",
      terms: "சேவை விதிமுறைகள்",
      followUs: "எங்களை பின்தொடருங்கள்",
      rights: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    },
  };

  return (
    <footer className="footer bg-dark text-light py-4">
      <div className="container text-center">
        <div className="row align-items-center">
          {/* Copyright Section */}
          <div className="col-md-6 text-start">
            <h5 className="text-uppercase fw-bold">Green Wallet</h5>
            <p className="mt-2 mb-0 text-light">
              &copy; 2024 Green Wallet. {texts[language].rights}
            </p>
          </div>

          {/* Links Section */}
          <div className="col-md-6 text-end">
            <h5 className="text-uppercase fw-bold">{texts[language].about}</h5>
            <ul className="list-unstyled d-flex justify-content-end gap-3">
              <li>
                <Link className="footer-link text-light text-decoration-none" to="/about">
                  {texts[language].about}
                </Link>
              </li>
              <li>
                <Link className="footer-link text-light text-decoration-none" to="/contact">
                  {texts[language].contact}
                </Link>
              </li>
              <li>
                <Link className="footer-link text-light text-decoration-none" to="/privacy">
                  {texts[language].privacy}
                </Link>
              </li>
              <li>
                <Link className="footer-link text-light text-decoration-none" to="/terms">
                  {texts[language].terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
