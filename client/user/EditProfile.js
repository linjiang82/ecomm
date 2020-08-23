import React, { useState, useEffect } from "react";
import { update, read } from "./api-user";
import { makeStyles } from "@material-ui/core/styles";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated, clearJWT } from "../auth/auth-helper";
import {
  Card,
  Icon,
  Typography,
  TextField,
  CardActions,
  Button,
  ListItem,
  ListItemAvatar,
  Avatar,
  Dialog,
  CardContent,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { Person } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
  error: {
    verticalAlign: "middle",
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  submit: {
    margin: "auto",
    marginBottom: theme.spacing(2),
  },
  filename: {
    marginLeft: theme.spacing[2],
  },
  avatar: {
    margin: "auto",
  },
}));
const EditProfile = ({ match }) => {
  const jwt = isAuthenticated();
  const classes = useStyles();
  const [values, setValues] = useState({
    name: "",
    email: "",
    photo: "",
    about: "",
    password: undefined,
    error: "",
    redirectToProfile: false,
  });
  useEffect(() => {
    const abortCntl = new AbortController();
    const signal = abortCntl.signal;
    read({ userId: match.params.userId }, { t: jwt.token }, signal).then(
      (data) => {
        if (data && data.error) setValues({ ...values, error: data.error });
        else
          setValues({
            ...values,
            name: data.name,
            about: data.about,
            email: data.email,
          });
      }
    );
    return () => {
      abortCntl.abort();
    };
  }, [match.params.userId]);
  const handleChange = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    setValues({ ...values, [name]: value });
  };
  const clickSubmit = () => {
    let userData = new FormData();
    values.name && userData.append("name", values.name);
    values.email && userData.append("email", values.email);
    values.password && userData.append("password", values.password);
    values.about && userData.append("about", values.about);
    values.photo && userData.append("photo", values.photo);
    update({ userId: match.params.userId }, { t: jwt.token }, userData).then(
      (data) => {
        if (data.error) setValues({ ...values, error: data.error });
        else {
          setValues({ ...values, error: "", redirectToProfile: true });
        }
      }
    );
  };
  const photoUrl = `/api/users/photo/${
    match.params.userId
  }?${new Date().getTime()}`;
  if (values.redirectToProfile)
    return <Redirect to={"/user/" + jwt.user._id}></Redirect>;
  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant='h6' className={classes.title}>
            Edit Profile
          </Typography>
          <ListItem>
            <ListItemAvatar className={classes.avatar}>
              <Avatar src={photoUrl}></Avatar>
            </ListItemAvatar>
          </ListItem>
          <input
            accept='image/*'
            type='file'
            onChange={handleChange("photo")}
            style={{ display: "none" }}
            id='icon-button-file'
          />
          <label htmlFor='icon-button-file'>
            <Button variant='contained' color='default' component='span'>
              Upload
            </Button>
          </label>
          <span>{values.photo ? values.photo.name : ""}</span>
          <br />
          <TextField
            id='name'
            label='Name'
            className={classes.textField}
            value={values.name}
            onChange={handleChange("name")}
            margin='normal'
          />
          <br />
          <TextField
            id='multiline-flexible'
            label='About'
            multiline
            row='2'
            className={classes.textField}
            value={values.about}
            onChange={handleChange("about")}
            margin='normal'
          />
          <br />
          <TextField
            id='email'
            type='email'
            label='Email'
            className={classes.textField}
            value={values.email}
            onChange={handleChange("email")}
            margin='normal'
          />
          <br />
          <TextField
            id='password'
            type='password'
            label='Password'
            className={classes.textField}
            value={values.password}
            onChange={handleChange("password")}
            margin='normal'
          />
          <br />
          {values.error && (
            <Typography component='p' color='error'>
              <Icon color='error' className={classes.error}>
                error
              </Icon>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            color='primary'
            variant='contained'
            onClick={clickSubmit}
            className={classes.submit}>
            Submit
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default EditProfile;
