import Course from "../model/course.model";
import formidable from "formidable";
import fs from "fs";
import { getErrorMessage } from "../helpers/dbErrorHandler";

const create = async (req, res) => {
  try {
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
      let result = await course.save();
      res.json(result);
    });
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

const photo = (req, res) => {
  try {
    if (req.profile.image.data) {
      res.set({ "Content-Type": req.profile.image.contentType });
      res.send(req.profile.image.data);
    }
  } catch (err) {
    return res.send(err);
  }
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
    req.profile = result;
    next();
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

export default { create, photo, courseById };
