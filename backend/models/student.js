const { Schema, model } = require("mongoose");
const { departmentSchema } = require("./department");

const studentSchema = new Schema(
  {
    _id: Number,
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      // unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    department: {
      type: departmentSchema,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

exports.studentSchema = studentSchema;
exports.Student = model("Student", studentSchema);
