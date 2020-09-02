import Post from "../model/post.model";
import fs from "fs";
import formidable from "formidable";
import { getErrorMessage } from "../helpers/dbErrorHandler";

const listNewsFeed = async (req, res) => {
  let following = req.profile.following;
  following.push(req.profile._id);
  try {
    const posts = await Post.find({ postedBy: { $in: following } })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .sort("-created")
      .exec();
    res.json(posts);
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};
const listByUser = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.profile._id })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .sort("-created")
      .exec();
    res.json(posts);
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

const create = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Image could not be uploaded" });
    }
    let post = new Post(fields);
    post.postedBy = req.profile;
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    try {
      let result = await post.save();
      res.json(result);
    } catch (err) {
      return res.status(400).json({ error: getErrorMessage(err) });
    }
  });
};

const photo = async (req, res) => {
  res.set("Content-Type", req.post.photo.contentType);
  return res.send(req.post.photo.data);
};
const postById = async (req, res, next, id) => {
  try {
    let post = await (await Post.findById(id))
      .populated("postedBy", "_id name")
      .exec();
    if (!post) return res.status(400).json({ error: "Post not exist" });
    req.post = post;
    next();
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};
export default { listNewsFeed, listByUser, create, postById, photo };
