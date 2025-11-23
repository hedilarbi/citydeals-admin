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

export async function fetchDeals({ q = "", sort = "", direction = "" } = {}) {
  const query = new URLSearchParams();
  if (q) query.set("q", q);
  if (sort) query.set("sort", sort);
  if (direction) query.set("direction", direction);

  const headers = await withAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/deals${query.toString() ? `?${query}` : ""}`,
    {
      cache: "no-store",
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Impossible de récupérer les deals.");
  }

  return response.json();
}

export async function fetchDeal(id) {
  const headers = await withAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/deal/${id}`, {
    cache: "no-store",
    headers,
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer le deal.");
  }

  return response.json();
}

const parsePayload = async (response) => {
  const rawBody = await response.text();
  if (!rawBody) return undefined;
  try {
    return JSON.parse(rawBody);
  } catch (error) {
    return undefined;
  }
};

export async function fetchDealCategories({ sort = "name" } = {}) {
  const query = new URLSearchParams();
  if (sort) query.set("sort", sort);

  const headers = await withAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/deal-categories${query.toString() ? `?${query}` : ""}`,
    {
      cache: "no-store",
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Impossible de récupérer les catégories de deals.");
  }

  return response.json();
}

export async function createDealCategory({ name, description, file }) {
  const formData = new FormData();
  if (name) formData.append("name", name);
  if (description) formData.append("description", description);
  if (file && file instanceof File && file.size > 0) {
    formData.append("file_cover", file);
  }

  formData.append("active", 1);
  const headers = {};
  const { token } = await getSession();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/deal-category`, {
    method: "POST",
    headers,
    body: formData,
  });

  const payload = await parsePayload(response);

  if (!response.ok) {
    throw new Error(payload?.message ?? "Impossible de créer la catégorie.");
  }

  return payload ?? { success: true };
}

export async function fetchDealCategory(id) {
  const headers = await withAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/deal-category/${id}`, {
    cache: "no-store",
    headers,
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer la catégorie.");
  }

  return response.json();
}

export async function updateDealCategory(id, { name, description, file }) {
  const formData = new FormData();
  if (name) formData.append("name", name);
  if (description) formData.append("description", description);
  if (file && file instanceof File && file.size > 0) {
    formData.append("file_cover", file);
  }

  const headers = {};
  const { token } = await getSession();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/deal-category/${id}`, {
    method: "PUT",
    headers,
    body: formData,
  });

  const payload = await parsePayload(response);

  if (!response.ok) {
    throw new Error(
      payload?.message ?? "Impossible de mettre à jour la catégorie."
    );
  }

  return payload ?? { success: true };
}

export async function deleteDealCategory(id) {
  const headers = {};
  const { token } = await getSession();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/deal-category/${id}`, {
    method: "DELETE",
    headers,
  });

  const payload = await parsePayload(response);

  if (!response.ok) {
    throw new Error(
      payload?.message ?? "Impossible de supprimer la catégorie."
    );
  }

  return payload ?? { success: true };
}
