import React, { useRef, useState, useEffect } from "react";
import { API_URL } from "variables/URLs";

const CreateVote = (props) => {
  const [students, setStudents] = useState([]);
  const [studentSelect, setStudentSelect] = useState([]);
  const [depts, setDepts] = useState([]);
  const [deptSelect, setDeptSelect] = useState([]);

  const titleRef = useRef();
  const desRef = useRef();
  const dateRef = useRef();

  useEffect(() => {
    async function getVote() {
      try {
        const res = await fetch(`${API_URL}/vote/`, {
          method: "GET",
        });

        const resData = await res.json();
        if (!res.ok) {
          throw resData;
        }
        setStudents(resData.students);
        const depts = [];
        for (let dept of resData.departments) {
          depts.push(dept.name);
        }
        setDepts(depts);
      } catch (error) {
        console.error(error);
      }
    }

    getVote();
  }, []);

  function onClickAddDepts(e, index) {
    e.preventDefault();
    // add the dept to the selected
    setDeptSelect([...deptSelect, depts[index]]);

    // remove the dept from the depts
    let newdepts = depts.filter((e, i) => i !== index);
    setDepts(newdepts);
  }

  function onClickDeleteDepts(e, index) {
    e.preventDefault();

    setDepts([...depts, deptSelect[index]]);

    let newDeptSelect = deptSelect.filter((e, i) => i !== index);
    setDeptSelect(newDeptSelect);
  }

  function onClickAddStudent(index) {
    setStudentSelect([...studentSelect, students[index]]);

    let newStudents = students.filter((e, i) => i !== index);
    setStudents(newStudents);
  }

  function onClickDeleteStudent(index) {
    setStudents([...students, studentSelect[index]]);

    let newStudentsSelect = studentSelect.filter((e, i) => i !== index);
    setStudentSelect(newStudentsSelect);
  }

  async function onClickCreateVote(e) {
    e.preventDefault();
    try {
      const title = titleRef.current.value;
      const description = desRef.current.value;
      const dateTime = dateRef.current.value;

      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      const departments = deptSelect.length > 0 ? deptSelect : "all";

      if (studentSelect.length < 2) {
        throw new Error("Please select at least two students");
      }
      const students = studentSelect.filter((e) => {
        return e._id;
      });

      const res = await fetch(`${API_URL}/vote/create`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token} ${role}`,
        },
        body: JSON.stringify({
          title,
          description,
          dateTime,
          departments,
          students,
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw resData;
      }
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="content">
      <form
        onSubmit={(e) => {
          onClickCreateVote(e);
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col">
              {/* title  */}
              <div className="form-group m-form">
                <div className="input-group-prepend">
                  <label htmlFor="title">Title</label>
                </div>
                <input
                  className="form-control"
                  type="text"
                  name="title"
                  id="title"
                  ref={titleRef}
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="row">
            <div className="col">
              <div className="form-group m-form">
                <div className="input-group-prepend">
                  <label htmlFor="desc">Description</label>
                </div>
                <textarea
                  className="form-control"
                  name="desc"
                  id="desc"
                  ref={desRef}
                  style={{ minHeight: "150px" }}
                  required
                />
              </div>
            </div>
          </div>

          {/* for the date and time  */}
          <div className="row">
            <div className="col">
              <div className="form-group m-form">
                <div className="input-group-prepend">
                  <label htmlFor="date">Date and Time</label>
                </div>
                <input
                  className="form-control"
                  type="datetime-local"
                  name="date"
                  id="date"
                  ref={dateRef}
                  required
                />
              </div>
            </div>
          </div>

          {/* for the students  */}
          <div className="row">
            <div className="col">
              {/* for adding students  */}
              <div className="form-group m-form">
                <div className="input-group-prepend">
                  <label htmlFor="addStudent">Add Student</label>
                </div>

                <select
                  className="form-select form-control custom-select"
                  name="addstudent"
                  id="addstudent"
                  size={5}
                >
                  <option>Click to add student as candidate</option>
                  {students.map((student, index) => (
                    <option
                      key={index}
                      value={student.id}
                      onClick={(e) => {
                        onClickAddStudent(index);
                      }}
                    >
                      {`${student._id} ${student.name}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col">
              {/* for the deleting of students  */}
              <div className="input-group-prepend">
                <label htmlFor="deleteStudents">Delete Students</label>
              </div>
              <select
                className="form-select form-control custom-select"
                name="deletestudent"
                id="deletestudent"
                size={5}
              >
                <option>Click to remove student as candidate</option>
                {studentSelect.map((student, index) => (
                  <option
                    key={index}
                    value={student.id}
                    onClick={(e) => {
                      onClickDeleteStudent(index);
                    }}
                  >
                    {`${student._id} ${student.name}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* //for the departments */}
          <div className="row">
            <div className="col">
              {/* //adding department */}
              <div className="input-group-prepend">
                <label htmlFor="addDepts">Add Departments</label>
              </div>
              <select
                id="addDepts"
                name="addDepts"
                className="form-select form-control custom-select"
                size={5}
              >
                <option value="tap to add dept">
                  Click a department to add
                </option>
                {depts.map((dept, index) => (
                  <option
                    key={index}
                    value={dept}
                    onClick={(e) => {
                      onClickAddDepts(e, index);
                    }}
                  >
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            {/* for the deleting of depart */}
            <div className="col">
              <div className="input-group-prepend">
                <label htmlFor="deleteDepts">Delete Departments</label>
              </div>
              <select
                id="deleteDepts"
                name="deleteDepts"
                className="form-select form-control custom-select"
                size={5}
              >
                <option value="tap to delete dept">
                  Click a department to Delete
                </option>
                {deptSelect.map((dept, index) => (
                  <option
                    onClick={(e) => {
                      onClickDeleteDepts(e, index);
                    }}
                    key={index}
                    value={dept}
                  >
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* //submit button */}
        <div className="text-center m-form">
          <input
            type="submit"
            value="Create Poll"
            className="btn btn-dark btn-lg"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateVote;
