"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaCalendarDays,
  FaLayerGroup,
  FaMagnifyingGlass,
  FaPlus,
  FaStore,
} from "react-icons/fa6";

const formatDate = (value) => {
  if (!value) return "—";
  const safeDate = value.replace(" ", "T");
  const date = new Date(safeDate);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const statusTheme = (deal) => {
  if (deal.active !== 1) {
    return {
      label: "Brouillon",
      className: "bg-gray-100 text-gray-600 border-gray-200",
    };
  }
  const now = Date.now();
  const start = new Date(deal.date_start.replace(" ", "T")).getTime();
  const end = new Date(deal.date_end.replace(" ", "T")).getTime();

  if (now < start) {
    return {
      label: "À venir",
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
    };
  }
  if (now > end) {
    return {
      label: "Terminé",
      className: "bg-gray-200 text-gray-600 border-gray-300",
    };
  }
  return {
    label: "En cours",
    className: "bg-green-50 text-green-600 border-green-200",
  };
};

const DealsExplorer = ({ deals = [], pagination, query, isError }) => {
  const [searchValue, setSearchValue] = useState(query?.q ?? "");

  const filteredDeals = useMemo(() => {
    if (!searchValue) return deals;
    return deals.filter((deal) => {
      const haystack = `${deal.name} ${deal?.relateds?.company?.name ?? ""} ${
        deal?.relateds?.deal_category?.name ?? ""
      } ${deal.city ?? ""}`.toLowerCase();
      return haystack.includes(searchValue.toLowerCase());
    });
  }, [deals, searchValue]);

  const activeDealsCount = useMemo(
    () =>
      deals.filter((deal) => {
        const status = statusTheme(deal).label;
        return status === "En cours";
      }).length,
    [deals]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mt-2">Deals</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/deals/categories"
            className="inline-flex items-center gap-2 border border-light-gray px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:border-pr hover:text-pr transition-colors"
          >
            <FaLayerGroup /> Catégories
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-light-gray p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-pr/10 text-pr flex items-center justify-center text-xl">
            <FaStore />
          </div>
          <div>
            <p className="text-xs uppercase text-gray-400">Total deals</p>
            <p className="text-2xl font-semibold text-gray-900">
              {pagination?.items?.nb_items ?? deals.length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-light-gray p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-pr/10 text-pr flex items-center justify-center text-xl">
            <FaCalendarDays />
          </div>
          <div>
            <p className="text-xs uppercase text-gray-400">En cours</p>
            <p className="text-2xl font-semibold text-gray-900">
              {activeDealsCount}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-light-gray p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-pr/10 text-pr flex items-center justify-center text-xl">
            <FaLayerGroup />
          </div>
          <div>
            <p className="text-xs uppercase text-gray-400">
              Catégories suivies
            </p>
            <p className="text-2xl font-semibold text-gray-900">
              {
                new Set(
                  deals
                    .map((deal) => deal?.relateds?.deal_category?.name)
                    .filter(Boolean)
                ).size
              }
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-light-gray shadow-sm p-4 flex items-center gap-3">
        <div className="text-gray-400">
          <FaMagnifyingGlass />
        </div>
        <input
          type="search"
          placeholder="Rechercher un deal..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="flex-1 text-sm outline-none"
        />
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
          Impossible de charger les deals pour le moment. Réessayez plus tard.
        </div>
      )}

      {!isError && filteredDeals.length === 0 && (
        <div className="bg-white border border-dashed border-light-gray rounded-2xl p-10 text-center text-gray-500 text-sm">
          {deals.length === 0
            ? "Aucun deal n’a encore été publié. Commencez par créer votre première campagne."
            : "Aucun deal ne correspond à cette recherche."}
        </div>
      )}

      {!isError && filteredDeals.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredDeals.map((deal) => {
            const coverUrl = deal?.files?.cover?.url;
            const company = deal?.relateds?.company;
            const category = deal?.relateds?.deal_category;
            const status = statusTheme(deal);

            return (
              <div
                key={deal.id_deal}
                className="bg-white border border-light-gray rounded-3xl overflow-hidden shadow-sm flex flex-col"
              >
                <div className="relative h-56 bg-gray-100">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={deal.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs uppercase">
                      Aucun visuel
                    </div>
                  )}
                  <span
                    className={`absolute top-4 right-4 border px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase text-gray-400">Deal</p>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {deal.name}
                      </h3>
                    </div>
                    {category?.name && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {category.name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 flex-1">
                    {deal.description ||
                      "Aucune description pour cette campagne."}
                  </p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>
                      Du{" "}
                      <span className="font-medium text-gray-800">
                        {formatDate(deal.date_start)}
                      </span>{" "}
                      au{" "}
                      <span className="font-medium text-gray-800">
                        {formatDate(deal.date_end)}
                      </span>
                    </p>
                    <p>
                      Entreprise :{" "}
                      <Link
                        href={`/entreprises/${company?.id_company}`}
                        className="text-pr hover:underline"
                      >
                        {company?.name ?? "—"}
                      </Link>
                    </p>
                    <p>
                      Localisation :{" "}
                      <span className="capitalize">
                        {deal.city || company?.city || "—"}{" "}
                        {deal.postcode ? `(${deal.postcode})` : ""}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link
                      href={`/deals/${deal.id_deal}`}
                      className="text-xs font-medium text-pr hover:text-pr-dark"
                    >
                      Voir les détails
                    </Link>
                    <Link
                      href={`/deals/${deal.id_deal}/edit`}
                      className="text-xs font-medium text-gray-600 hover:text-gray-900"
                    >
                      Modifier
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DealsExplorer;
