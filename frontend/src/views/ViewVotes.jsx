import React, { useEffect, useRef, useState } from "react";
import "../assets/css/style.css";
import { API_URL } from "variables/URLs";
import EditVote from "components/EditVote";
import { Bounce, ToastContainer, toast } from "react-toastify";

const ViewVotes = (props) => {
  const [votes, setVotes] = useState([]);
  const [voteId, setVoteId] = useState();
  const [edit, setEdit] = useState(false);

  const detailRef = useRef([]);

  useEffect(() => {
    const getVotes = async () => {
      try {
        const res = await fetch(`${API_URL}/vote/get-all`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const resData = await res.json();
        if (!res.ok) {
          throw resData;
        }

        for (let vote of resData) {
          const expTime = new Date(vote.expMil);
          vote.expTime = expTime;
        }
        setVotes(resData);

        // console.log(resData.polls[0].description.split("\n"));
      } catch (error) {
        console.error(error);
      }
    };

    // getVotes();

    const params = new URLSearchParams(window.location.search);
    const voteId = params.get("voteId");
    const edit = params.get("edit");

    if (edit) {
      setEdit(true);
    }
    if (voteId) {
      setVoteId(voteId);
    } else {
      getVotes();
    }
  }, []);

  const notify = (type, message) => {
    const option = {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    };

    switch (type) {
      case "info":
        toast.info(message, option);
        break;
      case "success":
        toast.success(message, option);
        break;
      case "error":
        toast.error(message, option);
        break;
      case "warning":
        toast.warn(message, option);
        break;
      default:
        toast(message, option);
    }
  };

  function onClickVote(e, index) {
    const hidden = !detailRef.current[index].hidden;

    for (let pollDetail of detailRef.current) {
      pollDetail.hidden = true;
    }

    if (!hidden) {
      detailRef.current[index].hidden = false;
    }
  }

  async function onClickDeleteVote(e, voteId) {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const res = await fetch(`${API_URL}/vote/delete/${voteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token} ${role}`,
        },
      });

      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }
      //  unSetPoll();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  function unSetVote() {
    const { origin, pathname } = new URL(window.location.href);
    window.location.href = `${origin}${pathname}`;
  }

  function SetEdit(voteId) {
    const queryParams = new URLSearchParams();
    queryParams.append("edit", true);
    queryParams.append("voteId", voteId);
    const url = new URL(window.location.href);
    url.search = queryParams.toString();
    window.location.href = url.toString();
  }

  return (
    <div className="content">
      <ToastContainer />

      {edit ? (
        <EditVote
          {...props}
          voteId={voteId}
          unSetVote={unSetVote}
          notify={notify}
        />
      ) : (
        <ul>
          {votes.map((vote, index) => (
            <li style={{ listStyle: "none" }} key={index}>
              <div className="list-poll container popping-div p-4 bg-dark text-white">
                <div className="row justify-content-md-center">
                  <div className="col-sm-8">
                    <p>
                      <strong>{vote.title.toUpperCase()}</strong>
                    </p>
                    <p>
                      Created by {vote.creator.profile.name} ---{" "}
                      {vote.creator.role}
                    </p>
                    <p>
                      {`Expire: ${vote.expTime.toDateString()} ${vote.expTime.getHours()}:${vote.expTime.getMinutes()}`}
                    </p>
                  </div>
                  <div className="col-sm d-flex align-items-center justify-content-center">
                    <div className="container">
                      <div className="row">
                        {/* <i className="nc-icon nc-minimal-right" /> */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            SetEdit(vote._id);
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
                            onClickDeleteVote(e, vote._id);
                          }}
                        >
                          DELETE
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-sm d-flex align-items-center justify-content-center"
                    onClick={(e) => {
                      onClickVote(e, index);
                    }}
                  >
                    <i className="nc-icon nc-minimal-down" />
                  </div>
                </div>
              </div>
              <div
                className="container"
                ref={(element) => (detailRef.current[index] = element)}
                hidden={true}
              >
                <div className="row">
                  <div className="bg-secondary text-white poll-detail col">
                    <pre style={{ fontFamily: "inherit", color: "white" }}>
                      {vote.description}
                    </pre>
                    <ul>
                      {vote.candidates.map((candidate, index) => (
                        <li key={index}>
                          {`${candidate.profile._id} ${candidate.profile.name}`}
                          {candidate.manifesto && (
                            <pre>{candidate.manifesto} deed</pre>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewVotes;
