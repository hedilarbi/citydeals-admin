import { Expo } from "expo-server-sdk";

const TEST_PUSH_TOKEN = "ExponentPushToken[vCcI1tJIn-XEub1lAH_HpC]";

const expoClient = new Expo();

export async function POST(request) {
  try {
    const { title, body } = await request.json();

    if (!title || !body) {
      return Response.json(
        { message: "Le titre et le message sont obligatoires." },
        { status: 400 }
      );
    }

    if (!Expo.isExpoPushToken(TEST_PUSH_TOKEN)) {
      return Response.json(
        { message: "Le token de notification configuré est invalide." },
        { status: 500 }
      );
    }

    const messages = [
      {
        to: TEST_PUSH_TOKEN,
        sound: "default",
        title,
        body,
      },
    ];

    const chunks = expoClient.chunkPushNotifications(messages);
    const tickets = [];
    for (const chunk of chunks) {
      const ticketChunk = await expoClient.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    return Response.json({
      success: true,
      tickets,
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
