"use client";

import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";

const BackButton = ({ label = "Retour", fallbackHref = "/" }) => {
  const router = useRouter();

  const handleClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-pr transition-colors"
    >
      <FaArrowLeft /> {label}
    </button>
  );
};

export default BackButton;
