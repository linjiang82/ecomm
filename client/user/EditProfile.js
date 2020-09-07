import React, { useState, useEffect } from "react";
import { update } from "./api-user";
import { makeStyles } from "@material-ui/core/styles";
import { Link, Redirect } from "react-router-dom";
import { updateUser, isAuthenticated, clearJWT } from "../auth/auth-helper";
import {
  Card,
  Icon,
  Typography,
  TextField,
  CardActions,
  Button,
  Dialog,
  CardContent,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControlLabel,
  Switch,
} from "@material-ui/core";

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
}));
const EditProfile = ({ match }) => {
  const classes = useStyles();
  const jwt = isAuthenticated();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: undefined,
    error: "",
    educator: false,
    redirectToProfile: false,
  });
  useEffect(() => {
    setValues({
      ...values,
      name: jwt.user.name,
      email: jwt.user.email,
      educator: jwt.user.educator,
    });
  }, [match.params.userId]);
  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };
  const handleCheck = (e, checked) => {
    setValues({ ...values, educator: checked });
  };
  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
      educator: values.educator,
    };

    update({ userId: match.params.userId }, { t: jwt.token }, user).then(
      (data) => {
        if (data.error) setValues({ ...values, error: data.error });
        else {
          updateUser(data, () => {
            setValues({ ...values, error: "", redirectToProfile: true });
          });
        }
      }
    );
  };
  if (values.redirectToProfile)
    return <Redirect to={"/user/" + jwt.user._id}></Redirect>;
  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant='h6' className={classes.title}>
            Edit Profile
          </Typography>
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
            id='email'
            type='email'
            label='Email'
            className={classes.textField}
            value={values.email}
            onChange={handleChange("email")}
            margin='normal'
          />
          <br />
          <Typography variant='subtitle1' className={classes.subheading}>
            I am an Educator
          </Typography>
          <FormControlLabel
            control={
              <Switch
                classes={{ checked: classes.checked, bar: classes.bar }}
                checked={values.educator}
                onChange={handleCheck}
              />
            }
            label={values.educator ? "Yes" : "No"}
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
