// backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) =>
  jwt.sign(
    { id },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "7d" }
  );

/* ---------------- REGISTER ---------------- */
exports.register = async (req, res) => {
  try {
    console.log("REGISTER HIT:", req.body);

    const {
      firstName,
      lastName,
      email,
      registrationNumber,
      password,
      role
    } = req.body;

    if (!firstName || !lastName || !email || !registrationNumber || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      registrationNumber,
      password: hashed,
      role: role || "student", // ✅ default role
    });

    const savedUser = await user.save();
    console.log("USER SAVED TO DB:", savedUser._id);

    const token = generateToken(savedUser._id);

    res.status(201).json({
      user: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        registrationNumber: savedUser.registrationNumber,
        role: savedUser.role,
      },
      token,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- LOGIN ---------------- */
exports.login = async (req, res) => {
  try {
    console.log("LOGIN HIT:", req.body.email);

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        registrationNumber: user.registrationNumber,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- CURRENT USER ---------------- */
exports.getCurrentUser = (req, res) => {
  res.json(req.user);
};
