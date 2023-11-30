import React, { useState, useEffect, useContext } from "react";
import "./App.css";
import Header from "./Header";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import { GlobalStateContext } from "./Context";
const { SERVERURL } = require("./Config");

function Courses(props) {
  const [courses, setCourses] = useState([]);
  const user = props.user;
  console.log("user", user);
  console.log("props", props);

  const context = useContext(GlobalStateContext);
  const loggedInUser = context.authenticateduser.get;

  console.log(loggedInUser);
  const email = loggedInUser.email;
  const password = loggedInUser.password;
  let base64 = require("base-64");
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append(
    "Authorization",
    "Basic " + base64.encode(email + ":" + password)
  );

  const fetchCourses = () => {
    let url = `${SERVERURL}/courses`;
    fetch(url, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((json) => {
        setCourses(json);
      });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    // <GlobalStateContext.Consumer>
    //   {() => (
    <React.Fragment>
      {/* header to test  Global State
          data */}
      {/* <h1>{context.authenticateduser.get.firstName}</h1> */}
      <Header />
      <div className="bounds">
        {console.log("courses", courses)}
        {courses.map((course) => {
          // Only display the courses which belong to the user
          // where the course's user id matches loggedInUser.userId
          if (course.user._id === loggedInUser.userId)
            return (
              <div className="grid-33" key={course._id}>
                <Link
                  className="course--module course--link"
                  to={{
                    pathname: "/courses/" + course._id,
                    state: {
                      course: course,
                    },
                  }}
                >
                  <h4 className="course--label">Course</h4>
                  <h3 className="course--title">{course.title}</h3>
                </Link>
              </div>
            );
        })}
        <div className="grid-33">
          <Link
            className="course--module course--add--module"
            to={{
              pathname: "/courses/create",
              state: {
                user: user,
              },
            }}
          >
            <h3 className="course--add--title">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 13 13"
                className="add"
              >
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>
              New Course
            </h3>
          </Link>
        </div>
      </div>
    </React.Fragment>
    //   )}
    // </GlobalStateContext.Consumer>
  );
}

export default withRouter(Courses);
