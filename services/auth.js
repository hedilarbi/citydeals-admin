import { API_BASE_URL } from "./apiConfig";

export async function authenticateAdmin({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const payload = await response.json();

  if (!response.ok || !payload?.success) {
    const message = payload?.message ?? "Identifiants incorrects.";
    throw new Error(message);
  }

  return payload;
}
