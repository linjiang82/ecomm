import React from "react";
import Post from "./Post";
import PropTypes from "prop-types";

const PostList = (props) => {
  return (
    <div>
      {props.posts.map((post, i) => (
        <Post key={i} post={post} onRemove={props.removeUpdate}></Post>
      ))}
    </div>
  );
};

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  removeUpdate: PropTypes.func.isRequired,
};

export default PostList;
