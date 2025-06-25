import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./searchlist.css"; // Import the CSS file

const Searchlist = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState(null);

  // Get the query from the location state
  const location = useLocation();
  const query = location.state?.query;

  useEffect(() => {
    const fetchlist = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/buyer/products/name/${query}`
        );
        if (response.status === 200 && response.data.length > 0) {
          setProducts(response.data);
        } else {
          setMessage("Product not found");
        }
      } catch (err) {
        setMessage(`Error: ${err.message}`);
      }
    };

    if (query) {
      fetchlist();
    }
  }, [query]);

  const handleclick = (product) => {
    navigate("fullinfo", { state: { product } });
  };

  // Helper function to render star rating
  const renderStars = (averageRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= averageRating ? "star filled" : "star"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="search-list-container">
      {message ? (
        <p className="message">{message}</p>
      ) : (
        products.map((product, index) => (
          <div
            key={index}
            className="product-item"
            onClick={() => handleclick(product)}
          >
            {product.imageData && (
              <img
                src={`data:image/jpeg;base64,${product.imageData}`}
                alt={product.name}
              />
            )}
            <div className="star-rating">
              {renderStars(product.averageRating)}
            </div>

            <div className="info">
              <strong>{product.name}</strong>
              <br />
              <strong>₹{product.price}</strong>
              <br />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Searchlist;
