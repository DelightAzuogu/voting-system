import React, { useEffect, useRef, useState } from "react";
import { API_URL } from "variables/URLs";
import EditPoll from "components/EditPoll";

import "../assets/css/style.css";
import { Bounce, ToastContainer, toast } from "react-toastify";

const ViewPolls = (props) => {
  const [polls, setpolls] = useState([]);
  const [pollId, setPollId] = useState();
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await fetch(`${API_URL}/poll/get-all`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const resData = await res.json();
        if (!res.ok) {
          throw resData;
        }
        setpolls(resData.polls);

        // console.log(resData.polls[0].description.split("\n"));
      } catch (error) {
        console.error(error);
      }
    };

    fetchPolls();

    const params = new URLSearchParams(window.location.search);
    const pollId = params.get("pollId");
    const edit = params.get("edit");

    if (edit) {
      setEdit(true);
    }
    if (pollId) {
      setPollId(pollId);
    } else {
      fetchPolls();
    }
  }, []);

  const pollDetailRef = useRef([]);

  //hide all other details and show the clicked one
  function onClickPoll(e, index) {
    const hidden = !pollDetailRef.current[index].hidden;

    for (let pollDetail of pollDetailRef.current) {
      pollDetail.hidden = true;
    }

    if (!hidden) {
      pollDetailRef.current[index].hidden = false;
    }
  }

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

  function SetEdit(pollId) {
    const queryParams = new URLSearchParams();
    queryParams.append("edit", true);
    queryParams.append("pollId", pollId);
    const url = new URL(window.location.href);
    url.search = queryParams.toString();
    window.location.href = url.toString();
  }

  function unSetPoll() {
    const { origin, pathname } = new URL(window.location.href);
    window.location.href = `${origin}${pathname}`;
  }

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
      unSetPoll();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="content">
      <ToastContainer />
      {edit ? (
        <EditPoll
          {...props}
          pollId={pollId}
          unSetPoll={unSetPoll}
          notify={notify}
        />
      ) : (
        <ul>
          {polls.map((poll, index) => (
            <li style={{ listStyle: "none" }} key={index}>
              <div className="list-poll container popping-div p-4 bg-dark text-white">
                <div className="row justify-content-md-center">
                  <div className="col-sm-8">
                    <p>
                      <strong>{poll.title.toUpperCase()}</strong>
                    </p>
                    <p>{poll.question}?</p>
                    <p>
                      Created by {poll.creator.profile.name} ---{" "}
                      {poll.creator.role}
                    </p>
                  </div>
                  <div className="col-sm d-flex align-items-center justify-content-center">
                    <div className="container">
                      <div className="row">
                        {/* <i className="nc-icon nc-minimal-right" /> */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            SetEdit(poll._id);
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
                  <div
                    className="col-sm d-flex align-items-center justify-content-center"
                    onClick={(e) => {
                      onClickPoll(e, index);
                    }}
                  >
                    <i className="nc-icon nc-minimal-down" />
                  </div>
                </div>
              </div>
              <div
                className="container"
                ref={(element) => (pollDetailRef.current[index] = element)}
                hidden={true}
              >
                <div className="row">
                  <div className="bg-secondary text-white poll-detail col">
                    <pre style={{ fontFamily: "inherit", color: "white" }}>
                      {poll.description}
                    </pre>
                    <ul>
                      {poll.options.map((option, index) => (
                        <li key={index}>{option.message}</li>
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

export default ViewPolls;
