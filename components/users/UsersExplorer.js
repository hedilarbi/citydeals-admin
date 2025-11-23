"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaMagnifyingGlass,
  FaPeopleGroup,
  FaPhone,
  FaUserPlus,
} from "react-icons/fa6";
import { toggleUserActivation } from "@/services/users";

const statusStyles = (active) =>
  active
    ? "bg-green-50 text-green-600 border-green-200"
    : "bg-red-50 text-red-600 border-red-200";

const buildStatusMap = (users = []) => {
  return users.reduce((acc, user) => {
    if (user?.id_user) {
      acc[user.id_user] = user.active === 1;
    }
    return acc;
  }, {});
};

const UsersExplorer = ({ users = [], pagination, query, isError }) => {
  const [searchValue, setSearchValue] = useState(query?.q ?? "");
  const [statusMap, setStatusMap] = useState(() => buildStatusMap(users));
  const [pendingToggleId, setPendingToggleId] = useState(null);

  useEffect(() => {
    setStatusMap(buildStatusMap(users));
  }, [users]);

  const filteredUsers = useMemo(() => {
    if (!searchValue) return users;
    return users.filter((user) => {
      const haystack = `${user.email} ${user.phone ?? ""} ${
        user.city ?? ""
      }`.toLowerCase();
      return haystack.includes(searchValue.toLowerCase());
    });
  }, [users, searchValue]);

  const activeUsers = useMemo(() => {
    const values = Object.values(statusMap);
    if (values.length === 0) {
      return users.filter((user) => user.active === 1).length;
    }
    return values.filter(Boolean).length;
  }, [statusMap, users]);

  const getUserStatus = (user) =>
    statusMap[user.id_user] ?? user.active === 1;

  const handleToggle = async (user) => {
    const userId = user?.id_user;
    if (!userId) return;

    const currentStatus = getUserStatus(user);
    const nextStatus = !currentStatus;

    setStatusMap((previous) => ({
      ...previous,
      [userId]: nextStatus,
    }));
    setPendingToggleId(userId);

    try {
      await toggleUserActivation(userId, currentStatus);
    } catch (error) {
      console.error("Erreur lors du changement de statut utilisateur", error);
      setStatusMap((previous) => ({
        ...previous,
        [userId]: currentStatus,
      }));
    } finally {
      setPendingToggleId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/entreprises"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-pr transition-colors"
          >
            <FaArrowLeft /> Retour aux entreprises
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 mt-2">
            Utilisateurs
          </h1>
        </div>
        <Link
          href="#"
          className="inline-flex items-center gap-2 bg-pr text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-pr-dark transition-colors"
        >
          <FaUserPlus /> Inviter un utilisateur
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-light-gray p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-pr/10 text-pr flex items-center justify-center text-xl">
            <FaPeopleGroup />
          </div>
          <div>
            <p className="text-xs uppercase text-gray-400">
              Total utilisateurs
            </p>
            <p className="text-2xl font-semibold text-gray-900">
              {pagination?.items?.nb_items ?? users.length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-light-gray p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-pr/10 text-pr flex items-center justify-center text-xl">
            <FaPhone />
          </div>
          <div>
            <p className="text-xs uppercase text-gray-400">Actifs</p>
            <p className="text-2xl font-semibold text-gray-900">
              {activeUsers}
            </p>
            <p className="text-xs text-gray-500">
              Comptes prêts à être contactés.
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
          placeholder="Rechercher un utilisateur..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="flex-1 text-sm outline-none"
        />
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
          Impossible de charger les utilisateurs pour le moment. Réessayez plus
          tard.
        </div>
      )}

      {!isError && filteredUsers.length === 0 && (
        <div className="bg-white border border-dashed border-light-gray rounded-2xl p-10 text-center text-gray-500 text-sm">
          {users.length === 0
            ? "Aucun utilisateur n’est répertorié pour le moment."
            : "Aucun utilisateur ne correspond à cette recherche."}
        </div>
      )}

      {!isError && filteredUsers.length > 0 && (
        <div className="overflow-x-auto bg-white border border-light-gray rounded-2xl shadow-sm">
          <table className="min-w-full divide-y divide-light-gray text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">Nom</th>
                <th className="px-6 py-3 text-left">Prénom</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Téléphone</th>
                <th className="px-6 py-3 text-left">Ville</th>
                <th className="px-6 py-3 text-left">Statut</th>
                <th className="px-6 py-3 text-left">Créé le</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-gray">
              {filteredUsers.map((user) => {
                const isActive = getUserStatus(user);
                const formattedDate = user.date_add
                  ? new Date(user.date_add.replace(" ", "T")).toLocaleDateString(
                      "fr-FR",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )
                  : "—";

                return (
                  <tr
                    key={user.id_user}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-700 capitalize">
                      {user.lastname || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-700 capitalize">
                      {user.firstname || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {user.phone || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-700 capitalize">
                      {user.city || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${statusStyles(
                          isActive
                        )}`}
                      >
                        {isActive ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {formattedDate}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <button
                          type="button"
                          role="switch"
                          aria-label={`${isActive ? "Désactiver" : "Activer"} ${
                            user.firstname ?? user.lastname ?? "l'utilisateur"
                          }`}
                          aria-checked={isActive}
                          onClick={() => handleToggle(user)}
                          disabled={pendingToggleId === user.id_user}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            isActive ? "bg-pr" : "bg-gray-300"
                          } ${
                            pendingToggleId === user.id_user
                              ? "opacity-60 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isActive ? "translate-x-5" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <Link
                          href={`/utilisateurs/${user.id_user}`}
                          className="text-xs font-medium text-pr hover:text-pr-dark"
                        >
                          Voir les détails
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersExplorer;
