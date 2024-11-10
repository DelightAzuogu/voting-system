const { Schema, model } = require("mongoose");

const departmentSchema = new Schema(
  {
    faculty: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

exports.departmentSchema = departmentSchema;
exports.Department = model("Department", departmentSchema);
