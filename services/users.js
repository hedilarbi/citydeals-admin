import { API_BASE_URL } from "./apiConfig";
import { getSession } from "@/utils/session";

export async function fetchUsers({
  q = "",
  sort = "",
  direction = "",
} = {}) {
  const query = new URLSearchParams();
  if (q) query.set("q", q);
  if (sort) query.set("sort", sort);
  if (direction) query.set("direction", direction);

  const headers = {
    "Content-Type": "application/json",
  };

  const { token } = await getSession();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/users${query.toString() ? `?${query}` : ""}`, {
    cache: "no-store",
    headers,
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer les utilisateurs.");
  }

  return response.json();
}
