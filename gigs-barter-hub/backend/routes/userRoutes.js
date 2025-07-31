const express = require("express");
const router = express.Router();
const User = require("../models/User");

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

module.exports = router;
