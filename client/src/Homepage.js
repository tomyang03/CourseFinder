import React from "react";
import "./App.css";
import Header from "./Header";
import { withRouter } from "react-router";
function Homepage() {
  return (
    <React.Fragment>
      <Header />
    </React.Fragment>
  );
}

export default withRouter(Homepage);
