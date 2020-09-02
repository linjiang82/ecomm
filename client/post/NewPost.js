import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Button,
  Avatar,
  TextField,
} from "@material-ui/core";
import { PhotoCamera } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { create } from "./api-post";
import { isAuthenticated } from "../auth/auth-helper";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#efefef",
    padding: `${theme.spacing(3)}px 0px 1px`,
  },
  card: {
    maxWidth: 600,
    margin: "auto",
    marginBottom: theme.spacing(3),
    backgroundColor: "rgba(65, 150, 136, 0.09)",
    boxShadow: "none",
  },
  cardContent: {
    backgroundColor: "white",
    paddingTop: 0,
    paddingBottom: 0,
  },
  cardHeader: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  photoButton: {
    height: 30,
    marginBottom: 5,
  },
  input: {
    display: "none",
  },
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    width: "90%",
  },
  submit: {
    margin: theme.spacing(2),
  },
  filename: {
    verticalAlign: "super",
  },
}));
const NewPost = (props) => {
  const classes = useStyles();
  let jwt = isAuthenticated();
  const [values, setValues] = useState({
    error: "",
    text: "",
    photo: "",
    user: {},
  });
  useEffect(() => {
    setValues({ ...values, user: jwt.user });
  }, []);
  const photoURL = values.user.userId
    ? `/api/user/photo/${userId}`
    : `/api/user/defaultPhoto`;
  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };
  const clickPost = () => {
    let postData = new FormData();
    postData.append("text", values.text);
    postData.append("photo", values.photo);
    create({ userId: values.user._id }, { t: jwt.token }, postData).then(
      (data) => {
        if (data.error) setValues({ ...values, error: data.error });
        setValues({ ...values, text: "", photo: "" });
        props.addUpdate(data);
      }
    );
  };
  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          className={classes.cardHeader}
          avatar={<Avatar src={photoURL}></Avatar>}
          title={values.user.name}></CardHeader>
        <CardContent className={classes.cardContent}>
          <TextField
            placeholder='Share your thoughts ...'
            multiline
            rows='3'
            value={values.text}
            onChange={handleChange("text")}
            className={classes.textField}
            margin='normal'></TextField>
          <input
            type='file'
            accept='image/*'
            onChange={handleChange("photo")}
            id='icon-button-file'
            className={classes.input}></input>
          <label htmlFor='icon-button-file'>
            <IconButton
              color='secondary'
              className={classes.photoButton}
              component='span'>
              <PhotoCamera></PhotoCamera>
            </IconButton>
          </label>
          <span>{values.photo ? values.photo.name : ""}</span>
          {values.error && (
            <Typography>
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
            disabled={values.text === ""}
            className={classes.submit}
            onClick={clickPost}>
            POST
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default NewPost;
