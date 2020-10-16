import {Button, Dialog, DialogTitle, DialogActions, DialogContent, TextField} from "@material-ui/core";
import Add from '@material-ui/icons/AddBox'
import PropTypes from 'prop-types'
import {newLesson} from './api-course'
import React, {useState} from "react";
import {isAuthenticated} from "../auth/auth-helper";

const NewLesson = (props) => {
  const [lesson, setLesson] = useState({
    title: "",
    content: "",
    resource_url: "",
  });
  const jwt = isAuthenticated();
  const [open, setOpen] = useState(false)
  const handleChange = (text) => (e) => {
    setLesson({...lesson, [text]: e.target.value})
  }

  const handleSubmit = () => {
    newLesson({courseId: props.courseId}, {t: jwt.token}, lesson).then(data => {
      if (data && data.error) console.log(data.error)
      else {
        props.addNewLesson(data)
        setLesson({
          title: "",
          content: "",
          resource_url: "",
        })
        setOpen(false)
      }
    })
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <div>
      <Button onClick={handleOpen} variant='contained'>
        <Add /> New Lesson
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <div>
          <DialogTitle id='form-dialog-title'>
            Add New Lesson
          </DialogTitle>
          <DialogContent>

            <TextField
              margin='dense'
              label='Title'
              type='text'
              fullWidth
              value={lesson.title}
              onChange={handleChange('title')}
            >
            </TextField>
            <br />
            <TextField
              margin='dense'
              label='Content'
              type='text'
              multiline
              row='5'
              fullWidth
              value={lesson.content}
              onChange={handleChange('content')}
            >
            </TextField>
            <br />
            <TextField
              margin='dense'
              label='Resource link'
              type='text'
              fullWidth
              value={lesson.resource_url}
              onChange={handleChange('resource_url')}
            >
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button variant='contained' color='primary' onClick={handleClose}>CANCEL</Button>
            <Button variant='contained' color='secondary' onClick={handleSubmit}>ADD</Button>
          </DialogActions>
        </div></Dialog>
    </div>
  );
};
NewLesson.propTypes = {
  addNewLesson: PropTypes.func.isRequired,
  courseId: PropTypes.string.isRequired
}

export default NewLesson
