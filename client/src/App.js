import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import UserSignIn from "./UserSignIn";
import UserSignUp from "./UserSignUp";
import Courses from "./Courses";
import NotFound from "./NotFound";
import CourseDetails from "./CourseDetails";
import Forbidden from "./Forbidden";
import CreateCourse from "./CreateCourse";
import UpdateCourse from "./UpdateCourse";
import PrivateRoute from "./PrivateRoute";
import UserSignOut from "./UserSignOut";
import GlobalStateProvider from "./Context.js";
import Homepage from "./Homepage";
require("dotenv").config();

console.log(process.env.NODE_ENV);
console.log(process.env.REACT_APP_SERVERURL);

const mySubmitHandler = (event) => {
  event.preventDefault();
  alert("You are submitting " + this.state.username);
};
const myChangeHandler = (event) => {
  this.setState({ username: event.target.value });
};

const App = () => {
  return (
    <GlobalStateProvider>
      <Fragment>
        <Switch>
          <Route exact path="/" render={() => <Homepage />} />
          <Route exact path="/signin" render={() => <UserSignIn />} />
          <Route exact path="/signup" render={() => <UserSignUp />} />
          <PrivateRoute exact path="/signout" render={() => <UserSignOut />} />
          <PrivateRoute
            component={CreateCourse}
            path="/courses/create"
          ></PrivateRoute>
          <PrivateRoute
            component={Courses}
            exact
            path="/courses"
          ></PrivateRoute>
          <PrivateRoute
            component={CourseDetails}
            exact
            path="/courses/:id"
          ></PrivateRoute>
          <PrivateRoute
            component={UpdateCourse}
            exact
            path={"/courses/:id/update"}
          ></PrivateRoute>

          <Route exact path="/forbidden" component={Forbidden} />
          <Route render={() => <NotFound />} />
        </Switch>
      </Fragment>
    </GlobalStateProvider>
  );
};

export default App;
