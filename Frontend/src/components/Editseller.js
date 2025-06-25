import React, { useContext, useEffect, useState } from "react";
import UserContext from "./UserContext";
import axios from "axios";

const Editseller = () => {
  const { user } = useContext(UserContext); // Ensure user context is correctly populated
  const [res, setRes] = useState({
    fullName: "",
    password: "",
    address: "",
    shopName: "",
    shopType: "",
  }); // Initialize the form fields
  const [error, setError] = useState(null);

  // Fetch seller information when component loads
  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const response = await axios.post("http://localhost:5000/seller/info", {
          email: user, // Pass email correctly
        });
        setRes(response.data); // Set fetched seller data
      } catch (err) {
        setError("Failed to fetch seller information");
        console.error(err);
      }
    };

    if (user) {
      fetchSeller();
    }
  }, [user]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      const response = await axios.post(
        "http://localhost:5000/seller/update",
        res
      );
      if (response.status === 200) {
        console.log("Successfully updated seller information");
      } else {
        console.log("Error occurred during seller update");
      }
    } catch (err) {
      console.error("Error during submission:", err);
    }
  };

  // Handlers for form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRes((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!res.fullName) {
    return <div>Loading...</div>; // Display loading state
  }

  return (
    <div>
      <h1>Edit Seller Information</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="fullName"
          value={res.fullName}
          onChange={handleInputChange}
          type="text"
          placeholder="Full Name"
        />
        <input
          name="password"
          value={res.password}
          onChange={handleInputChange}
          type="password"
          placeholder="Password"
        />
        <input
          name="address"
          value={res.address}
          onChange={handleInputChange}
          type="text"
          placeholder="Address"
        />
        <input
          name="shopName"
          value={res.shopName}
          onChange={handleInputChange}
          type="text"
          placeholder="Shop Name"
        />
        <select
          name="shopType"
          value={res.shopType}
          onChange={handleInputChange}
        >
          <option value="Home Appliances">Home Appliances</option>
          <option value="Electronic">Electronic</option>
          <option value="Furniture">Furniture</option>
        </select>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default Editseller;
