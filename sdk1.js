// sdk.js

// Function to open the iframe as a modal
function openIframe(url, onSuccess) {
  const modalBackdrop = document.createElement("div");
  modalBackdrop.classList.add("sdk-modal-backdrop");

  const iframe = document.createElement("iframe");
  iframe.src = url;

  const modalContainer = document.createElement("div");
  modalContainer.classList.add("sdk-modal-container");
  modalContainer.appendChild(iframe);

  modalBackdrop.appendChild(modalContainer);
  document.body.appendChild(modalBackdrop);

  // Close the modal when the backdrop is clicked
  modalBackdrop.addEventListener("click", () => {
    document.body.removeChild(modalBackdrop);
  });
}

// Function to send information to the host application
function sendToHost(data) {
  // You can use window.postMessage to send data to the host
  window.parent.postMessage(data, "*");
}

// Function to close the iframe
function closeIframe() {
  const modalBackdrop = document.querySelector(".sdk-modal-backdrop");
  if (modalBackdrop) {
    document.body.removeChild(modalBackdrop);
  }
}

// Event listener to receive data from the SDK
window.addEventListener("message", (event) => {
  // Check the event source for security reasons
  if (event.origin !== "http://localhost:3000") {
    return;
  }

  if (event.data.event === "close") {
    closeIframe();
  }

  // Handle data received from the SDK
  const data = event.data;

  console.log("Data received from SDK:", data);
});

// Export functions for external use
module.exports = {
  openIframe,
  sendToHost,
  closeIframe,
};
