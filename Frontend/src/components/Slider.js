import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./slider.css";

const Slider = () => {
  return (
    <div
      id="carouselExampleCaptions"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        {[1, 2, 3].map((num, index) => (
          <div
            key={num}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img
              src={`/images/slider-${num}.jpg`}
              className="d-block w-100"
              alt={`Slide ${num}`}
              style={{ height: "500px", zIndex: "1", opacity: "0.9" }}
            />
            <div
              className="carousel-caption d-none d-md-block"
              style={{ zIndex: "2" }}
            >
              <div className="custom-carousel-content">
                <h1>
                  <span>Smart Buyer: Compare & Save </span>
                  Find the Best Local Market Prices
                </h1>
                <p>
                  We provide a smart and efficient way to compare product prices
                  in local markets, helping you make informed purchasing
                  decisions and save money effortlessly.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Slider;
