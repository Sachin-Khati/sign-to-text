import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass =
    "px-4 py-2 rounded-lg transition duration-300 hover:bg-sky-500 hover:text-white";

  return (
    <nav className="bg-black shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-sky-600">
          Sign to text
        </Link>

        {/* Nav Links */}
        <div className="flex gap-4 text-white font-semibold">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/detect" className={linkClass}>
            Detect
          </NavLink>
          <NavLink to="/learn" className={linkClass}>
            Learn
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
