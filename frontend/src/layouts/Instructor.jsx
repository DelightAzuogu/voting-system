import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";

import DemoNavbar from "../components/Navbars/DemoNavbar";
import Sidebar from "../components/Sidebar/Sidebar";

import routes from "../Routes/instructorRoute";
import CreateVote from "views/createVote";
import Poll from "views/createPoll";
import ViewMyPolls from "views/viewMyPoll";
import ViewEligiblePolls from "views/ViewEligiblePolls";
import ViewMyVotes from "views/viewMyVotes";
import ViewEligibleVotes from "views/ViewEligibleVotes";

var ps;

function Instructor(props) {
  const mainPanel = React.useRef();
  const location = useLocation();
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current);
      document.body.classList.toggle("perfect-scrollbar-on");
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.body.classList.toggle("perfect-scrollbar-on");
      }
    };
  });
  React.useEffect(() => {
    mainPanel.current.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [location]);

  return (
    <div className="wrapper">
      <Sidebar
        {...props}
        routes={routes}
        bgColor={"black"}
        activeColor={"info"}
      />
      <div className="main-panel" ref={mainPanel}>
        <DemoNavbar {...props} routes={routes} />
        {location.pathname === "/instructor/create-vote" && (
          <CreateVote {...props} />
        )}
        {location.pathname === "/instructor/create-poll" && <Poll {...props} />}
        {location.pathname === "/instructor/my-polls" && (
          <ViewMyPolls {...props} />
        )}
        {location.pathname === "/instructor/eligible-polls" && (
          <ViewEligiblePolls {...props} />
        )}
        {location.pathname === "/instructor/my-votes" && (
          <ViewMyVotes {...props} />
        )}
        {location.pathname === "/instructor/eligible-votes" && (
          <ViewEligibleVotes {...props} />
        )}
      </div>
    </div>
  );
}

export default Instructor;
