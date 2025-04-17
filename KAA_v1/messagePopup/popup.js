// The user clicked our button, get the active tab in the current window using
// the tabs API.
let tabs = await messenger.tabs.query({ active: true, currentWindow: true });

// Get the message currently displayed in the active tab, using the
// messageDisplay API. Note: This needs the messagesRead permission.
// The returned message is a MessageHeader object with the most relevant
// information.
let message = await messenger.messageDisplay.getDisplayedMessages(tabs[0].id);

// Update the HTML fields with the message subject and sender.
document.getElementById("subject").textContent = message.messages[0].subject;
document.getElementById("from").textContent = message.messages[0].author;

// Request the full message to access its full set of headers.
let full = await messenger.messages.getFull(message.messages[0].id);
let head = await messenger.messages.get(message.messages[0].id);
console.log("Full Message: ", full);
let onlymsg = await messenger.messages.listInlineTextParts(
  message.messages[0].id
);
console.log("ONLY MESSAGE:", onlymsg);

let requireddata = {
  message_id: head.headerMessageId,
  subject: head.subject,
  body: onlymsg[0].content,
};

fetch("https://hello.nodehosting.online/webhook-test/karolis-mail", {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(requireddata),
})
  .then((response) => response.json())
  .then((response) => console.log(JSON.stringify(response)));

document.getElementById("received").textContent = full.headers.received[0];
