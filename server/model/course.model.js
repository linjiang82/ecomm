import mongoose from "mongoose";
import User from "./user.model";

const LessonSchema = new mongoose.Schema({
  title: String,
  content: String,
  resource_url: String,
});

const Lesson = mongoose.model("Lesson", LessonSchema);

const CourseSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: "Course name is required" },
  description: { type: String, trim: true },
  image: { data: Buffer, contentType: String },
  category: { type: String, required: "Category is required" },
  published: { type: Boolean, default: false },
  instructor: { type: mongoose.Schema.ObjectId, ref: User },
  created: { type: Date, default: Date.now },
  updated: { type: Date },
  lessons: [LessonSchema],
});

const Course = mongoose.model("Course", CourseSchema);
export { Course as default, Lesson };
