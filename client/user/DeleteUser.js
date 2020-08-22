import React, { useState } from "react";
import { remove } from "./api-user";
import { isAuthenticated, clearJWT } from "../auth/auth-helper";
import { Redirect } from "react-router-dom";
import { Delete } from "@material-ui/icons";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
} from "@material-ui/core";
import PropTypes from "prop-types";

const DeleteUser = ({ userId }) => {
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const deleteUser = () => {
    const jwt = isAuthenticated();
    remove({ userId: userId }, { t: jwt.token }).then((data) => {
      if (data && data.error) console.log(data.error);
      else {
        clearJWT(() => {});
        setRedirect(true);
      }
    });
  };
  const handleRequestCancel = () => {
    setOpen(false);
  };
  const handleClick = () => {
    setOpen(true);
  };
  if (redirect) return <Redirect to='/'></Redirect>;
  return (
    <span>
      <IconButton aria-label='Delete' color='secondary' onClick={handleClick}>
        <Delete></Delete>
      </IconButton>

      <Dialog open={open} onClose={handleRequestCancel}>
        <DialogTitle>{"Delete Account"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Confirm to delete your account.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestCancel} color='primary'>
            Cancel
          </Button>
          <Button onClick={deleteUser} color='secondary' autoFocus='autoFocus'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
};

DeleteUser.propTypes = {
  userId: PropTypes.string.isRequired,
};
export default DeleteUser;
