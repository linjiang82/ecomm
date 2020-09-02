import express from "express";
import authCtrl from "../controllers/auth.controller";
import userCtrl from "../controllers/user.controllers";
import postCtrl from "../controllers/post.controller";

const router = express.Router();

router
  .route("/api/posts/new/:userId")
  .post(authCtrl.requireSignin, postCtrl.create);
router
  .route("/api/posts/feed/:userId")
  .get(authCtrl.requireSignin, postCtrl.listNewsFeed);
router
  .route("/api/posts/by/:userId")
  .get(authCtrl.requireSignin, postCtrl.listByUser);
router.route("/api/posts/photo/:postId").get(postCtrl.photo);

router.param("userId", userCtrl.userById);
router.param("postId", postCtrl.postById);

export default router;
