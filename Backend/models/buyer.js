const mongoose = require("mongoose");

const buyerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const Buyer = mongoose.model("Buyer", buyerSchema);

module.exports = Buyer;
