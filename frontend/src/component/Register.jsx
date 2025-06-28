import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [formData, SetFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errorMessage, seterrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (event) => {
    SetFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password || !formData.username) {
      return seterrorMessage("Please provide all details");
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/register`,
        formData
      );
      
      if (response.status === 200) {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      
      // Improved error handling with specific messages from backend
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data;
        
        if (status === 422) {
          seterrorMessage("Email already in use. Please try a different email.");
        } else if (typeof message === 'string') {
          seterrorMessage(message);
        } else {
          seterrorMessage("Registration failed. Please try again.");
        }
      } else {
        seterrorMessage("Network error. Please check your connection.");
      }
    }
  };

  return (
    <div>
      <h2>Registration Form</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Name:</label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
          />
          <br />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
          <br />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />
          <br />
          <button type="submit">Register</button>
        </form>
        <p>
          Already a user? <Link to="/login">Click here!</Link>
        </p>
      </div>
    </div>
  );
}