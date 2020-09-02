import express from "express";
import userCtrl from "../controllers/user.controllers";
import authCtrl from "../controllers/auth.controller";

const router = express.Router();

///////////////////////////
//!!!The route order MATTERS!!!//
///////////////////////////
router.route("/api/users").get(userCtrl.list).post(userCtrl.create);

router
  .route("/api/users/follow")
  .put(authCtrl.requireSignin, userCtrl.addFollowing, userCtrl.addFollower);
router
  .route("/api/users/unfollow")
  .put(
    authCtrl.requireSignin,
    userCtrl.removeFollowing,
    userCtrl.removeFollower
  );
router
  .route("/api/users/findpeople/:userId")
  .get(authCtrl.requireSignin, userCtrl.findpeople);
router
  .route("/api/users/:userId")
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);

router
  .route("/api/users/photo/:userId")
  .get(userCtrl.photo, userCtrl.defaultPhoto);

router.param("userId", userCtrl.userById);

export default router;
