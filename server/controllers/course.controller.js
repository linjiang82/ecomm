import Course from "../model/course.model";
import formidable from "formidable";
import fs from "fs";
import { getErrorMessage } from "../helpers/dbErrorHandler";
import profileImage from "../../client/assets/images/default.png";
import extend from "lodash/extend";

const create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Could not upload images",
      });
    }
    let course = new Course(fields);
    course.instructor = req.profile;
    if (files.image) {
      course.image.data = fs.readFileSync(files.image.path);
      course.image.contentType = files.image.type;
    }
    try {
      let result = await course.save();
      return res.json(result);
    } catch (err) {
      return res.status(400).json({
        error: getErrorMessage(err),
      });
    }
  });
};

const update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (error, fields, files) => {
    if (error) {
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }
    let course = req.course;
    course = extend(course, fields);
    if (fields.lessons) {
      course.lessons = JSON.parse(fields.lessons);
    }
    course.updated = Date.now();
    if (files.image) {
      course.image.data = fs.readFileSync(files.image.path);
      course.image.contentType = files.image.type;
    }
    try {
      await course.save();
      return res.json(course);
    } catch (err) {
      return res.status(400).json({ error: getErrorMessage(err) });
    }
  });
};

const isInstructor = (req, res, next) => {
  let isInstructor =
    req.course && req.auth && req.course.instructor._id == req.auth._id;
  if (!isInstructor)
    return res.status(403).json({ error: "User not authorised" });
  next();
};
const listByInstructor = async (req, res) => {
  try {
    let result = await Course.find({ instructor: req.profile._id })
      .populate("instructor", "_id name")
      .exec();
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

const listCourse = async (req, res) => {
  try {
    if (req.course) {
      req.course.image = undefined;
      res.json(req.course);
    }
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

const remove = async (req, res) => {
  try {
    let result = await Course.findByIdAndDelete(req.course._id);
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

const photo = (req, res, next) => {
  try {
    if (req.course.image.data) {
      res.set({ "Content-Type": req.course.image.contentType });
      return res.send(req.course.image.data);
    }
    next();
  } catch (err) {
    return res.send(err);
  }
};

const newLesson = async (req, res) => {
  let lesson = req.body;
  try {
    let result = await Course.findByIdAndUpdate(
      req.course._id,
      {
        $push: { lessons: lesson },
        updated: Date.now(),
      },
      { new: true }
    )
      .populate("instructor", "_id name")
      .exec();
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};
const listPublished = async (req, res) => {
  try {
    const result = await Course.find({ published: true })
      .populate("instructor", "_id name")
      .exec();
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};
const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd() + profileImage);
};

const courseById = async (req, res, next, id) => {
  try {
    let result = await Course.findById(id)
      .populate("instructor", "_id name")
      .exec();
    if (!result) {
      return res.status(400).json({
        error: "Course not found",
      });
    }
    req.course = result;
    next();
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

export default {
  create,
  photo,
  courseById,
  listByInstructor,
  defaultPhoto,
  listCourse,
  isInstructor,
  newLesson,
  update,
  remove,
  listPublished,
};
