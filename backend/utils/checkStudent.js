const { Student } = require("../models/student");
const { newError } = require("./newError");

exports.checkStudent = async function (id) {
  try {
    const student = await Student.findOne({ _id: id });
    if (!student) {
      throw newError("Student not found", 404);
    }
    return student;
  } catch (error) {
    throw error;
  }
};
