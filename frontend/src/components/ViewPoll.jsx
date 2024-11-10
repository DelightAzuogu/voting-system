import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { API_URL } from "variables/URLs";

import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const ViewPoll = (props) => {
  const [poll, setPoll] = useState();
  const [optionIndex, setOptionIndex] = useState();

  const { pathname, search } = useLocation();
  const component = pathname.split("/")[2].split("-")[0];
  const pollId = search.split("=")[1];

  useEffect(() => {
    async function getPoll() {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        let res;

        // this is for if the user is in different pages
        if (component === "my") {
          let url = `${API_URL}/poll/get-my-poll/${pollId}`;
          res = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token} ${role}`,
            },
          });
        } else {
          let url = `${API_URL}/poll/${pollId}`;
          res = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token} ${role}`,
            },
          });
        }

        const resData = await res.json();
        if (!res.ok) {
          throw resData;
        }

        if (resData.index) {
          setOptionIndex(parseInt(resData.index));
        } else {
          setOptionIndex(resData.index);
        }
        setPoll(resData.poll);
      } catch (error) {
        console.error(error);
      }
    }

    getPoll();
  }, [component, pollId]);

  //for the voting
  async function onClickVoteButton(e, option, index) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const res = await fetch(`${API_URL}/poll/vote/${pollId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token} ${role}`,
        },
        body: JSON.stringify({ optionId: option._id }),
      });
      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }
      setPoll(resData.poll);
      setOptionIndex(resData.index);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="container">
        <div className="col">
          <div className="row">
            <button
              type="button"
              className="btn btn-secondary btn-sm back-button"
              onClick={(e) => {
                e.preventDefault();
                props.unSetPoll();
              }}
            >
              <i className="nc-icon nc-minimal-left" />
            </button>
          </div>
          {poll ? (
            <div className="poll-details">
              <h1>{poll.title.toUpperCase()}</h1>
              <p>{poll.question}?</p>

              <div>
                <h4>Description:</h4>
                <p>{poll.description}</p>

                <div className="created-by">
                  <h4>Created By:</h4>
                  <p>
                    <strong>ID: </strong>{" "}
                    <span>{poll.creator.profile._id}</span>
                    <br />
                    <strong>Name: </strong>
                    <span>{poll.creator.profile.name}</span>
                    <br />
                    <strong>Role: </strong>
                    <span>{poll.creator.role}</span>
                  </p>
                </div>
                <div className="eligible-departments">
                  <h4>Eligible Department to vote: </h4>
                  {poll.eligibleDepts[0] === "all" ? (
                    <p>All departments can vote</p>
                  ) : (
                    <ul>
                      {poll.eligibleDepts.map((dept, index) => (
                        <li key={index}>{dept}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="poll-options">
                  <ul className="list-group">
                    {poll.options.map((option, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {option.message}
                        {/* show the vote count is the user is the owner of the poll  */}
                        <span className="badge bg-primary">
                          {component === "my" && option.count + " votes"}
                        </span>
                        {/* there will be a vote button is the user hasn't voted before  */}
                        {optionIndex == null && !poll.status ? (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={(e) => {
                              onClickVoteButton(e, option, index);
                            }}
                          >
                            VOTE
                          </button>
                        ) : // {/* identify the option the user voted if the user has voted */}

                        optionIndex === index ? (
                          <span className="badge bg-primary">Voted</span>
                        ) : (
                          <span className="badge bg-primary"> </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="poll-result">
                  {poll.result.length > 0 && (
                    <>
                      <p>Result:</p>
                      <ul className="list-group">
                        {poll.result.map((result, index) => (
                          <li key={index} className="list-group-item">
                            {result}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="invalid-poll">Invalid poll</div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewPoll;
