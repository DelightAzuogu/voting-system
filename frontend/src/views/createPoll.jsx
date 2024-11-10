import React, { useEffect, useRef, useState } from "react";
import { API_URL } from "variables/URLs";

const Poll = (prop) => {
  console.log("delight");
  const titleRef = useRef();
  const desRef = useRef();
  const questionRef = useRef();
  const dateRef = useRef();
  const addPollRef = useRef();

  const [pollsArray, setPollArray] = useState([]);
  const [depts, setDepts] = useState([]);
  const [deptSelect, setDeptSelect] = useState([]);

  useEffect(() => {
    async function getDepts() {
      try {
        const res = await fetch(`${API_URL}/departments/`, { method: "GET" });

        const resData = await res.json();
        if (!res.ok) {
          throw resData;
        }

        const depts = [];
        for (let dept of resData.departments) {
          // console.log(dept.name);
          depts.push(dept.name);
        }
        setDepts(depts);
      } catch (error) {
        console.error(error);
      }
    }
    getDepts();
  }, []);

  function addPollClick(e) {
    e.preventDefault();

    const addValue = addPollRef.current.value;

    if (addValue.length) {
      setPollArray([...pollsArray, addValue]);
    }
  }

  function deletePollOnClick(e) {
    e.preventDefault();

    const index = parseInt(e.target.value);
    const newPoll = pollsArray.filter((value, i) => index !== i);
    setPollArray(newPoll);
  }

  async function onSubmitCreatePoll(e) {
    e.preventDefault();
    const title = titleRef.current.value;
    const question = questionRef.current.value;
    const description = desRef.current.value;
    const dateTime = dateRef.current.value;

    const departments = deptSelect.length ? deptSelect : "all";

    try {
      const token = localStorage.getItem("token"),
        role = localStorage.getItem("role");

      const url = `${API_URL}/poll/create`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token} ${role}`,
        },
        body: JSON.stringify({
          title,
          question,
          description,
          dateTime,
          polls: pollsArray,
          departments,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }
      console.log(resData);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

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

  return (
    <div className="content">
      <form
        onSubmit={(e) => {
          onSubmitCreatePoll(e);
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
            <div className="col">
              {/* question  */}
              <div className="form-group m-form">
                <div className="input-group-prepend">
                  <label htmlFor="question">Question</label>
                </div>
                <input
                  className="form-control"
                  type="text"
                  name="question"
                  id="question"
                  ref={questionRef}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="container form-group m-form">
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

        <div className="container">
          <div className="row">
            <div className="col">
              {/* date and time  */}
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
              {/* for adding poll logic */}
              <div className="form-group m-form">
                <div className="input-group-prepend">
                  <label htmlFor="addPoll">Add Poll</label>
                </div>
                <input
                  type="text"
                  ref={addPollRef}
                  name="addPoll"
                  id="addPoll"
                  className="form-control"
                />
                <button
                  onClick={(e) => {
                    addPollClick(e);
                  }}
                >
                  ADD
                </button>
              </div>
            </div>
            {/* second col  */}
            <div className="col">
              <div className="form-group m-form">
                <div className="input-group-prepend">
                  <label htmlFor="deletePoll">Delete Poll</label>
                </div>
                <select
                  id="deletePoll"
                  name="deletePoll"
                  className="form-select form-control custom-select"
                  size={5}
                >
                  <option value="tap to delete poll" key={-1}>
                    Click To Delete Poll
                  </option>
                  {pollsArray.map((poll, index) => (
                    <option
                      onClick={(e) => {
                        deletePollOnClick(e);
                      }}
                      key={index}
                      value={index}
                    >
                      {`${poll}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
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

export default Poll;
