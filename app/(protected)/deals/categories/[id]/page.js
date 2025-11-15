import CategoryCreateForm from "@/components/categories/CategoryCreateForm";
import { fetchDealCategory, updateDealCategory } from "@/services/deals";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

const buildUpdateAction = (categoryId) => {
  return async function updateDealCategoryAction(_, formData) {
    "use server";

    const name = formData.get("name");
    const description = formData.get("description");
    const file = formData.get("cover");

    if (!name) {
      return { message: "Le nom est obligatoire." };
    }

    try {
      await updateDealCategory(categoryId, { name, description, file });
      revalidatePath(`/deals/categories/${categoryId}`);
      revalidatePath("/deals/categories");
      return {
        success: true,
        message: "Catégorie mise à jour avec succès.",
      };
    } catch (error) {
      return {
        message: error.message ?? "Impossible de mettre à jour la catégorie.",
      };
    }
  };
};

export default async function DealCategoryDetailPage({ params }) {
  const resolvedParams = (await params) ?? {};
  const categoryId = resolvedParams.id;

  if (!categoryId) {
    notFound();
  }

  let categoryData = null;
  try {
    const response = await fetchDealCategory(categoryId);
    categoryData = response?.deal_category ?? null;
  } catch (error) {
    console.error("Erreur lors de la récupération de la catégorie", error);
  }

  if (!categoryData) {
    notFound();
  }

  const action = buildUpdateAction(categoryData.id_deal_category);

  const initialValues = {
    name: categoryData.name,
    description: categoryData.description,
    coverUrl: categoryData?.files?.cover?.url ?? "",
    coverTitle: categoryData?.files?.cover?.title ?? "",
  };

  return (
    <section className="p-6 lg:p-8 space-y-6 h-[calc(100vh-100px)] overflow-y-auto">
      <div>
        <Link
          href="/deals/categories"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-pr transition-colors"
        >
          <FaArrowLeft /> Retour aux catégories
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 mt-3">
          {categoryData.name}
        </h1>
        <p className="text-sm text-gray-500">
          Dernière mise à jour le{" "}
          <span className="font-medium text-gray-900">
            {new Date(categoryData.date_upd.replace(" ", "T")).toLocaleString(
              "fr-FR"
            )}
          </span>
        </p>
      </div>

      <CategoryCreateForm
        action={action}
        initialValues={initialValues}
        submitLabel="Mettre à jour la catégorie"
        resetOnSuccess={false}
      />
    </section>
  );
}
