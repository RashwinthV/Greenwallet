import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import translations from "../translation";

const Register = ({ language }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNo: "",
    age: "",
    gender: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/user/register`, formData);
      setMessage(response.data.message);
      if (response) navigate("/login");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error registering user");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0 p-4" style={{ borderRadius: "12px", backgroundColor: "#f8f9fa" }}>
            {/* Card Header */}
            <div className="text-center">
              <h4 className="mb-0">{translations[language].register}</h4>
            </div>

            <div className="card-body">
              {message && <div className="alert alert-info">{message}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">{translations[language].name}</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control rounded-pill p-2"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={translations[language].enterName}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">{translations[language].email}</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control rounded-pill p-2"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={translations[language].enterEmail}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">{translations[language].password}</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control rounded-pill p-2"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder={translations[language].enterPassword}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">{translations[language].phoneNo}</label>
                  <input
                    type="text"
                    name="phoneNo"
                    className="form-control rounded-pill p-2"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    required
                    pattern="\d{10}"
                    title="Phone number must be 10 digits"
                    placeholder={translations[language].enterPhone}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">{translations[language].age}</label>
                  <input
                    type="number"
                    name="age"
                    className="form-control rounded-pill p-2"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min="18"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">{translations[language].gender}</label>
                  <select name="gender" className="form-control rounded-pill p-2" value={formData.gender} onChange={handleChange} required>
                    <option value="">{translations[language].selectGender}</option>
                    <option value="male">{translations[language].male}</option>
                    <option value="female">{translations[language].female}</option>
                    <option value="other">{translations[language].other}</option>
                  </select>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 rounded-pill p-2 fs-5 shadow-sm"
                    style={{ backgroundColor: "#007bff", border: "none", transition: "0.3s" }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
                  >
                    {translations[language].register}
                  </button>
                </div>

                <p className="text-center mt-4">
                  {translations[language].alreadyHaveAccount}{" "}
                  <a href="/login" className="text-decoration-none text-primary fw-semibold">
                    {translations[language].login}
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
