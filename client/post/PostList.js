import React from "react";
import Post from "./Post";

const PostList = (props) => {
  return (
    <div>
      {props.posts.map((post, i) => (
        <Post key={i} post={post}></Post>
      ))}
    </div>
  );
};

export default PostList;
