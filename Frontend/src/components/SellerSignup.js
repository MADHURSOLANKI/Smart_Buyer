import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import UserContext from "./UserContext";

const Signup = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Get the setUser function from context

  // State for managing form data, user type, OTP, and message
  const [userType, setUserType] = useState("Buyer");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    address: "",
    shopName: "",
    shopType: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false); // Track if OTP is sent
  const [message, setMessage] = useState("");

  // Handle change in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle user type change
  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  // Send OTP when email is provided
  const sendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/send-otp", {
        email: formData.email,
      });
      if (response.status === 200) {
        setMessage("OTP sent successfully!");
        setOtpSent(true); // OTP is sent, now show OTP input
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  // Verify OTP before form submission
  const verifyOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/verify-otp", {
        email: formData.email,
        otp,
      });
      if (response.status === 200) {
        setMessage("OTP verified successfully!");
        setUser(formData.email); // Store the email in UserContext
        handleSubmit(); // Proceed with signup if OTP is verified
      } else {
        setMessage("OTP verification failed.");
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  // Handle form submission after OTP verification
  const handleSubmit = async () => {
    try {
      const endpoint = userType === "Buyer" ? "/buyer" : "/seller";
      const response = await axios.post(
        `http://localhost:5000${endpoint}`,
        formData
      );

      if (response.status === 200) {
        setMessage(`${userType} signup occurred successfully!`);
        if (endpoint === "/buyer") {
          navigate("./Buyerhome");
        } else {
          navigate("./Sellerhome");
        }
      } else {
        setMessage(`${userType} signup failed`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
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
  background: linear-gradient(to right, blue, purple);
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
        {message && <p>{message}</p>}

        {/* Select user type */}
        {/* Select user type */}
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

        {/* Form Inputs */}
        <form>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          {userType === "Seller" && (
            <>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />
              <input
                type="text"
                name="shopName"
                placeholder="Shop Name"
                value={formData.shopName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="shopType"
                placeholder="Shop Type"
                value={formData.shopType}
                onChange={handleChange}
              />
            </>
          )}

          {/* OTP Section */}
          {!otpSent ? (
            <button type="button" onClick={sendOtp}>
              Send OTP
            </button>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button type="button" onClick={verifyOtp}>
                Verify OTP
              </button>
            </>
          )}
        </form>

        <p className="login">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </>
  );
};

export default Signup;
