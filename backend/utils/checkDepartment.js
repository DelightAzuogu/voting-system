const { Department } = require("../models/department");
const { newError } = require("./newError");

module.exports = async function (name) {
  // name = name.toLowerCase()
  try {
    const dept = await Department.findOne({ name });
    if (!dept) {
      throw newError("invalid Department", 400);
    }

    return dept;
  } catch (error) {
    throw error;
  }
};
