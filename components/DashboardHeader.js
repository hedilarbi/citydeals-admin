import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaBell } from "react-icons/fa6";

import HeaderProfileSection from "./HeaderProfileSection";

const DashboardHeader = () => {
  return (
    <header
      id="header"
      className="bg-white border-b border-light-gray sticky top-0 z-50 h-20 flex items-center "
    >
      <div className="flex items-center justify-between px-6 py-4 w-full">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="text-2xl font-bold font-inter text-primary-dark"
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={334}
                height={70}
                className="h-12 w-auto"
                priority
              />
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pl-10 w-64 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />

            <div className="absolute left-3 top-3 text-gray-400">
              <FaMagnifyingGlass />
            </div>
          </div> */}
          {/* <button className="relative p-2 text-gray-600 hover:text-primary">
            <div className="text-lg">
              <FaBell />
            </div>
            <span className="absolute -top-1 -right-1 bg-warning text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
          <HeaderProfileSection /> */}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
