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

export async function PUT(request, { params }) {
  try {
    const subscriptionId = params?.id;

    if (!subscriptionId) {
      return Response.json(
        { message: "Identifiant d'abonnement manquant." },
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

    const formData = await request.formData();

    const response = await fetch(
      `${API_BASE_URL}/subscription/${subscriptionId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const payload = await parsePayload(response);

    if (!response.ok) {
      return Response.json(
        {
          message: payload?.message ?? "Impossible de modifier le paiement.",
        },
        { status: response.status || 502 }
      );
    }

    return Response.json(payload ?? { success: true });
  } catch (error) {
    console.error("Failed to update subscription", error);
    return Response.json(
      {
        message:
          "Impossible de modifier le paiement pour le moment. Veuillez réessayer.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const subscriptionId = params?.id;

    if (!subscriptionId) {
      return Response.json(
        { message: "Identifiant d'abonnement manquant." },
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
      `${API_BASE_URL}/subscription/${subscriptionId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const payload = await parsePayload(response);

    if (!response.ok) {
      return Response.json(
        {
          message: payload?.message ?? "Impossible de supprimer le paiement.",
        },
        { status: response.status || 502 }
      );
    }

    return Response.json(payload ?? { success: true });
  } catch (error) {
    console.error("Failed to delete subscription", error);
    return Response.json(
      {
        message:
          "Impossible de supprimer le paiement pour le moment. Veuillez réessayer.",
      },
      { status: 500 }
    );
  }
}
