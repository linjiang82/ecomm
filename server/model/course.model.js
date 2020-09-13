import mongoose from "mongoose";
import User from "./user.model";

const CourseSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: "Course name is required" },
  description: { type: String, trim: true },
  image: { data: Buffer, contentType: String },
  category: { type: String, required: "Category is required" },
  published: { type: Boolean, default: false },
  instructor: { type: mongoose.Schema.ObjectId, ref: User },
  created: { type: Date, default: Date.now },
  updated: { type: Date },
});

export default mongoose.model("Course", CourseSchema);
