import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaEnvelope,
  FaGlobe,
  FaLayerGroup,
  FaLocationDot,
  FaPhone,
} from "react-icons/fa6";

import BackButton from "@/components/BackButton";
import CompanySubscriptions from "@/components/companies/CompanySubscriptions";
import { fetchCompany, fetchCompanyDeals } from "@/services/companies";

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

const formatDateTime = (value) => {
  if (!value) return "—";
  const safeDate = value.replace(" ", "T");
  const date = new Date(safeDate);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const dealStatusTheme = (deal) => {
  if (deal.active !== 1) {
    return {
      label: "Brouillon",
      className: "bg-gray-100 text-gray-600 border-gray-200",
    };
  }
  const now = Date.now();
  const start = new Date(deal.date_start?.replace(" ", "T")).getTime();
  const end = new Date(deal.date_end?.replace(" ", "T")).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return { label: "En cours", className: "bg-green-50 text-green-600 border-green-200" };
  }

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

export const dynamic = "force-dynamic";

export default async function CompanyDetailPage({ params }) {
  const resolvedParams = (await params) ?? {};
  const companyId = resolvedParams.id;

  if (!companyId) {
    notFound();
  }

  let companyPayload = null;

  try {
    companyPayload = await fetchCompany(companyId);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'entreprise", error);
  }

  const company = companyPayload?.company ?? companyPayload ?? null;

  if (!company?.id_company) {
    notFound();
  }

  let dealsPayload = { deals: [], pagination: null };
  let dealsError = false;

  try {
    const response = await fetchCompanyDeals(companyId);
    dealsPayload = {
      deals: response?.deals ?? [],
      pagination: response?.pagination ?? null,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des deals de l'entreprise", error);
    dealsError = true;
  }

  const coverUrl =
    company?.files?.cover?.url ??
    company?.relateds?.company_category?.files?.cover?.url ??
    null;
  const logoUrl = company?.files?.logo?.url ?? null;
  const category = company?.relateds?.company_category;
  const dealsCount = dealsPayload.deals.length;

  return (
    <section className="p-6 lg:p-8 space-y-8 h-[calc(100vh-100px)] overflow-y-auto">
      <div className="space-y-6">
        <BackButton fallbackHref="/entreprises" label="Retour" />

        <div className="bg-white border border-light-gray rounded-3xl shadow-sm overflow-hidden">
          {coverUrl ? (
            <div className="relative w-full h-48">
              <Image
                src={coverUrl}
                alt={`Couverture ${company.name}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 80vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          ) : (
            <div className="h-20 bg-gradient-to-r from-pr/10 via-pr/5 to-transparent" />
          )}

          <div className="p-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl border border-light-gray bg-white flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={company.name}
                    width={80}
                    height={80}
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <span className="text-2xl font-semibold text-gray-500 uppercase">
                    {company.name?.[0] ?? "?"}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <FaLayerGroup /> {category?.name ?? "Sans catégorie"}
                </p>
                <h1 className="text-3xl font-semibold text-gray-900">
                  {company.name}
                </h1>
                <p className="text-sm text-gray-500 capitalize">
                  {company.city || "Localisation inconnue"}{" "}
                  {company.postcode ? `(${company.postcode})` : ""}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:w-auto">
              <div className="bg-gray-50 rounded-2xl px-4 py-3 border border-light-gray/70">
                <p className="text-xs uppercase text-gray-400">Deals publiés</p>
                <p className="text-2xl font-semibold text-gray-900">{dealsCount}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl px-4 py-3 border border-light-gray/70">
                <p className="text-xs uppercase text-gray-400">Active depuis</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatDate(company.date_add)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-light-gray rounded-3xl shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {company.description || "Aucune description n’a encore été fournie pour cette entreprise."}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="text-xs uppercase text-gray-400">Identifiant</p>
                  <p className="text-gray-900 font-medium">
                    {company.identification_number || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400">Numéro de TVA</p>
                  <p className="text-gray-900 font-medium">
                    {company.vat_number || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400">Créée le</p>
                  <p className="text-gray-900 font-medium">
                    {formatDateTime(company.date_add)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400">Dernière mise à jour</p>
                  <p className="text-gray-900 font-medium">
                    {formatDateTime(company.date_upd)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-light-gray rounded-3xl shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Coordonnées</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" />
                  <span>{company.email || "—"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaPhone className="text-gray-400" />
                  <span>{company.phone || "—"}</span>
                </p>
                <p className="flex items-start gap-2">
                  <FaLocationDot className="text-gray-400 mt-0.5" />
                  <span className="capitalize">
                    {company.address ? `${company.address}, ` : ""}
                    {company.postcode ? `${company.postcode} ` : ""}
                    {company.city || ""}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <FaGlobe className="text-gray-400" />
                  <span>Pays : {company.id_country || "—"}</span>
                </p>
              </div>
            </div>

            {category?.description && (
              <div className="bg-white border border-dashed border-light-gray rounded-3xl shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-900">Catégorie</h3>
                <p className="text-xs uppercase text-gray-400 mt-2">{category.name}</p>
                <p className="text-sm text-gray-600 mt-1">{category.description}</p>
              </div>
            )}
          </div>
        </div>

        <CompanySubscriptions
          companyId={company.id_company ?? companyId}
          companyName={company.name}
        />

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Deals publiés</h2>
              <p className="text-sm text-gray-500">
                Découvrez les campagnes actives ou passées de {company.name}.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-100 border border-light-gray rounded-full px-3 py-1">
              {dealsCount} deal{dealsCount > 1 ? "s" : ""}
            </span>
          </div>

          {dealsError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
              Impossible de charger les deals de cette entreprise pour le moment.
            </div>
          )}

          {!dealsError && dealsPayload.deals.length === 0 && (
            <div className="bg-white border border-dashed border-light-gray rounded-3xl p-8 text-center text-sm text-gray-500">
              Cette entreprise n&apos;a pas encore publié de deal.
            </div>
          )}

          {!dealsError && dealsPayload.deals.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {dealsPayload.deals.map((deal) => {
                const cover = deal?.files?.cover?.url;
                const status = dealStatusTheme(deal);

                return (
                  <div
                    key={deal.id_deal}
                    className="bg-white border border-light-gray rounded-3xl overflow-hidden shadow-sm flex flex-col"
                  >
                    <div className="relative h-48 bg-gray-100">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={deal.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">
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
                      <div>
                        <p className="text-xs uppercase text-gray-400">Deal</p>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {deal.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 flex-1">
                        {deal.description || "Aucune description pour cette campagne."}
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
                        <p className="capitalize">
                          {deal.city || company.city || "—"}{" "}
                          {deal.postcode ? `(${deal.postcode})` : ""}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-4 pt-2 text-xs font-medium">
                        <Link href={`/deals/${deal.id_deal}`} className="text-pr hover:underline">
                          Voir le deal
                        </Link>
                        <Link
                          href={`/deals/${deal.id_deal}/edit`}
                          className="text-gray-600 hover:text-gray-900"
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
      </div>
    </section>
  );
}
