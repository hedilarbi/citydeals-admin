"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaArrowDownAZ,
  FaArrowDown91,
  FaArrowsRotate,
  FaBuilding,
  FaFilter,
  FaLayerGroup,
  FaLocationDot,
  FaPlus,
} from "react-icons/fa6";

import CompaniesTable from "./CompaniesTable";
import DeleteWarning from "../modals/DeleteWarning";

const ToolbarButton = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
      active
        ? "bg-pr text-white border-pr"
        : "bg-white border-light-gray text-gray-600 hover:border-gray-400"
    }`}
  >
    {children}
  </button>
);

const CompaniesExplorer = ({ companies = [], pagination, query, isError }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(query?.q ?? "");
  const [sort, setSort] = useState(query?.sort ?? "name");
  const [direction, setDirection] = useState(
    (query?.direction ?? "DESC").toUpperCase()
  );
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [isPending, startTransition] = useTransition();

  const categories = useMemo(() => {
    const values = new Set();
    companies.forEach((company) => {
      const categoryName = company?.relateds?.company_category?.name;
      if (categoryName) {
        values.add(categoryName);
      }
    });
    return Array.from(values);
  }, [companies]);

  const cities = useMemo(() => {
    const values = new Set();
    companies.forEach((company) => {
      if (company.city) {
        values.add(company.city);
      }
    });
    return Array.from(values);
  }, [companies]);

  const displayedCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesCategory = selectedCategory
        ? company?.relateds?.company_category?.name === selectedCategory
        : true;
      const matchesCity = selectedCity ? company.city === selectedCity : true;
      return matchesCategory && matchesCity;
    });
  }, [companies, selectedCategory, selectedCity]);

  const updateRoute = (paramsToUpdate) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");

    Object.entries(paramsToUpdate).forEach(([key, value]) => {
      if (value && value.length > 0) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    const queryString = params.toString();
    startTransition(() => {
      router.push(`/entreprises${queryString ? `?${queryString}` : ""}`);
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    updateRoute({ q: searchValue, sort, direction });
  };

  const handleSortChange = (value) => {
    setSort(value);
    updateRoute({ q: searchValue, sort: value, direction });
  };

  const toggleDirection = () => {
    const nextDirection = direction === "DESC" ? "ASC" : "DESC";
    setDirection(nextDirection);
    updateRoute({ q: searchValue, sort, direction: nextDirection });
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedCity(null);
  };

  const handleDeleteConfirmation = () => {
    setCompanyToDelete(null);
    // TODO: Connect with API delete flow when endpoint is ready.
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Entreprises</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/entreprises/new"
            className="inline-flex items-center gap-2 bg-pr text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-pr-dark transition-colors"
          >
            <FaPlus /> Créer une entreprise
          </Link>
          <Link
            href="/entreprises/categories"
            className="inline-flex items-center gap-2 border border-light-gray px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:border-pr hover:text-pr transition-colors"
          >
            <FaLayerGroup /> Catégories
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-light-gray p-4 shadow-sm space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-pr/10 text-pr flex items-center justify-center text-xl">
              <FaBuilding />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase">
                Entreprises suivies
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {pagination?.items?.nb_items ?? companies.length}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {pagination?.pages?.nb_pages
              ? `${pagination.pages.nb_pages} page${
                  pagination.pages.nb_pages > 1 ? "s" : ""
                }`
              : "Pagination à venir"}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-light-gray p-4 shadow-sm space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-pr/10 text-pr flex items-center justify-center text-xl">
              <FaLayerGroup />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase">
                Catégories uniques
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {categories.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-light-gray p-4 shadow-sm space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-pr/10 text-pr flex items-center justify-center text-xl">
              <FaLocationDot />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase">
                Villes couvertes
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {cities.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-light-gray p-4 shadow-sm space-y-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 md:flex-row md:items-end"
        >
          <div className="flex-1">
            <label className="text-xs uppercase tracking-wide text-gray-500">
              Recherche
            </label>
            <input
              type="search"
              placeholder="Nom, email, téléphone..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="mt-1 w-full border border-light-gray rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pr/40"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 bg-pr text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-pr-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <FaFilter /> Rechercher
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-light-gray">
          <span className="text-xs uppercase text-gray-400 tracking-wide">
            Trier par
          </span>
          <ToolbarButton
            active={sort === "name"}
            onClick={() => handleSortChange("name")}
          >
            Nom
          </ToolbarButton>
          <ToolbarButton
            active={sort === "date_add"}
            onClick={() => handleSortChange("date_add")}
          >
            Date d&apos;ajout
          </ToolbarButton>
          <button
            type="button"
            onClick={toggleDirection}
            className="inline-flex items-center gap-2 text-xs font-medium text-gray-700 border border-light-gray rounded-full px-3 py-1.5 hover:border-pr hover:text-pr transition-colors"
          >
            {direction === "DESC" ? <FaArrowDownAZ /> : <FaArrowDown91 />}
            {direction === "DESC" ? "Descendant" : "Ascendant"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-light-gray p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <FaFilter /> Filtres express
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs text-gray-500 hover:text-gray-800 inline-flex items-center gap-2"
          >
            <FaArrowsRotate /> Réinitialiser
          </button>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Catégories
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.length === 0 && (
              <span className="text-xs text-gray-400">
                Les catégories apparaîtront au fur et à mesure des imports.
              </span>
            )}
            {categories.map((category) => (
              <ToolbarButton
                key={category}
                active={selectedCategory === category}
                onClick={() =>
                  setSelectedCategory((current) =>
                    current === category ? null : category
                  )
                }
              >
                {category}
              </ToolbarButton>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Villes
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {cities.length === 0 && (
              <span className="text-xs text-gray-400">
                Importez plusieurs entreprises pour activer ce filtre.
              </span>
            )}
            {cities.map((city) => (
              <ToolbarButton
                key={city}
                active={selectedCity === city}
                onClick={() =>
                  setSelectedCity((current) => (current === city ? null : city))
                }
              >
                {city}
              </ToolbarButton>
            ))}
          </div>
        </div>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
          Impossible de charger les entreprises pour le moment. Vérifiez la
          configuration de l’API.
        </div>
      )}

      {!isError && displayedCompanies.length > 0 && (
        <CompaniesTable
          companies={displayedCompanies}
          onDelete={(company) => setCompanyToDelete(company)}
        />
      )}

      {!isError && displayedCompanies.length === 0 && (
        <div className="bg-white border border-dashed border-light-gray rounded-2xl p-10 text-center text-gray-500 text-sm">
          {companies.length === 0
            ? "Aucune entreprise n’est enregistrée pour le moment. Ajoutez votre premier partenaire."
            : "Aucune entreprise ne correspond à ces filtres. Essayez un autre segment ou supprimez les filtres."}
        </div>
      )}

      {companyToDelete && (
        <DeleteWarning
          title={`Supprimer ${companyToDelete.name}`}
          description="Cette action est définitive. Les données liées à cette entreprise seront archivées."
          buttonText="Supprimer"
          action={handleDeleteConfirmation}
          setShowModal={(value) => {
            if (value === false) {
              setCompanyToDelete(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default CompaniesExplorer;
