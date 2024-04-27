console.log("inside sw.js");

self.addEventListener("install", (event) => {
  console.log("Service worker installed");
});

self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});

self.addEventListener("push", function (event) {
  const data = event.data.json();
  event.waitUntil(self.registration.showNotification(data.title, data.options));
});

self.addEventListener("notificationclick", (event) => {
  const url = new URL(event.notification.data.url, self.location.origin).href;
  // event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) if (client.focused) return;
        for (const client of clientList)
          if (client.url == url) return client.focus();
        return clients.openWindow(url);
      })
  );
  // https://web.dev/articles/push-notifications-common-notification-patterns
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/notificationclick_event
  // https://web.dev/articles/push-notifications-notification-behaviour
});
