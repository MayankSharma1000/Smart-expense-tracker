import { NavLink } from "react-router-dom";

import "../../../styles/Sidebar.css";

import { FaArrowTrendUp } from "react-icons/fa6";

import {
  FaCalendarAlt,
  FaChartPie,
  FaCog,
  FaPiggyBank,
  FaReceipt,
  FaWallet,
} from "react-icons/fa";

function Sidebar() {
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaChartPie />,
    },
    {
      name: "Expenses",
      path: "/expenses",
      icon: <FaReceipt />,
    },
    {
      name: "Recurring",
      path: "/recurring",
      icon: <FaCalendarAlt />,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <FaChartPie />,
    },
    {
      name: "Savings",
      path: "/savings",
      icon: <FaPiggyBank />,
    },
    {
      name: "Investments",
      path: "/investments",
      icon: <FaArrowTrendUp />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <FaCog />,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <FaWallet />
        </div>

        <div>
          <h2>SmartMoney</h2>
          <p>Personal Finance OS</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
