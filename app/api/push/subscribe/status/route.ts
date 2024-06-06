import { subscriptions } from "@/db";
import { push } from "@/utils/push";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    push();
    const { subscription } = await request.json();
    if (!subscription) {
      return new Response("Bad request. Subscription is mandatory.", {
        status: 400,
      });
    }

    return NextResponse.json({
      subscription: subscriptions.get(subscription),
    });
  } catch (err: any) {
    console.error(err);
    return new Response("Internal server error : Web Push is not available", {
      status: 500,
    });
  }
}
