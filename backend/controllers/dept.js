const { Department } = require("../models/department");

exports.getDepartments = async (req, res, next) => {
  try {
    const depts = await Department.find();

    res.status(200).send({ departments: depts });
  } catch (error) {
    next(error);
  }
};
