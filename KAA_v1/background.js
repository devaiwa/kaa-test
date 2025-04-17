// Wrapper for handling errors during creation of menu items.
async function addMenuEntry(createData) {
  let { promise, resolve, reject } = Promise.withResolvers();
  let error;
  let id = browser.menus.create(createData, () => {
    error = browser.runtime.lastError; // Either null or an Error object.
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  try {
    await promise;
    console.info(`Successfully created menu entry <${id}>`);
  } catch (error) {
    if (error.message.includes("already exists")) {
      console.info(
        `The menu entry <${id}> exists already and was not added again.`
      );
    } else {
      console.error("Failed to create menu entry:", createData, error);
    }
  }

  return id;
}

browser.menus.onClicked.addListener((info, tab) => {
  //TODO change to simple statement and one template
  switch (info.menuItemId) {
    case "T01":
      console.log("Added truck ", info.menuItemId);
      addTruckId(tab, info.menuItemId);
      break;
    case "T02":
      console.log("Added truck ", info.menuItemId);
      addTruckId(tab, info.menuItemId);
      break;
    case "T03":
      console.log("Added truck ", info.menuItemId);
      addTruckId(tab, info.menuItemId);
      break;
    case "T04":
      console.log("Added truck ", info.menuItemId);
      addTruckId(tab, info.menuItemId);
      break;
    case "T05":
      console.log("Added truck ", info.menuItemId);
      addTruckId(tab, info.menuItemId);
      break;
    case "T06":
      console.log("Added truck ", info.menuItemId);
      addTruckId(tab, info.menuItemId);
      break;
  }
  console.log({ tab, info });
});

//TODO options loop
await addMenuEntry({
  id: "T01",
  contexts: ["compose_action_menu"],
  type: "radio",
  title: "Fura: pirma",
});
await addMenuEntry({
  id: "T02",
  contexts: ["compose_action_menu"],
  type: "radio",
  title: "Fura: antra",
});
await addMenuEntry({
  id: "T03",
  contexts: ["compose_action_menu"],
  type: "radio",
  title: "Fura: trecia",
});
await addMenuEntry({
  id: "T04",
  contexts: ["compose_action_menu"],
  type: "radio",
  title: "Fura: Ketvirta",
});
await addMenuEntry({
  id: "T05",
  contexts: ["compose_action_menu"],
  type: "radio",
  title: "Fura: Penkta",
});
await addMenuEntry({
  id: "T06",
  contexts: ["compose_action_menu"],
  type: "radio",
  title: "Fura: Sesta",
});

// Thunderbird can terminate idle backgrounds in Manifest V3.
// Any listener directly added during add-on startup will be registered as a
// persistent listener and the background will wake up (restart) each time the
// event is fired.

async function addTruckId(tab, truckID) {
  // Get the existing message.
  let details = await browser.compose.getComposeDetails(tab.id);
  console.log(details);

  if (details.isPlainText) {
    // The message is being composed in plain text mode.
    let body = details.plainTextBody;
    console.log(body);

    // Make direct modifications to the message text, and send it back to the editor.
    body += "\n\n[KAA_TruckID:\n";
    body += truckID;
    body += "]\n\n";
    console.log(body);
    browser.compose.setComposeDetails(tab.id, { plainTextBody: body });
  } else {
    // The message is being composed in HTML mode. Parse the message into an HTML document.
    let document = new DOMParser().parseFromString(details.body, "text/html");
    console.log(document);

    // Use normal DOM manipulation to modify the message.
    let para = document.createElement("p");
    para.textContent = "[KAA_TruckID:" + truckID + "]";
    document.body.appendChild(para);

    // Serialize the document back to HTML, and send it back to the editor.
    let html = new XMLSerializer().serializeToString(document);
    console.log(html);
    browser.compose.setComposeDetails(tab.id, { body: html });
  }
}
