"use client";

import Image from "next/image";
import Link from "next/link";
import { FaRegEye, FaTrashAlt } from "react-icons/fa";

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const safeDate = dateString.replace(" ", "T");
  const parsed = new Date(safeDate);
  if (Number.isNaN(parsed.getTime())) return dateString;
  return parsed.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const StatusPill = ({ active }) => {
  const label = active ? "Active" : "Inactive";
  const colorClasses = active
    ? "bg-green-50 text-green-600 border-green-200"
    : "bg-red-50 text-red-600 border-red-200";
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClasses}`}
    >
      {label}
    </span>
  );
};

const CategoryCard = ({ category, onDelete }) => {
  const coverUrl = category?.files?.cover?.url;

  return (
    <div className="bg-white border border-light-gray rounded-3xl overflow-hidden shadow-sm flex flex-col">
      <div className="relative h-40 bg-gray-100">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={`Visuel ${category.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs uppercase tracking-wide">
            Aucun visuel
          </div>
        )}
        <div className="absolute top-4 right-4">
          <StatusPill active={category.active === 1} />
        </div>
      </div>

      <div className="flex-1 p-5 flex flex-col space-y-3">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {category.name}
          </h3>
        </div>
        <p className="text-sm text-gray-600 flex-1">
          {category.description ||
            "Aucune description fournie pour cette catégorie."}
        </p>
        <div className="text-xs text-gray-400">
          Créée le{" "}
          <span className="font-medium text-gray-600">
            {formatDate(category.date_add)}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            href={`/entreprises/categories/${category.id_company_category}`}
            className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full bg-pr text-white hover:bg-pr-dark transition-colors"
          >
            <FaRegEye className="text-sm" /> Voir la fiche
          </Link>
          <button
            type="button"
            onClick={() => onDelete(category)}
            className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
          >
            <FaTrashAlt /> Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
