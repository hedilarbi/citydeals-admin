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

  const headers = await withAuthHeaders();

  const response = await fetch(url, {
    cache: "no-store",
    headers,
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer les entreprises");
  }

  return response.json();
}

export async function fetchCompany(id) {
  if (!id) {
    throw new Error("Identifiant d'entreprise manquant.");
  }

  const headers = await withAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/company/${id}`, {
    cache: "no-store",
    headers,
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer l'entreprise demandée.");
  }

  return response.json();
}

export async function fetchCompanyDeals(id, params = {}) {
  if (!id) {
    throw new Error("Identifiant d'entreprise manquant.");
  }

  const query = new URLSearchParams();
  const { page, limit } = params;

  if (page) query.set("page", page);
  if (limit) query.set("limit", limit);

  const headers = await withAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/deals/company/${id}${
      query.toString() ? `?${query.toString()}` : ""
    }`,
    {
      cache: "no-store",
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Impossible de récupérer les deals de cette entreprise.");
  }

  return response.json();
}
