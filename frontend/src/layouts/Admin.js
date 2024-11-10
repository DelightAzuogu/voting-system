import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Routes, useLocation } from "react-router-dom";

import DemoNavbar from "../components/Navbars/DemoNavbar";
import Sidebar from "../components/Sidebar/Sidebar";

import routes from "Routes/adminRoutes";
import Poll from "../views/createPoll";
import ViewPolls from "../views/viewPoll";
import CreateVote from "../views/createVote";
import ViewVotes from "../views/ViewVotes";

var ps;

function Dashboard(props) {
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
        {location.pathname === "/admin/create-poll" && <Poll {...props} />}
        {location.pathname === "/admin/view-polls" && <ViewPolls {...props} />}
        {location.pathname === "/admin/create-vote" && (
          <CreateVote {...props} />
        )}
        {location.pathname === "/admin/view-vote" && <ViewVotes {...props} />}
      </div>
    </div>
  );
}

export default Dashboard;
