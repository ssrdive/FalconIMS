import Commute from "@material-ui/icons/Commute";
// core components/views for Admin layout
import Inventory from "views/Inventory/Inventory.js";

const dashboardRoutes = [
  {
    path: "/inventory",
    name: "Inventory",
    icon: Commute,
    component: Inventory,
    layout: "/app"
  }
];

export default dashboardRoutes;