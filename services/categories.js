import { API_BASE_URL } from "./apiConfig";
import { getSession } from "@/utils/session";

export async function fetchCompanyCategories({
  sort = "name",
  direction = "",
  q = "",
} = {}) {
  const query = new URLSearchParams();

  if (sort) query.set("sort", sort);
  if (direction) query.set("direction", direction);
  if (q) query.set("q", q);

  const url = `${API_BASE_URL}/company-categories${
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
    throw new Error("Impossible de récupérer les catégories");
  }

  return response.json();
}

export async function createCategory({ name, description, file }) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("active", 1);
  if (description) formData.append("description", description);
  if (file && file instanceof File && file.size > 0) {
    formData.append("file_cover", file);
  }

  const { token } = await getSession();
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/company-category`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = "Impossible de créer la catégorie";
    try {
      const payload = await response.json();
      errorMessage = payload?.message ?? errorMessage;
    } catch (error) {
      // swallow parsing error
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function fetchCompanyCategory(id) {
  const headers = {
    "Content-Type": "application/json",
  };
  const { token } = await getSession();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/company-category/${id}`, {
    cache: "no-store",
    headers,
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer la catégorie");
  }

  return response.json();
}

export async function updateCategory(id, { name, description, file }) {
  const formData = new FormData();
  if (name) formData.append("name", name);
  if (description) formData.append("description", description);
  if (file && file instanceof File && file.size > 0) {
    formData.append("file_cover", file);
  }

  const { token } = await getSession();
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/company-category/${id}`, {
    method: "PUT",
    headers,
    body: formData,
  });

  const rawBody = await response.text();
  let payload;

  try {
    payload = rawBody ? JSON.parse(rawBody) : undefined;
  } catch (error) {
    payload = undefined;
  }

  if (!response.ok) {
    const errorMessage = payload?.message ?? "Impossible de mettre à jour la catégorie";
    throw new Error(errorMessage);
  }

  return payload ?? { success: true };
}

export async function deleteCategory(id) {
  const { token } = await getSession();
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/company-category/${id}`, {
    method: "DELETE",
    headers,
  });

  const rawBody = await response.text();
  let payload;
  try {
    payload = rawBody ? JSON.parse(rawBody) : undefined;
  } catch (error) {
    payload = undefined;
  }

  if (!response.ok) {
    throw new Error(payload?.message ?? "Impossible de supprimer la catégorie.");
  }

  return payload ?? { success: true };
}
