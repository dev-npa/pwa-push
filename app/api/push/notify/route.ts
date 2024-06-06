import webPush from "web-push";
import { push } from "@/utils/push";
import { subscriptions } from "../subscribe/route";

export async function POST(request: Request) {
  try {
    push();
    const { payload } = await request.json();

    await Promise.all(
      subscriptions.map((s: any) => webPush.sendNotification(s, payload))
    );

    return new Response("Notified", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Internal server error : Web Push is not available", {
      status: 500,
    });
  }
}
