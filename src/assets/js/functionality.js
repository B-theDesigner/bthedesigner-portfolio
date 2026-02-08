'use strict';
// ===============================
// Copy Email to Clipboard CTA
// ===============================
(function () {
  function copyEmail(event) {
    event.preventDefault();

    const link = event.currentTarget;
    const email = "hello@bthedesigner.me"; // ← replace with your email
    const originalHTML = link.innerHTML;

    if (!navigator.clipboard) {
      console.warn("Clipboard API not supported");
      return;
    }

    navigator.clipboard.writeText(email)
      .then(() => {
        link.innerHTML = '<i class="uil uil-check"></i> Copied!';

        setTimeout(() => {
          link.innerHTML = originalHTML;
        }, 1500);
      })
      .catch(err => {
        console.error("Failed to copy email:", err);
      });
  }

  // Expose function globally for inline onclick usage
  window.copyEmail = copyEmail;
})();
