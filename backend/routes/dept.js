const { Router } = require("express");

const controller = require("../controllers/dept");
const router = Router();

router.get("/", controller.getDepartments);
module.exports = router;
