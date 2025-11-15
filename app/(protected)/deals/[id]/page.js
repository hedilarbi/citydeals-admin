import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { notFound } from "next/navigation";
import { fetchDeal } from "@/services/deals";

const formatDateTime = (value) => {
  if (!value) return "—";
  const safeDate = value.replace(" ", "T");
  const date = new Date(safeDate);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const computeStatus = (deal) => {
  if (deal.active !== 1) {
    return { label: "Brouillon", color: "bg-gray-100 text-gray-600" };
  }
  const now = Date.now();
  const start = new Date(deal.date_start.replace(" ", "T")).getTime();
  const end = new Date(deal.date_end.replace(" ", "T")).getTime();

  if (now < start)
    return { label: "À venir", color: "bg-yellow-100 text-yellow-800" };
  if (now > end)
    return { label: "Terminé", color: "bg-gray-200 text-gray-700" };
  return { label: "En cours", color: "bg-green-100 text-green-700" };
};

export default async function DealDetailPage({ params }) {
  const resolvedParams = (await params) ?? {};
  const dealId = resolvedParams.id;

  if (!dealId) {
    notFound();
  }

  let dealData = null;
  try {
    const response = await fetchDeal(dealId);
    dealData = response?.deal ?? response ?? null;
  } catch (error) {
    console.error("Erreur lors de la récupération du deal", error);
  }

  if (!dealData) {
    notFound();
  }

  const status = computeStatus(dealData);
  const company = dealData?.relateds?.company;
  const category = dealData?.relateds?.deal_category;
  const coverUrl = dealData?.files?.cover?.url;

  return (
    <section className="p-6 lg:p-8 space-y-6 h-[calc(100vh-100px)] overflow-y-auto">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-pr transition-colors"
          >
            <FaArrowLeft /> Retour aux deals
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold text-gray-900">
              {dealData.name}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}
            >
              {status.label}
            </span>
          </div>
          <p className="text-sm text-gray-500 max-w-3xl">
            {dealData.description || "Aucune description pour ce deal."}
          </p>
          {category?.name && (
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Catégorie :{" "}
              <span className="text-gray-800 font-medium">{category.name}</span>
            </p>
          )}
        </div>
        <div className="bg-white border border-light-gray rounded-2xl shadow-sm px-6 py-4 space-y-1">
          <p className="text-xs uppercase text-gray-400">Planification</p>
          <p className="text-sm text-gray-600">
            Du{" "}
            <span className="font-semibold text-gray-900">
              {formatDateTime(dealData.date_start)}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Au{" "}
            <span className="font-semibold text-gray-900">
              {formatDateTime(dealData.date_end)}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-light-gray rounded-3xl overflow-hidden shadow-sm">
            {coverUrl ? (
              <div className="relative w-full h-80">
                <Image
                  src={coverUrl}
                  alt={dealData.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  unoptimized
                />
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-400 text-sm">
                Aucun visuel
              </div>
            )}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="text-xs uppercase text-gray-400">Créé le</p>
                <p className="text-gray-900 font-medium">
                  {formatDateTime(dealData.date_add)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-400">
                  Dernière mise à jour
                </p>
                <p className="text-gray-900 font-medium">
                  {formatDateTime(dealData.date_upd)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-400">Localisation</p>
                <p className="text-gray-900 font-medium capitalize">
                  {dealData.city || company?.city || "—"}{" "}
                  {dealData.postcode ? `(${dealData.postcode})` : ""}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-400">Pays</p>
                <p className="text-gray-900 font-medium">
                  {dealData.id_country || company?.id_country || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-light-gray rounded-3xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Entreprise liée
            </h2>
            {company ? (
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p className="text-gray-900 font-medium">{company.name}</p>
                <p>{company.description || "Aucune description"}</p>
                <p>Email : {company.email || "—"}</p>
                <p>Téléphone : {company.phone || "—"}</p>
                <Link
                  href={`/entreprises/${company.id_company}`}
                  className="text-pr text-xs font-medium hover:underline inline-block mt-2"
                >
                  Voir la fiche entreprise
                </Link>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-4">
                Aucune entreprise associée.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
