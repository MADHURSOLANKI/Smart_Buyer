const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/smartbuyer", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if the connection fails
  }
};

module.exports = connectDB;
