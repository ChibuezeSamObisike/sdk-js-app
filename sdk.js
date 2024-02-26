class SDK {
  constructor({ onSuccess, onError, onClose, ...rest }) {
    // Initialize the SDK instance if an instance doesn't already exist
    if (!(this instanceof SDK)) {
      return new SDK({
        onSuccess,
        onError,
        onClose,
        ...rest,
      });
    }
    // Callback functions
    this.onSuccess = onSuccess;
    this.onError = onError;
    this.onClose = onClose;
    // Additional configuration
    this.config = rest;
  }

  init() {
    this.#openIframe();
    this.#addMessageListener();
  }

  // Method to open an iframe with a provided URL
  #openIframe() {
    // Create modal backdrop
    const modalBackdrop = document.createElement("div");
    modalBackdrop.classList.add("sdk-modal-backdrop");
    modalBackdrop.style.position = "fixed";
    modalBackdrop.style.top = "0";
    modalBackdrop.style.left = "0";
    modalBackdrop.style.width = "100%";
    modalBackdrop.style.height = "100%";
    modalBackdrop.style.background = "rgba(0, 0, 0, 0.2)";
    modalBackdrop.style.display = "flex";
    modalBackdrop.style.justifyContent = "center";
    modalBackdrop.style.alignItems = "center";
    modalBackdrop.style.zIndex = "9999";

    // Create modal container
    const modalContainer = document.createElement("div");
    modalContainer.style.borderRadius = "5px";
    modalContainer.style.position = "relative";
    modalContainer.style.width = "100%";
    modalContainer.style.height = "100%";

    // Create loader element
    const loader = document.createElement("div");
    loader.textContent = "Loading...";
    loader.style.textAlign = "center";
    loader.style.padding = "20px";
    loader.style.fontWeight = "bold";
    loader.style.color = "white";
    loader.style.height = "100vh";
    loader.style.display = "flex";
    loader.style.alignItems = "center";
    loader.style.justifyContent = "center";

    modalContainer.appendChild(loader);
    modalBackdrop.appendChild(modalContainer);
    document.body.appendChild(modalBackdrop);

    // Create iframe element
    const iframe = document.createElement("iframe");
    iframe.src = "http://localhost:3001";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";

    // When iframe is fully loaded
    iframe.onload = () => {
      // Send initial data to iframe
      iframe.contentWindow.postMessage(
        {
          type: "sdkData",
          config: this.config,
        },
        "*"
        //This means the host application which is the react app
      );
      // Remove loader and display iframe
      modalContainer.removeChild(loader);
      modalContainer.appendChild(iframe);
      modalContainer.style.display = "block";
    };

    // Handle iframe loading error
    iframe.onerror = () => {
      loader.textContent = "Failed to load the content.";
      setTimeout(() => {
        this.#closeIframe();
      }, 2000);
    };

    modalContainer.appendChild(iframe);
  }

  // Method to close the iframe
  #closeIframe() {
    const modalBackdrop = document.querySelector(".sdk-modal-backdrop");
    if (modalBackdrop) {
      document.body.removeChild(modalBackdrop);
    }
  }

  // Method to send data to the host
  sendToHost(data) {
    window.parent.postMessage(data, "*");
  }

  // Method to add message event listener
  #addMessageListener() {
    window.addEventListener("message", (event) => {
      // Check the event source for security reasons
      const data = event.data;
      if (event.origin !== "http://localhost:3001") {
        return;
      }

      if (event.data.type === "close") {
        this.#closeIframe();
      }

      // Handle data received from the SDK
      if (event.data?.type === "success") {
        this.onSuccess(data);
      }
      console.log("Data received from SDK:", data);
    });
  }
}

module.exports = { SDK };
