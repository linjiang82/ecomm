import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
import CompletedIcon from "@material-ui/icons/VerifiedUser";
import InProgressIcon from "@material-ui/icons/DonutLarge";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "90%",
    margin: "auto",
    marginTop: 20,
    marginBottom: theme.spacing(2),
    padding: 20,
    backgroundColor: "#ffffff",
  },
  enrolledCard: {
    backgroundColor: "#616161",
  },
  enrolledTitle: {
    color: "#efefef",
    marginBottom: 5,
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
  container: {
    minWidth: "100%",
    paddingBottom: "14px",
  },
  gridList: {
    width: "100%",
    minHeight: 100,
    padding: "12px 0 10px",
  },
  tile: {
    textAlign: "center",
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
  progress: {
    color: "#b4f8b4",
  },
}));
const MyEnrollments = ({ enrolled }) => {
  const classes = useStyles();

  return (
    <Card className={`${classes.card} ${classes.enrolledCard}`}>
      <Typography variant="h6" component="h2" className={classes.enrolledTitle}>
        Courses you are enrolled in
      </Typography>
      <GridList cols={4} cellHeight={120} className={classes.gridList}>
        {enrolled.map((enrollment) => (
          <GridListTile
            key={enrollment.course._id}
            cols={1}
            className={classes.tile}
          >
            <Link to={"/course/" + enrollment.course._id}>
              <img
                src={`/api/courses/photo/${enrollment.course._id}`}
                className={classes.image}
              />
            </Link>
            <GridListTileBar
              className={classes.tileBar}
              title={
                <Link
                  to={"/course/" + enrollment.course._id}
                  className={classes.tileTitle}
                >
                  {enrollment.course.name}
                </Link>
              }
              actionIcon={
                <div className={classes.action}>
                  {enrollment.completed ? (
                    <CompletedIcon color="secondary" />
                  ) : (
                    <InProgressIcon className={classes.progress} />
                  )}
                </div>
              }
            ></GridListTileBar>
          </GridListTile>
        ))}
      </GridList>
    </Card>
  );
};

export default MyEnrollments;
