// main.js
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
          setupPushNotifications(registration);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
  
  // Function to set up push notifications
  function setupPushNotifications(registration) {
    if ('Notification' in window && 'PushManager' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          const applicationServerKey = urlBase64ToUint8Array('YOUR_PUBLIC_VAPID_KEY');
          registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey,
          })
          .then(subscription => {
            return sendSubscriptionToServer(subscription);
          })
          .catch(error => {
            console.error('Failed to subscribe to push:', error);
          });
        }
      });
    }
  }
  
  // Helper function to convert VAPID key
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  
  // Function to send subscription to your server
  function sendSubscriptionToServer(subscription) {
    return fetch('/api/save-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
  }
  
  // Example of handling form submission in offline mode
  document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData.entries());
    
    if (navigator.onLine) {
      try {
        const response = await fetch('/api/save-workout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formObject),
        });
        
        if (response.ok) {
          showMessage('Workout saved successfully!');
        }
      } catch (error) {
        console.error('Error saving workout:', error);
        saveForOffline(formObject);
        showMessage('You are offline. Your workout will be saved when you reconnect.');
      }
    } else {
      saveForOffline(formObject);
      showMessage('You are offline. Your workout will be saved when you reconnect.');
    }
  });
  
  // Helper function to save data for offline
  function saveForOffline(data) {
    // IndexedDB logic here...
  }
  
  // Helper function to show messages to the user
  function showMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'message';
    messageEl.textContent = message;
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
      messageEl.classList.add('hide');
      setTimeout(() => {
        document.body.removeChild(messageEl);
      }, 500);
    }, 3000);
  }