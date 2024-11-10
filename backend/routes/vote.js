const { Router } = require("express");

const controller = require("../controllers/vote");
const isINstructorOrAdmin = require("../middleware/isINstructorOrAdmin");
const { check } = require("express-validator");
const isAdmin = require("../middleware/isAdmin");
const isInstructorOrStudent = require("../middleware/isInstructorOrStudent");
const isInstructorOrStudentOrAdmin = require("../middleware/isInstructorOrStudentOrAdmin");
const isStudent = require("../middleware/isStudent");

const router = Router();

// this is to get all the neccessary things to create a vote
router.get("/", controller.getInitVote);

//get all
//to get all the votes
router.get("/get-all", isAdmin, controller.getAllVotes);

//get my votes
router.get("/get-my-votes", isINstructorOrAdmin, controller.getMyVotes);

//get eligible votes
router.get(
  "/get-eligible-votes",
  isInstructorOrStudent,
  controller.getEligibleVotes
);

//get voteId
//to get a specific vote
router.get("/get/:voteId", isInstructorOrStudentOrAdmin, controller.getVote);

//get manifesto
//get Votes with manifesto
router.get("/get-my-manifesto-vote", isStudent, controller.getManifestoVote);

router.post(
  "/update-manifesto/:candidateId/:voteId",
  // isStudent,
  [check("manifesto").notEmpty()],
  controller.postUpdateManifesto
);

router.post(
  "/create",
  isINstructorOrAdmin,
  [
    check("title").notEmpty().trim(),
    check("description").notEmpty().trim(),
    check("departments").notEmpty(),
    check("dateTime").isAlphanumeric(undefined, { ignore: "- :" }).trim(),
    check("students").notEmpty(),
  ],
  controller.postCreateVote
);

router.post(
  "/edit/:voteId",
  isINstructorOrAdmin,
  [
    check("title").notEmpty().trim(),
    check("description").notEmpty().trim(),
    check("departments").notEmpty(),
    check("dateTime").isAlphanumeric(undefined, { ignore: "- :" }).trim(),
  ],
  controller.postEditVote
);

router.post(
  "/vote/:voteId/:candidateId",
  isInstructorOrStudent,
  controller.postCastVote
);

router.delete("/delete/:voteId", isINstructorOrAdmin, controller.deleteVote);

module.exports = router;
