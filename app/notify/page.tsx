"use client";

import React, { useEffect, useState } from "react";

export default function Page() {
  const [payload, setPayload] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetch("/api/push/notify", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ payload }),
    }).then((response) => {
      console.log("Notified");
    });
  };

  useEffect(() => {
    fetch("/api/push/subscribe", {
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        response?.subscriptions?.length &&
          setSubscriptions(response.subscriptions);
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
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        ></input>
        <button
          type="submit"
          className="mt-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          disabled={!payload}
        >
          Push
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
