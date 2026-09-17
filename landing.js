(() => {
  const button = document.getElementById("copy");
  const command = document.getElementById("command");
  const status = document.getElementById("copy-status");
  if (!navigator.clipboard || !button || !command) return;
  button.hidden = false;
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(command.textContent);
      button.textContent = "Copied";
      status.textContent = "Docker command copied.";
      setTimeout(() => {
        button.textContent = "Copy";
      }, 2000);
    } catch {
      status.textContent =
        "Copy unavailable. Select and copy the command manually.";
      button.textContent = "Select code";
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(command);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
})();
