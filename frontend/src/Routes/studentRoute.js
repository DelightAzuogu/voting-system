import ViewMyPolls from "views/viewMyPoll.jsx";
import createPoll from "../views/createPoll.jsx";
import ViewEligiblePolls from "views/ViewEligiblePolls.jsx";
import ViewEligibleVotes from "views/ViewEligibleVotes.jsx";
import Manifesto from "views/Manifesto.jsx";

var routes = [
  {
    path: "/create-poll",
    name: "Create poll",
    icon: "nc-icon nc-bank",
    component: createPoll,
    layout: "/student",
  },
  {
    path: "/eligible-polls",
    name: "Eligible Polls",
    icon: "nc-icon nc-bank",
    component: ViewEligiblePolls,
    layout: "/student",
  },
  {
    path: "/my-polls",
    name: "My Polls",
    icon: "nc-icon nc-bank",
    component: ViewMyPolls,
    layout: "/student",
  },
  {
    path: "/eligible-votes",
    name: "Eligible Votes",
    icon: "nc-icon nc-bank",
    component: ViewEligibleVotes,
    layout: "/student",
  },
  {
    path: "/manifesto",
    name: "Manifesto",
    icon: "nc-icon nc-bank",
    component: Manifesto,
    layout: "/student",
  },
];
export default routes;
