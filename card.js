// Shared behaviour for every profile card page.
(() => {
  const shareBtn = document.getElementById("sharebtn");
  const toast = document.getElementById("toast");
  let toastTimer;

  function notify(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  if (!shareBtn) return;

  // Reveal the share affordance once the card has settled in.
  setTimeout(() => shareBtn.classList.remove("is-hidden"), 1200);

  shareBtn.addEventListener("click", async () => {
    const name = document.querySelector(".name")?.textContent.trim() || document.title;
    const role = document.querySelector(".role")?.textContent.replace(/\s+/g, " ").trim() || "";

    const payload = {
      title: document.title,
      text: role ? `${name} — ${role}` : name,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(payload);
      } catch (err) {
        if (err.name !== "AbortError") notify("Couldn't open the share sheet");
      }
      return;
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        notify("Link copied to clipboard");
        return;
      } catch (err) {
        /* fall through to the unsupported message */
      }
    }

    notify("Sharing isn't supported on this browser");
  });
})();
