import CategoryCreateForm from "@/components/categories/CategoryCreateForm";
import { createDealCategory } from "@/services/deals";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

async function createDealCategoryAction(_, formData) {
  "use server";

  const name = formData.get("name");
  const description = formData.get("description");
  const file = formData.get("cover");

  if (!name) {
    return { message: "Le nom est obligatoire." };
  }

  try {
    await createDealCategory({ name, description, file });
    return {
      success: true,
      message: "Catégorie créée avec succès.",
    };
  } catch (error) {
    return {
      message: error.message ?? "Impossible de créer la catégorie.",
    };
  }
}

export default function DealCategoryCreatePage() {
  return (
    <section className="p-6 lg:p-8 space-y-6 h-[calc(100vh-100px)] overflow-y-auto">
      <div>
        <Link
          href="/deals/categories"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-pr transition-colors"
        >
          <FaArrowLeft /> Retour aux catégories
        </Link>
        <p className="text-xs uppercase tracking-wide text-gray-400 mt-4">Deals</p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">
          Nouvelle catégorie de deal
        </h1>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
          Définissez un nom, une description et un visuel pour structurer vos campagnes par thème.
        </p>
      </div>

      <CategoryCreateForm action={createDealCategoryAction} />
    </section>
  );
}
