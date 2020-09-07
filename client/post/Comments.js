import React, { useState, useEffect } from "react";
import { Card, CardHeader, Avatar, TextField, Icon } from "@material-ui/core";
import { isAuthenticated } from "../auth/auth-helper";
import { makeStyles } from "@material-ui/core/styles";
import { comment, uncomment } from "./api-post";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  smallAvatar: {
    width: 25,
    height: 25,
  },
  commentField: {
    width: "96%",
  },
  commentText: {
    backgroundColor: "white",
    padding: theme.spacing(1),
    margin: `2px ${theme.spacing(2)}px 2px 2px`,
  },
  commentDate: {
    display: "block",
    color: "gray",
    fontSize: "0.8em",
  },
  commentDelete: {
    fontSize: "1.6em",
    verticalAlign: "middle",
    cursor: "pointer",
  },
}));

const Comments = (props) => {
  const classes = useStyles();
  const jwt = isAuthenticated();
  const [text, setText] = useState("");
  useEffect(() => {}, []);

  const addComment = (e) => {
    if (e.keyCode == 13 && e.target.value) {
      e.preventDefault();
      comment({ userId: jwt.user._id }, { t: jwt.token }, props.postId, {
        text: text,
      }).then((data) => {
        if (data && data.error) {
          console.log(data.error);
        }
        setText("");
        props.updateComments(data.comments);
      });
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleDelete = (item) => (e) => {
    uncomment({}, { t: jwt.token }, props.postId, item).then((data) => {
      if (data && data.error) console.log(data.error);
      props.updateComments(data.comments);
    });
  };

  const commentBody = (item) => {
    return (
      <p className={classes.commentText}>
        <Link to={"/user/" + item.postedBy._id}>{item.postedBy.name}</Link>
        <br />
        {item.text}
        <br />
        <span className={classes.commentDate}>
          {new Date(item.created).toDateString()}
          {jwt.user._id == item.postedBy._id && (
            <span>
              {" "}
              |
              <Icon
                className={classes.commentDelete}
                onClick={handleDelete(item)}>
                delete
              </Icon>
            </span>
          )}
        </span>
      </p>
    );
  };

  return (
    <div>
      <Card>
        <CardHeader
          avatar={
            <Avatar
              className={classes.smallAvatar}
              src={"api/users/photo/" + jwt.user._id}
            />
          }
          title={
            <TextField
              onKeyDown={addComment}
              multiline
              value={text}
              onChange={handleChange}
              placeholder='Write something...'
              className={classes.commentField}
              margin='normal'
            />
          }></CardHeader>
        {props.comments.map((item, i) => {
          return (
            <CardHeader
              avatar={<Avatar src={"/api/users/photo/" + item.postedBy._id} />}
              title={commentBody(item)}
              key={i}
              className={classes.cardHeader}
            />
          );
        })}
      </Card>
    </div>
  );
};

Comments.propTypes = {
  postId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  updateComments: PropTypes.func.isRequired,
};

export default Comments;
