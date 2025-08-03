const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Import bcryptjs

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["client", "freelancer"],
    default: "client",
  },
  // New fields for user profile
  bio: {
    type: String,
    default: "",
  },
  skills: {
    type: [String], // An array of strings for skills
    default: [],
  },
  location: {
    type: String,
    default: "",
  }
}, { timestamps: true });

// Middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare the entered password with the stored hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);