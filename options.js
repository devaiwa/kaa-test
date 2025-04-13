const form = document.getElementById("optionsForm");
const statusDiv = document.getElementById("status");

// Function to save options
function saveOptions(e) {
  e.preventDefault(); // Prevent form submission
  const selectedProvider = form.querySelector(
    'input[name="provider"]:checked'
  ).value;

  chrome.storage.sync.set(
    {
      webmailProvider: selectedProvider,
    },
    () => {
      // Update status to let user know options were saved.
      statusDiv.textContent = "Options saved successfully!";
      console.log("Settings saved:", selectedProvider);
      setTimeout(() => {
        statusDiv.textContent = ""; // Clear status after a few seconds
      }, 2000);
    }
  );
}

// Function to restore saved options
function restoreOptions() {
  // Use default value 'gmail' if nothing is stored
  chrome.storage.sync.get(
    {
      webmailProvider: "gmail", // Default value
    },
    (items) => {
      const savedProvider = items.webmailProvider;
      const radioToCheck = form.querySelector(
        `input[name="provider"][value="${savedProvider}"]`
      );
      if (radioToCheck) {
        radioToCheck.checked = true;
        console.log("Settings restored:", savedProvider);
      } else {
        console.warn("Saved provider not found in options:", savedProvider);
        // Optionally check the default radio manually here if needed
        form.querySelector(
          'input[name="provider"][value="gmail"]'
        ).checked = true;
      }
    }
  );
}

// Add event listeners
document.addEventListener("DOMContentLoaded", restoreOptions);
form.addEventListener("submit", saveOptions);
