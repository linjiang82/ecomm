import React from "react";
import { isAuthenticated, clearJWT } from "../auth/auth-helper";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
} from "@material-ui/core";
import { Home as HomeIcon } from "@material-ui/icons";

const Menu = withRouter(({ history }) => {
  const isActive = (history, path) =>
    history.location.pathname == path
      ? { color: "#ff4081" }
      : { color: "#ffffff" };
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' color='inherit'>
          MERN Skeleton
        </Typography>
        <Link to='/'>
          <IconButton aria-label='Home' style={isActive(history, "/")}>
            <HomeIcon />
          </IconButton>
        </Link>
        <Link to='/users'>
          <Button style={isActive(history, "/users")}>Users</Button>
        </Link>
        {isAuthenticated() ? (
          <span>
            <Link to={"/user/" + isAuthenticated().user._id}>
              <Button
                style={isActive(
                  history,
                  "/user/" + isAuthenticated().user._id
                )}>
                {" "}
                Profile{" "}
              </Button>
            </Link>
            <Link to='/signout'>
              <Button
                onClick={() => {
                  clearJWT(() => history.push("/"));
                }}>
                {" "}
                Sign Out{" "}
              </Button>
            </Link>
          </span>
        ) : (
          <span>
            <Link to='/signup'>
              <Button style={isActive(history, "/signup")}> Sign Up </Button>
            </Link>
            <Link to='/signin'>
              <Button style={isActive(history, "/signin")}> Sign In </Button>
            </Link>
          </span>
        )}
      </Toolbar>
    </AppBar>
  );
});

export default Menu;
