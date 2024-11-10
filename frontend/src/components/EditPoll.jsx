import React, { useEffect, useState, useRef } from "react";
import { API_URL } from "variables/URLs";

const EditPoll = (props) => {
  const [poll, setPoll] = useState(null);
  const [depts, setDepts] = useState([]);
  const [deptSelect, setDeptSelect] = useState([]);
  const titleRef = useRef(null);
  const desRef = useRef(null);
  const questionRef = useRef(null);
  const dateRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        // Fetch poll data
        const pollResponse = await fetch(
          `${API_URL}/poll/edit/${props.pollId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token} ${role}`,
            },
          }
        );
        const pollData = await pollResponse.json();
        if (!pollResponse.ok) {
          throw pollData;
        }

        const departmentsResponse = await fetch(`${API_URL}/departments/`, {
          method: "GET",
        });
        const departmentsData = await departmentsResponse.json();
        if (!departmentsResponse.ok) {
          throw departmentsData;
        }

        setPoll(pollData.poll);
        const depts = departmentsData.departments.map((dept) => dept.name);
        setDepts(depts);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [props.pollId]);

  useEffect(() => {
    if (poll) {
      const filteredDepts = depts.filter(
        (dept) => !poll.eligibleDepts.includes(dept)
      );
      setDepts(filteredDepts);
      setDeptSelect(poll.eligibleDepts);
      titleRef.current.value = poll.title;
      questionRef.current.value = poll.question;
      desRef.current.value = poll.description;
      console.log(poll.expMil);
      const expDate = new Date(poll.expMil);
      const dateString = expDate.toISOString().substring(0, 16);
      dateRef.current.value = dateString;
    }
  }, [poll]);

  const onSubmitEditPoll = async (e) => {
    e.preventDefault();
    try {
      const title = titleRef.current.value;
      const question = questionRef.current.value;
      const description = desRef.current.value;
      const date = dateRef.current.value;
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      const res = await fetch(`${API_URL}/poll/edit/${props.pollId}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token} ${role}`,
        },
        body: JSON.stringify({
          title,
          question,
          description,
          dateTime: date,
          departments: deptSelect.length ? deptSelect : "all",
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }

      props.unSetPoll();
    } catch (error) {
      console.error(error);
      props.notify("error", error.msg);
    }
  };

  const onClickAddDepts = (index) => {
    const selectedDept = depts[index];
    setDeptSelect([...deptSelect, selectedDept]);
    const updatedDepts = depts.filter((_, i) => i !== index);
    setDepts(updatedDepts);
  };

  const onClickDeleteDepts = (index) => {
    const deletedDept = deptSelect[index];
    setDepts([...depts, deletedDept]);
    const updatedDeptSelect = deptSelect.filter((_, i) => i !== index);
    setDeptSelect(updatedDeptSelect);
  };

  return (
    <div className="content">
      <div>
        <button
          type="button"
          className="btn btn-secondary btn-sm back-button"
          onClick={() => props.unSetPoll()}
        >
          <i className="nc-icon nc-minimal-left" />
        </button>
      </div>
      {poll ? (
        <form onSubmit={onSubmitEditPoll}>
          {/* Title and Question fields */}
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="form-group m-form">
                  <label htmlFor="title">Title</label>
                  <input
                    ref={titleRef}
                    className="form-control"
                    type="text"
                    name="title"
                    id="title"
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="form-group m-form">
                  <label htmlFor="question">Question</label>
                  <input
                    ref={questionRef}
                    className="form-control"
                    type="text"
                    name="question"
                    id="question"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description field */}
          <div className="container form-group m-form">
            <label htmlFor="desc">Description</label>
            <textarea
              ref={desRef}
              className="form-control"
              name="desc"
              id="desc"
              style={{ minHeight: "150px" }}
              required
            />
          </div>

          {/* Date and Time field */}
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="form-group m-form">
                  <label htmlFor="date">Date and Time</label>
                  <input
                    ref={dateRef}
                    className="form-control"
                    type="datetime-local"
                    name="date"
                    id="date"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Add and Delete Departments options */}
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="form-group m-form">
                  <label htmlFor="addDepts">Add Departments</label>
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
                        onClick={() => onClickAddDepts(index)}
                      >
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col">
                <div className="form-group m-form">
                  <label htmlFor="deleteDepts">Delete Departments</label>
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
                        key={index}
                        value={dept}
                        onClick={() => onClickDeleteDepts(index)}
                      >
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Note about reopening a closed poll */}
          <div className="text-center m-form">
            <br />
            <span>
              <strong>NOTE: </strong>This will re-open the poll if closed
            </span>
          </div>

          {/* Submit button */}
          <div className="text-center m-form">
            <input
              type="submit"
              value="EDIT Poll"
              className="btn btn-dark btn-lg"
            />
          </div>
        </form>
      ) : (
        <strong>Invalid poll</strong>
      )}
    </div>
  );
};

export default EditPoll;
