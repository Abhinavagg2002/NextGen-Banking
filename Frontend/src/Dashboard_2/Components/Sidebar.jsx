import React from "react";
import "../Css/Components/Sidebar.css";
import {
  AiOutlineDashboard,
  AiOutlineShareAlt,
  AiOutlineShoppingCart,
  AiOutlineBook
} from "react-icons/ai";
import { GrCatalogOption } from "react-icons/gr";
import { BsPeople } from "react-icons/bs";
const Sidebar = () => {
  const sidemenus = [
    {
      menu_name: "Money Deposit",
      menu_icon: AiOutlineBook,
      menu_link: "deposit"
    },
    {
      menu_name: "Money Withdrawl",
      menu_icon: AiOutlineShoppingCart,
      menu_link: "withdrawl"
    },
    {
      menu_name: "Money Transfer",
      menu_icon: BsPeople,
      menu_link: "transfer"
    },
    {
      menu_name: "Loan",
      menu_icon: AiOutlineShareAlt,
      menu_link: "loan"
    },
    {
      menu_name: "User-Profile",
      menu_icon: AiOutlineShareAlt,
      menu_link: "profile"
    }
  ];

  const links = [
    {
      menu_name:"Nextgen Banking",
      menu_link:'/'
    }
  ];

  return (
    <>
      <div className="sidebar">
        <div className="brand">
          <ul>
            {links.map((value) => {
              return (
                <li className={value.active ? "active" : ""}>
                  <a href= {value.menu_link}>
                    {value.menu_name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="links">
          <ul>
            {sidemenus.map((value) => {
              return (
                <li className={value.active ? "active" : "false"}>
                  <a href= {value.menu_link}>
                    <value.menu_icon />
                    {value.menu_name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};
export default Sidebar;