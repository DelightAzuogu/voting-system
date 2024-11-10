const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Admin } = require("../models/admin");
const { newError } = require("../utils/newError");
const { checkAdmin } = require("../utils/checkAdmin");
const { checkInstructor } = require("../utils/checkInstructor");
const { checkStudent } = require("../utils/checkStudent");
const { validationError } = require("../utils/validationError");

// TODO add the login implementation
exports.postLogin = async (req, res, next) => {
  let user = req.params.user;
  user = user.toLowerCase();
  const { id, password } = req.body;

  try {
    validationError(req);

    let userProfile;
    //check id user equals "admin"
    if (user === "admin") {
      userProfile = await checkAdmin(id);
    }
    // else check id user equals "instructor"
    else if (user === "instructor") {
      userProfile = await checkInstructor(id);
    }
    //else check id user equals "student"
    else if (user === "student") {
      userProfile = await checkStudent(id);
    }

    if (!userProfile) {
      throw newError("Invalid user id", 400);
    }

    //check if user.password equals password
    if (!bcrypt.compareSync(password, userProfile.password)) {
      throw newError("Invalid password", 400);
    }

    const token = jwt.sign(
      { _id: userProfile._id, user },
      process.env.JWT_SECRET,
      {
        // expiresIn: "1h",
      }
    );

    res.status(200).json(token);
  } catch (error) {
    //do something with error
    next(error);
  }
};
