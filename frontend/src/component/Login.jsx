import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  const naviagte = useNavigate();
  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        formData
      );
      if (response.status === 200) {
        naviagte("/screen");
      } else {
        console.log("login failed ");
      }
    } catch (e) {}
  };

  return (
    <>
      <div>
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
      </div>
    </>
  );
}
