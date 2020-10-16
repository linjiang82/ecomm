import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  CardHeader,
  Button,
  Icon,
  CardMedia,
  Typography,
  List,
  ListItemText,
  ListItem,
  ListItemAvatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/auth-helper";
import { listCourse, newLesson, removeCourse, update } from "./api-course";
import NewLesson from "./NewLesson";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 800,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
  }),
  flex: {
    display: "flex",
    marginBottom: 20,
  },
  card: {
    padding: "24px 40px 40px",
  },
  subheading: {
    margin: "0px",
    color: theme.palette.openTitle,
  },
  details: {
    margin: "16px",
  },
  sub: {
    display: "block",
    margin: "3px 0px 5px 0px",
    fontSize: "0.9em",
  },
  media: {
    height: 190,
    display: "inline-block",
    width: "100%",
    marginLeft: "16px",
  },
  icon: {
    verticalAlign: "sub",
  },
  category: {
    color: "#5c5c5c",
    fontSize: "0.9em",
    padding: "3px 5px",
    backgroundColor: "#dbdbdb",
    borderRadius: "0.2em",
    marginTop: 5,
  },
  action: {
    margin: "10px 0px",
    display: "flex",
    justifyContent: "flex-end",
  },
  statSpan: {
    margin: "7px 10px 0 10px",
    alignItems: "center",
    color: "#616161",
    display: "inline-flex",
    "& svg": {
      marginRight: 10,
      color: "#b6ab9a",
    },
  },
  enroll: {
    float: "right",
  },
  image: {
    height: 200,
    width: 200,
  },
}));

const Course = ({ match }) => {
  const classes = useStyles();
  const [course, setCourse] = useState({ instructor: {}, lessons: [{}] });
  const [values, setValues] = useState({
    error: "",
    redirect: false,
    openDeleteDiaglog: false,
    openPublishDiaglog: false,
  });
  const jwt = isAuthenticated();
  useEffect(() => {
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
  const addNewLesson = (course) => {
    setCourse(course);
  };
  const openPublishDiaglog = () => {
    setValues({ ...values, openPublishDiaglog: true });
  };
  const openDeleteDiaglog = () => {
    setValues({ ...values, openDeleteDiaglog: true });
  };
  const handleCancel = () => {
    setValues({
      ...values,
      openDeleteDiaglog: false,
      openPublishDiaglog: false,
    });
  };
  const togglePublish = () => {
    const courseData = new FormData();
    courseData.append("published", !course.published);
    update(
      { courseId: match.params.courseId },
      { t: jwt.token },
      courseData
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCourse({ ...course, published: !course.published });
        setValues({ ...values, openPublishDiaglog: false });
      }
    });
  };
  const deleteCourse = () => {
    removeCourse({ courseId: match.params.courseId }, { t: jwt.token }).then(
      (data) => {
        if (data && data.error) {
          setValues({ ...values, error: data.error });
        } else setValues({ ...values, redirect: true });
      }
    );
  };
  const imageUrl = `/api/courses/photo/${
    match.params.courseId
  }?${new Date().getTime()}`;
  if (values.redirect) return <Redirect to="/teach/courses/"></Redirect>;
  return (
    <div className={classes.root}>
      <Card>
        <CardHeader
          title={course.name}
          subheader={
            <div>
              <Link
                className={classes.sub}
                to={"/user/" + course.instructor._id}
              >
                By {course.instructor.name}
              </Link>
              <span>{course.category}</span>
              <p>{course.description}</p>
            </div>
          }
          action={
            <>
              {jwt.user &&
                course.instructor &&
                jwt.user._id == course.instructor._id && (
                  <span className={classes.action}>
                    <Link to={"/course/edit/" + match.params.courseId}>
                      <Button color="secondary">
                        <Icon>edit</Icon>
                      </Button>
                    </Link>
                    <Tooltip
                      title={
                        course.lessons.length == 0
                          ? "At least add one lesson"
                          : ""
                      }
                      placement="bottom"
                    >
                      <div>
                        <Button
                          variant="outlined"
                          color="secondary"
                          disabled={course.lessons.length == 0}
                          onClick={openPublishDiaglog}
                        >
                          {course.published ? "UNPUBLISH" : "PUBLISH"}
                        </Button>
                      </div>
                    </Tooltip>
                    {!course.published && (
                      <Button color="secondary" onClick={openDeleteDiaglog}>
                        <Icon>delete</Icon>
                      </Button>
                    )}
                  </span>
                )}
            </>
          }
        ></CardHeader>
        <CardMedia
          className={classes.image}
          image={imageUrl}
          title={course.name}
        />
        <br />
        <CardHeader
          title={
            <Typography variant="h6" className={classes.subheading}>
              Lessons
            </Typography>
          }
          subheader={
            <div>
              <Typography variant="subtitle1">
                {course.lessons.length}{" "}
                {course.lessons.length == 0 || course.lessons.length == 1
                  ? "lesson"
                  : "lessons"}
              </Typography>
              <List>
                {course.lessons &&
                  course.lessons.map((lesson, idx) => (
                    <ListItem key={idx}>
                      <ListItemAvatar>
                        <Avatar>{idx + 1}</Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={lesson.title}></ListItemText>
                    </ListItem>
                  ))}
                <Divider variant="inset" component="li" />
              </List>
            </div>
          }
          action={
            <span>
              <NewLesson
                courseId={match.params.courseId}
                addNewLesson={addNewLesson}
              ></NewLesson>
            </span>
          }
        ></CardHeader>
      </Card>
      <Dialog open={values.openPublishDiaglog} onClose={handleCancel}>
        <DialogTitle>
          <Typography variant="h6">Publish {course.name}</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {course.published
              ? "Unpublishing will lose all enrollment, are you sure?"
              : " Publishing your course will make it live to students for enrollment.  Make sure all lessons are added and ready for publishing.  "}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={togglePublish} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={values.openDeleteDiaglog} onClose={handleCancel}>
        <DialogTitle>
          <Typography variant="h6">Delete {course.name}</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please confirm to delete {course.name}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={deleteCourse} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Course;
