import CategoriesExplorer from "@/components/categories/CategoriesExplorer";
import { deleteCategory, fetchCompanyCategories } from "@/services/categories";
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
    const result = await deleteCategory(id);
    revalidatePath("/entreprises/categories");
    revalidatePath(`/entreprises/categories/${id}`);
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

export default async function CategoriesPage({ searchParams }) {
  const resolvedParams = (await searchParams) ?? {};
  const { sort = "name", direction = "", q = "" } = resolvedParams;

  let payload = fallbackPayload;
  let isError = false;

  try {
    const response = await fetchCompanyCategories({ sort, direction, q });
    payload = {
      categories: response?.deal_categories ?? [],
      pagination: response?.pagination ?? null,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories", error);
    isError = true;
  }

  return (
    <section className="p-6 lg:p-8 h-[calc(100vh-80px)] overflow-y-auto">
      <CategoriesExplorer
        categories={payload.categories}
        pagination={payload.pagination}
        query={{ sort, direction, q }}
        isError={isError}
        deleteCategoryAction={deleteCategoryAction}
      />
    </section>
  );
}
