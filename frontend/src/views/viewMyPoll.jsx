import ViewPoll from "components/ViewPoll";
import ViewPolls from "components/ViewPolls";
import React, { useState, useEffect } from "react";
import { API_URL } from "variables/URLs";
import EditPoll from "components/EditPoll";
import { Bounce, ToastContainer, toast } from "react-toastify";

const ViewMyPolls = (props) => {
  const [polls, setPolls] = useState([]);
  const [pollId, setPollId] = useState(null);
  const [edit, setEdit] = useState(false);

  async function getPolls() {
    try {
      const token = localStorage.getItem("token"),
        role = localStorage.getItem("role");
      const res = await fetch(`${API_URL}/poll/get-my-polls`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token} ${role}`,
        },
      });
      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }
      setPolls(resData.polls);
      // console.log(resData);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pollId = params.get("pollId");
    const edit = params.get("edit");

    if (edit) {
      setEdit(true);
    }

    if (pollId) {
      setPollId(pollId);
    } else {
      getPolls();
    }
  }, []);

  function SetEdit(pollId) {
    const queryParams = new URLSearchParams();
    queryParams.append("edit", true);
    queryParams.append("pollId", pollId);
    const url = new URL(window.location.href);
    url.search = queryParams.toString();
    window.location.href = url.toString();
  }

  function SetPoll(poll) {
    const queryParams = new URLSearchParams();
    queryParams.append("pollId", poll._id);
    const url = new URL(window.location.href);
    url.search = queryParams.toString();
    window.location.href = url.toString();
  }

  function unSetPoll() {
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
        <EditPoll
          {...props}
          pollId={pollId}
          unSetPoll={unSetPoll}
          notify={notify}
        />
      ) : pollId ? (
        <ViewPoll
          {...props}
          unSetPoll={unSetPoll}
          pollId={pollId}
          notify={notify}
        />
      ) : (
        <ViewPolls
          {...props}
          polls={polls}
          unSetPoll={unSetPoll}
          setPoll={SetPoll}
          setEdit={SetEdit}
          notify={notify}
          my={"my"}
        />
      )}
    </div>
  );
};

export default ViewMyPolls;
