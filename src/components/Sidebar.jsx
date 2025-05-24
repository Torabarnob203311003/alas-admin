import React from "react";
import { NavLink } from "react-router-dom";
import { FaUserFriends, FaCreditCard } from "react-icons/fa";
import logo from "../assets/logo.png";

export default function Sidebar({ sidebarOpen, onClose }) {
  return (
    <>
      {/* Overlay backdrop for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } md:hidden`}
        onClick={onClose}
      ></div>

      {/* Sidebar panel */}
      <aside
        className={`fixed top-[56px] left-0 min-h-[calc(100vh-56px)] bg-gray-200 border-r border-zinc-300 flex flex-col p-6 pt-6 z-50 w-72 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:fixed`}
        style={{ overflowY: "auto" }}
      >
        {/* Close button - mobile only */}
        <div className="mb-14">
          <img
            src={logo}
            alt="Alaska Go Logo"
            className="w-[147.59px] h-[147.59px] object-contain mb-4"
          />
        </div>

        <nav className="flex flex-col gap-4">
          <NavLink
            to="/dashboard/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold ${
                isActive
                  ? "bg-white text-black border-2 border-gray-400"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
            onClick={onClose}
          >
            <FaUserFriends className="text-2xl text-zinc-600" /> Users
          </NavLink>

          <NavLink
            to="/dashboard/cards"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold ${
                isActive
                  ? "bg-white text-black border-2 border-gray-400"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
            onClick={onClose}
          >
            <FaCreditCard className="text-lg" /> Cards
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
