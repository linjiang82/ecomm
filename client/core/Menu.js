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
import { LibraryBooks as Library } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  teach: {
    display: "block",
    float: "right",
  },
}));
const Menu = withRouter(({ history }) => {
  const classes = useStyles();
  const isActive = (history, path) =>
    history.location.pathname == path
      ? { color: "#ff4081" }
      : { color: "#ffffff" };
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' color='inherit'>
          MERN Classroom
        </Typography>
        <Link to='/'>
          <IconButton aria-label='Home' style={isActive(history, "/")}>
            <HomeIcon />
          </IconButton>
        </Link>
        <Link to='/users/'>
          <Button style={isActive(history, "/users/")}>Users</Button>
        </Link>
        <div style={{ position: "absolute", right: "8px" }}>
          {isAuthenticated() ? (
            <span className={classes.teach}>
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
              {isAuthenticated().user.educator && (
                <Link to='/teach/courses/'>
                  <Button style={isActive(history, "/teach/courses/")}>
                    <Library /> Teach{" "}
                  </Button>
                </Link>
              )}
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
        </div>
      </Toolbar>
    </AppBar>
  );
});

export default Menu;
