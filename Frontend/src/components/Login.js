import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "./UserContext";

const LoginPage = () => {
  const [userType, setUserType] = useState("Buyer");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  // Handle changes in user type (Buyer/Seller)
  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  // Handle input changes for email and password
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Use the correct backend URL with port 5000
      const endpoint =
        userType === "Seller"
          ? "http://localhost:5000/seller/login"
          : "http://localhost:5000/buyer/login";
      const response = await axios.post(endpoint, formData);
      const user = formData.email;
      console.log(user);
      setUser(user);
      if (response.status === 200) {
        setMessage("Login occurred successfully");
        setError("");
        navigate(userType === "Seller" ? "/Sellerhome" : "/Buyerhome");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during login.");
    }
  };

  return (
    <>
      <style>
        {`
        html,
body {
  min-height: 100vh;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right,blue,purple);
}

.container {
  max-width: 300px;
  border: 3px solid red;
  width: 90%;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  text-align: center;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: skyblue;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: blue;
}
.login {
  padding-top: 15px;
}

        `}
      </style>
      <div className="container">
        {/* Display login success or error message */}
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Radio buttons for selecting user type */}
        <div className="d-flex justify-content-center">
          <div
            className="btn-group"
            role="group"
            aria-label="Basic radio toggle button group"
          >
            <input
              type="radio"
              className="btn-check"
              name="userType"
              id="buyerRadio"
              value="Buyer"
              checked={userType === "Buyer"}
              onChange={handleUserTypeChange}
              autoComplete="off"
            />
            <label className="btn btn-outline-primary" htmlFor="buyerRadio">
              Buyer
            </label>

            <input
              type="radio"
              className="btn-check"
              name="userType"
              id="sellerRadio"
              value="Seller"
              checked={userType === "Seller"}
              onChange={handleUserTypeChange}
              autoComplete="off"
            />
            <label className="btn btn-outline-primary" htmlFor="sellerRadio">
              Seller
            </label>
          </div>
        </div>

        {/* Form for logging in */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>

        <p className="sign-up">
          Don't have an account? <Link to="/signup">Sign up here.</Link>
        </p>
      </div>
    </>
  );
};

export default LoginPage;
