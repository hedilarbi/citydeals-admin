"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaExternalLinkAlt, FaTrashAlt } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";
import { toggleCompanyActivation } from "@/services/companies";

const formatDate = (dateString) => {
  if (!dateString) {
    return "—";
  }

  const safeDate = dateString.replace(" ", "T");
  const formatted = new Date(safeDate);

  if (Number.isNaN(formatted.getTime())) {
    return dateString;
  }

  return formatted.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const StatusPill = ({ active }) => {
  const label = active ? "Active" : "Inactive";
  const styles = active
    ? "bg-green-50 text-green-600 border-green-200"
    : "bg-red-50 text-red-600 border-red-200";

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles}`}>
      {label}
    </span>
  );
};

const buildStatusMap = (companies = []) => {
  return companies.reduce((acc, company) => {
    if (company?.id_company) {
      acc[company.id_company] = company.active === 1;
    }
    return acc;
  }, {});
};

const CompaniesTable = ({ companies, onDelete }) => {
  const [statusMap, setStatusMap] = useState(() => buildStatusMap(companies));
  const [pendingToggleId, setPendingToggleId] = useState(null);

  useEffect(() => {
    setStatusMap(buildStatusMap(companies));
  }, [companies]);

  const getCompanyStatus = (company) =>
    statusMap[company.id_company] ?? company.active === 1;

  const handleToggle = async (company) => {
    const companyId = company?.id_company;
    if (!companyId) return;

    const currentStatus = getCompanyStatus(company);
    const nextStatus = !currentStatus;

    setStatusMap((previous) => ({
      ...previous,
      [companyId]: nextStatus,
    }));
    setPendingToggleId(companyId);

    try {
      await toggleCompanyActivation(companyId, currentStatus);
    } catch (error) {
      console.error(
        "Erreur lors du changement de statut de l'entreprise",
        error
      );
      setStatusMap((previous) => ({
        ...previous,
        [companyId]: currentStatus,
      }));
    } finally {
      setPendingToggleId(null);
    }
  };

  return (
    <div className="overflow-x-auto bg-white border border-light-gray rounded-2xl shadow-sm">
      <table className="min-w-full divide-y divide-light-gray text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-6 py-3 text-left">Entreprise</th>
            <th className="px-6 py-3 text-left">Catégorie</th>
            <th className="px-6 py-3 text-left">Ville</th>
            <th className="px-6 py-3 text-left">Contact</th>
            <th className="px-6 py-3 text-left">Création</th>
            <th className="px-6 py-3 text-left">Statut</th>
            <th className="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-light-gray">
          {companies.map((company) => {
            const logoUrl = company?.files?.logo?.url;
            const categoryName =
              company?.relateds?.company_category?.name ?? "—";
            const isActive = getCompanyStatus(company);

            return (
              <tr key={company.id_company} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-gray-500 text-xs uppercase">
                      {logoUrl ? (
                        <Image
                          src={logoUrl}
                          alt={`Logo ${company.name}`}
                          fill
                          sizes="40px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        company.name?.slice(0, 2)
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 flex items-center gap-2">
                        {company.name}
                        <Link
                          href={`/entreprises/${company.id_company}`}
                          className="text-pr text-xs hover:underline inline-flex items-center gap-1"
                        >
                          Voir
                          <FaExternalLinkAlt className="text-[10px]" />
                        </Link>
                      </p>
                      <p className="text-xs text-gray-500">{company.description || "—"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">{categoryName}</td>
                <td className="px-6 py-4 text-gray-700 capitalize">
                  {company.city || "—"}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  <div className="flex flex-col">
                    {company.email && (
                      <a
                        href={`mailto:${company.email}`}
                        className="text-pr hover:underline text-xs"
                      >
                        {company.email}
                      </a>
                    )}
                    <span className="text-xs text-gray-500">{company.phone || "—"}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {formatDate(company.date_add)}
                </td>
                <td className="px-6 py-4">
                  <StatusPill active={isActive} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <button
                      type="button"
                      role="switch"
                      aria-label={`${isActive ? "Désactiver" : "Activer"} ${
                        company.name
                      }`}
                      aria-checked={isActive}
                      onClick={() => handleToggle(company)}
                      disabled={pendingToggleId === company.id_company}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isActive ? "bg-pr" : "bg-gray-300"
                      } ${pendingToggleId === company.id_company ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isActive ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <Link
                      href={`/entreprises/${company.id_company}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-white bg-pr hover:bg-pr-dark transition-colors px-3 py-2 rounded-full"
                    >
                      <FaRegPenToSquare /> Modifier
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(company)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 px-3 py-2 rounded-full transition-colors"
                    >
                      <FaTrashAlt /> Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CompaniesTable;
