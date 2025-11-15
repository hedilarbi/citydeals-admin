"use client";

import Image from "next/image";
import Link from "next/link";
import { FaRegEye, FaTrashAlt } from "react-icons/fa";

const DealCategoryCard = ({ category, onDelete }) => {
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
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs uppercase">
            Aucun visuel
          </div>
        )}
      </div>
      <div className="p-5 space-y-3 flex-1 flex flex-col">
        <div>
          <p className="text-xs uppercase text-gray-400">
            Catégorie #{category.id_deal_category}
          </p>
          <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
        </div>
        <p className="text-sm text-gray-600 flex-1">
          {category.description || "Aucune description pour le moment."}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            href={`/deals/categories/${category.id_deal_category}`}
            className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full bg-pr text-white hover:bg-pr-dark transition-colors"
          >
            <FaRegEye className="text-sm" /> Voir
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

export default DealCategoryCard;
