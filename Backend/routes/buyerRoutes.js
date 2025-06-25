const express = require("express");
const router = express.Router();
const Buyer = require("../models/buyer");
const Product = require("../models/product");
const mongoose = require("mongoose");
// Route to fetch products by name
// In your backend (Node.js/Express)
router.get("/getUserByEmail/:email", async (req, res) => {
  try {
    const user = await Buyer.findOne({ email: req.params.email });
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send(`Server error: ${err.message}`);
  }
});

router.get("/products/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({
      category: { $regex: category, $options: "i" },
    });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No product found in this category" });
    }

    const productsWithImage = products.map((product) => ({
      ...product._doc,
      imageData: product.imageData
        ? product.imageData.toString("base64")
        : null,
    }));

    res.status(200).json(productsWithImage);
  } catch (err) {
    res.status(500).json({ error: `Error: ${err.message}` });
  }
});

// Ensure Product model is imported

router.post("/products/rate", async (req, res) => {
  try {
    const { productId, userId, rating } = req.body;

    // Convert userId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);
    console.log("Converted User ID:", userObjectId);

    // Find the product by ID
    const product = await Product.findById(productId);
    console.log("Product ID:", productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if the user has already rated this product
    const existingRating = product.ratings.find(
      (ratingObj) => ratingObj.user.toString() === userObjectId.toString()
    );

    if (existingRating) {
      // Update the existing rating
      existingRating.rating = rating;
      console.log("Updated existing rating:", rating);
    } else {
      // Add a new rating
      product.ratings.push({ user: userObjectId, rating });
      console.log("Added new rating:", rating);
    }

    // Save the product (average rating will be updated automatically)
    await product.save();

    res
      .status(200)
      .json({ message: "Rating added/updated successfully", product });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Error adding/updating rating" });
  }
});

router.post("/update", async (req, res) => {
  try {
    // Use findByIdAndUpdate to update the buyer document
    const response = await Buyer.findByIdAndUpdate(
      req.body._id, // Find by the _id field from the request body
      req.body, // Update the document with the data in the request body
      { new: true } // Return the updated document after modification
    );

    // If no document is found, send an error message
    if (!response) {
      return res.json("Update not successful");
    }

    // Respond with the updated buyer data
    res.json(response); // Ensure that response contains only document data
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    res.json(`Error: ${err.message}`);
  }
});

router.post("/edit", async (req, res) => {
  try {
    console.log(req.body); // Log the entire request body
    const { email } = req.body; // Ensure you're destructuring the email correctly
    console.log(`Received email: ${email}`); // Log the email for debugging

    const buyer = await Buyer.findOne({ email: email });
    if (!buyer) {
      return res.json("Buyer not found");
    }

    res.json(buyer);
  } catch (err) {
    res.status(500).send(`Error: ${err}`);
  }
});

router.get("/products/name/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const products = await Product.find({
      name: { $regex: name, $options: "i" },
    }); // Case-insensitive search

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No product found" });
    }

    const productsWithImage = products.map((product) => ({
      ...product._doc,
      imageData: product.imageData
        ? product.imageData.toString("base64")
        : null, // Handle missing image data
    }));

    res.status(200).json(productsWithImage);
  } catch (err) {
    res.status(500).json({ error: `Error: ${err.message}` });
  }
});

// User login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Buyer.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (password === user.password) {
      res.status(200).send("Successfully login occurred");
    } else {
      res.status(401).send("Incorrect password");
    }
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
});

// User signup route
router.post("/", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }

    const newBuyer = new Buyer({
      fullName,
      email,
      password,
    });

    await newBuyer.save();
    res.status(200).json("Signup successfully");
  } catch (err) {
    res.status(500).json({ error: `Error: ${err.message}` });
  }
});

module.exports = router;
