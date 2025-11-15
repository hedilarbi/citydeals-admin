import { destroySession } from "@/utils/session";

export async function POST() {
  await destroySession();
  return Response.json({ success: true });
}
