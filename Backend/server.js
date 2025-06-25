const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Ensure the path is correct
const sellerRoutes = require("./routes/sellerRoutes"); // Import the seller routes
const buyerRoutes = require("./routes/buyerRoutes");
const crypto = require("crypto"); // For generating OTPs
const nodemailer = require("nodemailer"); // For sending OTPs

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Connect to the database
connectDB();

// Use the seller and buyer routes
app.use("/seller", sellerRoutes);
app.use("/buyer", buyerRoutes);

// In-memory store for OTPs (For production, store in DB)
let otpStore = {};

// Configure nodemailer for sending OTPs
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service
  auth: {
    user: "madhurrajput415@gmail.com", // Replace with your email
    pass: "ilwrsarwnhknnzsi", // Replace with your app-specific password
  },
});

// Endpoint to send OTP
app.post("/send-otp", (req, res) => {
  const { email } = req.body;
  const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
  otpStore[email] = otp; // Store the OTP with the email as the key

  // Send the OTP to the user's email
  transporter.sendMail(
    {
      from: "madhurrajput415@gmail.com",
      to: email,
      subject: "Your OTP for Signup",
      text: `Your OTP code is ${otp}`,
    },
    (err, info) => {
      if (err) {
        return res.status(500).json({ error: "Error sending OTP" });
      }
      res.status(200).json({ message: "OTP sent successfully" });
    }
  );
});

// Endpoint to verify OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore[email];

  // Verify OTP
  if (storedOtp && storedOtp === otp) {
    delete otpStore[email]; // Optionally remove OTP after verification
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ error: "Invalid OTP" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
