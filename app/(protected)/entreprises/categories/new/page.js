import CategoryCreateForm from "@/components/categories/CategoryCreateForm";
import { createCategory } from "@/services/categories";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

async function createCategoryAction(_, formData) {
  "use server";

  const name = formData.get("name");
  const description = formData.get("description");
  const file = formData.get("cover");

  if (!name) {
    return { message: "Le nom est obligatoire." };
  }

  try {
    await createCategory({ name, description, file });
    return { success: true, message: "Catégorie créée avec succès." };
  } catch (error) {
    if (error?.digest?.toString()?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    return { message: error.message ?? "Impossible de créer la catégorie." };
  }
}

export default function CategoryCreatePage() {
  return (
    <section className="p-6 lg:p-8 space-y-6 h-[calc(100vh-80px)] overflow-y-auto">
      <div>
        <Link
          href="/entreprises/categories"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-pr transition-colors"
        >
          <FaArrowLeft /> Retour aux catégories
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 mt-3">
          Nouvelle catégorie
        </h1>
      </div>

      <CategoryCreateForm action={createCategoryAction} />
    </section>
  );
}
