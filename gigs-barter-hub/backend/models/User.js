const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
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

    bio: { type: String, default: "" },
    headline: { type: String, maxlength: 100 },
    location: { type: String, default: "" },

    skills: { type: [String], default: [] }, 
    languages: { type: [String], default: [] },

    experience: [
      {
        title: String,
        company: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],

    education: [
      {
        institution: String,
        degree: String,
        startYear: Number,
        endYear: Number,
      },
    ],

    socialLinks: {
      linkedin: {
        type: String,
        match: /^https?:\/\/(www\.)?linkedin\.com\/.+$/,
      },
      github: {
        type: String,
        match: /^https?:\/\/(www\.)?github\.com\/.+$/,
      },
      website: {
        type: String,
        match: /^https?:\/\/.+$/,
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
