import express from "express";
import authCtrl from "../controllers/auth.controller";
import courseCtrl from "../controllers/course.controller";
import enrollCtrl from "../controllers/enrollment.controller";

const router = express.Router();

router
  .route("/api/enrollment/new/:courseId")
  .post(authCtrl.requireSignin, enrollCtrl.findEnrollment, enrollCtrl.create);

router
  .route("/api/enrollment/complete/:enrollmentId")
  .put(authCtrl.requireSignin, enrollCtrl.isStudent, enrollCtrl.complete);

router
  .route("/api/enrollment/enrolled")
  .get(authCtrl.requireSignin, enrollCtrl.listEnrolled);

router
  .route("/api/enrollment/:enrollmentId")
  .get(authCtrl.requireSignin, enrollCtrl.isStudent, enrollCtrl.read);

router.param("courseId", courseCtrl.courseById);
router.param("enrollmentId", enrollCtrl.enrollmentById);

export default router;
