### How to use the SDK in your application (For test purposes)

In the body of your html kindly paste this code
```js
<script src="https://sdk-js-app.vercel.app/sdk.js"></script>
    <button id="sendMessageButton" onclick="openSDKIframe()">
      Open SDK Iframe
    </button>

    <script>
      function onSuccess(data) { }
      function onError(data) {}
      function onClose(data) {}
      const sdk = new SDK({
        onSuccess,
        onError,
        onClose,
        config: { name: "Nyerishi", amount: 300 },
      });
    
      function openSDKIframe() {
        // Replace 'your-sdk-url' with the URL you want to load in the iframe
        sdk.init();
      }
    </script>
</script>
```
