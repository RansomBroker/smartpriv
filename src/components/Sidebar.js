import React from "react";
import { Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Sidebar = ({ logoSrc, navItems, className, onLinkClick, collapsed }) => {
  return (
    <div className={`p-3 ${className}`}>
      <div className="d-flex align-items-center mb-4 justify-content-center">
        <Image
          src={logoSrc}
          fluid
          style={{
            width: collapsed ? "40px" : "150px",
            transition: "width 0.3s",
          }}
        />
      </div>
      <nav>
        <ul className="nav flex-column">
          {navItems.map((nav, index) => (
            <li key={index} className="nav-item mb-3 text-center">
              <NavLink
                to={nav.to}
                onClick={() => onLinkClick && onLinkClick()}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                <Image
                  src={nav.image}
                  className="me-2"
                  height={20}
                  width={20}
                  alt={nav.text}
                />
                {!collapsed && <span>{nav.text}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
