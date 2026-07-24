import {
  FaCalendarAlt,
  FaChartLine,
  FaChartPie,
  FaCog,
  FaPiggyBank,
  FaReceipt,
} from "react-icons/fa";

const sidebarItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: FaChartPie,
  },
  {
    name: "Expenses",
    path: "/expenses",
    icon: FaReceipt,
  },
  {
    name: "Recurring",
    path: "/recurring",
    icon: FaCalendarAlt,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: FaChartPie,
  },
  {
    name: "Savings",
    path: "/savings",
    icon: FaPiggyBank,
  },
  {
    name: "Investments",
    path: "/investments",
    icon: FaChartLine,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: FaCog,
  },
];

export default sidebarItems;
