import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import unicornbikeImg from "./../assets/images/unicornbike.jpg";
import { listPublished } from "../course/api-course";
import { listEnrolled } from "../enrollment/api-enrollment";
import Courses from "../course/Courses";
import { isAuthenticated } from "../auth/auth-helper";
import MyEnrollments from "../enrollment/MyEnrollments";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    marginTop: theme.spacing(10),
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
  },
  media: {
    minHeight: 400,
  },
  extraTop: {
    marginTop: 96,
  },
}));

const Home = () => {
  const classes = useStyles();
  const [publishedCourses, setPublishedCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [newCourse, setNewCourse] = useState([]);
  const jwt = isAuthenticated();
  useEffect(() => {
    const AbortCtrl = new AbortController();
    const signal = AbortCtrl.signal;
    listPublished(signal).then((data) => {
      if (data && data.error) console.log(data.error);
      else setPublishedCourses(data);
    });
    listEnrolled({ t: jwt.token }, signal).then((data) => {
      if (data.error) console.log(data.error);
      else setEnrolled(data);
    });
    setNewCourse(
      publishedCourses.filter(
        (item) => !enrolled.some((e) => e.course._id == item._id)
      )
    );
    return () => {
      AbortCtrl.abort();
    };
  }, []);
  if (publishedCourses.length == 0)
    return (
      <Card className={classes.card}>
        <Typography variant="h6" className={classes.title}>
          MERN Classroom
        </Typography>
        <CardMedia
          className={classes.media}
          image={unicornbikeImg}
          title="Unicorn Bike"
        ></CardMedia>
        <CardContent>
          <Typography variant="body2" component="p">
            Welcome to the MERN Classroom home page
          </Typography>
        </CardContent>
      </Card>
    );
  else
    return (
      <div className={classes.extraTop}>
        <MyEnrollments enrolled={enrolled}></MyEnrollments>
        <Courses courses={newCourse}></Courses>
      </div>
    );
};

export default Home;
