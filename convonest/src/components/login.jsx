import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  
  // State to manage form inputs and errors
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission

    try {
      // Send login request to the backend API
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password,
      });

      // If login is successful, save the token to localStorage (or a global state)
      localStorage.setItem('token', response.data.token);

      // Redirect the user to the messages page
      navigate('/main');
    } catch (err) {
      setError('Invalid credentials or server error');
      console.error('Login error:', err);
    }
  };

  const handleRegisterClick = () => {
    navigate('/signup'); // Navigate to the signup page
  };

  return (
    <div className="hero">
      <div className="signupbox">
        <div className="heading">Log in</div>
        <form onSubmit={handleLogin}>
          <div className="input">
            <div className="lab">Email</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input">
            <div className="lab">Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <div className="anch">
            <a href="#" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
          </div>
          <div className="lower">
            <div className="logb button">
              <button type="submit">Log in</button>
            </div>
            <div className="or">OR</div>
            <div className="regb button">
              <button type="button" onClick={handleRegisterClick}>Register</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
