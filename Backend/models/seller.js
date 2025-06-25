const mongoose = require("mongoose");

// Define the schema for the Seller model
const sellerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  shopName: { type: String, required: true },
  shopType: { type: String, required: true },
});

// Create and export the Seller model
const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;
