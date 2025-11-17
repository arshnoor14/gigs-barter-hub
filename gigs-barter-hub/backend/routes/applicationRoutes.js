
const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Gig = require("../models/Gig");
const { protect } = require("../middleware/authMiddleware");


router.get("/gig/:gigId", protect, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const applications = await Application.find({ gig: req.params.gigId })
      .populate("user", "name email");
      
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const { status } = req.body; 

    if (!status || !['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status provided." });
    }

    const application = await Application.findById(req.params.id).populate("gig");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

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