import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import Users from "./user/Users";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Profile from "./user/Profile";
import EditProfile from "./user/EditProfile";
import PrivateRoute from "./auth/PrivateRoute";
import Menu from "./core/Menu";

const MainRouter = () => {
  return (
    <div>
      <Menu />
      <Switch>
        <Route exact path='/' component={Home}></Route>
        <Route exact path='/users' component={Users}></Route>
        <Route exact path='/signup' component={Signup}></Route>
        <Route exact path='/signin' component={Signin}></Route>
        <PrivateRoute
          exact
          path='/user/edit/:userId'
          component={EditProfile}></PrivateRoute>
        <Route exact path='/user/:userId' component={Profile}></Route>
      </Switch>
    </div>
  );
};

export default MainRouter;
