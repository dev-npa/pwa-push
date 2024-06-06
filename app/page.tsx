"use client";

import { useCallback, useEffect, useState } from "react";
import { urlBase64ToUint8Array } from "@/utils";
import { rest } from "@/services/rest";

export default function Page() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [status, setStatus] = useState("");

  const fetchStatus = async (subscription: PushSubscription | null) => {
    if (!subscription) return null;

    return rest
      .post("/subscribe/status", { subscription })
      .then(({ data }) => Boolean(data.subscription));
  };

  const handleRequestNotificationAccess = async () => {
    if (!window.Notification) return;

    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }

    if (Notification.permission === "granted") {
      return true;
    }
  };

  const handleSubscribe = async () => {
    if (!(await handleRequestNotificationAccess())) {
      setStatus("Notification access not granted.");
      return;
    }

    const subscription = await getServiceWorkerSubscription();

    const subscribed = await fetchStatus(subscription);

    if (subscribed) {
      setStatus("You are already subscribed");
      return;
    }

    rest.post("/subscribe", { subscription }).then(() => {
      setStatus("Subscribed successfully");
    });
  };

  const handleCheckStatus = async () => {
    if (!subscription) {
      setStatus("Not subscribed");
    }
    const subscribed = await fetchStatus(subscription);
    setStatus(subscribed ? "You are already subscribed" : "Not subscribed");
  };

  const getServiceWorkerSubscription = useCallback(async () => {
    const registration = await navigator.serviceWorker.ready;

    let subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      return subscription;
    }

    const vapidPublicKey = await rest.get("/key").then(({ data }) => data);
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });

    return subscription;
  }, []);

  useEffect(() => {
    navigator.serviceWorker.register("service-worker.js", { scope: "/" });

    getServiceWorkerSubscription().then((subscription) => {
      setSubscription(subscription);
    });
  }, []);

  return (
    <div className="container mx-auto px-2 mt-2">
      <h1 className="text-xl font-semibold mb-3">PWA PUSH</h1>
      <div className="space-x-1">
        <button className="btn-primary" onClick={handleSubscribe}>
          Subscribe
        </button>
        <button className="btn-secondary" onClick={handleCheckStatus}>
          Notification Status
        </button>
      </div>
      {status && <p className="my-2 font-semibold text-yellow-800">{status}</p>}
      {subscription && (
        <div className="mt-3">
          <p className="mb-1">Subscription Details</p>
          <code>
            <p>{JSON.stringify(subscription, null, 2)}</p>
          </code>
        </div>
      )}
    </div>
  );
}
