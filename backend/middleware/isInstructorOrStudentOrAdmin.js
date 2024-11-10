const { Admin } = require("../models/admin");
const { Instructor } = require("../models/instructor");
const { Student } = require("../models/student");
const { newError } = require("../utils/newError");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
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

    //if admin
    if (role == "admin") {
      const admin = await Admin.findOne({ _id: payload._id });
      if (!admin) {
        throw newError("admin not found", 401);
      }
      req.user = admin;
      req.role = "admin";
    }
    if (role == "instructor") {
      const instructor = await Instructor.findOne({ _id: payload._id });
      if (!instructor) {
        throw newError("instructor not found", 401);
      }
      req.user = instructor;
      req.role = "instructor";
    }
    if (role == "student") {
      const student = await Student.findOne({ _id: payload._id });
      if (!student) {
        throw newError("student not found", 401);
      }
      req.user = student;
      req.role = "student";
    }

    next();
  } catch (error) {
    next(error);
  }
};
