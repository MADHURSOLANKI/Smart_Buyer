import React, { useContext, useEffect, useState } from "react";
import UserContext from "./UserContext";
import axios from "axios";
const EditBuyer = () => {
  const { user } = useContext(UserContext); // Access user from context
  const [res, setRes] = useState({});

  // State to store response
  const handleNameChange = (e) => {
    setRes((prevRes) => ({
      ...prevRes,
      fullName: e.target.value,
    }));
  };

  const handlePasswordChange = (e) => {
    setRes((prevRes) => ({
      ...prevRes,
      password: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/buyer/update",
        res
      ); // Assuming you have an update route
      console.log("Updated response:", response.data);
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.post("http://localhost:5000/buyer/edit", {
          email: user,
        });
        console.log(response.data);
        setRes(response.data); // This will log what the backend sends back
      } catch (err) {
        console.log(`Error: ${err}`);
      }
    };

    fetchdata(); // Call the fetchdata function
  }, [user]); // Dependency array ensures this runs only once or when 'user' changes

  return (
    <>
      <style>{`
  html, body {
    min-height: 100vh;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to right, blue, purple);
    font-family: Arial, sans-serif;
  }
  
  .container {
    background: white;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    width: 100%;
    text-align: center;
  }

  label {
    display: block;
    margin-top: 10px;
    font-weight: bold;
  }

  input {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
  }

  button {
    margin-top: 20px;
    padding: 10px 15px;
    border: none;
    background: linear-gradient(to right, #4a90e2, #8e44ad);
    color: white;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
  }

  button:hover {
    background: linear-gradient(to right, #357abd, #6d2c92);
  }
`}</style>

      <div className="container">
        <label>Full Name:</label>
        <input
          name="fullname"
          value={res.fullName || ""}
          onChange={handleNameChange}
          type="text"
        />
        <br />
        <label>Password:</label>
        <input
          name="password"
          value={res.password || ""}
          onChange={handlePasswordChange}
          type="String"
        />
        <h3>Email: {res?.email || "Email not available"}</h3>
        <button onClick={handleSubmit}>Save Changes</button>
      </div>
    </>
  );
};

export default EditBuyer;
