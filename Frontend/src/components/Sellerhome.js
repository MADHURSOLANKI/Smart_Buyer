import React, { useState, useContext } from "react";
import "./Sellerhome.css"; // Create this CSS file for styling
import axios from "axios";
import { Link } from "react-router-dom";
import UserContext from "./UserContext";
import { useNavigate } from "react-router-dom";
const SellerHome = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // Always call hooks at the top level
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    email: user, // Ensure 'email' is set based on 'user'
  });
  const [imageFile, setImageFile] = useState(null); // State to store the selected file
  const [products, setProducts] = useState([]); // Stores list of products
  const [message, setMessage] = useState("");

  // If user is not logged in, handle rendering a fallback message
  if (!user) {
    return <div>Please login to continue.</div>;
  }

  // Handle form input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); // Store the selected file in state
  };
  const handleimage = () => {
    console.log("click kiya img pe");
    navigate("EditSeller");
  };
  // Handle form submission for adding a product
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if category is selected
    if (!productData.category) {
      setMessage("Please select a category.");
      return;
    }

    // Create a FormData object to send text and file data
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("category", productData.category);
    formData.append("email", productData.email); // Append the email
    if (imageFile) {
      formData.append("image", imageFile); // Append the selected image file
    }

    try {
      // Post request to your backend to save the product data along with the file
      const response = await axios.post(
        "http://localhost:5000/seller/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the header for file uploads
          },
        }
      );

      if (response.status === 200) {
        setMessage("Product added successfully!");
        setProducts([...products, response.data]); // Update products with the response data
        // Reset form fields
        setProductData({
          name: "",
          description: "",
          price: "",
          category: "",
          email: user.email, // Retain the email field after reset
        });
        setImageFile(null); // Reset file input
      } else {
        setMessage("Failed to add product");
      }
    } catch (err) {
      setMessage("sdfhds");
    }
  };

  return (
    <div>
      <div className="header">
        <h3>SmartBuyer</h3>
        <div className="img">
          <img onClick={handleimage} src="/images/loginicon.png" />
        </div>
      </div>

      <div className="seller-home-container">
        <h2>Welcome Seller! Add Your Products</h2>

        {/* Display message */}
        {message && <p>{message}</p>}

        {/* Form to add a new product */}
        <form onSubmit={handleSubmit} className="product-form">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={productData.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Product Description"
            value={productData.description}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={productData.price}
            onChange={handleChange}
            required
          />
          <select
            name="category"
            placeholder="Category"
            value={productData.category}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select category
            </option>

            <optgroup label="Home & Lifestyle">
              <option value="Furniture">Furniture</option>
              <option value="Home Appliances">Home Appliances</option>
              <option value="Gardening">Gardening</option>
            </optgroup>

            <optgroup label="Electronics & Gadgets">
              <option value="Electronic">Electronic</option>
            </optgroup>

            <optgroup label="Fashion & Beauty">
              <option value="Clothing">Clothing</option>
              <option value="Beauty">Beauty</option>
              <option value="Footwear">Footwear</option>
            </optgroup>

            <optgroup label="Books & Media">
              <option value="Books">Books</option>
            </optgroup>

            <optgroup label="Others">
              <option value="Toys">Toys</option>
              <option value="Groceries">Groceries</option>
            </optgroup>
          </select>

          {/* File input to select an image */}
          <input type="file" accept="image/*" onChange={handleFileChange} />

          <button type="submit">Add Product</button>
        </form>

        {/* Link to view products */}
        <Link to="./productlist">Your Products</Link>
      </div>
    </div>
  );
};

export default SellerHome;
