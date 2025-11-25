import { Expo } from "expo-server-sdk";
import { getSession } from "@/utils/session";

const expoClient = new Expo();
const allowedRecipients = ["guests", "users", "companies"];

export async function POST(request) {
  try {
    const {
      title,
      body,
      recipient = "guests",
      city = "all",
    } = await request.json();

    const { token } = await getSession();
    if (!token) {
      return Response.json(
        { message: "Session administrateur manquante." },
        { status: 401 }
      );
    }

    if (!title || !body) {
      return Response.json(
        { message: "Le titre et le message sont obligatoires." },
        { status: 400 }
      );
    }

    if (!allowedRecipients.includes(recipient)) {
      return Response.json(
        { message: "Le destinataire sélectionné est invalide." },
        { status: 400 }
      );
    }

    const searchParams = new URLSearchParams();
    if (city && city !== "all") {
      searchParams.set("city", city);
    }
    const tokenUrl = `https://zapi.zdigital.fr/push_tokens/${recipient}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    const tokenResponse = await fetch(tokenUrl, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!tokenResponse.ok) {
      return Response.json(
        { message: "Impossible de récupérer les push tokens." },
        { status: 502 }
      );
    }

    const tokensPayload = await tokenResponse.json();

    if (!tokensPayload?.success) {
      return Response.json(
        { message: "Le service des push tokens a retourné une erreur." },
        { status: 502 }
      );
    }

    const pushTokens = Array.isArray(tokensPayload.push_tokens)
      ? tokensPayload.push_tokens
      : [];

    const validTokens = pushTokens.filter((token) =>
      Expo.isExpoPushToken(token)
    );

    if (validTokens.length === 0) {
      return Response.json(
        {
          message:
            "Aucun push token valide trouvé pour cette combinaison destinataire/ville.",
        },
        { status: 400 }
      );
    }

    const messages = validTokens.map((token) => ({
      to: token,
      sound: "default",
      title,
      body,
    }));

    const sendNotificationsInBackground = async () => {
      try {
        const chunks = expoClient.chunkPushNotifications(messages);
        for (const chunk of chunks) {
          await expoClient.sendPushNotificationsAsync(chunk);
        }
      } catch (backgroundError) {
        console.error("Failed to send push notifications (background)", backgroundError);
      }
    };

    // Fire-and-forget to avoid blocking the response
    sendNotificationsInBackground();

    return Response.json({
      success: true,
      recipients: validTokens.length,
    });
  } catch (error) {
    console.error("Failed to send push notification", error);
    return Response.json(
      {
        message:
          "Impossible d'envoyer la notification pour le moment. Veuillez réessayer.",
      },
      { status: 500 }
    );
  }
}
