import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [register, setRegister] = useState(null);

  const publicVapidKey = "BBXR_R7gx9k7Q8NXjD8yQv8JAq4f_ne37hL83n_seoWM3_GR76nPSia8lwJ4QZdHUW28kG6IQjiPXea5mSvzMCM";


  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  useEffect(() => {

    async function send() {
      // Register Service Worker
      console.log("Registering service worker...");
      const registerObj = await navigator.serviceWorker.register("./sw.js", {
        scope: "/",
      });
      setRegister(registerObj);
      console.log("Service Worker Registered...");
    }

    if ("serviceWorker" in navigator) {
      send().catch((err) => console.error(err));
    }
  }, []);

  const handleSubscribe = async () => {
    // Register Push
    console.log("Registering Push...");
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    console.log(subscription);
    console.log("Push Registered...");
    console.log("Sending Push...");
    const payload = {
      server: publicVapidKey,
      subscription
    }
    await fetch("https://ultimate-push-backend-production.up.railway.app/api/v1/subscription/save", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log("Push Sent...");
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <button className="subscribe-button" onClick={handleSubscribe}>
        Subscribe
      </button>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
