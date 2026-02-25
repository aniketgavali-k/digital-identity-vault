const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    

    await user.save();

// Generate token
const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);


res.status(201).json({
  message: "User registered successfully ✅",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  }
});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      "process.env.JWT_SECRET",
      { expiresIn: "1d" }
    );

res.json({
  message: "Login successful ✅",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  }
});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed 🔐",
    userId: req.user.id
  });
});
router.post("/verify", async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    console.log("Entered OTP:", otp);
    console.log("Stored OTP:", user.otp);
    console.log("Expires:", user.otpExpires);

    if (user.otp !== otp) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified successfully" });
});
const { register, login, verifyOtp } = require("../controllers/authController");

router.post("/verify-otp", verifyOtp);

module.exports = router;