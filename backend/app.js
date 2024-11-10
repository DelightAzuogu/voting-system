const express = require("express");
require("dotenv").config();
var cors = require("cors");

const database = require("./database.js");
const authRoute = require("./routes/auth");
const pollRoute = require("./routes/poll");
const deptRoute = require("./routes/dept.js");
const voteRoute = require("./routes/vote.js");

const app = express();

//for cors errors;
app.use(cors());
//for json req body
app.use(express.json());

//this will be for the routes
//auth route
app.use("/auth", authRoute);

//poll route
app.use("/poll", pollRoute);

//to get all the departments
app.use("/departments", deptRoute);

//vote route
app.use("/vote", voteRoute);

// 404
app.use((req, res, next) => {
  res.status(404).json("route not found");
});

//error handling function
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.status || 500;
  error.msg = error.message || "server Error";
  res.status(status).json({ error });
});

const PORT = process.env.PORT || 3000;

database(() => {
  const server = app.listen(PORT, async () => {
    console.log(`Server started on port ${PORT}`);
  });
});
