import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { API_URL } from "variables/URLs";

import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const ViewVote = (props) => {
  const [vote, setVote] = useState();
  const [optionIndex, setOptionIndex] = useState();
  const [voteId, setVoteId] = useState();

  useEffect(() => {
    async function getVote() {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        let res;

        // this is for if the user is in different pages

        let url = `${API_URL}/vote/get/${voteId}`;
        res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token} ${role}`,
          },
        });

        const resData = await res.json();
        if (!res.ok) {
          throw resData;
        }

        if (resData.index) {
          setOptionIndex(parseInt(resData.index));
        } else {
          setOptionIndex(resData.index);
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
    } else {
      props.unSetVote();
    }
  }, []);

  //for the voting
  async function onClickVoteButton(e, candidate) {
    e.preventDefault();
    // console.log(option);
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const res = await fetch(
        `${API_URL}/vote/vote/${voteId}/${candidate._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token} ${role}`,
          },
        }
      );
      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }
      setVote(resData.vote);
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
                props.unSetVote();
              }}
            >
              <i className="nc-icon nc-minimal-left" />
            </button>
          </div>
          {vote ? (
            <div className="poll-details">
              <h1>{vote.title.toUpperCase()}</h1>

              <div>
                <h4>Description:</h4>
                <p style={{ whiteSpace: "pre-wrap" }}>{vote.description}</p>

                <div className="created-by">
                  <h4>Created By:</h4>
                  <p>
                    <strong>ID: </strong>{" "}
                    <span>{vote.creator.profile._id}</span>
                    <br />
                    <strong>Name: </strong>
                    <span>{vote.creator.profile.name}</span>
                    <br />
                    <strong>Role: </strong>
                    <span>{vote.creator.role}</span>
                  </p>
                </div>
                <div className="eligible-departments">
                  <h4>Eligible Department to vote: </h4>
                  {vote.eligibleDepts[0] === "all" ? (
                    <p>All departments can vote</p>
                  ) : (
                    <ul>
                      {vote.eligibleDepts.map((dept, index) => (
                        <li key={index}>{dept}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="poll-options">
                  <ul className="list-group">
                    {vote.candidates.map((option, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center "
                      >
                        <div className="container">
                          <div className="row">
                            <div className="col-sm-6">
                              <div className="row">
                                {`${option.profile._id} ${option.profile.name}`}
                              </div>
                              <div className="row">
                                {option.profile.department.name}
                              </div>
                            </div>
                            {/* show the vote count is the user is the owner of the vote  */}
                            {props.my && (
                              <div className="col-sm-3">
                                <div className="d-flex align-items-center justify-content-center  badge bg-primary">
                                  {`${option.count} votes`}{" "}
                                </div>
                              </div>
                            )}
                            {/* there will be a vote button is the user hasn't voted before  */}
                            <div className="col-sm-3 d-flex align-items-center justify-content-center ">
                              {optionIndex == null && !vote.status ? (
                                <button
                                  className="btn btn-secondary btn-sm"
                                  onClick={(e) => {
                                    onClickVoteButton(e, option);
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
                            </div>
                          </div>
                          <div className="row">{option.manifesto}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="vote-result">
                  {vote.result.length > 0 && (
                    <>
                      <p>Result:</p>
                      <ul className="list-group">
                        {vote.result.map((result, index) => (
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
            <div className="invalid-poll">Invalid vote</div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewVote;
