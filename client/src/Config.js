const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  // SERVERURL: process.env.REACT_APP_SERVERURL,
  SERVERURL:
    process.env.NODE_ENV === "production" // if running env i snetfli or 8888, bavcken apiu rul is same as website url
      ? ""
      : process.env.REACT_APP_SERVERURL, // if you run react using npm start, web site url is 3333, but backend is 8888
};
