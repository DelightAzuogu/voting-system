const bcrypt = require("bcrypt");

const { Instructor } = require("../models/instructor");
const { Student } = require("../models/student");
const { Admin } = require("../models/admin");
const { Department } = require("../models/department");

exports.createDummy = async () => {
  const passHash = bcrypt.hashSync("password", 12);

  //create admins
  let i = 0;
  Admin.create({ name: "Admin 1", _id: ++i, password: passHash });
  Admin.create({ name: "Admin 2", _id: ++i, password: passHash });
  Admin.create({ name: "Admin 3", _id: ++i, password: passHash });

  //create department
  const comp = await Department.create({
    faculty: "Engineering",
    name: "computer Engineering",
  });

  const soft = await Department.create({
    faculty: "Engineering",
    name: "software Engineering",
  });

  const arc = await Department.create({
    faculty: "Architecture",
    name: "Architecture",
  });

  const nurse = await Department.create({
    faculty: "Health Science",
    name: "Nusing",
  });

  const dent = await Department.create({
    faculty: "Health Science",
    name: "Dentistry",
  });

  // create Instructors
  i = 0;
  Instructor.create({
    _id: ++i,
    name: "First Instructor",
    email: "test@test.com",
    department: comp,
    password: passHash,
  });

  Instructor.create({
    _id: ++i,
    name: "Second instructor",
    email: "test@test.com",
    department: soft,
    password: passHash,
  });

  Instructor.create({
    _id: ++i,
    name: "third Instructor",
    email: "test@test.com",
    department: comp,
    password: passHash,
  });

  Instructor.create({
    _id: ++i,
    name: "forth Instructor",
    email: "test@test.com",
    department: arc,
    password: passHash,
  });

  //create the students
  i = 0;
  Student.create({
    _id: ++i,
    name: "student 1",
    email: "test@test.com",
    password: passHash,
    department: comp,
  });
  Student.create({
    _id: ++i,
    name: "student 2",
    email: "test@test.com",
    password: passHash,
    department: comp,
  });
  Student.create({
    _id: ++i,
    name: "student 3",
    email: "test@test.com",
    password: passHash,
    department: comp,
  });
  Student.create({
    _id: ++i,
    name: "student 4",
    email: "test@test.com",
    password: passHash,
    department: comp,
  });

  Student.create({
    _id: ++i,
    name: "student 5",
    email: "test@test.com",
    password: passHash,
    department: soft,
  });
  Student.create({
    _id: ++i,
    name: "student 6",
    email: "test@test.com",
    password: passHash,
    department: soft,
  });
  Student.create({
    _id: ++i,
    name: "student 7",
    email: "test@test.com",
    password: passHash,
    department: soft,
  });
};
