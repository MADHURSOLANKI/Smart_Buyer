import React, { useContext, useState } from "react";
import "./Buyerhome.css"; // Make sure to style it correctly
import { useNavigate } from "react-router-dom";
import UserContext from "./UserContext";
import Footer from "./Footer.js";
import Slider from "./Slider.js";
const Buyerhome = () => {
  const { user } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSearch(e.target.value);
  };
  const handlelogin = (e) => {
    navigate("/Buyerhome/EditBuyer");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/product/search", { state: { query: search } });
  };

  const handleCategoryClick = (category) => {
    setSearch(category);
    navigate("/product/category", { state: { query: category } });
  };

  // Define categories with image paths and names
  const categories = [
    { name: "Home Appliances", image: "/images/home-appliances.jpg" },
    { name: "Electronic", image: "/images/electronics.jpg" },
    { name: "Clothing", image: "/images/clothing.jpg" },
    { name: "Furniture", image: "/images/furniture.jpg" },
    { name: "Beauty", image: "/images/beauty.jpg" },
    { name: "Sports", image: "/images/sports.jpg" },
    { name: "Books", image: "/images/books.jpg" },
    { name: "Toys", image: "/images/toys.jpg" },
    { name: "Groceries", image: "/images/groceries.jpg" },
    { name: "Gardening", image: "/images/gardening.jpg" },
  ];

  return (
    <div className="buyer">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <a className="navbar-brand" href="#">
              <i className="bi bi-cart-fill"></i>
            </a>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="#"
                  onClick={handlelogin}
                >
                  Profile
                </a>
              </li>
            </ul>
            <form className="d-flex" role="search" onSubmit={handleSubmit}>
              <input
                className="form-control me-2"
                type="search"
                onChange={handleChange}
                value={search}
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
      <br />
      <Slider />
      <br />

      <div className="categories-grid">
        {categories.map((category) => (
          <div
            key={category.name}
            className="category-item"
            onClick={() => handleCategoryClick(category.name)}
          >
            <img
              src={category.image}
              alt={category.name}
              className="category-image"
            />
            <p className="category-name">{category.name}</p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Buyerhome;
