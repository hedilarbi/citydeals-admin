"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaLayerGroup,
  FaMagnifyingGlass,
  FaPlus,
} from "react-icons/fa6";

import DeleteWarning from "../modals/DeleteWarning";
import DealCategoryCard from "./DealCategoryCard";

const DealCategoriesExplorer = ({
  categories = [],
  pagination,
  isError,
  deleteCategoryAction,
}) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const filteredCategories = useMemo(() => {
    if (!searchValue) return categories;
    return categories.filter((category) => {
      const haystack = `${category.name} ${
        category.description ?? ""
      }`.toLowerCase();
      return haystack.includes(searchValue.toLowerCase());
    });
  }, [categories, searchValue]);

  const handleDeleteConfirmation = async () => {
    if (!categoryToDelete || !deleteCategoryAction) return;
    setIsDeleting(true);
    setFeedback(null);
    try {
      const result = await deleteCategoryAction(
        categoryToDelete.id_deal_category
      );
      if (!result?.success) {
        throw new Error(
          result?.message ?? "Impossible de supprimer la catégorie."
        );
      }
      setFeedback({
        type: "success",
        message: result?.message ?? "Catégorie supprimée avec succès.",
      });
      setCategoryToDelete(null);
      router.refresh();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.message ?? "Une erreur est survenue lors de la suppression.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-pr transition-colors"
          >
            <FaArrowLeft /> Retour aux deals
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 mt-2">
            Catégories de deals
          </h1>
        </div>
        <Link
          href="/deals/categories/new"
          className="inline-flex items-center gap-2 bg-pr text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-pr-dark transition-colors"
        >
          <FaPlus /> Nouvelle catégorie
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-light-gray p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-pr/10 text-pr flex items-center justify-center text-xl">
            <FaLayerGroup />
          </div>
          <div>
            <p className="text-xs uppercase text-gray-400">Total catégories</p>
            <p className="text-2xl font-semibold text-gray-900">
              {pagination?.items?.nb_items ?? categories.length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-light-gray shadow-sm p-4 flex items-center gap-3">
        <div className="text-gray-400">
          <FaMagnifyingGlass />
        </div>
        <input
          type="search"
          placeholder="Rechercher une catégorie..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="flex-1 text-sm outline-none"
        />
      </div>

      {feedback && (
        <div
          className={`border rounded-2xl px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
          Impossible de charger les catégories pour le moment. Réessayez plus
          tard.
        </div>
      )}

      {!isError && filteredCategories.length === 0 && (
        <div className="bg-white border border-dashed border-light-gray rounded-2xl p-10 text-center text-gray-500 text-sm">
          {categories.length === 0
            ? "Aucune catégorie n’a encore été créée."
            : "Aucune catégorie ne correspond à cette recherche."}
        </div>
      )}

      {!isError && filteredCategories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <DealCategoryCard
              key={category.id_deal_category}
              category={category}
              onDelete={(selected) => setCategoryToDelete(selected)}
            />
          ))}
        </div>
      )}

      {categoryToDelete && (
        <DeleteWarning
          title={`Supprimer ${categoryToDelete.name}`}
          description="Cette catégorie ne sera plus disponible pour vos deals. Confirmez-vous la suppression ?"
          buttonText="Supprimer"
          action={handleDeleteConfirmation}
          isLoading={isDeleting}
          setShowModal={(value) => {
            if (value === false) setCategoryToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default DealCategoriesExplorer;
