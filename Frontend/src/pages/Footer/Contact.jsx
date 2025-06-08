import React, { useState } from "react";
import Footertranslations from "../../footerTranslation";
import { toast } from "react-toastify";

function Contact() {
  const lang = localStorage.getItem("language") || "en";
  const t = Footertranslations[lang];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/user/${user._id}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ formData }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });

      // Reset submission status after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error(error);
      toast.error("Error sending message. Please try again later.");
    }
  };

  return (
    <div className="container py-5 vh-100">
      <h2 className="text-success mb-3">{t.contact_title}</h2>
      <p className="lead">{t.contact_description}</p>

      <div className="mb-4">
        <ul className="list-unstyled fs-5">
          <li>
            <strong>{t.Email}:</strong> {t.contact_email}
          </li>
          <li>
            <strong>{t.phone}:</strong> {t.contact_phone}
          </li>
          <li>
            <strong>{t.address}:</strong> {t.contact_address}
          </li>
          <li>
            <strong>{t.hours} :</strong> {t.contact_hours}
          </li>
        </ul>
      </div>

      {/* <div className="mb-4">
        <p>{t.contact_social}</p>
      </div> */}

      <div className="card p-4 shadow-sm">
        <h5 className="mb-3">{t.contact_form_title}</h5>
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                {t.contact_form_name}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                required
                placeholder={t.contact_form_name}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                {t.contact_form_email}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                required
                placeholder={t.contact_form_email}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                {t.contact_form_message}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-control"
                rows="4"
                required
                placeholder={t.contact_form_message}
              />
            </div>

            <button type="submit" className="btn btn-success">
              {t.contact_form_button}
            </button>
          </form>
        ) : (
          <div className="alert alert-success" role="alert">
            {t.contact_form_success}
          </div>
        )}
      </div>
    </div>
  );
}

export default Contact;
