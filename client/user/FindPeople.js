import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { findpeople, follow } from "./api-user";
import { isAuthenticated } from "../auth/auth-helper";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItemAvatar,
  ListItem,
  ListItemText,
  Button,
  Avatar,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Snackbar,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";

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
const FindPeople = () => {
  const classes = useStyles();
  const [data, setData] = useState({
    users: [],
    open: false,
    followMessage: "",
  });
  const jwt = isAuthenticated();
  useEffect(() => {
    const abortCntl = new AbortController();
    const signal = abortCntl.signal;
    findpeople({ userId: jwt.user._id }, { t: jwt.token }, signal).then((v) => {
      console.log(v);
      if (v && v.error) {
        console.log(v.error);
      } else setData({ ...data, users: v });
    });
    return () => {
      abortCntl.abort();
    };
  }, []);
  const clickFollow = (user, i) => {
    follow({ followId: user._id }, { userId: jwt.user._id, t: jwt.token }).then(
      (v) => {
        if (v.error) console.log(v.error);
        else {
          let toFollow = data.users;
          toFollow.splice(i, 1);
          setData({
            ...data,
            users: toFollow,
            open: true,
            followMessage: `Following ${user.name}`,
          });
        }
      }
    );
  };
  const handleRequstClose = () => {
    setData({ ...data, open: false });
  };

  return (
    <List>
      {data.users.map((item, i) => {
        return (
          <span key={i}>
            <ListItem>
              <ListItemAvatar className={classes.avatar}>
                <Avatar src={"/api/users/photo/" + item._id} />
              </ListItemAvatar>
              <ListItemText primary={item.name} />
              <ListItemSecondaryAction className={classes.follow}>
                <Link to={"/user/" + item._id}>
                  <IconButton
                    variant='contained'
                    color='secondary'
                    className={classes.viewButton}>
                    <VisibilityIcon />
                  </IconButton>
                </Link>
                <Button
                  aria-label='Follow'
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    clickFollow(item, i);
                  }}>
                  Follow
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          </span>
        );
      })}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={data.open}
        onClose={handleRequstClose}
        autoHideDuration={3000}
        message={
          <span className={classes.snack}>{data.followMessage}</span>
        }></Snackbar>
    </List>
  );
};

export default FindPeople;
