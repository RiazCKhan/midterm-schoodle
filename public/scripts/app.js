// Client facing scripts here

// NOT IMPLEMENTED - COPY BUTTON FOR UNIQUE-URL
document.getElementById('clipboardCopy').addEventListener('click', clipboardCopy);
async function clipboardCopy() {
  let text = document.querySelector("#input").value;
  await navigator.clipboard.writeText(text);
}
