import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./searchlist.css"; // Import the CSS file

const Categorylist = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  // Get the query from the location state
  const location = useLocation();
  const query = location.state?.query;

  useEffect(() => {
    const fetchlist = async () => {
      try {
        if (!query) {
          setMessage("No search query provided.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/buyer/products/category/${query}`
        );
        if (response.status === 200 && response.data.length > 0) {
          setProducts(response.data);
        } else {
          setMessage("Product not found");
        }
      } catch (err) {
        setMessage(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchlist();
  }, [query]);
  const handleclick = (product) => {
    navigate("fullinfo", { state: { product } });
  };
  return (
    <div className="search-list-container">
      {loading ? (
        <p className="loading-message">Loading...</p>
      ) : message ? (
        <p className="message">{message}</p>
      ) : (
        products.map((product, index) => (
          <div
            key={index}
            className="product-item"
            onClick={() => handleclick(product)}
          >
            <p>
              <strong>Name:</strong> {product.name}
            </p>

            <p>
              ₹{product.price} {/* Rupee symbol */}
            </p>
            {product.imageData && (
              <img
                src={`data:image/jpeg;base64,${product.imageData}`}
                alt={product.name}
                className="product-image" // Add a class for styling
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Categorylist;
