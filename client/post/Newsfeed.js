import React, { useState, useEffect } from "react";
import { Card, Typography, Divider } from "@material-ui/core";
import NewPost from "./NewPost";
import PostList from "./PostList";
import { isAuthenticated } from "../auth/auth-helper";
import { listNewsFeed } from "../post/api-post";

const Newsfeed = () => {
  const [posts, setPosts] = useState([]);
  const jwt = isAuthenticated();
  const addPost = (post) => {
    let updatedPosts = [...posts];
    updatedPosts.unshift(post);
    setPosts(updatedPosts);
  };
  useEffect(() => {
    const abortCtrl = new AbortController();
    const signal = abortCtrl.signal;
    listNewsFeed({ userId: jwt.user._id }, { t: jwt.token }, signal).then(
      (data) => {
        if (data && data.error) console.log(data.error);
        else setPosts(data);
      }
    );
    return () => {
      abortCtrl.abort();
    };
  }, [jwt.user._id]);

  return (
    <Card>
      <Typography type='title'>Newsfeed</Typography>
      <Divider></Divider>
      <NewPost addUpdate={addPost}></NewPost>
      <Divider></Divider>
      <PostList posts={posts}></PostList>
    </Card>
  );
};

export default Newsfeed;
