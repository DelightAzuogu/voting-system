const { Vote } = require("../models/vote");
const { newError } = require("./newError");

module.exports = async function (id) {
  try {
    const vote = await Vote.findOne({ _id: id });
    if (!vote) {
      throw newError("vote not found", 400);
    }
    return vote;
  } catch (error) {
    throw error;
  }
};
