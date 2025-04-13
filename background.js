// Default webmail provider if none is set
const DEFAULT_PROVIDER = "gmail";

// --- Helper functions (parseMailto, createComposeUrl) remain the same ---
// Function to parse the mailto: URL
function parseMailto(url) {
  if (!url || !url.startsWith("mailto:")) {
    console.error("Invalid mailto URL:", url);
    return null;
  }
  try {
    const mailtoUrl = new URL(url);
    const recipient = mailtoUrl.pathname;
    const params = mailtoUrl.searchParams;
    return {
      to: recipient || "",
      subject: params.get("subject") || "",
      body: params.get("body") || "",
      cc: params.get("cc") || "",
      bcc: params.get("bcc") || "",
    };
  } catch (e) {
    console.error("Error parsing mailto URL:", url, e);
    const simpleUrl = url.substring(7);
    const parts = simpleUrl.split("?");
    return {
      to: parts[0] || "",
      subject: "",
      body: "",
      cc: "",
      bcc: "",
    };
  }
}

// Function to construct the webmail compose URL
function createComposeUrl(provider, mailtoData) {
  if (!mailtoData) return null;
  const encode = encodeURIComponent;
  const { to, subject, body, cc, bcc } = mailtoData;
  switch (provider) {
    case "gmail":
      return `https://mail.google.com/mail/?view=cm&fs=1&to=${encode(
        to
      )}&su=${encode(subject)}&body=${encode(body)}&cc=${encode(
        cc
      )}&bcc=${encode(bcc)}`;
    case "outlook":
      return `https://outlook.live.com/owa/?path=/mail/action/compose&to=${encode(
        to
      )}&subject=${encode(subject)}&body=${encode(body)}`;
    case "yahoo":
      return `https://mail.yahoo.com/?to=${encode(to)}&subject=${encode(
        subject
      )}&body=${encode(body)}&cc=${encode(cc)}&bcc=${encode(bcc)}`;
    default:
      console.warn("Unsupported provider:", provider);
      return null;
  }
}
// --- End of helper functions ---

// Listener for web requests before they are sent
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    console.log("Intercepted mailto request:", details.url);

    // Get the saved provider preference
    // Using a Promise wrapper for chrome.storage.sync.get for cleaner async handling
    const getProvider = () => {
      return new Promise((resolve) => {
        chrome.storage.sync.get(
          { webmailProvider: DEFAULT_PROVIDER },
          (result) => {
            resolve(result.webmailProvider);
          }
        );
      });
    };

    // Process asynchronously
    (async () => {
      const provider = await getProvider();
      console.log("Using provider:", provider);

      // Add a small delay if needed, sometimes helps prevent race conditions
      // await new Promise(resolve => setTimeout(resolve, 50));

      const mailtoData = parseMailto(details.url);
      const composeUrl = createComposeUrl(provider, mailtoData);

      if (composeUrl) {
        // Open the webmail compose page in a new tab
        try {
          await chrome.tabs.create({ url: composeUrl });
          console.log("Opened compose URL:", composeUrl);
        } catch (error) {
          console.error("Error opening tab:", error);
          // If opening fails, maybe DON'T cancel the original request?
          // For now, we still cancel it to prevent default handler.
        }
      } else {
        console.error("Could not create compose URL for:", details.url);
        // Still cancel the default action even if we couldn't handle it,
        // or return {} to allow default action? User preference?
        // Let's cancel it to avoid unexpected external client launch.
      }
    })(); // Immediately invoke the async function

    // IMPORTANT: Cancel the original mailto: request to prevent
    // the default mail client from opening.
    // This MUST be returned synchronously from the main listener function.
    return { cancel: true };
  },
  // Filter for mailto URLs in main or subframes
  {
    urls: ["mailto:*"],
    types: ["main_frame", "sub_frame"], // Listen for navigation in top-level or iframe contexts
  },
  // Specifies that the listener function wants to block the request ('blocking')
  ["blocking"]
);

// --- Other background script logic remains the same ---

// Optional: Open options page when the extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.runtime.openOptionsPage();
});

// Optional: Set default provider on installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.storage.sync.set({ webmailProvider: DEFAULT_PROVIDER }, () => {
      console.log("Default webmail provider set to", DEFAULT_PROVIDER);
    });
  }
});

console.log("Background service worker (webRequest) started.");
