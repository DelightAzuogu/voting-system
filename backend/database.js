const mongoose = require("mongoose");
require("dotenv").config();
const { createDummy } = require("./utils/database.js");

module.exports = (cb) => {
  mongoose.set("strictQuery", false);

  mongoose
    .connect(process.env.MONGODB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      cb();
    });

  // mongoose.connection.dropDatabase(() => {
  //   console.log("deleted");
  //   createDummy();
  // });

  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to db...");
  });

  mongoose.connection.on("error", (err) => {
    console.log("error message");
    console.log(err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose connection is disconnected...");
  });

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.log(
        "Mongoose connection is disconnected due to app termination..."
      );
      process.exit(0);
    });
  });
};
