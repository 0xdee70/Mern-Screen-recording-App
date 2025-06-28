import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return setErrorMessage("Please provide both email and password.");
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        formData
      );

      if (response.status === 200 && response.data.token) {
        localStorage.setItem("Token", response.data.token);
        navigate("/screen");
      } else {
        setErrorMessage("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      
      // Improved error handling with specific messages from backend
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data;
        
        if (status === 401) {
          setErrorMessage("User not found. Please check your email.");
        } else if (status === 402) {
          setErrorMessage("Incorrect password. Please try again.");
        } else if (typeof message === 'string') {
          setErrorMessage(message);
        } else {
          setErrorMessage("Login failed. Please try again.");
        }
      } else {
        setErrorMessage("Network error. Please check your connection.");
      }
    }
  };

  return (
    <div>
      <h2>Login Form</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            value={formData.email}
            onChange={handleChange} 
          />
          <br />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />
          <br />
          <button type="submit">Login</button>
        </div>
      </form>

      <p>
        Not a user? <Link to="/register">Click here</Link>
      </p>
    </div>
  );
}