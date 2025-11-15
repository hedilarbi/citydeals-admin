import DealCategoriesExplorer from "@/components/deals/DealCategoriesExplorer";
import {
  deleteDealCategory,
  fetchDealCategories,
} from "@/services/deals";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const fallbackPayload = {
  categories: [],
  pagination: null,
};

async function deleteCategoryAction(id) {
  "use server";

  if (!id) {
    return { success: false, message: "Identifiant manquant." };
  }

  try {
    const result = await deleteDealCategory(id);
    revalidatePath("/deals/categories");
    revalidatePath(`/deals/categories/${id}`);
    return {
      success: true,
      message: result?.message ?? "Catégorie supprimée avec succès.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message ?? "Impossible de supprimer la catégorie.",
    };
  }
}

export default async function DealCategoriesPage() {
  let payload = fallbackPayload;
  let isError = false;

  try {
    const response = await fetchDealCategories();
    payload = {
      categories: response?.deal_categories ?? [],
      pagination: response?.pagination ?? null,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories de deals", error);
    isError = true;
  }

  return (
    <section className="p-6 lg:p-8 space-y-6 h-[calc(100vh-100px)] overflow-y-auto">
      <DealCategoriesExplorer
        categories={payload.categories}
        pagination={payload.pagination}
        isError={isError}
        deleteCategoryAction={deleteCategoryAction}
      />
    </section>
  );
}
