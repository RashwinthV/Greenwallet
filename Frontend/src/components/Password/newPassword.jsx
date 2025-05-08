import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsCheckCircle } from "react-icons/bs"; // For the success check mark
import useAuth from "../../Hooks/UseAuth";
import axios from "axios";

const translations = {
  en: {
    heading: "Change Password",
    startBtn: "Change Password",
    confirmMsg: "Are you sure you want to change your password?",
    currentPwd: "Current Password",
    newPwd: "New Password",
    confirmPwd: "Confirm New Password",
    verifyBtn: "Verify & Continue",
    cancel: "Cancel",
    updateBtn: "Update Password",
    errorIncorrect: "Incorrect current password",
    errorMismatch: "New passwords do not match",
    success: "Password successfully changed!",
    passfail: "Error occurred while updating password",
    samePassword: "New password is same as current password",
  },
  ta: {
    heading: "கடவுச்சொல்லை மாற்றவும்",
    startBtn: "கடவுச்சொல்லை மாற்றவும்",
    confirmMsg: "நீங்கள் உங்கள் கடவுச்சொல்லை மாற்ற விரும்புகிறீர்களா?",
    currentPwd: "தற்போதைய கடவுச்சொல்",
    newPwd: "புதிய கடவுச்சொல்",
    confirmPwd: "புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    verifyBtn: "சரிபார்க்கவும்",
    cancel: "ரத்து செய்க",
    updateBtn: "கடவுச்சொல்லை புதுப்பிக்கவும்",
    errorIncorrect: "தவறான தற்போதைய கடவுச்சொல்",
    errorMismatch: "புதிய கடவுச்சொல்கள் பொருந்தவில்லை",
    success: "கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது!",
    passfail: "கடவுச்சொல்லைப் புதுப்பிக்கும்போது பிழை ஏற்பட்டது",
    samePassword: "புதிய கடவுச்சொல்லும் தற்போதைய கடவுச்சொல்லும் ஒன்றே",
  },
};

function NewPassword() {
  const [step, setStep] = useState("start");
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
const {user}=useAuth()
  const lang = localStorage.getItem("language") || "en";
  const t = translations[lang];

  const sendmail = async () => {
    try {
        console.log("yes");
        
      const token = localStorage.getItem("token");
      const userId = user._id;
  console.log("user",user);
  
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/user/mail/passwordupdate-info/${userId}`,
        { email: user.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Email send error:", err);
      setError(t.passfail);
    }
  };
  
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URI}/user/verify-password/${
        storedUser._id
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword: formData.currentPassword }),
      }
    );

    const data = await res.json();

    if (data?.match) {
      setError("");
      setStep("change");
    } else {
      setError(t.errorIncorrect);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError(t.errorMismatch);
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/user/password/${storedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await res.json();

      if (data?.same) {
        setError(t.samePassword);
      } else if (data?.match) {
        setSuccess(true);
        sendmail()
        setStep("start");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setError("");

        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(t.errorIncorrect);
      }
    } catch (error) {
      setError(t.passfail);
    }
  };

  return (
    <div className="card p-4 border-0 rounded-3">
      <h3>{t.heading}</h3>

      {step === "start" && (
        <button
          className="btn btn-warning mt-4"
          onClick={() => setStep("verify")}
        >
          {t.startBtn}
        </button>
      )}

      {step === "verify" && (
        <form className="mt-4" onSubmit={handleVerifySubmit}>
          <p>{t.confirmMsg}</p>
          <div className="mb-3">
            <label className="form-label">{t.currentPwd}</label>
            <input
              type="password"
              name="currentPassword"
              className="form-control"
              value={formData.currentPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          {error && <div className="text-danger">{error}</div>}
          <button type="submit" className="btn btn-danger me-2">
            {t.verifyBtn}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setStep("start");
              setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              });
              setError("");
            }}
          >
            {t.cancel}
          </button>
        </form>
      )}

      {step === "change" && (
        <form className="mt-4" onSubmit={handlePasswordChange}>
          <div className="mb-3">
            <label className="form-label">{t.newPwd}</label>
            <input
              type="password"
              name="newPassword"
              className="form-control"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">{t.confirmPwd}</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          {error && <div className="text-danger">{error}</div>}
          <div className="d-flex justify-content-around">
            <button type="submit" className="btn btn-success">
              {t.updateBtn}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setStep("start");
                setFormData({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
                setError("");
              }}
            >
              {t.cancel}
            </button>
          </div>
        </form>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-4 alert alert-success d-flex align-items-center">
          <BsCheckCircle className="text-success me-2" size={24} />
          <span>{t.success}</span>
        </div>
      )}
    </div>
  );
}

export default NewPassword;
