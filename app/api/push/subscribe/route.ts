import { push } from "@/utils/push";
import { NextResponse } from "next/server";
import { subscriptions } from "@/db";

export async function GET() {
  try {
    push();
    return NextResponse.json({ subscriptions: subscriptions.find() });
  } catch (err: any) {
    console.error(err);
    return new Response("Internal server error : Web Push is not available", {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    push();
    const { subscription } = await request.json();
    if (!subscription) {
      return new Response("Bad request. Subscription is mandatory.", {
        status: 400,
      });
    }

    subscriptions.add(subscription);

    return new Response("Subscribed", { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response("Internal server error : Web Push is not available", {
      status: 500,
    });
  }
}
