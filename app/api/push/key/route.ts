import { push } from "@/utils/push";

export async function GET() {
  try {
    push();
    return new Response(process.env.VAPID_PUBLIC_KEY, {
      status: 200,
    });
  } catch (err: any) {
    console.error(err);
    return new Response("Internal server error : Web Push is not available", {
      status: 500,
    });
  }
}
