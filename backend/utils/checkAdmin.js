const { Admin } = require("../models/admin");
const { newError } = require("./newError");

exports.checkAdmin = async function (id) {
  try {
    const admin = await Admin.findOne({ _id: id });
    //throw error is not found;
    if (!admin) throw newError("Admin not found", 404);
    return admin;
  } catch (error) {
    throw error;
  }
};
