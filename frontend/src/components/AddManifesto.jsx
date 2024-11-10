import React, { useEffect, useRef, useState } from "react";
import { API_URL } from "variables/URLs";

const AddManifesto = (props) => {
  const [vote, setVote] = useState();
  const [voteId, setVoteId] = useState();
  const [manifesto, setManifesto] = useState("");
  const [candidateId, setCandidateId] = useState();

  const manifestoRef = useRef();

  useEffect(() => {
    async function getVote() {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        let res;

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

        setVote(resData.vote);
      } catch (error) {
        console.error(error);
      }
    }

    const params = new URLSearchParams(window.location.search);
    const voteId = params.get("voteId");
    const candidateId = params.get("candidateId");

    if (voteId) {
      setCandidateId(candidateId);
      getVote();
      setVoteId(voteId);
    } else {
      props.unSetVote();
    }
  }, []);

  useEffect(() => {
    if (vote) {
      vote.candidates.forEach((e) => {
        if (e.profile._id == candidateId) {
          setManifesto(e.manifesto);
          manifestoRef.current.value = e.manifesto;
        }
      });
    }
  }, [vote]);

  async function OnSubmitManifestoForm(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const res = await fetch(
        `${API_URL}/vote/update-manifesto/${candidateId}/${voteId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token} ${role}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            manifesto: manifestoRef.current.value,
          }),
        }
      );

      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }

      props.unSetVote();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="content">
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

      {voteId && (
        <form
          onSubmit={(e) => {
            OnSubmitManifestoForm(e);
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="form-group m-form">
                  <div className="input-group-prepend">
                    <label htmlFor="manifesto">Manifesto</label>
                  </div>
                  <textarea
                    className="form-control"
                    name="manifesto"
                    id="manifesto"
                    ref={manifestoRef}
                    style={{ minHeight: "150px" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="text-center m-form">
            <input
              type="submit"
              value="Edit Manifesto"
              className="btn btn-dark btn-lg"
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default AddManifesto;
