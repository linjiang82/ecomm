import React from "react";
import PropTypes from "prop-types";
import { isAuthenticated } from "../auth/auth-helper";
import Enroll from "../enrollment/Enroll";
import { Link, Redirect } from "react-router-dom";
import {
  GridList,
  GridListTile,
  GridListTileBar,
  Button,
  ListSubheader,
  makeStyles,
} from "@material-ui/core";

const Courses = ({ courses }) => {
  return (
    <GridList cellHeight={160} cols={2}>
      <GridListTile key="Subheader" cols={2} style={{ height: "auto" }}>
        <ListSubheader>
          <h3>All Courses</h3>
        </ListSubheader>
      </GridListTile>
      {courses.map((course) => (
        <GridListTile key={course._id} cols={1}>
          <Link to={"/course/" + course._id}>
            <img src={`/api/courses/photo/${course._id}`} />
          </Link>
          <GridListTileBar
            title={<Link to={"/course/" + course._id}>{course.name}</Link>}
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
      ))}
    </GridList>
  );
};

Courses.propTypes = {
  courses: PropTypes.array.isRequired,
};
export default Courses;
