import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./fullinfo.css";
import UserContext from "./UserContext";

const Fullinfo = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const { product } = location.state;
  const [shop, setShop] = useState({});
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [averageRating, setAverageRating] = useState(
    product.averageRating || 0
  );
  const [userId, setUserId] = useState(""); // To store the userId

  // Fetch shop details and user ID
  useEffect(() => {
    const fetchDetails = async () => {
      // Fetch shop details
      if (product?.email) {
        try {
          const shopResponse = await axios.get(
            `http://localhost:5000/seller/shop/${product.email}`
          );
          if (shopResponse && shopResponse.data) {
            setShop(shopResponse.data);
          } else {
            console.log("Shop details not found");
          }
        } catch (err) {
          console.log(`Error fetching shop details: ${err.message}`);
        }
      }

      // Fetch user ID based on email
      if (user) {
        console.log("User email in Fullinfo:", user);

        try {
          const userResponse = await axios.get(
            `http://localhost:5000/buyer/getUserByEmail/${user}`
          );
          if (userResponse.data && userResponse.data._id) {
            const fetchedUserId = userResponse.data._id;
            setUserId(fetchedUserId);
            console.log("Successfully fetched userId:", fetchedUserId);
          } else {
            console.log("User ID not found");
          }
        } catch (err) {
          console.log(`Error fetching user ID: ${err.message}`);
        }
      }
    };

    fetchDetails();
  }, [product.email, user]);

  // Function to handle star click
  const handleStarClick = (value) => {
    setRating(value);
  };

  // Function to submit rating
  const handleRatingSubmit = async () => {
    if (!userId) {
      alert("User not found. Cannot submit rating.");
      return;
    }

    try {
      console.log(
        "Submitting rating with product ID:",
        product._id,
        "and user ID:",
        userId,
        "with rating:",
        rating
      );

      const response = await axios.post(
        `http://localhost:5000/buyer/products/rate`,
        {
          productId: product._id,
          userId: userId, // Ensure that the userId is available
          rating,
        }
      );

      if (response.data && response.data.product) {
        setAverageRating(response.data.product.averageRating);
        alert("Thank you for your rating!");
      } else {
        alert("Failed to submit rating. Please try again.");
      }
    } catch (err) {
      console.error(`Error: ${err.message}`);
      alert("An error occurred while submitting your rating.");
    }
  };

  // Function to render stars
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= (hoverRating || rating) ? "filled" : ""}`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="container">
      <div className="img">
        {product.imageData && (
          <img
            src={`data:image/jpeg;base64,${product.imageData}`}
            alt={product.name}
          />
        )}
      </div>

      <div className="Product-info">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>₹{product.price}</p>
        <p>{product.category}</p>
        <p>{product.imageType}</p>
        <p>{product.email}</p>
      </div>

      <h1>SHOP DETAILS</h1>
      {shop ? (
        <div>
          <p>{shop.address}</p>
          <p>{shop.shopName}</p>
          <p>{shop.shopType}</p>
        </div>
      ) : (
        <p>No shop details available for this product</p>
      )}

      <h2>Rate this Product</h2>
      <div className="rating-stars">{renderStars()}</div>
      <button className="submit-button" onClick={handleRatingSubmit}>
        Submit Rating
      </button>
      <p>Average Rating: {averageRating.toFixed(1)}</p>
    </div>
  );
};

export default Fullinfo;
