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
  const [user, setUser] = useState({});
  const [redirectToSignin, setRedirectToSignin] = useState(false);

  useEffect(() => {
    const abortCntl = new AbortController();
    const signal = abortCntl.signal;
    const jwt = isAuthenticated();
    read({ userId: match.params.userId }, { t: jwt.token }, signal).then(
      (data) => {
        if (data && data.error) setRedirectToSignin(true);
        else setUser(data);
      }
    );
    //return to cleanup
    return () => {
      abortCntl.abort();
    };
  }, [match.params.userId]);

  if (redirectToSignin) return <Redirect to='/signin'></Redirect>;
  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant='h6' className={classes.title}>
        Profile
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <Person />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={user.name}
            secondary={user.email}></ListItemText>
          {isAuthenticated().user && isAuthenticated().user._id == user._id && (
            <ListItemSecondaryAction>
              <Link to={"/user/edit/" + user._id}>
                <IconButton aria-label='Edit' color='primary'>
                  <Edit />
                </IconButton>
              </Link>
              <DeleteUser userId={user._id}></DeleteUser>
            </ListItemSecondaryAction>
          )}
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={"Joined: " + new Date(user.created).toDateString()}
          />
        </ListItem>
      </List>
    </Paper>
  );
};

export default Profile;
