import Dashboard from "@material-ui/icons/Dashboard";
import Commute from "@material-ui/icons/Commute";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import Inventory from "views/Inventory/Inventory.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/app"
  },
  {
    path: "/inventory",
    name: "Inventory",
    icon: Commute,
    component: Inventory,
    layout: "/app"
  }
];

export default dashboardRoutes;