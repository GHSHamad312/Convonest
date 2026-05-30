import React, { useState } from "react";
import axios from "axios";
import "./sign_up.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [emailForVerification, setEmailForVerification] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!specialCharPattern.test(password)) {
      return "Password must include at least one special character";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.termsAccepted) {
      setError("You must agree to the terms and conditions");
      return;
    }

    try {
      // Send registration details
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setSuccessMessage(res.data.message);
      setError(null);
      setIsVerifying(true);
      setEmailForVerification(formData.email);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
        email: emailForVerification,
        verificationCode,
      });

      setSuccessMessage(res.data.message);
      setError(null);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="hero">
      <div className="inner">
        {!isVerifying ? (
          <>
            <div className="reg">Registration</div>
            <form onSubmit={handleSubmit} className="formdata">
              <div className="inps">
                <p>Name</p>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="inps">
                <p>Email</p>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="inps">
                <p>Password</p>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="inps">
                <p>Repeat Password</p>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="termsbox">
                <input
                  className="check"
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                />
                <p className="terms">
                  I agree with all the <a href="#" onClick={(e) => e.preventDefault()}>Terms and conditions</a> of the app
                </p>
              </div>

              {error && <p className="error">{error}</p>}
              {successMessage && <p className="success">{successMessage}</p>}

              <div className="inps">
                <button type="submit">Sign Up</button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="reg">Verify Email</div>
            <form onSubmit={handleVerification} className="formdata">
              <div className="inps">
                <p>Enter Verification Code</p>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>

              {error && <p className="error">{error}</p>}
              {successMessage && <p className="success">{successMessage}</p>}

              <div className="inps">
                <button type="submit">Verify</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
