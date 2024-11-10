const { newError } = require("./newError");
const { Instructor } = require("../models/instructor");

exports.checkInstructor = async function (id) {
  try {
    const instructor = await Instructor.findOne({ _id: id });
    if (!instructor) {
      throw newError("Instructor not found", 404);
    }
    return instructor;
  } catch (error) {
    throw error;
  }
};
