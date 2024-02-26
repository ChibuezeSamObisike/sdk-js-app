class SDK {
  constructor({ onSuccess, onError, onClose, ...rest }) {
    // Initialize the SDK instance
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

    // Create loader element
    const loader = document.createElement("div");
    loader.classList.add("sdk-loader");

    // Create SVG loading animation
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "40");
    svg.setAttribute("height", "40");
    svg.innerHTML = `
      <circle cx="20" cy="20" r="15" fill="none" stroke-width="3" stroke="#007bff">
        <animate attributeName="r" from="15" to="0" dur="0.8s" begin="0s" repeatCount="indefinite" />
      </circle>
    `;

    loader.appendChild(svg);

    // Create modal container
    const modalContainer = document.createElement("div");
    modalContainer.classList.add("sdk-modal-container");

    modalContainer.appendChild(loader);
    modalBackdrop.appendChild(modalContainer);
    document.body.appendChild(modalBackdrop);

    // Create iframe element
    const iframe = document.createElement("iframe");
    iframe.src = "http://localhost:3001";

    // When iframe is fully loaded
    iframe.onload = () => {
      // Send initial data to iframe
      iframe.contentWindow.postMessage(
        {
          type: "sdkData",
          config: { name: "Nyerishi" },
        },
        "*"
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
      if (event.origin !== "http://localhost:3001") {
        return;
      }

      if (event.data.type === "close") {
        this.#closeIframe();
      }

      // Handle data received from the SDK
      const data = event.data;
      this.onSuccess(data);
      console.log("Data received from SDK:", data);
    });
  }
}

module.exports = { SDK };

x;
