import mongoose from "mongoose";
import Course, { Lesson } from "./course.model";
import User from "./user.model";

const EnrollSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.ObjectId,
    ref: Course,
  },
  student: {
    type: mongoose.Schema.ObjectId,
    ref: User,
  },
  lessonStatus: [
    {
      lesson: {
        type: mongoose.Schema.ObjectId,
        ref: Lesson,
      },
      complete: Boolean,
    },
  ],
  enrolled: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  completed: Date,
});

export default mongoose.model("Enrollment", EnrollSchema);
