//this is for only instructors and students, becuase they are the only ones that can vote for real.

import React from "react";
import "../assets/css/style.css";
import { API_URL } from "variables/URLs";

const ViewPolls = (props) => {
  async function onClickDeletePoll(e, pollId) {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const res = await fetch(`${API_URL}/poll/delete/${pollId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token} ${role}`,
        },
      });

      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }
      props.unSetPoll();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {props.polls.map((poll, index) => (
        <div className="list-poll container" key={index}>
          <div className="row justify-content-md-center">
            <div className="col-sm-8" style={{ padding: "15px" }}>
              <p>{poll.title.toUpperCase()}</p>
              <p>{poll.question}</p>
              <p>
                Created by {poll.creator.profile.name} --- {poll.creator.role}
              </p>
            </div>

            {/* //for the edit and delete  */}
            {props.my && (
              <div className="col-sm  d-flex align-items-center justify-content-center">
                <div className="container">
                  <div className="row">
                    {/* <i className="nc-icon nc-minimal-right" /> */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        props.setEdit(poll._id);
                      }}
                      className="btn btn-secondary btn-sm back-button"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="row">
                    {/* <i className="nc-icon nc-minimal-right" /> */}
                    <button
                      className="btn btn-danger btn-sm back-button"
                      onClick={(e) => {
                        onClickDeletePoll(e, poll._id);
                      }}
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div
              className="col col-lg-2 d-flex align-items-center justify-content-center"
              onClick={(e) => {
                props.setPoll(poll);
              }}
            >
              <i className="nc-icon nc-minimal-right" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ViewPolls;
