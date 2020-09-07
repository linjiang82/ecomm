import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import PropsTypes from "prop-types";
import { GridList, GridListTile, Avatar, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    background: theme.palette.background.paper,
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: "auto",
  },
  gridList: {
    width: 500,
    height: 220,
  },
  tileText: {
    textAlign: "center",
    marginTop: 10,
  },
}));

const FollowGrid = (props) => {
  const classes = useStyles();

  return (
    <div>
      <GridList cellHeight={160} className={classes.gridList}>
        {props.people.map((person, i) => (
          <GridListTile key={i} style={{ height: 120 }}>
            <Link to={"/user/" + person._id}>
              <Avatar
                className={classes.bigAvatar}
                src={`/api/users/photo/${person._id}`}></Avatar>
              <Typography className={classes.tileText}>
                {person.name}
              </Typography>
            </Link>
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
};

FollowGrid.propsTypes = {
  people: PropsTypes.array.isRequired,
};
export default FollowGrid;
