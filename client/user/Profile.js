import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
  ListItemSecondaryAction,
  IconButton,
  Divider,
} from "@material-ui/core";
import { Edit, Person } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { isAuthenticated } from "../auth/auth-helper";
import { read } from "./api-user";
import DeleteUser from "./DeleteUser";
import FollowButton from "./FollowButton";
import { values } from "lodash";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
  }),
  title: {
    marginTop: theme.spacing(3),
    color: theme.palette.protectedTitle,
  },
}));

const Profile = ({ match }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    user: { name: "", email: "", following: [], followers: [] },
    following: false,
  });
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const jwt = isAuthenticated();

  useEffect(() => {
    const abortCntl = new AbortController();
    const signal = abortCntl.signal;
    read({ userId: match.params.userId }, { t: jwt.token }, signal).then(
      (data) => {
        console.log(data);
        if (data && data.error) setRedirectToSignin(true);
        else {
          let following = checkFollow(data);
          setValues({ ...values, user: data, following: following });
        }
      }
    );
    //return to cleanup
    return () => {
      abortCntl.abort();
    };
  }, [match.params.userId]);

  //follow button props
  const checkFollow = (user) => {
    return user.followers.some((follower) => follower._id == jwt.user._id);
  };
  const clickFollowButton = (toggleFollow) => {
    toggleFollow(
      { followId: match.params.userId },
      { t: jwt.token, userId: jwt.user._id }
    ).then((data) => {
      if (data.error) setValues({ ...values, error: data.error });
      else setValues({ ...values, following: !values.following });
    });
  };
  //trailing a time value to bypass caching behavior
  const photoUrl = `/api/users/photo/${
    match.params.userId
  }?${new Date().getTime()}`;

  if (redirectToSignin) return <Redirect to='/signin'></Redirect>;
  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant='h6' className={classes.title}>
        Profile
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar src={photoUrl}></Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={values.user.name}
            secondary={values.user.email}></ListItemText>
          {isAuthenticated() &&
          isAuthenticated().user._id == values.user._id ? (
            <ListItemSecondaryAction>
              <Link to={"/user/edit/" + values.user._id}>
                <IconButton aria-label='Edit' color='primary'>
                  <Edit />
                </IconButton>
              </Link>
              <DeleteUser userId={values.user._id}></DeleteUser>
            </ListItemSecondaryAction>
          ) : (
            <FollowButton
              following={values.following}
              onButtonClick={clickFollowButton}></FollowButton>
          )}
        </ListItem>
        <ListItem>
          <ListItemText primary={values.user.about}></ListItemText>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={"Joined: " + new Date(values.user.created).toDateString()}
          />
        </ListItem>
      </List>
    </Paper>
  );
};

export default Profile;
