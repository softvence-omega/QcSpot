import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface IActiveLink {
  to: string;
  children: ReactNode;
}

const ActiveLink = ({ to, children }: IActiveLink) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "bg-green-600 w-full px-3 rounded text-lg py-2 inline-block"
          : "hover:underline w-full text-lg duration-300 py-2 inline-block"
      }
    >
      {children}
    </NavLink>
  );
};

export default ActiveLink;
