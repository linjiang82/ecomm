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
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { isAuthenticated } from "../auth/auth-helper";
import PropTypes from "prop-types";
import Comments from "./Comments";
import { like, unlike, remove } from "./api-post";

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
  const jwt = isAuthenticated();
  const checkLike = (likes) => {
    return likes.indexOf(jwt.user._id) !== -1;
  };
  const [values, setValues] = useState({
    like: checkLike(props.post.likes),
    qtyOfLikes: props.post.likes.length,
    comments: props.post.comments,
  });
  const clickLike = () => {
    const callApi = values.like ? unlike : like;
    callApi({ userId: jwt.user._id }, { t: jwt.token }, props.post._id).then(
      (data) => {
        if (data && data.error) console.log(data.error);
        else {
          console.log(data);
          setValues({
            ...values,
            like: !values.like,
            qtyOfLikes: data.likes.length,
          });
        }
      }
    );
  };
  const deletePost = () => {
    remove({ postId: props.post._id }, { t: jwt.token }).then((data) => {
      if (data && data.error) console.log(data.error);
      else props.onRemove(props.post);
    });
  };
  return (
    <div>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar
              src={"/api/users/photo/" + props.post.postedBy._id}></Avatar>
          }
          action={
            props.post.postedBy._id == jwt.user._id && (
              <IconButton onClick={deletePost}>
                <Delete />
              </IconButton>
            )
          }
          title={
            <Link to={"/user/" + props.post.postedBy._id}>
              {props.post.postedBy.name}
            </Link>
          }
          subheader={new Date(props.post.created).toDateString()}
          className={classes.cardHeader}></CardHeader>
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
          // updateComments={updateComments}
        />
      </Card>
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default Post;
