import { API_BASE_URL } from "./apiConfig";
import { getSession } from "@/utils/session";

const withAuthHeaders = async () => {
  const headers = {
    "Content-Type": "application/json",
  };

  const { token } = await getSession();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export async function fetchUsers({
  q = "",
  sort = "",
  direction = "",
} = {}) {
  const query = new URLSearchParams();
  if (q) query.set("q", q);
  if (sort) query.set("sort", sort);
  if (direction) query.set("direction", direction);

  const headers = await withAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/users${query.toString() ? `?${query}` : ""}`, {
    cache: "no-store",
    headers,
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer les utilisateurs.");
  }

  return response.json();
}

const safeParseJson = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
};

export async function toggleUserActivation(id, currentlyActive) {
  if (!id) {
    throw new Error("Identifiant utilisateur manquant.");
  }

  const headers = await withAuthHeaders();
  const action = currentlyActive ? "deactivate" : "activate";

  const response = await fetch(`${API_BASE_URL}/user/${id}/${action}`, {
    cache: "no-store",
    headers,
  });

  if (!response.ok) {
    throw new Error(
      `Impossible de ${
        action === "activate" ? "activer" : "désactiver"
      } l'utilisateur.`
    );
  }

  return safeParseJson(response);
}
