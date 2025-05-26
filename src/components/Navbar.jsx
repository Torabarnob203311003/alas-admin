import React from "react";
import { FaBars } from "react-icons/fa";
import logo from "../assets/logo.png";

export default function Navbar({ onMenuClick }) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 border-b border-zinc-300 py-4 px-20 flex items-center  bg-gray-200 z-50"
      style={{ height: 56  }} // optional explicit height for clarity
    >
      <div className="flex items-center gap-[1580px]">
     <img
  src={logo}
  alt="Logo"
  className="h-20 w-25 object-contain rounded-full"
/>
        <span className="font-semibold text-gray-900 text-pretty text-2xl">ADMIN</span>
      </div>

      {/* Hamburger icon visible only on mobile */}
      <button
        onClick={onMenuClick}
        className="md:hidden text-gray-700 text-xl ml-4"
        aria-label="Toggle sidebar"
      >
        <FaBars />
      </button>
    </nav>
  );
}
