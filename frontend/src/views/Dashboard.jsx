import React from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

function Dashboard() {
  function onClickPoll(e) {
    e.preventDefault();
  }
  return (
    <>
      <div className="content">
        <div>
          <button
            onClick={(e) => {
              onClickPoll(e);
            }}
          >
            POLL
          </button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
