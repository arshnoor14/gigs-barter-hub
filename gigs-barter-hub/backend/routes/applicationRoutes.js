// backend/routes/applicationRoutes.js
const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Gig = require("../models/Gig");
const { protect } = require("../middleware/authMiddleware");

// @desc    Get all applications for a specific gig (for the gig owner)
// @route   GET /api/applications/gig/:gigId
// @access  Private
router.get("/gig/:gigId", protect, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Check if the logged-in user is the owner of the gig
    if (gig.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Find applications for this gig and populate user info
    const applications = await Application.find({ gig: req.params.gigId })
      .populate("user", "name email");
      
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Update an application's status (accept/reject)
// @route   PUT /api/applications/:id
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const { status } = req.body; // status should be "accepted" or "rejected"

    if (!status || !['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status provided." });
    }

    const application = await Application.findById(req.params.id).populate("gig");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if the logged-in user is the owner of the gig
    if (application.gig.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;