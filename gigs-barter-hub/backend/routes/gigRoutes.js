const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Gig = require("../models/Gig");
const Application = require("../models/Application");

router.get("/", async (req, res) => {
  try {
    const gigs = await Gig.find().populate("user", "name");
    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/my-gigs", protect, async (req, res) => {
  try {
    const gigs = await Gig.find({ user: req.user.id });
    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate("user", "name");
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }
    res.status(200).json(gig);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { title, description, price } = req.body;

    const newGig = new Gig({
      title,
      description,
      price,
      user: req.user.id,
    });

    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized to update this gig" });
    }

    gig.title = req.body.title || gig.title;
    gig.description = req.body.description || gig.description;
    gig.price = req.body.price || gig.price;

    const updatedGig = await gig.save();
    res.status(200).json(updatedGig);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized to delete this gig" });
    }

    await Gig.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Gig removed successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/:id/apply", protect, async (req, res) => {
  try {
    const gigId = req.params.id;
    const userId = req.user.id;

    const existingApplication = await Application.findOne({ gig: gigId, user: userId });
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this gig." });
    }

    const newApplication = new Application({
      gig: gigId,
      user: userId,
    });

    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully.", application: newApplication });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
