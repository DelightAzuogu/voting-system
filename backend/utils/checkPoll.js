const { Admin } = require("../models/admin");
const { Poll } = require("../models/poll");
const { newError } = require("./newError");

exports.checkPoll = async function (id) {
  try {
    const poll = await Poll.findOne({ _id: id });
    //throw error is not found;
    if (!poll) throw newError("Poll not found", 404);
    return poll;
  } catch (error) {
    throw error;
  }
};
