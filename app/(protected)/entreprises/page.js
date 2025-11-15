import CompaniesExplorer from "@/components/companies/CompaniesExplorer";
import { fetchCompanies } from "@/services/companies";

export const dynamic = "force-dynamic";

const fallbackPayload = {
  companies: [],
  pagination: null,
};

export default async function CompaniesPage({ searchParams }) {
  const resolvedParams = (await searchParams) ?? {};
  const { sort = "name", direction = "DESC", q = "" } = resolvedParams;

  let payload = fallbackPayload;
  let isError = false;

  try {
    const response = await fetchCompanies({ sort, direction, q });
    payload = {
      companies: response?.companies ?? [],
      pagination: response?.pagination ?? null,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des entreprises", error);
    isError = true;
  }

  return (
    <section className="p-6 lg:p-8 h-[calc(100vh-80px)] lg:h-[calc(100vh-96px)] overflow-y-scroll">
      <CompaniesExplorer
        companies={payload.companies}
        pagination={payload.pagination}
        query={{ sort, direction, q }}
        isError={isError}
      />
    </section>
  );
}
