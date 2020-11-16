import React, { useState } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { Button, makeStyles } from "@material-ui/core";
import { create } from "./api-enrollment";
import { isAuthenticated } from "../auth/auth-helper";

const useStyles = makeStyles((theme) => ({
  icon: {
    margin: "3px",
    backgroundColor: "orange",
    color: "white",
  },
}));
const Enroll = ({ courseId }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    enrollId: "",
    redirect: false,
    error: "",
  });
  const jwt = isAuthenticated();
  const handleEnroll = async () => {
    create({ courseId: courseId }, { t: jwt.token }).then((data) => {
      if (data && data.error) setValues({ ...values, error: data.error });
      else {
        setValues({ ...values, enrollId: data._id, redirect: true });
      }
    });
  };
  if (values.redirect) {
    console.log(values.enrollId);
    return <Redirect to={"/enrollment/" + values.enrollId}></Redirect>;
  }
  return (
    <Button className={classes.icon} variant="contained" onClick={handleEnroll}>
      Enroll
    </Button>
  );
};

Enroll.propTypes = {
  courseId: PropTypes.string.isRequired,
};
export default Enroll;
