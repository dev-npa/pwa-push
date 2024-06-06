import { push } from "@/utils/push";
import { subscriptions } from "@/db";

export async function POST(request: Request) {
  try {
    push();
    subscriptions.clear();
    return new Response("Cleared", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Internal server error : Web Push is not available", {
      status: 500,
    });
  }
}
