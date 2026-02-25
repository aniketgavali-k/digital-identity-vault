const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = req.body.email.trim().toLowerCase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 🔥 Generate OTP as STRING
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      otp: otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
      isVerified: false
    });

    await user.save();

    // Send email
    await sendEmail(email, otp);

    res.status(201).json({
      message: "User registered. OTP sent to email 📩"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
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
         process.env.JWT_SECRET,
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
   };

exports.verifyOtp = async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const otp = req.body.otp.trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    console.log("Entered OTP:", otp);
    console.log("Stored OTP:", user.otp);
    console.log("Expires At:", user.otpExpires);
    console.log("Current Time:", Date.now());

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP Expired" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.json({ message: "Account verified successfully ✅" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};