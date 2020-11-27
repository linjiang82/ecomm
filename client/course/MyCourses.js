import React, { useEffect, useState } from "react";
import { isAuthenticated } from "../auth/auth-helper";
import { listByInstructor } from "../course/api-course";
import {
  Paper,
  Avatar,
  ListItem,
  List,
  ListItemAvatar,
  ListItemText,
  Typography,
  Button,
  Icon,
} from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(10),
  }),
  icon: {
    marginRight: "8px",
  },
  media: {
    height: 0,
  },
  new: {
    float: "right",
  },
  title: {
    margin: `${theme.spacing(1)}px 0 ${theme.spacing(3)}px ${theme.spacing(
      1
    )}px`,
    color: theme.palette.protectedTitle,
    fontSize: "1.2em",
  },
}));

const MyCourses = () => {
  const classes = useStyles();
  const [courses, setCourses] = useState([]);
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    const jwt = isAuthenticated();
    const abortCntl = new AbortController();
    const signal = abortCntl.signal;
    listByInstructor({ userId: jwt.user._id }, { t: jwt.token }, signal).then(
      (data) => {
        if (data && data.error) {
          console.log(data.error);
          setRedirect(true);
        } else setCourses(data);
      }
    );
    return () => {
      abortCntl.abort();
    };
  }, []);
  if (redirect) return <Redirect to="/signin" />;
  return (
    <Paper className={classes.root} elevation={4}>
      <Typography className={classes.title}>
        My Courses
        <span className={classes.new}>
          <Link to="/teach/course/new">
            <Button color="primary" variant="contained">
              <Icon className={classes.icon}>add_box</Icon> New Course
            </Button>
          </Link>
        </span>
      </Typography>
      <List>
        {courses.map((item, i) => {
          return (
            <Link key={i} to={"/course/" + item._id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    src={
                      "/api/courses/photo/" +
                      item._id +
                      "?" +
                      new Date().getTime()
                    }
                  ></Avatar>
                </ListItemAvatar>
                <ListItemText
                  className={classes.colorTextPrimary}
                  primary={item.name}
                  secondary={item.description}
                />
                <br />
              </ListItem>
            </Link>
          );
        })}
      </List>
    </Paper>
  );
};

export default MyCourses;
