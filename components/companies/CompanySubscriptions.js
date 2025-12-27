"use client";

import { useEffect, useMemo, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { FaPlus, FaRegPenToSquare } from "react-icons/fa6";

import DeleteWarning from "@/components/modals/DeleteWarning";

const formatDate = (value) => {
  if (!value) return "—";
  const safeDate = value.replace(" ", "T");
  const date = new Date(safeDate);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

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

const formatAmount = (amount, currency) => {
  if (!amount) return "—";
  const numeric = Number(amount);
  const formatted = Number.isFinite(numeric)
    ? numeric.toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : amount;
  return currency ? `${formatted} ${currency}` : formatted;
};

const toInputDateTime = (value) => {
  if (!value) return "";
  const withT = value.replace(" ", "T");
  return withT.length >= 16 ? withT.slice(0, 16) : withT;
};

const toApiDateTime = (value) => {
  if (!value) return "";
  const [datePart, timePart] = value.split("T");
  if (!timePart) return value;
  const normalizedTime = timePart.length === 5 ? `${timePart}:00` : timePart;
  return `${datePart} ${normalizedTime}`;
};

const buildStatus = (subscription) => {
  const isValid = Number(subscription?.valid) === 1;
  return {
    label: isValid ? "Valide" : "Invalide",
    className: isValid
      ? "bg-green-50 text-green-600 border-green-200"
      : "bg-red-50 text-red-600 border-red-200",
  };
};

const emptyForm = {
  amount: "",
  date_start: "",
  date_end: "",
  valid: "1",
};

const CompanySubscriptions = ({ companyId, companyName }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: "create",
    subscription: null,
  });
  const [formValues, setFormValues] = useState(emptyForm);
  const [modalError, setModalError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalCount = subscriptions.length;
  const validCount = useMemo(
    () => subscriptions.filter((item) => Number(item?.valid) === 1).length,
    [subscriptions]
  );

  const loadSubscriptions = async () => {
    if (!companyId) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const response = await fetch(
        `/api/subscriptions?id_company=${encodeURIComponent(companyId)}`
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok || payload?.success === false) {
        throw new Error(
          payload?.message ?? "Impossible de récupérer les abonnements."
        );
      }
      const items = Array.isArray(payload?.subscriptions)
        ? payload.subscriptions
        : [];
      setSubscriptions(items);
    } catch (error) {
      setLoadError(
        error?.message ?? "Erreur lors du chargement des abonnements."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, [companyId]);

  const openCreateModal = () => {
    setFormValues(emptyForm);
    setModalError(null);
    setModalState({ isOpen: true, mode: "create", subscription: null });
  };

  const openEditModal = (subscription) => {
    setFormValues({
      amount: subscription?.amount ?? "",
      date_start: toInputDateTime(subscription?.date_start),
      date_end: toInputDateTime(subscription?.date_end),
      valid: Number(subscription?.valid) === 1 ? "1" : "0",
    });
    setModalError(null);
    setModalState({ isOpen: true, mode: "edit", subscription });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: "create", subscription: null });
    setModalError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!companyId) return;
    setIsSaving(true);
    setModalError(null);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append("id_company", companyId);
      formData.append("amount", formValues.amount);
      formData.append("date_start", toApiDateTime(formValues.date_start));
      formData.append("date_end", toApiDateTime(formValues.date_end));
      formData.append("valid", formValues.valid);

      const isEdit = modalState.mode === "edit";
      const endpoint = isEdit
        ? `/api/subscription/${modalState.subscription?.id_subscription}`
        : "/api/subscription";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        body: formData,
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok || payload?.success === false) {
        throw new Error(
          payload?.message ?? "Impossible d'enregistrer le paiement."
        );
      }

      setFeedback({
        type: "success",
        message: isEdit
          ? "Paiement mis à jour avec succès."
          : "Paiement ajouté avec succès.",
      });
      closeModal();
      await loadSubscriptions();
    } catch (error) {
      setModalError(
        error?.message ?? "Une erreur est survenue lors de l'enregistrement."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!subscriptionToDelete) return;
    setIsDeleting(true);
    setFeedback(null);
    try {
      const response = await fetch(
        `/api/subscription/${subscriptionToDelete.id_subscription}`,
        {
          method: "DELETE",
        }
      );
      const payload = await response.json().catch(() => null);

      if (!response.ok || payload?.success === false) {
        throw new Error(
          payload?.message ?? "Impossible de supprimer le paiement."
        );
      }

      setFeedback({
        type: "success",
        message: "Paiement supprimé avec succès.",
      });
      setSubscriptionToDelete(null);
      await loadSubscriptions();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error?.message ?? "Une erreur est survenue lors de la suppression.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Gestion des paiements
          </h2>
          <p className="text-sm text-gray-500">
            Suivez les abonnements liés à {companyName ?? "cette entreprise"}.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-pr text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-pr-dark transition-colors"
        >
          <FaPlus /> Ajouter un paiement
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-100 border border-light-gray rounded-full px-3 py-1">
          {totalCount} paiement{totalCount > 1 ? "s" : ""}
        </span>
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-100 border border-light-gray rounded-full px-3 py-1">
          {validCount} valide{validCount > 1 ? "s" : ""}
        </span>
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

      {loadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
          {loadError}
        </div>
      )}

      {isLoading && (
        <div className="bg-white border border-light-gray rounded-2xl p-6 text-sm text-gray-500">
          Chargement des paiements en cours...
        </div>
      )}

      {!isLoading && !loadError && subscriptions.length === 0 && (
        <div className="bg-white border border-dashed border-light-gray rounded-2xl p-8 text-center text-sm text-gray-500">
          Aucun paiement n&apos;a encore été ajouté pour cette entreprise.
        </div>
      )}

      {!isLoading && !loadError && subscriptions.length > 0 && (
        <div className="overflow-x-auto bg-white border border-light-gray rounded-2xl shadow-sm">
          <table className="min-w-full divide-y divide-light-gray text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">Montant</th>
                <th className="px-6 py-3 text-left">Période</th>
                <th className="px-6 py-3 text-left">Statut</th>
                <th className="px-6 py-3 text-left">Ajouté le</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-gray">
              {subscriptions.map((subscription) => {
                const status = buildStatus(subscription);
                return (
                  <tr
                    key={subscription.id_subscription}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {formatAmount(
                        subscription.amount,
                        subscription.currency
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <div className="flex flex-col">
                        <span>
                          Du{" "}
                          <span className="font-medium text-gray-900">
                            {formatDate(subscription.date_start)}
                          </span>
                        </span>
                        <span>
                          au{" "}
                          <span className="font-medium text-gray-900">
                            {formatDate(subscription.date_end)}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {formatDateTime(subscription.date_add)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <button
                          type="button"
                          onClick={() => openEditModal(subscription)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-white bg-pr hover:bg-pr-dark transition-colors px-3 py-2 rounded-full"
                        >
                          <FaRegPenToSquare /> Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => setSubscriptionToDelete(subscription)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 px-3 py-2 rounded-full transition-colors"
                        >
                          <FaTrashAlt /> Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-xl border border-light-gray w-full max-w-2xl p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {modalState.mode === "edit"
                    ? "Modifier un paiement"
                    : "Ajouter un paiement"}
                </h3>
                <p className="text-sm text-gray-500">
                  Renseignez les informations de l&apos;abonnement.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="text-sm text-gray-500 hover:text-gray-700"
                disabled={isSaving}
              >
                Fermer
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Montant *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formValues.amount}
                  onChange={(event) =>
                    setFormValues((prev) => ({
                      ...prev,
                      amount: event.target.value,
                    }))
                  }
                  className="mt-2 w-full border border-light-gray rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pr/30"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Date de début *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formValues.date_start}
                    onChange={(event) =>
                      setFormValues((prev) => ({
                        ...prev,
                        date_start: event.target.value,
                      }))
                    }
                    className="mt-2 w-full border border-light-gray rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pr/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Date de fin *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formValues.date_end}
                    onChange={(event) =>
                      setFormValues((prev) => ({
                        ...prev,
                        date_end: event.target.value,
                      }))
                    }
                    className="mt-2 w-full border border-light-gray rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pr/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Statut
                </label>
                <select
                  value={formValues.valid}
                  onChange={(event) =>
                    setFormValues((prev) => ({
                      ...prev,
                      valid: event.target.value,
                    }))
                  }
                  className="mt-2 w-full border border-light-gray rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pr/30 bg-white"
                >
                  <option value="1">Valide</option>
                  <option value="0">Invalide</option>
                </select>
              </div>

              {modalError && (
                <div className="text-sm rounded-2xl px-4 py-2 border bg-red-50 border-red-200 text-red-700">
                  {modalError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-full text-sm font-medium border border-light-gray text-gray-600 hover:border-gray-300 transition-colors"
                  disabled={isSaving}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-sm font-medium bg-pr text-white hover:bg-pr-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isSaving}
                >
                  {isSaving
                    ? "Enregistrement..."
                    : modalState.mode === "edit"
                      ? "Mettre à jour"
                      : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {subscriptionToDelete && (
        <DeleteWarning
          title="Supprimer le paiement"
          description="Ce paiement sera supprimé définitivement. Confirmez-vous la suppression ?"
          buttonText="Supprimer"
          action={handleDelete}
          isLoading={isDeleting}
          setShowModal={(value) => {
            if (value === false) setSubscriptionToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default CompanySubscriptions;
