import React from "react";
import PropTypes from "prop-types";
import { isAuthenticated } from "../auth/auth-helper";
import Enroll from "../enrollment/Enroll";
import { Link, Redirect } from "react-router-dom";
import {
  Card,
  GridList,
  GridListTile,
  GridListTileBar,
  Button,
  ListSubheader,
  makeStyles,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "90%",
    margin: "auto",
    marginTop: 20,
    marginBottom: theme.spacing(2),
    padding: 20,
    backgroundColor: "#ffffff",
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
  gridList: {
    width: "100%",
    minHeight: 200,
    padding: "16px 0 0px",
  },
  tile: {
    textAlign: "center",
    border: "1px solid #cecece",
    backgroundColor: "#04040c",
  },
  image: {
    height: "100%",
  },
  tileBar: {
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    textAlign: "left",
  },
  tileTitle: {
    fontSize: "1.1em",
    marginBottom: "5px",
    color: "#fffde7",
    display: "block",
  },
  action: {
    margin: "0 10px",
  },
}));
const Courses = ({ courses }) => {
  console.log(courses);
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <Typography variant="h5" component="h2">
        All Courses
      </Typography>
      <GridList className={classes.gridList} cellHeight={160} cols={2}>
        {courses.length == 0 ? (
          <GridListTile cols={2}>
            <ListSubheader>
              <h4>No new courses.</h4>
            </ListSubheader>
          </GridListTile>
        ) : (
          courses.map((course) => (
            <GridListTile className={classes.tile} key={course._id} cols={1}>
              <Link to={"/course/" + course._id}>
                <img
                  className={classes.image}
                  src={`/api/courses/photo/${course._id}`}
                />
              </Link>
              <GridListTileBar
                className={classes.tileBar}
                title={
                  <Link
                    to={"/course/" + course._id}
                    className={classes.tileTitle}
                  >
                    {course.name}
                  </Link>
                }
                subtitle={course.category}
                actionIcon={
                  isAuthenticated() ? (
                    <Enroll courseId={course._id}></Enroll>
                  ) : (
                    <Link to="/signin">
                      <Button variant="contained" className={classes.icon}>
                        SIGNIN
                      </Button>
                    </Link>
                  )
                }
              ></GridListTileBar>
            </GridListTile>
          ))
        )}
      </GridList>
    </Card>
  );
};

Courses.propTypes = {
  courses: PropTypes.array.isRequired,
};
export default Courses;
