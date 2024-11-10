const { Schema, model } = require("mongoose");

const adminSchema = new Schema(
  {
    _id: Number,
    name: {
      type: String,
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

exports.adminSchema = adminSchema;
exports.Admin = model("Admin", adminSchema);
