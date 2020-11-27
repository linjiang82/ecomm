import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import Users from "./user/Users";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Profile from "./user/Profile";
import MyCourses from "./course/MyCourses";
import NewCourse from "./course/NewCourse";
import EditCourse from "./course/EditCourse";
import EditProfile from "./user/EditProfile";
import PrivateRoute from "./auth/PrivateRoute";
import Menu from "./core/Menu";
import Course from "./course/Course";
import NewLesson from "./course/NewLesson";
import Enrollment from "./enrollment/Enrollment";

const MainRouter = () => {
  return (
    <div>
      <Menu />
      <Switch>
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/users" component={Users}></Route>
        <Route exact path="/signup" component={Signup}></Route>
        <Route exact path="/signin" component={Signin}></Route>
        <Route
          exact
          path="/enrollment/:enrollmentId"
          component={Enrollment}
        ></Route>
        <Route
          exact
          path="/course/edit/:courseId"
          component={EditCourse}
        ></Route>
        <Route exact path="/course/:courseId" component={Course}></Route>
        <Route
          exact
          path="/course/:courseId/lesson/new"
          component={NewLesson}
        ></Route>
        <PrivateRoute
          exact
          path="/teach/courses/"
          component={MyCourses}
        ></PrivateRoute>
        <PrivateRoute
          exact
          path="/teach/course/new"
          component={NewCourse}
        ></PrivateRoute>
        <PrivateRoute
          exact
          path="/user/edit/:userId"
          component={EditProfile}
        ></PrivateRoute>
        <Route exact path="/user/:userId" component={Profile}></Route>
      </Switch>
    </div>
  );
};

export default MainRouter;
