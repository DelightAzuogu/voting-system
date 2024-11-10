const { Admin } = require("../models/admin");
const { Department } = require("../models/department");
const { Poll } = require("../models/poll");
const { checkAdmin } = require("../utils/checkAdmin");
const checkDateTime = require("../utils/checkDateTime");
const checkDepartment = require("../utils/checkDepartment");
const { checkInstructor } = require("../utils/checkInstructor");
const { checkPoll } = require("../utils/checkPoll");
const { checkStudent } = require("../utils/checkStudent");
const { newError } = require("../utils/newError");
const { validationError } = require("../utils/validationError");

//set interval to check if the expiration for polls has reached
//this goes off every 1 minute(60000 millseconds )
setInterval(async () => {
  const tDate = new Date();
  const tMill = tDate.getTime();
  const polls = await Poll.find({ status: false, expMil: { $lte: tMill } });
  for (let poll of polls) {
    poll.status = true;

    //count the individual votes
    let highestVoteCount = 0;
    for (let option of poll.options) {
      const voteCount = option.voters.length;
      highestVoteCount =
        voteCount > highestVoteCount ? voteCount : highestVoteCount;
      option.count = voteCount;
    }

    //check for winner
    for (let option of poll.options) {
      if (option.count == highestVoteCount) {
        poll.result.push(option.message);
      }
    }
    poll.save();
  }
}, 60000);

function checkVote(poll, user, role) {
  for (let i in poll.voters) {
    if (poll.voters[i].id === user._id && poll.voters[i].role === role) {
      for (let optionIndex in poll.options) {
        for (let voter of poll.options[optionIndex].voters) {
          if (voter.id == user._id && voter.role === role) {
            return optionIndex;
          }
        }
      }
    }
  }

  return null;
}

exports.getAllPolls = async function (req, res, next) {
  try {
    let polls = await Poll.find();
    polls = polls.reverse();
    res.send({ polls });
  } catch (error) {
    next(error);
  }
};

exports.getMyPolls = async function (req, res, next) {
  try {
    const role = req.role;
    const user = req.user;
    let polls = await Poll.find({
      "creator.role": role,
      "creator.profile._id": user._id,
    });
    res.send({ polls });
  } catch (error) {
    next(error);
  }
};

exports.getMyPoll = async function (req, res, next) {
  try {
    const role = req.role;
    const user = req.user;
    const pollId = req.params.pollId;
    let poll = await Poll.findOne({ _id: pollId });

    if (!poll) {
      throw newError("poll not found", 404);
    }
    if (poll.creator.role != role || poll.creator.profile._id != user._id) {
      throw newError("poll is not yours", 401);
    }

    const index = checkVote(poll, user, role);

    res.send({ poll, index });
  } catch (error) {
    next(error);
  }
};

exports.getEligiblePoll = async function (req, res, next) {
  try {
    const user = req.user;
    const role = req.role;
    let polls = [];
    let pollId = [];
    const pollsAll = await Poll.find({ eligibleDepts: "all" });
    for (let p of pollsAll) {
      polls.push(p);
      pollId.push(p.id);
    }

    const pollsDept = await Poll.find({ eligibleDepts: user.department.name });
    for (let p of pollsDept) {
      if (!pollId.includes(p.id)) {
        polls.push(p);
        pollId.push(p.id);
      }
    }

    const createdPolls = await Poll.find({ "creator.profile._id": user._id });
    for (let p of createdPolls) {
      if (!pollId.includes(p.id)) {
        polls.push(p);
        pollId.push(p.id);
      }
    }

    res.status(200).send({ polls });
  } catch (error) {
    next(error);
  }
};

exports.getPoll = async function (req, res, next) {
  try {
    const pollId = req.params.id;

    //get the poll
    const poll = await checkPoll(pollId);

    //this to check if the user has voted
    const index = checkVote(poll, req.user, req.role);

    res.send({ poll, index });
  } catch (error) {
    next(error);
  }
};

