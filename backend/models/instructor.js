const { Schema, model } = require("mongoose");
const { departmentSchema } = require("./department");

const instructorSchema = new Schema(
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
    department: {
      type: departmentSchema,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

exports.instructorSchema = instructorSchema;
exports.Instructor = model("Instructor", instructorSchema);
