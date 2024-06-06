"use client";

import React, { useEffect, useState } from "react";
import { rest } from "@/services/rest";

export default function Page() {
  const [payload, setPayload] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);

  const handleClearSubscriptions = () => {
    rest.post("/notify/clear").then(() => {
      setSubscriptions([]);
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    rest.post("/notify", { payload }).then(() => {
      console.debug("Notified");
    });
  };

  useEffect(() => {
    rest.get("/subscribe").then(({ data }) => {
      data?.subscriptions?.length && setSubscriptions(data.subscriptions);
    });
  }, []);

  return (
    <div className="container mx-auto px-2 mt-2">
      <h1 className="text-lg font-semibold">Notify</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Enter payload"
          type="text"
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          className="input mb-2"
        ></input>
        <button type="submit" className="btn-primary me-1" disabled={!payload}>
          Push
        </button>
        <button
          type="button"
          className="btn-secondary"
          disabled={!subscriptions?.length}
          onClick={handleClearSubscriptions}
        >
          Clear subscriptions
        </button>
      </form>

      <br />
      <p className="font-semibold">Available Subscription</p>
      <hr className="mb-1" />
      {subscriptions.length ? (
        <ul>
          {subscriptions.map((s: any, i) => (
            <li key={i} className="boder-b">
              <span className="font-semibold">{i + 1}.</span> {s?.endpoint}
            </li>
          ))}
        </ul>
      ) : (
        <p>No subscription available</p>
      )}
    </div>
  );
}
