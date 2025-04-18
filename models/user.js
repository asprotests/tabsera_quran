const mongoose = require("../config/mongo");

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    userName: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    country: String,
    gender: { type: String, enum: ["Male", "Female"] },
    language: String,
    confirmed: { type: Boolean, default: false },
    confirmationCode: String,
    role: { type: String, default: "student" },
    googleLinked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
