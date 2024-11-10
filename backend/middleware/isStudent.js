const jwt = require("jsonwebtoken");
const { newError } = require("../utils/newError");
const { Instructor } = require("../models/instructor");
const { Student } = require("../models/student");

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

    //for the student
    if (role == "student") {
      let student = await Student.findOne({ _id: payload._id });
      if (!student) {
        throw newError("student not found", 401);
      }
      req.user = student;
      req.role = "student";
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
