const jwt = require("jsonwebtoken");
const { newError } = require("../utils/newError");
const { Admin } = require("../models/admin");

module.exports = async function (req, res, next) {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      throw newError("token not found", 401);
    }
    //the authrization header is in this form
    // Bearer {token}
    const [bearer, token] = authHeader.split(" ");
    if (!token) {
      throw newError("token not found", 401);
    }

    //get payload
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
      throw newError("token not found", 401);
    }

    let admin = await Admin.findOne({ _id: payload._id });
    if (!admin) {
      throw newError("admin not found", 401);
    }
    req.user = admin;
    req.role = "admin";

    next();
  } catch (error) {
    next(error);
  }
};
