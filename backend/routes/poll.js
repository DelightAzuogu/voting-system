const { Router } = require("express");
const { check } = require("express-validator");

const controller = require("../controllers/poll");
const isInstructorOrStudent = require("../middleware/isInstructorOrStudent");
const isInstructorOrStudentOrAdmin = require("../middleware/isInstructorOrStudentOrAdmin");
const isAdmin = require("../middleware/isAdmin");
const router = Router();

//get all polls
router.get("/get-all", isAdmin, controller.getAllPolls);

//get userPolls (avaiable for only instructor and student);
router.get(
  "/get-my-polls",
  isInstructorOrStudentOrAdmin,
  controller.getMyPolls
);

router.get(
  "/get-my-poll/:pollId",
  isInstructorOrStudentOrAdmin,
  controller.getMyPoll
);

router.get(
  "/get-eligible-polls",
  isInstructorOrStudent,
  controller.getEligiblePoll
);

//post vote
//vote for an option
router.post(
  "/vote/:pollId",
  isInstructorOrStudent,
  [check("optionId").notEmpty().trim()],
  controller.postCastVote
);

router.post(
  "/create",
  isInstructorOrStudentOrAdmin,
  [
    check("title").notEmpty().trim(),
    check("description").notEmpty().trim(),
    check("polls").isArray(),
    check("dateTime").isAlphanumeric(undefined, { ignore: "- :" }).trim(),
    check("question").isAlphanumeric(undefined, { ignore: " " }).trim(),
    check("departments").notEmpty(),
  ],
  controller.postCreatePoll
);

router.delete(
  "/delete/:pollId",
  isInstructorOrStudentOrAdmin,
  controller.deletePoll
);

router.get("/edit/:pollId", isInstructorOrStudentOrAdmin, controller.getEdit);

router.post(
  "/edit/:pollId",
  isInstructorOrStudentOrAdmin,
  [
    check("title").notEmpty().trim(),
    check("description").notEmpty().trim(),
    check("question").isAlphanumeric(undefined, { ignore: " " }).trim(),
    check("departments").notEmpty(),
    check("dateTime").isAlphanumeric(undefined, { ignore: "- :" }).trim(),
  ],
  controller.postEditPoll
);

//get a poll.
router.get("/:id", isInstructorOrStudentOrAdmin, controller.getPoll);

module.exports = router;
