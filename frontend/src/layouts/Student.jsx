import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";

import DemoNavbar from "../components/Navbars/DemoNavbar";
import Sidebar from "../components/Sidebar/Sidebar";

import routes from "../Routes/studentRoute";
import Poll from "views/createPoll";
import ViewMyPolls from "views/viewMyPoll";
import ViewEligiblePolls from "views/ViewEligiblePolls";
import ViewMyVotes from "views/viewMyVotes";
import ViewEligibleVotes from "views/ViewEligibleVotes";
import Manifesto from "views/Manifesto";

var ps;

function Student(props) {
  const mainPanel = React.useRef();
  const location = useLocation();

  // console.log(location);
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

        {location.pathname === "/student/create-poll" && <Poll {...props} />}
        {location.pathname === "/student/my-polls" && (
          <ViewMyPolls {...props} />
        )}
        {location.pathname === "/student/eligible-polls" && (
          <ViewEligiblePolls {...props} />
        )}
        {location.pathname === "/student/my-votes" && (
          <ViewMyVotes {...props} />
        )}
        {location.pathname === "/student/eligible-votes" && (
          <ViewEligibleVotes {...props} />
        )}
        {location.pathname === "/student/manifesto" && <Manifesto {...props} />}
      </div>
    </div>
  );
}

export default Student;
