import AddManifesto from "components/AddManifesto";
import ViewVotes from "components/ViewVotes";
import React, { useEffect, useState } from "react";
import { API_URL } from "variables/URLs";

const Manifesto = (props) => {
  const [votes, setVotes] = useState([]);
  const [voteId, setVoteId] = useState(null);
  const [candidate, setCandidate] = useState({});

  useEffect(() => {
    //gets the votes the student is a candidate in
    const getVotes = async function () {
      try {
        const res = await fetch(`${API_URL}/vote/get-my-manifesto-vote`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )} ${localStorage.getItem("role")}`,
          },
        });

        const resData = await res.json();
        if (!res.ok) {
          return resData;
        }
        setVotes(resData.votes);
        setCandidate(resData.candidate);
      } catch (error) {
        console.error(error);
      }
    };

    const params = new URLSearchParams(window.location.search);
    const voteId = params.get("voteId");

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
    console.log(voteId);
    const queryParams = new URLSearchParams();
    queryParams.append("voteId", voteId);
    queryParams.append("candidateId", candidate._id);
    const url = new URL(window.location.href);
    url.search = queryParams.toString();
    window.location.href = url.toString();
  }

  function unSetVote() {
    const { origin, pathname } = new URL(window.location.href);
    window.location.href = `${origin}${pathname}`;
  }

  return (
    <div className="content">
      {!voteId ? (
        <ViewVotes
          {...props}
          votes={votes}
          unSetVote={unSetVote}
          setVoteId={SetVoteId}
          setEdit={SetEdit}
          candidate={candidate}
        />
      ) : (
        <AddManifesto {...props} unSetVote={unSetVote} />
      )}
    </div>
  );
};

export default Manifesto;
