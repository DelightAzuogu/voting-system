import React, { useEffect, useState, useRef } from "react";
import { API_URL } from "variables/URLs";

var stop = 100;

const EditVote = (props) => {
  const [render, setRender] = useState(false);
  const [vote, setVote] = useState();
  const [depts, setDepts] = useState([]);
  const [deptSelect, setDeptSelect] = useState([]);
  const [voteId, setVoteId] = useState();

  const titleRef = useRef();
  const desRef = useRef();
  const dateRef = useRef();

  useEffect(() => {
    //getting the poll

    async function getDepts() {
      try {
        const res = await fetch(`${API_URL}/departments/`, {
          method: "GET",
        });

        const resData = await res.json();
        if (!res.ok) {
          throw resData;
        }

        const depts = [];
        for (let dept of resData.departments) {
          depts.push(dept.name);
        }
        setDepts(depts);
      } catch (error) {
        console.error(error);
      }
    }

    async function getVote() {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        const res = await fetch(`${API_URL}/vote/get/${props.voteId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token} ${role}`,
          },
        });

        const resData = await res.json();
        if (!res.ok) {
          throw resData;
        }
        setVote(resData.vote);
      } catch (error) {
        console.error(error);
      }
    }

    const params = new URLSearchParams(window.location.search);
    const voteId = params.get("voteId");
    if (voteId) {
      setVoteId(voteId);
      getVote();

      //getting the departments
      getDepts();
    } else {
      // props.unSetVote();
    }

    setRender(!render);
  }, []);

  useEffect(() => {
    // Check if the poll and departments are loaded before setting deptSelect
    if (vote && depts.length) {
      if (vote.eligibleDepts[0] !== "all") {
        setDeptSelect(vote.eligibleDepts);

        // Filter out selected departments from depts array
        const newDepts = depts.filter(
          (dept) => !vote.eligibleDepts.includes(dept)
        );
        setDepts(newDepts);
      }
    } else if (stop > 0) {
      stop--;
      setRender(!render);
    }

    if (vote) {
      titleRef.current.value = vote.title;
      desRef.current.value = vote.description;
      const expDate = new Date(vote.expMil);

      let year = expDate.getFullYear();
      let month = expDate.getMonth() + 1;
      let day = expDate.getDate();
      let hour = expDate.getHours();
      let min = expDate.getMinutes();

      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      if (hour < 10) {
        hour = "0" + hour;
      }
      if (min < 10) {
        min = "0" + min;
      }

      dateRef.current.value = `${year}-${month}-${day}T${hour}:${min}`;
    }
  }, [render]);

  async function onSubmitEditVote(e) {
    e.preventDefault();
    try {
      const title = titleRef.current.value;
      const description = desRef.current.value;
      const date = dateRef.current.value;

      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      const res = await fetch(`${API_URL}/vote/edit/${props.voteId}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token} ${role}`,
        },
        body: JSON.stringify({
          title,
          description,
          dateTime: date,
          departments: deptSelect.length ? deptSelect : "all",
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }

      props.unSetVote();
    } catch (error) {
      console.error(error);
      props.notify("error", error.msg);
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
      <div>
        <button
          type="button"
          className="btn btn-secondary btn-sm back-button"
          onClick={(e) => {
            e.preventDefault();
            props.unSetVote();
          }}
        >
          <i className="nc-icon nc-minimal-left" />
        </button>
      </div>
      {vote ? (
        <form
          onSubmit={(e) => {
            onSubmitEditVote(e);
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
          {/* a note of reopening a closed poll;  */}
          <div className="text-center m-form">
            <br />
            <span>
              <strong>NOTE: </strong>This will re-open the Vote if closed
            </span>
          </div>

          {/* //submit button */}
          <div className="text-center m-form">
            <input
              type="submit"
              value="EDIT VOTE"
              className="btn btn-dark btn-lg"
            />
          </div>
        </form>
      ) : (
        <strong>Invalid Vote</strong>
      )}
    </div>
  );
};

export default EditVote;