exports.postCastVote = async function (req, res, next) {
  try {
    validationError(req);

    let { optionId } = req.body;
    let pollId = req.params.pollId;

    const poll = await checkPoll(pollId);
    //check if poll is still open
    if (poll.status) {
      throw newError("Poll is not open for votes", 400);
    }

    // check if the user is eligible to vote using the department
    if (typeof poll.eligibleDepts === "Array") {
      if (!poll.eligibleDepts.includes(req.user.department.name)) {
        throw newError("not eligible to vote", 401);
      }
    }

    //check if user have voted before
    const user = req.user;
    const role = req.role;
    for (voter of poll.voters) {
      if (voter.id === user._id && voter.role === role) {
        throw newError("voted already", 400);
      }
    }

    //find the option that the user is voting for(optionId)
    const optionIndex = poll.options.findIndex((e) => e.id === optionId);
    if (optionIndex < 0) {
      throw newError("Invalid option", 400);
    }

    //add user to the option voters and increase count
    poll.options[optionIndex].count++;
    poll.options[optionIndex].voters.push({ id: user.id, role });

    //add the user to voters of the poll
    poll.voters.push({ id: user._id, role });

    // //save poll
    poll.save();

    res.status(200).send({ msg: "success", poll, index: optionIndex });
  } catch (error) {
    next(error);
  }
};

exports.postCreatePoll = async (req, res, next) => {
  try {
    validationError(req);
    let { title, description, polls, dateTime, question, departments } =
      req.body;

    //to make the date for the expiration, ie the one given by the user
    const { expmil, tMill } = checkDateTime(dateTime);
    const timeDif = expmil - tMill;

    let eligibleDepts = [];
    if (typeof departments == "object") {
      for (let dept of departments) {
        const d = await checkDepartment(dept);
        eligibleDepts.push(d.name);
      }
    } else {
      eligibleDepts = "all";
    }

    let poll = {
      status: false,
      creator: { role: req.role, profile: req.user },
      title,
      description,
      options: [],
      startMil: tMill,
      expMil: expmil,
      question,
      voters: [],
      eligibleDepts,
    };

    // check if the poll is empty
    if (polls.length <= 0) {
      throw newError("enter polls", 400);
    }

    for (let p of polls) {
      poll.options.push({ count: 0, message: p, voters: [] });
    }

    poll = await Poll.create(poll);

    res.status(201).json(poll);
  } catch (error) {
    next(error);
  }
};

exports.deletePoll = async (req, res, next) => {
  try {
    const pollId = req.params.pollId;

    //check poll
    const poll = await checkPoll(pollId);

    if (
      poll.creator.profile._id == req.user._id &&
      poll.creator.role == req.role
    ) {
      poll.delete();
    } else if (req.role == "admin") {
      poll.delete();
    } else {
      throw newError("not creator or admin", 403);
    }
    res.status(200).json({ msg: "success", poll });
  } catch (error) {
    next(error);
  }
};

exports.postEditPoll = async (req, res, next) => {
  try {
    validationError(req);

    const { title, description, question, departments, dateTime } = req.body;
    const pollId = req.params.pollId;

    let poll = await checkPoll(pollId);

    if (
      (poll.creator.profile._id != req.user._id ||
        poll.creator.role != req.role) &&
      req.role != "admin"
    ) {
      throw newError("not eligible to update", 400);
    }

    let eligibleDepts = [];
    if (typeof departments == "object") {
      for (let dept of departments) {
        const d = await checkDepartment(dept);
        eligibleDepts.push(dept);
      }
    } else {
      eligibleDepts = "all";
    }

    const { expmil, tMill } = checkDateTime(dateTime);
    const timeDif = expmil - tMill;

    poll.status = false;
    poll.title = title;
    poll.question = question;
    poll.description = description;
    poll.eligibleDepts = eligibleDepts;
    poll.expMil = expmil;

    poll = await poll.save();

    res.status(200).send({ poll });
  } catch (error) {
    next(error);
  }
};

exports.getEdit = async function (req, res, next) {
  try {
    const pollId = req.params.pollId;

    const poll = await checkPoll(pollId);

    if (
      (poll.creator.profile._id != req.user._id ||
        poll.creator.role != req.role) &&
      req.role != "admin"
    ) {
      throw newError("not eligible for edit", 401);
    }

    res.status(200).send({ poll });
  } catch (error) {
    next(error);
  }
};

// TODO get voters of a poll

// TODO get result of a poll
