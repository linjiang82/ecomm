import { getErrorMessage } from "../helpers/dbErrorHandler";
import Enrollment from "../model/enrollment.model";

const read = (req, res) => {
  if (req.enrollment.student._id == req.auth._id)
    return res.json(req.enrollment);
};
const findEnrollment = async (req, res, next) => {
  try {
    const result = await Enrollment.find({
      course: req.course._id,
      student: req.auth._id,
    });
    if (result.length == 0) next();
    else res.json(result[0]);
  } catch (err) {
    res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

const isStudent = (req, res, next) => {
  if (req.enrollment.student._id == req.auth._id) next();
  else
    res.status(400).json({
      errror: "You are not authorized to view the enrollment",
    });
};

const enrollmentById = async (req, res, next, id) => {
  try {
    let enrollment = await Enrollment.findById(id)
      .populate({
        path: "course",
        populate: {
          path: "lessons",
          path: "instructor",
        },
      })
      .populate("student", "_id name")
      .exec();
    req.enrollment = enrollment;
    next();
  } catch (err) {
    res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

const create = async (req, res) => {
  let newEnroll = {
    course: req.course,
    student: req.auth,
  };
  newEnroll.lessonStatus = req.course.lessons.map((lesson) => {
    return { lesson: lesson, complete: false };
  });
  const enrollment = new Enrollment(newEnroll);
  try {
    let result = await enrollment.save();
    return res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

const complete = async (req, res) => {
  let updatedData = {};
  updatedData["lessonStatus.$.complete"] = req.body.complete;
  updatedData.updated = Date.now();
  if (req.body.courseCompleted) {
    updatedData.completed = req.body.courseCompleted;
  }
  try {
    let result = await Enrollment.updateOne(
      { "lessonStatus._id": req.body.lessonStatusId },
      { $set: updatedData }
    );
    res.json(result);
  } catch (err) {
    return res.status(404).json({
      error: getErrorMessage(err),
    });
  }
};

const listEnrolled = async (req, res) => {
  try {
    let result = await Enrollment.find({ student: req.auth._id })
      .sort({ completed: 1 })
      .populate("course", "_id name category");
    res.json(result);
  } catch (err) {
    return res.status(404).json({
      error: getErrorMessage(err),
    });
  }
};

export default {
  listEnrolled,
  complete,
  create,
  findEnrollment,
  isStudent,
  read,
  enrollmentById,
};
