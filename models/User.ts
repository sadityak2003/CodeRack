// models/User.ts
import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    avatarUrl: { type: String },
    description: { type: String }, // New field
    leetcode: { type: String },    // New field
    gfg: { type: String },         // New field
    github: { type: String },      // New field
    linkedin: { type: String },    // New field
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", UserSchema);

export default User;
