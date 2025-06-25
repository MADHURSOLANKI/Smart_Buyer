import { useParams } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Edit = () => {
  const { id } = useParams(); // Get product id from URL
  const [product, setProduct] = useState(null); // State to store product
  const [error, setError] = useState(""); // State to store errors
  const [categories, setCategories] = useState([
    "Electronics",
    "Clothing",
    "Home Appliances",
    "Books",
    "Furniture",
    // Add more categories here as needed
  ]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/seller/products/edit/${id}`
        );
        if (response.status === 200) {
          setProduct(response.data);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError(`Error: ${err.message}`);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `http://localhost:5000/seller/products/edit/${id}`,
        product
      );
      if (response.status === 200) {
        alert("Product updated successfully");
      } else {
        setError("Error updating product");
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          {product && (
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) =>
                    setProduct({ ...product, name: e.target.value })
                  }
                />
              </label>
              <label>
                Description:
                <input
                  type="text"
                  value={product.description}
                  onChange={(e) =>
                    setProduct({ ...product, description: e.target.value })
                  }
                />
              </label>
              <label>
                Price:
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) =>
                    setProduct({ ...product, price: e.target.value })
                  }
                />
              </label>
              <label>
                Category:
                <select
                  value={product.category}
                  onChange={(e) =>
                    setProduct({ ...product, category: e.target.value })
                  }
                >
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit">Save</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Edit;
