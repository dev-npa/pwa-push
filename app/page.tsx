"use client";

import { useEffect, useState } from "react";
import { urlBase64ToUint8Array } from "@/utils";

export default function Page() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );

  useEffect(() => {
    navigator.serviceWorker.register("service-worker.js", { scope: "/" });

    navigator.serviceWorker.ready
      .then(function (registration) {
        return registration.pushManager
          .getSubscription()
          .then(async function (subscription) {
            if (subscription) {
              return subscription;
            }

            const response = await fetch("/api/push/key");
            const vapidPublicKey = await response.text();
            const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

            return registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertedVapidKey,
            });
          });
      })
      .then(function (subscription) {
        fetch("/api/push/subscribe", {
          method: "post",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            subscription,
          }),
        }).then(() => {
          console.debug("Subscribed");
          setSubscription(subscription);
        });
      });
  }, []);

  return (
    <div className="container mx-auto px-2 mt-2">
      <h1 className="text-lg font-semibold">PWA PUSH</h1>
      {subscription && (
        <>
          <p className="mb-1">Subscription Details</p>
          <code>
            <p>{JSON.stringify(subscription, null, 2)}</p>
          </code>
        </>
      )}
    </div>
  );
}
