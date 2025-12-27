import { API_BASE_URL } from "@/services/apiConfig";
import { getSession } from "@/utils/session";

const parsePayload = async (response) => {
  const rawBody = await response.text();
  if (!rawBody) return null;
  try {
    return JSON.parse(rawBody);
  } catch (error) {
    return null;
  }
};

export async function POST(request) {
  try {
    const { token } = await getSession();
    if (!token) {
      return Response.json(
        { message: "Session administrateur manquante." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const companyId = formData.get("id_company");

    if (!companyId) {
      return Response.json(
        { message: "Identifiant d'entreprise manquant." },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/subscription`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const payload = await parsePayload(response);

    if (!response.ok) {
      return Response.json(
        {
          message: payload?.message ?? "Impossible d'ajouter le paiement.",
        },
        { status: response.status || 502 }
      );
    }

    return Response.json(payload ?? { success: true });
  } catch (error) {
    console.error("Failed to create subscription", error);
    return Response.json(
      {
        message:
          "Impossible d'ajouter le paiement pour le moment. Veuillez réessayer.",
      },
      { status: 500 }
    );
  }
}
