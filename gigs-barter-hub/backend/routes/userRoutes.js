const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware"); // Import the new middleware

// Route: POST /api/users/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = new User({ name, email, password, role });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

// Route: POST /api/users/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login successful", token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});
router.get("/profile", protect, async (req, res) => {
  res.status(200).json(req.user);
});

router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.bio = req.body.bio || user.bio;
      user.skills = req.body.skills || user.skills;
      user.location = req.body.location || user.location;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;