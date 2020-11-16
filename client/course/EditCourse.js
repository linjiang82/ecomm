import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth/auth-helper";
import { listCourse, update } from "./api-course";
import {
  IconButton,
  Icon,
  Divider,
  Card,
  CardHeader,
  Typography,
  TextField,
  Button,
  CardMedia,
  List,
  ListSubheader,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";
import ArrowUp from "@material-ui/icons/ArrowUpward";
import FileUpload from "@material-ui/icons/AddPhotoAlternate";
import { Redirect, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: "24px 40px 40px",
  },
  flex: {
    display: "flex",
    marginBottom: 20,
  },
  input: {
    display: "none",
  },
  textfield: {
    width: 350,
  },
  media: {
    height: 250,
    display: "inline-block",
    width: "50%",
    marginLeft: "16px",
  },
  detail: {
    margin: "16px",
  },
  button: {
    marginTop: 20,
  },
  arrowup: {
    border: "2px solid #f57c00",
    marginLeft: 3,
    marginTop: 10,
    padding: 4,
  },
}));

const EditCourse = ({ match }) => {
  const classes = useStyles();
  const [course, setCourse] = useState({
    lessons: [],
    instructor: {},
    name: "",
    category: "",
    description: "",
  });
  const [values, setValues] = useState({
    redirect: false,
    error: "",
  });
  const jwt = isAuthenticated();
  useEffect(() => {
    const jwt = isAuthenticated();
    const abortCtrl = new AbortController();
    const signal = abortCtrl.signal;

    listCourse({ courseId: match.params.courseId }, signal).then((data) => {
      if (data && data.error) console.log(data.error);
      else setCourse(data);
    });
    return () => {
      abortCtrl.abort();
    };
  }, [match.params.courseId]);
  const handleChange = (text) => (e) => {
    let value = text === "image" ? e.target.files[0] : e.target.value;
    setCourse({ ...course, [text]: value });
  };
  const handleSubmit = () => {
    const updatedCourse = new FormData();
    course.name && updatedCourse.append("name", course.name);
    course.category && updatedCourse.append("category", course.category);
    course.description &&
      updatedCourse.append("description", course.description);
    course.image && updatedCourse.append("image", course.image);
    course.lessons &&
      updatedCourse.append("lessons", JSON.stringify(course.lessons));
    update(
      { courseId: match.params.courseId },
      { t: jwt.token },
      updatedCourse
    ).then((data) => {
      if (data && data.error) setValues({ ...values, error: data.error });
      else setValues({ ...values, redirect: true });
    });
  };
  const deleteLesson = (idx) => (e) => {
    let lessons = course.lessons.slice();
    lessons.splice(idx, 1);
    setCourse({ ...course, lessons: lessons });
  };
  const handleLessonChange = (name, idx) => (e) => {
    let lessons = course.lessons.slice();
    lessons[idx][name] = e.target.value;
    setCourse({ ...course, lessons: lessons });
  };
  const handleSwapIdx = (idx) => (e) => {
    let lessons = course.lessons.slice();
    lessons.splice(idx - 1, 0, ...lessons.splice(idx, 1));
    setCourse({ ...course, lessons: lessons });
  };
  if (values.redirect)
    return <Redirect to={`/course/${course._id}`}></Redirect>;
  return (
    <Card className={classes.card}>
      <CardHeader
        title={
          <TextField
            margin="dense"
            fullWidth
            label="Title"
            type="text"
            value={course.name}
            onChange={handleChange("name")}
          ></TextField>
        }
        subheader={
          <div>
            <Link to={`/user/${course.instructor._id}`}>
              {course.instructor.name}
            </Link>
            <TextField
              margin="dense"
              fullWidth
              label="Category"
              type="text"
              value={course.category}
              onChange={handleChange("category")}
            ></TextField>
          </div>
        }
        action={
          <Button variant="contained" color="secondary" onClick={handleSubmit}>
            Save
          </Button>
        }
      ></CardHeader>
      <div className={classes.flex}>
        <CardMedia
          className={classes.media}
          image={`/api/courses/photo/${match.params.courseId}`}
        ></CardMedia>
        <div className={classes.detail}>
          <TextField
            className={classes.textfield}
            multiline
            rows="5"
            label="Description"
            type="text"
            value={course.description}
            onChange={handleChange("description")}
          ></TextField>
          <br />
          <input
            className={classes.input}
            type="file"
            id="icon-button-file"
            accept="image/*"
            onChange={handleChange("image")}
          />
          <label htmlFor="icon-button-file">
            <Button
              variant="outlined"
              className={classes.button}
              color="secondary"
              component="span"
            >
              Change Photo
              <FileUpload />
            </Button>
            <span>{course.image ? course.image.name : ""}</span>
          </label>
        </div>
      </div>
      <Divider />
      <List
        subheader={
          <ListSubheader component="div">
            Lessons - Edit and Rearrange
          </ListSubheader>
        }
      >
        {course.lessons.map((lesson, idx) => (
          <ListItem key={idx}>
            <span>
              <ListItemAvatar>
                <Avatar>{idx + 1}</Avatar>
              </ListItemAvatar>
              {idx !== 0 && (
                <ListItemAvatar>
                  <IconButton
                    className={classes.arrowup}
                    color="primary"
                    onClick={handleSwapIdx(idx)}
                  >
                    <ArrowUp />
                  </IconButton>
                </ListItemAvatar>
              )}
            </span>
            <ListItemText>
              <TextField
                label="Title"
                fullWidth
                value={lesson.title}
                onChange={handleLessonChange("title", idx)}
              ></TextField>
              <TextField
                label="Content"
                fullWidth
                value={lesson.content}
                onChange={handleLessonChange("content", idx)}
              ></TextField>
              <TextField
                label="Resource URL"
                fullWidth
                value={lesson.resource_url}
                onChange={handleLessonChange("resource_url", idx)}
              ></TextField>
            </ListItemText>
            <ListItemSecondaryAction>
              {!course.published && (
                <Button onClick={deleteLesson(idx)}>
                  <Icon>delete</Icon>
                </Button>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};
export default EditCourse;
