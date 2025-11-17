const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Application = require("../models/Application"); 
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      token, 
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        applicationTokens: newUser.applicationTokens 
      },
    });

  } catch (err) {
    console.error(err);
    if (err.code === 11000) { 
        return res.status(400).json({ message: "Email already exists." });
    }
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

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

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        applicationTokens: user.applicationTokens 
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); 
    if (!user) {
      return res.status(4404).json({ message: "User not found" });
    }

    res.status(200).json(user); 
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.bio = req.body.bio || user.bio;
      user.headline = req.body.headline || user.headline;
      user.skills = req.body.skills || user.skills;
      user.languages = req.body.languages || user.languages;
      user.experience = req.body.experience || user.experience;
      user.education = req.body.education || user.education;
      user.socialLinks = req.body.socialLinks || user.socialLinks;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.get("/:id/applications", protect, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(401).json({ message: "Not authorized to view these applications" });
    }
    const applications = await Application.find({ user: req.user.id }).populate("gig", "title");
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;