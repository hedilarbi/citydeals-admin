import React from "react";
import { FaTriangleExclamation } from "react-icons/fa6";
const DeleteWarning = ({
  title,
  description,
  buttonText,
  action,
  setShowModal,
  isLoading = false,
}) => {
  return (
    <div className="fixed top-0 left-0 bg-black/40 flex items-center justify-center w-full h-full">
      <div className="bg-white rounded-md p-6">
        <div className="flex justify-center">
          <div>
            <FaTriangleExclamation className="text-red-500 text-4xl" />
          </div>
        </div>
        <h3 className="text-red-500 text-center font-semibold mt-2">{title}</h3>
        <p className="mt-4 text-center">{description}</p>
        <div className="flex justify-center gap-8 mt-6">
          <button
            onClick={() => setShowModal(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            onClick={action}
            className=" bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Suppression..." : buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteWarning;
