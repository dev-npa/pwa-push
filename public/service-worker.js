self.addEventListener("activate", (event) => {});

self.addEventListener("install", (event) => {});

self.addEventListener("fetch", (event) => {});

self.addEventListener("push", function (event) {
  const payload = event.data ? event.data.text() : "no payload";

  event.waitUntil(
    self.registration.showNotification("PWA Push Notification", {
      body: payload,
    })
  );
});
