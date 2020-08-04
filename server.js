"use strict";

// load modules
const express = require("express");
const morgan = require("morgan");
const routes = require("./routes");
const mongoose = require("mongoose");
let ObjectId = require("mongodb").ObjectID;
const { url } = require("./config");
//const { sequelize } = require("./models");
const cors = require("cors");
const bodyParser = require("body-parser");

// variable to enable global error logging
const enableGlobalErrorLogging =
  process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true";

// create the Express app
const app = express();
app.use(express.json());
// serve static files from react client side folder "public" localhost:5000
app.use(express.static("public"));
app.use(cors());

// setup morgan which gives us http request logging
app.use(morgan("dev"));

// TODO setup your api routes here
app.use("/", routes);

// send 404 if no other route matched
// app.use((req, res) => {
//   res.status(404).json({
//     message: "Route Not Found",
//   });
// });

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 400).json({
    message: err.message,
    error: {},
  });
});

// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// connect shema from mongoose to mongoDB atlas
try {
  mongoose.connect(
    url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
    () => console.log("Connection to database successful!")
  );
} catch (error) {
  console.log("Unable to connect to the database");
}

// set our port
app.set("port", process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get("port"), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
