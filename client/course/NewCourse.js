import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  Typography,
  Card,
  Icon,
  TextField,
  Button,
  CardContent,
  CardActions,
} from "@material-ui/core";
import FileUpload from "@material-ui/icons/AddPhotoAlternate";
import { makeStyles } from "@material-ui/core/styles";
import { isAuthenticated } from "../auth/auth-helper";
import { create } from "../course/api-course";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    marginTop: theme.spacing(2),
    textAlign: "center",
  },
  title: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    color: theme.palette.openTitle,
  },
  input: {
    display: "none",
  },
  button: {
    margin: "auto",
    marginBottom: theme.spacing(2),
  },
  filename: {
    marginRight: theme.spacing(1),
  },
  error: {
    verticalAlign: "middle",
  },
}));

const NewCourse = ({ match }) => {
  const classes = useStyles();
  const jwt = isAuthenticated();
  const [values, setValues] = useState({
    name: "",
    description: "",
    category: "",
    image: "",
    redirect: false,
    error: "",
  });
  const handleSubmit = (e) => {
    const course = new FormData();
    values.name && course.append("name", values.name);
    values.description && course.append("description", values.description);
    values.category && course.append("category", values.category);
    values.image && course.append("image", values.image);
    create({ userId: jwt.user._id }, { t: jwt.token }, course).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, error: "", redirect: true });
      }
    });
  };
  const handleChange = (prop) => (e) => {
    let value = prop == "image" ? e.target.files[0] : e.target.value;
    setValues({ ...values, [prop]: value });
  };
  if (values.redirect) {
    return <Redirect to='/teach/courses' />;
  }
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant='h6' className={classes.title}>
          New Course
        </Typography>
        <input
          className={classes.input}
          accept='image/*'
          type='file'
          onChange={handleChange("image")}
          id='icon-button-file'
        />
        <label htmlFor='icon-button-file'>
          <Button variant='contained' color='secondary' component='span'>
            Upload Photo
            <FileUpload />
          </Button>
        </label>
        <span className={classes.filename}>
          {values.image ? values.image.name : ""}
        </span>
        <br />
        <TextField
          id='name'
          label='Name'
          value={values.name}
          onChange={handleChange("name")}></TextField>
        <br />
        <TextField
          id='description'
          label='Description'
          multiline
          row='2'
          value={values.description}
          onChange={handleChange("description")}></TextField>
        <br />
        <TextField
          id='category'
          label='Category'
          value={values.category}
          onChange={handleChange("category")}></TextField>
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
          className={classes.button}
          variant='contained'
          color='primary'
          onClick={handleSubmit}>
          SUBMIT
        </Button>
        <Link to='/teach/courses' className={classes.button}>
          <Button variant='contained'>CANCEL</Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default NewCourse;
