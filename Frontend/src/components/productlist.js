import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import UserContext from "./UserContext";
import { Link, useNavigate } from "react-router-dom";
import "./ProductList.css"; // Import the CSS file

const ProductList = () => {
  const { user } = useContext(UserContext); // Assuming user contains the email
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!user) {
          setError("User email not found.");
          return;
        }

        const response = await axios.get(`
          http://localhost:5000/seller/products/email/${user}
        `);
        console.log(response.data);
        if (response.status === 200) {
          setProducts(response.data);
          setError(""); // Clear error on successful fetch
        } else {
          setError("Failed to fetch products.");
        }
      } catch (err) {
        setError(`Error: ${err.message}`);
      }
    };

    if (user) {
      fetchProducts();
    }
  }, [user]); // Dependency array with 'user'

  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(`
        http://localhost:5000/seller/products/${productId}`);
      if (response.status === 200) {
        alert("Product deleted successfully");

        setProducts(products.filter((product) => product._id !== productId));
      } else {
        alert("Failed to delete product.");
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="container">
      <h2>Product List</h2>

      {error && <p className="error-message">{error}</p>}

      {products.length > 0 ? (
        <ul>
          {products.map((product, index) => (
            <li key={index} className="product">
              <div className="product-content">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Price: ₹{product.price}</p>
                <p>Category: {product.category}</p>
                <p>Address: {product.address}</p>
              </div>

              {product.imageData && (
                <img
                  src={`data:image/jpeg;base64,${product.imageData}`}
                  alt={product.name}
                />
              )}

              <div className="product-actions">
                <Link to={`/Sellerhome/productlist/edit/${product._id}`}>
                  <button>Edit</button>
                </Link>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
};

export default ProductList;
