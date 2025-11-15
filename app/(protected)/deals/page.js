import DealsExplorer from "@/components/deals/DealsExplorer";
import { fetchDeals } from "@/services/deals";

export const dynamic = "force-dynamic";

const fallbackPayload = {
  deals: [],
  pagination: null,
};

export default async function DealsPage({ searchParams }) {
  const resolvedParams = (await searchParams) ?? {};
  const { q = "", sort = "", direction = "" } = resolvedParams;

  let payload = fallbackPayload;
  let isError = false;

  try {
    const response = await fetchDeals({ q, sort, direction });
    payload = {
      deals: response?.deals ?? [],
      pagination: response?.pagination ?? null,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des deals", error);
    isError = true;
  }

  return (
    <section className="p-6 lg:p-8 space-y-6 h-[calc(100vh-100px)] overflow-y-auto">
      <DealsExplorer
        deals={payload.deals}
        pagination={payload.pagination}
        query={{ q, sort, direction }}
        isError={isError}
      />
    </section>
  );
}
