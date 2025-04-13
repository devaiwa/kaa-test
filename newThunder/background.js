browser.composeAction.onClicked.addListener((tab) => {
  // Get the list of available labels
  const labels = [
    { id: "pirma", text: "[PIRMA]" },
    { id: "antra", text: "[ANTRA]" },
    { id: "trecia", text: "[TRECIA]" },
  ];

  // Create a dropdown menu
  let labelMenu = new Menu();

  labels.forEach((label) => {
    const menuItem = new MenuItem({
      label: label.text,
      id: label.id,
    });

    menuItem.onclick = () => {
      browser.composeAction.setBadgeText({ text: label.id });
      injectLabelIntoComposer(label.text);
    };

    labelMenu.append(menuItem);
  });

  // Show the dropdown menu at the current cursor position
  const composeElement = document.querySelector("#mailContent");
  if (composeElement) {
    const rect = composeElement.getBoundingClientRect();
    labelMenu.popup(rect.left, rect.top + rect.height + 10);
  }
});

function injectLabelIntoComposer(labelText) {
  // Get the message body element
  const composerBody =
    document.getElementById("editorContainer").contentDocument.body;

  // Create a new div with the label
  const labelDiv = document.createElement("div");
  labelDiv.textContent = labelText + " ";
  labelDiv.style.fontSize = "12px";
  labelDiv.style.color = "#666666";
  labelDiv.style.fontStyle = "italic";

  // Insert the label at the beginning of the message
  composerBody.insertBefore(labelDiv, composerBody.firstChild);
}
