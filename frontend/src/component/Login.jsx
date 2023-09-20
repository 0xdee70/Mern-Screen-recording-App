import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, seterrorMessage] = useState("");

  const naviagte = useNavigate();
  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return seterrorMessage("Please Provide Both!");
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        formData
      );

      if (response.status === 200 && response.data.token) {
        localStorage.setItem("Token", response.data.token);

        naviagte("/screen");
      } else {
        seterrorMessage("Invalid Credentials");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div>
        <h2> Login Form </h2>
        {errorMessage && <p> {errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email"> Email </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleChange}
            />
            <br />
            <label htmlFor="password"> Password </label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
            />
            <br />
            <button type="submit"> Login </button>
          </div>
        </form>

        <p>
          Not an User ? <Link to="/register">click here </Link>
        </p>
      </div>
    </>
  );
}
