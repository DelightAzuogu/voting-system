let { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
const { studentSchema } = require("./student");
const { instructorSchema } = require("./instructor");
const { departmentSchema } = require("./department");
const { adminSchema } = require("./admin");

const pollSchema = new Schema({
  //when false you can still vote
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
  creator: {
    required: true,
    type: {
      role: {
        type: String,
        alias: ["instructor", "admin", "student"],
        required: true,
      },
      profile: {
        type: adminSchema || instructorSchema || studentSchema,
        required: true,
      },
    },
    _id: false,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: {
    required: true,
    type: [
      {
        count: {
          type: Number,
          required: true,
          default: 0,
        },
        message: {
          type: String,
          required: true,
        },
        voters: {
          type: [
            {
              id: {
                type: Number,
                required: true,
              },
              role: {
                type: String,
                required: true,
                enum: ["student", "instructor"],
              },
            },
          ],
          _id: false,
        },
      },
    ],
  },
  eligibleDepts: {
    type: [String],
    required: true,
  },
  result: {
    type: [String],
  },
  expMil: {
    type: Number,
    required: true,
  },
  startMil: {
    type: Number,
    required: true,
  },
  voters: {
    type: [
      {
        id: {
          type: Number,
          required: true,
        },
        role: {
          type: String,
          required: true,
          enum: ["student", "instructor"],
        },
      },
    ],
    _id: false,
  },
});

exports.pollSchema = pollSchema;
exports.Poll = model("Poll", pollSchema);
