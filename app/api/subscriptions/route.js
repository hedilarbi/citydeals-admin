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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId =
      searchParams.get("id_company") ?? searchParams.get("companyId");

    if (!companyId) {
      return Response.json(
        { message: "Identifiant d'entreprise manquant." },
        { status: 400 }
      );
    }

    const { token } = await getSession();
    if (!token) {
      return Response.json(
        { message: "Session administrateur manquante." },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/subscriptions?id_company=${companyId}`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const payload = await parsePayload(response);

    if (!response.ok) {
      return Response.json(
        {
          message:
            payload?.message ??
            "Impossible de récupérer les abonnements de cette entreprise.",
        },
        { status: response.status || 502 }
      );
    }

    return Response.json(payload ?? { success: true, subscriptions: [] });
  } catch (error) {
    console.error("Failed to fetch subscriptions", error);
    return Response.json(
      {
        message:
          "Impossible de récupérer les abonnements pour le moment. Veuillez réessayer.",
      },
      { status: 500 }
    );
  }
}
