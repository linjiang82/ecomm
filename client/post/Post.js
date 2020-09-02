import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Avatar,
  IconButton,
  CardContent,
  Typography,
  CardActions,
  Divider,
} from "@material-ui/core";
import { Delete, Favorite, FavoriteBorder, Comment } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { isAuthenticated } from "../auth/auth-helper";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    marginBottom: theme.spacing(3),
    backgroundColor: "rgba(0, 0, 0, 0.06)",
  },
  cardContent: {
    backgroundColor: "white",
    padding: `${theme.spacing(2)}px 0px`,
  },
  cardHeader: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  text: {
    margin: theme.spacing(2),
  },
  photo: {
    textAlign: "center",
    backgroundColor: "#f2f5f4",
    padding: theme.spacing(1),
  },
  media: {
    height: 200,
  },
  button: {
    margin: theme.spacing(1),
  },
}));
const Post = (props) => {
  const classes = useStyles();

  return (
    <div>
      <Card>
        <CardHeader
          avatar={
            <Avatar
              src={"/api/users/photo/" + props.post.postedBy._id}
              action={
                props.post.postedBy._id === isAuthenticated().user._id && (
                  <IconButton onClick={deletePost}>
                    <Delete />
                  </IconButton>
                )
              }></Avatar>
          }></CardHeader>
        <CardContent className={classes.cardContent}>
          <Typography component='p' className={classes.text}>
            {props.post.text}
          </Typography>
          {props.post.photo && (
            <div className={classes.photo}>
              <img
                className={classes.media}
                src={"/api/posts/photo/" + props.post._id}
              />
            </div>
          )}
        </CardContent>
        <CardActions>
          {values.like ? (
            <IconButton
              onClick={clickLike}
              className={classes.button}
              aria-label='Like'
              color='secondary'>
              <Favorite />
            </IconButton>
          ) : (
            <IconButton
              onClick={clickLike}
              className={classes.button}
              aria-label='Unlike'
              color='secondary'>
              <FavoriteBorder />
            </IconButton>
          )}{" "}
          <span>{values.likes}</span>
          <IconButton
            className={classes.button}
            aria-label='Comment'
            color='secondary'>
            <Comment />
          </IconButton>{" "}
          <span>{values.comments.length}</span>
        </CardActions>
        <Divider />
        <Comments
          postId={props.post._id}
          comments={values.comments}
          updateComments={updateComments}
        />
      </Card>
    </div>
  );
};

export default Post;
