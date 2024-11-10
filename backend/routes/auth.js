const { Router } = require("express");
const { body } = require("express-validator");

const controller = require("../controllers/auth");

const router = Router();

router.post(
  "/login/:user",
  [
    body("id").isNumeric().trim(),
    body("password").isAlphanumeric(undefined, { ignore: " " }).trim(),
  ],
  controller.postLogin
);

module.exports = router;
