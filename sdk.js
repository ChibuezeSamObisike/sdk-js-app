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
    this.onSuccess = onSuccess;
    this.onError = onError;
    this.onClose = onClose;
    this.config = rest;
  }

  openIframe(url) {
    const modalBackdrop = document.createElement("div");
    modalBackdrop.classList.add("sdk-modal-backdrop");

    const loader = document.createElement("div");
    loader.classList.add("sdk-loader");

    // Create an SVG loading animation
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "40");
    svg.setAttribute("height", "40");
    svg.innerHTML = `
      <circle cx="20" cy="20" r="15" fill="none" stroke-width="3" stroke="#007bff">
        <animate attributeName="r" from="15" to="0" dur="0.8s" begin="0s" repeatCount="indefinite" />
      </circle>
    `;

    loader.appendChild(svg);

    const modalContainer = document.createElement("div");
    modalContainer.classList.add("sdk-modal-container");

    modalContainer.appendChild(loader);
    modalBackdrop.appendChild(modalContainer);
    document.body.appendChild(modalBackdrop);

    const iframe = document.createElement("iframe");
    iframe.src = url;

    iframe.onload = () => {
      modalContainer.removeChild(loader); // Remove the loader when the iframe is fully loaded
      modalContainer.appendChild(iframe);
      modalContainer.style.display = "block"; // Display the iframe when it's fully loaded
    };

    iframe.onerror = () => {
      loader.textContent = "Failed to load the content.";
      setTimeout(() => {
        this.closeIframe();
      }, 2000); // Close the modal after 2 seconds in case of an error
    };

    modalContainer.appendChild(iframe);

    // Close the modal when the backdrop is clicked
    modalBackdrop.addEventListener("click", () => {
      this.closeIframe();
    });
  }

  closeIframe() {
    const modalBackdrop = document.querySelector(".sdk-modal-backdrop");
    if (modalBackdrop) {
      document.body.removeChild(modalBackdrop);
    }
  }

  sendToHost(data) {
    // You can use window.postMessage to send data to the host
    window.parent.postMessage(data, "*");
  }

  addMessageListener() {
    // Event listener to receive data from the SDK
    window.addEventListener("message", (event) => {
      // Check the event source for security reasons
      if (event.origin !== "http://localhost:3000") {
        return;
      }

      if (event.data.event === "close") {
        this.closeIframe();
      }

      // Handle data received from the SDK
      const data = event.data;
      this.onSuccess(data);
      console.log("Data received from SDK:", data);
    });
  }
}

module.exports = { SDK };
