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
          ? "text-primary text-lg py-2 inline-block"
          : "hover:underline text-lg hover:text-primary duration-300 py-2 inline-block"
      }
    >
      {children}
    </NavLink>
  );
};

export default ActiveLink;
