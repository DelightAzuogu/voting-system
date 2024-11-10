import ViewVotes from "../views/ViewVotes.jsx";
import CreateVote from "../views/createVote.jsx";
import ViewPolls from "../views/viewPoll.jsx";
import createPoll from "../views/createPoll.jsx";

var routes = [
  {
    path: "/create-poll",
    name: "create poll",
    icon: "nc-icon nc-bank",
    component: createPoll,
    layout: "/admin",
  },
  {
    path: "/view-polls",
    name: "View All poll",
    icon: "nc-icon nc-bank",
    component: ViewPolls,
    layout: "/admin",
  },
  {
    path: "/create-vote",
    name: "Create Vote",
    icon: "nc-icon nc-bank",
    component: CreateVote,
    layout: "/admin",
  },
  {
    path: "/view-vote",
    name: "View Vote",
    icon: "nc-icon nc-bank",
    component: ViewVotes,
    layout: "/admin",
  },
];
export default routes;
