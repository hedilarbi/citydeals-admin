"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { FaChartLine, FaExclamation, FaLink } from "react-icons/fa6";
import LogoutButton from "./LogoutButton";
import { GrCompliance } from "react-icons/gr";
import { FaStore } from "react-icons/fa6";
import { RiDiscountPercentFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
const linkBase =
  "flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors";
const inactive = "text-gray-600 hover:bg-gray-100";
const active = "bg-pr/10 text-pr";

const Aside = () => {
  const pathname = usePathname();

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside
      id="sidebar"
      className={`w-64 border-r border-light-gray h-[calc(100vh-80px)] overflow-y-auto bg-white`}
    >
      <div className="p-4 flex flex-col h-full justify-between pb-4">
        <div className="space-y-6">
          <div className="space-y-1">
            <Link
              href="/"
              className={`${linkBase} ${isActive("/") ? active : inactive}`}
            >
              <div className="text-2xl">
                <FaChartLine />
              </div>
              <span className="font-medium">Tableau de bord</span>
            </Link>

            <Link
              href="/entreprises"
              className={`${linkBase} ${
                isActive("/entreprises") ? active : inactive
              }`}
            >
              <div
                className={`text-2xl ${
                  isActive("/entreprises")
                    ? "border-current"
                    : "border-gray-600 text-gray-600"
                }`}
              >
                <FaStore />
              </div>
              <span>Entreprises</span>
            </Link>
            <Link
              href="/utilisateurs"
              className={`${linkBase} ${
                isActive("/utilisateurs") ? active : inactive
              }`}
            >
              <div
                className={` text-2xl ${
                  isActive("/utilisateurs")
                    ? "border-current"
                    : "border-gray-600 text-gray-600"
                }`}
              >
                <FaUsers />
              </div>
              <span>Utilisateurs</span>
            </Link>
            <Link
              href="/deals"
              className={`${linkBase} ${
                isActive("/deals") ? active : inactive
              }`}
            >
              <div
                className={` text-2xl ${
                  isActive("/deals")
                    ? "border-current"
                    : "border-gray-600 text-gray-600"
                }`}
              >
                <RiDiscountPercentFill />
              </div>
              <span>Deals</span>
            </Link>

            {/* <Link
              href="/cgv"
              className={`${linkBase} ${isActive("/cgv") ? active : inactive}`}
            >
              <div
                className={`border border-dotted rounded-full p-1 ${
                  isActive("/cgv")
                    ? "border-current"
                    : "border-gray-600 text-gray-600"
                }`}
              >
                <LuBadgeCheck />
              </div>
              <span>Conformité CGV</span>
            </Link> */}
            {/* 
            <Link
              href="/domaines"
              className={`${linkBase} ${
                isActive("/domaines") ? active : inactive
              }`}
            >
              <div
                className={`border border-dotted rounded-full p-1 ${
                  isActive("/domaines")
                    ? "border-current"
                    : "border-gray-600 text-gray-600"
                }`}
              >
                <FaLink />
              </div>
              <span>Domaines & URLs</span>
            </Link> */}
          </div>
        </div>

        <LogoutButton />
      </div>
    </aside>
  );
};

export default Aside;
