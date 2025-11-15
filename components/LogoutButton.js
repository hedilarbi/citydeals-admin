"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const LogoutButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await fetch("/api/logout", {
        method: "POST",
      });
      router.replace("/login");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="bg-pr text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-pr-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      onClick={handleLogout}
      disabled={isLoading}
      type="button"
    >
      {isLoading ? "Déconnexion..." : "Déconnexion"}
    </button>
  );
};

export default LogoutButton;
