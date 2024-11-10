const jwt = require("jsonwebtoken");
const { newError } = require("../utils/newError");
const { Instructor } = require("../models/instructor");
const { Admin } = require("../models/admin");

module.exports = async function (req, res, next) {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      throw newError("token not found", 401);
    }
    //the authrization header is in this form
    // Bearer {token} {a role}
    const [bearer, token, role] = authHeader.split(" ");
    if (!token) {
      throw newError("token not found", 401);
    }
    if (!role) {
      throw newError("Role not found", 401);
    }

    //get payload
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
      throw newError("token not found", 401);
    }

    //for the instructor
    if (role.toLowerCase() == "instructor") {
      let instructor = await Instructor.findOne({ _id: payload._id });
      if (!instructor) {
        throw newError("instructor not found", 401);
      }
      req.user = instructor;
      req.role = "instructor";
    }
    //for the admin
    else if (role.toLowerCase() == "admin") {
      let admin = await Admin.findOne({ _id: payload._id });
      if (!admin) {
        throw newError("admin not found", 401);
      }
      req.user = admin;
      req.role = "admin";
    }
    // for another thing
    else {
      throw newError("invalid role", 401);
    }
    next();
  } catch (error) {
    next(error);
  }
};
