const { Department } = require("../models/department");
const { Student } = require("../models/student");
const { Vote } = require("../models/vote");
const checkDateTime = require("../utils/checkDateTime");
const checkDepartment = require("../utils/checkDepartment");
const { checkStudent } = require("../utils/checkStudent");
const checkVote = require("../utils/checkVote");
const { newError } = require("../utils/newError");
const { validationError } = require("../utils/validationError");

//set interval to check if the expiration for vote has reached
//this goes off every 1 minute(60000 millseconds )
setInterval(async () => {
  const tDate = new Date();
  const tMill = tDate.getTime();
  const votes = await Vote.find({ status: false, expMil: { $lte: tMill } });
  for (let vote of votes) {
    vote.status = true;

    //count the individual votes
    let highestVoteCount = 0;
    for (let option of vote.candidates) {
      const voteCount = option.voters.length;
      highestVoteCount =
        voteCount > highestVoteCount ? voteCount : highestVoteCount;
      option.count = voteCount;
    }

    //check for winner
    vote.result = [];
    for (let option of vote.candidates) {
      if (option.count == highestVoteCount) {
        vote.result.push(option.profile);
      }
    }
    vote.save();
  }
}, 60000);

function checkVoteIndex(vote, user, role) {
  for (let v of vote.voters) {
    if (v.id == user._id && v.role === role) {
      for (let optionIndex in vote.candidates) {
        for (let voter of vote.candidates[optionIndex].voters) {
          if (voter.id == user._id && voter.role === role) {
            return optionIndex;
          }
        }
      }
    }
  }

  return null;
}

exports.getInitVote = async function (req, res, next) {
  try {
    const students = await Student.find();
    const departments = await Department.find();
    res.send({ students, departments });
  } catch (error) {
    next(error);
  }
};

exports.postCreateVote = async function (req, res, next) {
  try {
    validationError(req);

    let { title, description, departments, dateTime, students } = req.body;

    let eligibleDepts = [];
    if (typeof departments == "object") {
      for (let dept of departments) {
        const d = await checkDepartment(dept);
        eligibleDepts.push(d.name);
      }
    } else {
      eligibleDepts = "all";
    }

    const candidates = [];
    for (student of students) {
      const s = await checkStudent(student);
      candidates.push({ profile: s, count: 0, voters: [], manifesto: "" });
    }

    const { expmil, tMill } = checkDateTime(dateTime);

    let vote = await Vote.create({
      status: false,
      title,
      description,
      eligibleDepts,
      creator: { role: req.role, profile: req.user },
      candidates,
      expMil: expmil,
      startMil: tMill,
    });

    res.status(201).send({ vote, msg: "created" });
  } catch (error) {
    next(error);
  }
};

exports.getAllVotes = async function (req, res, next) {
  try {
    const votes = await Vote.find();

    res.send(votes);
  } catch (error) {
    next(error);
  }
};

exports.getVote = async function (req, res, next) {
  try {
    const voteId = req.params.voteId;

    const vote = await checkVote(voteId);

    const index = checkVoteIndex(vote, req.user, req.role);

    res.send({ vote, index });
  } catch (error) {
    next(error);
  }
};

exports.deleteVote = async function (req, res, next) {
  try {
    const voteId = req.params.voteId;

    const vote = await checkVote(voteId);

    //check if the request sender is the creator of the vote or an admin
    if (
      (vote.creator.profile._id != req.user._id ||
        vote.creator.role != req.role) &&
      req.role != "admin"
    ) {
      throw newError("not allowed to delete", 400);
    }

    vote.delete();

    res.status(200).send({ msg: "success" });
  } catch (error) {
    next(error);
  }
};

