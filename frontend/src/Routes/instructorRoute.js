import ViewEligiblePolls from "views/ViewEligiblePolls.jsx";
import ViewEligibleVotes from "views/ViewEligibleVotes.jsx";
import CreateVote from "views/createVote.jsx";
import ViewMyPolls from "views/viewMyPoll.jsx";
import ViewMyVotes from "views/viewMyVotes.jsx";
import createPoll from "../views/createPoll.jsx";

var routes = [
  {
    path: "/create-vote",
    name: "Create Vote",
    icon: "nc-icon nc-bank",
    component: CreateVote,
    layout: "/instructor",
  },
  {
    path: "/create-poll",
    name: "create poll",
    icon: "nc-icon nc-bank",
    component: createPoll,
    layout: "/instructor",
  },
  {
    path: "/my-polls",
    name: "My Polls",
    icon: "nc-icon nc-bank",
    component: ViewMyPolls,
    layout: "/instructor",
  },
  {
    path: "/eligible-polls",
    name: "Eligible Polls",
    icon: "nc-icon nc-bank",
    component: ViewEligiblePolls,
    layout: "/instructor",
  },
  {
    path: "/my-votes",
    name: "My Votes",
    icon: "nc-icon nc-bank",
    component: ViewMyVotes,
    layout: "/instructor",
  },
  {
    path: "/eligible-votes",
    name: "Eligible Votes",
    icon: "nc-icon nc-bank",
    component: ViewEligibleVotes,
    layout: "/instructor",
  },
];
export default routes;
