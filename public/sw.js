console.log("Service Worker Loaded...");

let campaignId = "";

self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    console.log("Push event!! ", data);

    campaignId = data.campaignId;
    console.log("CampaignId: ", campaignId);

    self.registration.showNotification(data.title, {
      body: data.body,
      image: data.image,
      icon: data.icon,
      data: {
        url: data.launchUrl
      }
    });
  } else {
    console.log("Push event but no data");
  }
});



self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // Close the notification when clicked

  const urlToOpen = event.notification.data.url; // Retrieve the URL from the notification data

  // Call the incrementClick API
  console.log("CampaignId: ", campaignId);
  fetch(
    `https://ultimate-push-backend-production.up.railway.app/api/v1/campaign/incrementclick/${campaignId}`, 
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    }
  );

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        // If the URL is already open, focus it
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
  
});
