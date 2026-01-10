import { NavLink } from "react-router-dom";

const NavItem = ({ icon, text, url, isOpen }) => {
  return (
    <NavLink
      to={url}
      className={({ isActive }) =>
        `flex items-center gap-4 p-2 rounded transition duration-200 ${
          isActive
            ? "bg-[#01D063] text-white" // aktiv olanda rənglər
            : "text-gray-400 hover:bg-[#01D063] hover:text-white" // normal
        }`
      }
    >
      <span className="text-[15px] ">{icon}</span>
      {isOpen && <div className="text-[15px]">{text}</div>}
    </NavLink>
  );
};

export default NavItem;
