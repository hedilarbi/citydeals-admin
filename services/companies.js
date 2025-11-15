import { API_BASE_URL } from "./apiConfig";
import { getSession } from "@/utils/session";

/**
 * Fetches companies from the API with the provided options.
 * @param {Object} params
 * @param {string} [params.sort="name"]
 * @param {string} [params.direction="DESC"]
 * @param {string} [params.q=""]
 */
export async function fetchCompanies({
  sort = "name",
  direction = "DESC",
  q = "",
} = {}) {
  const query = new URLSearchParams();

  if (sort) query.set("sort", sort);
  if (direction) query.set("direction", direction);
  if (q) query.set("q", q);

  const url = `${API_BASE_URL}/companies${
    query.toString() ? `?${query.toString()}` : ""
  }`;

  const headers = {
    "Content-Type": "application/json",
  };

  const { token } = await getSession();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    cache: "no-store",
    headers,
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer les entreprises");
  }

  return response.json();
}
