import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  postedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  comments: [
    {
      text: String,
      created: { type: Date, default: Date.now },
      postedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
    },
  ],
  text: { type: String, required: true },
  photo: { data: Buffer, contentType: String },
});

export default mongoose.model("Post", PostSchema);
