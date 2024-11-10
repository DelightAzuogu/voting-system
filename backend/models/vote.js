const { Schema, model } = require("mongoose");
const { Timestamp } = require("mongodb");
const { studentSchema } = require("./student");
const { adminSchema } = require("./admin");
const { instructorSchema } = require("./instructor");

const voteSchema = new Schema({
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
  candidates: {
    type: [
      {
        profile: {
          type: studentSchema,
          required: true,
        },
        count: {
          type: Number,
          default: 0,
          required: true,
        },
        manifesto: {
          type: String,
        },
        voters: {
          type: [
            {
              id: {
                type: String,
                required: true,
              },
              role: {
                type: String,
                required: true,
                enum: ["student", "instructor"],
              },
            },
          ],
        },
        // _id: false,
      },
    ],
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
  eligibleDepts: {
    type: [String],
    required: true,
  },
  voters: {
    type: [
      {
        id: {
          type: String,
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

exports.voteSchema = voteSchema;
exports.Vote = model("Vote", voteSchema);