exports.postEditVote = async function (req, res, next) {
  try {
    validationError(req);

    let { title, description, departments, dateTime } = req.body;

    let voteId = req.params.voteId;

    let vote = await checkVote(voteId);

    // update the eligibleDepts
    let eligibleDepts = [];
    if (typeof departments == "object") {
      for (let dept of departments) {
        const d = await checkDepartment(dept);
        eligibleDepts.push(d.name);
      }
    } else {
      eligibleDepts = "all";
    }

    //check the date and time
    const { expmil, tMill } = checkDateTime(dateTime);

    vote.title = title;
    vote.description = description;
    vote.eligibleDepts = eligibleDepts;
    vote.expMil = expmil;

    vote.save();

    res.status(200).send({ vote, msg: "updated" });
  } catch (error) {
    next(error);
  }
};

exports.getMyVotes = async function (req, res, next) {
  try {
    const role = req.role;
    const user = req.user;
    let votes = await Vote.find({
      "creator.role": role,
      "creator.profile._id": user._id,
    });

    res.send({ votes });
  } catch (error) {
    next(error);
  }
};

exports.getEligibleVotes = async function (req, res, next) {
  try {
    const user = req.user;
    const role = req.role;
    let votes = [];
    let voteId = [];
    const votesAll = await Vote.find({ eligibleDepts: "all" });
    for (let p of votesAll) {
      votes.push(p);
      voteId.push(p.id);
    }

    const votesDept = await Vote.find({ eligibleDepts: user.department.name });
    for (let p of votesDept) {
      if (!voteId.includes(p.id)) {
        votes.push(p);
        voteId.push(p.id);
      }
    }

    const createdvotes = await Vote.find({ "creator.profile._id": user._id });
    for (let p of createdvotes) {
      if (!voteId.includes(p.id)) {
        votes.push(p);
        voteId.push(p.id);
      }
    }

    res.status(200).send({ votes });
  } catch (error) {
    next(error);
  }
};

exports.postCastVote = async function (req, res, next) {
  try {
    const user = req.user,
      role = req.role,
      voteId = req.params.voteId,
      candidateId = req.params.candidateId;

    //get the vote
    let vote = await checkVote(voteId);

    //check the status of the vote
    if (vote.status) {
      throw newError("Not open for votes", 401);
    }

    //check the user eligibility to vote
    if (vote.eligibleDepts[0].toLowerCase() != "all") {
      if (!vote.eligibleDepts.includes(user.department.name)) {
        throw newError("not eligible to vote", 401);
      }
    }

    //check if user have voted before
    for (voter of vote.voters) {
      if (voter.id === user._id && voter.role === role) {
        throw newError("voted already", 400);
      }
    }

    //find the option that the user is voting for(optionId)
    const candidateIndex = vote.candidates.findIndex(
      (e) => e.id === candidateId
    );
    if (candidateIndex < 0) {
      throw newError("Invalid option", 400);
    }

    vote.candidates[candidateIndex].count++;
    vote.candidates[candidateIndex].voters.push({ id: user._id, role });

    vote.voters.push({ id: user._id, role: role });

    vote.save();

    res.status(200).send({ vote, msg: "success", index: candidateIndex });
  } catch (error) {
    next(error);
  }
};

exports.getManifestoVote = async function (req, res, next) {
  try {
    const votes = await Vote.find({
      "candidates.profile._id": req.user._id,
      status: false,
    });

    res.send({ votes, candidate: req.user });
  } catch (error) {
    next(error);
  }
};

exports.postUpdateManifesto = async function (req, res, next) {
  try {
    const candidateId = req.params.candidateId;
    const voteId = req.params.voteId;
    const manifesto = req.body.manifesto;

    let vote = await Vote.findOne({ _id: voteId, status: false });
    if (!vote) {
      throw newError("invalid voteId", 400);
    }

    const index = vote.candidates.findIndex(
      (e) => e.profile._id == candidateId
    );
    if (index < 0) {
      throw newError("invalid candidateId", 400);
    }

    vote.candidates[index].manifesto = manifesto;

    vote = await vote.save();

    res.status(200).send({ msg: "success" });
  } catch (error) {
    next(error);
  }
};
