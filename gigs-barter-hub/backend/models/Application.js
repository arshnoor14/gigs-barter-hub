const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Gig",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["applied", "accepted", "rejected"],
    default: "applied",
  },
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);