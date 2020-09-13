import express from "express";
import authCtrl from "../controllers/auth.controller";
import userCtrl from "../controllers/user.controllers";
import courseCtrl from "../controllers/course.controller";

const router = express.Router();

router
  .route("/api/courses/by/:userId")
  .get(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    courseCtrl.listByInstructor
  )
  .post(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    userCtrl.isEducator,
    courseCtrl.create
  );

router
  .route("/api/courses/photo/:courseId")
  .get(courseCtrl.photo, courseCtrl.defaultPhoto);
router.param("userId", userCtrl.userById);
router.param("courseId", courseCtrl.courseById);
export default router;
