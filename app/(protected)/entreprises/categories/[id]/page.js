import CategoryCreateForm from "@/components/categories/CategoryCreateForm";
import { fetchCompanyCategory, updateCategory } from "@/services/categories";
import Link from "next/link";
import { FaArrowLeft, FaArrowRotateRight } from "react-icons/fa6";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

const buildUpdateAction = (categoryId) => {
  return async function updateCategoryAction(prevState, formData) {
    "use server";

    const name = formData.get("name");
    const description = formData.get("description");
    const file = formData.get("cover");

    if (!name) {
      return { message: "Le nom est obligatoire." };
    }

    try {
      await updateCategory(categoryId, { name, description, file });
      revalidatePath(`/entreprises/categories/${categoryId}`);
      revalidatePath("/entreprises/categories");
      return {
        success: true,
        message: "Catégorie mise à jour avec succès.",
      };
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la catégorie", error);
      if (error?.digest?.toString()?.includes("NEXT_REDIRECT")) {
        throw error;
      }
      return {
        message: error.message ?? "Impossible de mettre à jour la catégorie.",
      };
    }
  };
};

const formatDate = (value) => {
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

export default async function CategoryDetailPage({ params }) {
  const resolvedParams = (await params) ?? {};
  const categoryId = resolvedParams.id;

  if (!categoryId) {
    notFound();
  }

  let categoryData = null;

  try {
    const response = await fetchCompanyCategory(categoryId);
    categoryData = response?.company_category ?? null;
  } catch (error) {
    console.error("Erreur lors de la récupération de la catégorie", error);
  }

  if (!categoryData) {
    notFound();
  }

  const updateAction = buildUpdateAction(categoryData.id_company_category);

  const initialValues = {
    name: categoryData.name,
    description: categoryData.description,
    coverUrl: categoryData?.files?.cover?.url ?? "",
    coverTitle: categoryData?.files?.cover?.title ?? "",
  };

  return (
    <section className="p-6 lg:p-8 space-y-8 h-[calc(100vh-80px)] overflow-y-auto">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link
            href="/entreprises/categories"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-pr transition-colors"
          >
            <FaArrowLeft /> Retour aux catégories
          </Link>
          <div className="flex items-center gap-3 mt-3">
            <h1 className="text-3xl font-semibold text-gray-900">
              {categoryData.name}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                categoryData.active === 1
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {categoryData.active === 1 ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="text-sm text-gray-500 max-w-2xl mt-2">
            {categoryData.description || "Aucune description pour le moment."}
          </p>
        </div>
        <div className="bg-white border border-light-gray rounded-2xl shadow-sm px-6 py-4">
          <p className="text-xs uppercase text-gray-400">
            Dernière mise à jour
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {formatDate(categoryData.date_upd)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="lg:col-span-2">
          <CategoryCreateForm
            action={updateAction}
            initialValues={initialValues}
            submitLabel="Mettre à jour la catégorie"
            resetOnSuccess={false}
          />
        </div>
      </div>
    </section>
  );
}
