import React, { useState, useEffect } from "react";
import { API_URL } from "variables/URLs";
import ViewVotes from "components/ViewVotes";
import ViewVote from "components/ViewVote";
import EditVote from "components/EditVote";
import { Bounce, ToastContainer, toast } from "react-toastify";

const ViewMyVotes = (props) => {
  const [votes, setVotes] = useState([]);
  const [voteId, setVoteId] = useState(null);
  const [edit, setEdit] = useState(false);

  async function getVotes() {
    try {
      const token = localStorage.getItem("token"),
        role = localStorage.getItem("role");
      const res = await fetch(`${API_URL}/vote/get-my-votes`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token} ${role}`,
        },
      });
      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }
      setVotes(resData.votes);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
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

  function SetEdit(voteId) {
    const queryParams = new URLSearchParams();
    queryParams.append("edit", true);
    queryParams.append("voteId", voteId);
    const url = new URL(window.location.href);
    url.search = queryParams.toString();
    window.location.href = url.toString();
  }

  function SetVoteId(voteId) {
    const queryParams = new URLSearchParams();
    queryParams.append("voteId", voteId);
    const url = new URL(window.location.href);
    url.search = queryParams.toString();
    window.location.href = url.toString();
  }

  function unSetVote() {
    const { origin, pathname } = new URL(window.location.href);
    window.location.href = `${origin}${pathname}`;
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
      ) : voteId ? (
        <ViewVote
          {...props}
          unSetVote={unSetVote}
          voteId={voteId}
          notify={notify}
          my={"my"}
        />
      ) : (
        <ViewVotes
          {...props}
          votes={votes}
          unSetVote={unSetVote}
          setVoteId={SetVoteId}
          setEdit={SetEdit}
          notify={notify}
          my={"my"}
        />
      )}
    </div>
  );
};

export default ViewMyVotes;
