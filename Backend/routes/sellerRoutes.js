const express = require("express");
const router = express.Router();
const Seller = require("../models/seller");
const Product = require("../models/product");
const multer = require("multer");

// Set up multer to store images in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// GET /products/:id - Retrieve a product by ID
// GET /products/email/:email - Retrieve products by email
// GET /products/:id - Retrieve a product by ID
router.post("/update", async (req, res) => {
  try {
    const { email, fullName, password, address, shopName, shopType } = req.body;

    const seller = await Seller.findOneAndUpdate(
      { email: email }, // Find seller by email
      { fullName, password, address, shopName, shopType }, // Update fields
      { new: true } // Return updated seller info
    );

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.json(seller); // Send updated seller back to client
  } catch (err) {
    res.status(500).json({ error: `Error: ${err}` });
  }
});
router.get("/shop/:email", async (req, res) => {
  try {
    console.log("Fetching shop details");
    const { email } = req.params;
    const data = await Seller.findOne({ email: email }); // Use findOne for a single document

    if (!data) {
      return res.status(404).send("No shop data found for this email");
    }

    res.status(200).send(data); // Send the found data with a success status
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`); // Send proper status for server errors
  }
});
// POST /products/:id/rate - Add a rating to a product

router.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request params
    const response = await Product.findByIdAndDelete(id);

    if (!response) {
      return res.status(404).json({ message: "Product not found" }); // Handle case where product is not found
    }

    res.status(200).json({ message: "Product deleted successfully" }); // Send success response
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: err.message }); // Send error response
  }
});

router.patch("/products/edit/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get product id from URL
    const updatedProductData = req.body; // Get updated product data from request body

    // Find the product by ID and update it
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updatedProductData,
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure that the update adheres to the schema
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct); // Return the updated product
  } catch (err) {
    res.status(500).json({ message: `Error updating product: ${err.message}` });
  }
});

router.get("/products/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error occurred while fetching product" });
  }
});

router.get("/products/email/:email", async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const products = await Product.find({ email });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ error: "No products found for this email" });
    }

    // Convert image buffer to Base64
    const productsWithImage = products.map((product) => ({
      ...product._doc,
      imageData: product.imageData.toString("base64"), // Convert buffer to Base64
    }));

    res.status(200).json(productsWithImage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error occurred while fetching products" });
  }
});

// POST /products - Add a new product with image as buffer
router.post("/products", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, email } = req.body;

    // Check if all required fields are provided
    if (!req.file || !name || !description || !price || !category || !email) {
      return res.status(400).json({ error: "Enter all inputs" });
    }

    // Create new product object with image stored as buffer
    const newProduct = new Product({
      imageData: req.file.buffer, // Store image as buffer
      name,
      description,
      price,
      category,
      email,
    });

    // Save the product in the database
    await newProduct.save();
    res.status(200).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while creating product" });
  }
});

// POST /login - Login a seller
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: "Fill all the fields" });
    }

    // Find the seller by email
    const seller = await Seller.findOne({ email });

    // If seller does not exist
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    // Check if the password matches
    if (seller.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // If everything is correct, login successful
    res.status(200).json({ message: "Login successful", seller });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred during login" });
  }
});
router.post("/info", async (req, res) => {
  try {
    console.log(req.body);
    const { email } = req.body;
    console.log(email);
    const response = await Seller.findOne({ email: email });
    if (!response) {
      res.send("Seller not found");
    }
    console.log(`Elvish bhaii ${response}`);
    res.json(response);
  } catch (err) {
    res.json(`Error: ${err}`);
  }
});
// POST /seller (registration route) - Register a new seller
router.post("/", async (req, res) => {
  try {
    const { fullName, email, password, address, shopName, shopType } = req.body;

    // Ensure all fields are filled
    if (
      !fullName ||
      !email ||
      !password ||
      !address ||
      !shopName ||
      !shopType
    ) {
      return res.status(400).json({ error: "Fill all the fields" });
    }

    // Create a new seller instance
    const newSeller = new Seller({
      fullName,
      email,
      password,
      address,
      shopName,
      shopType,
    });

    // Save the seller to the database
    await newSeller.save();
    res.status(200).json(newSeller);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the seller" });
  }
});

module.exports = router;
