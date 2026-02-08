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

// ===============================
// Anchor Links Functionality
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("anchor_list");
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll("a.anchors"));
  if (!links.length) return;

  // Map links -> section elements
  const items = links
    .map(link => {
      const id = link.getAttribute("href");
      if (!id || !id.startsWith("#")) return null;
      const section = document.querySelector(id);
      return section ? { link, section, id } : null;
    })
    .filter(Boolean);

  if (!items.length) return;

  const setActive = (activeId) => {
    links.forEach(a => {
      const isActive = a.getAttribute("href") === activeId;
      a.classList.toggle("active", isActive);
      if (isActive) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  };

  // ✅ ADD THIS helper so your existing calls work
  const setActiveLink = (linkEl) => {
    const href = linkEl.getAttribute("href");
    if (href) setActive(href);
  };

  // Ensure active updates on click immediately (then scroll happens)
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      // ✅ headerOffset = sticky header height
      const headerOffset = 75.2 + 20;

      const y =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        headerOffset;

      window.scrollTo({ top: y, behavior: "smooth" });

      // ✅ this now works because we added setActiveLink()
      setActiveLink(link);
      history.replaceState(null, "", href);
    });
  });

  // Observe sections to update active while scrolling
  const observer = new IntersectionObserver(
  (entries) => {
    // Only consider visible sections
    const visibleEntries = entries.filter(e => e.isIntersecting);
    if (!visibleEntries.length) return;

    // Pick the section whose top is closest to the sticky header
    const closest = visibleEntries.reduce((prev, curr) => {
      const prevOffset = Math.abs(prev.boundingClientRect.top - 75.2);
      const currOffset = Math.abs(curr.boundingClientRect.top - 75.2);
      return currOffset < prevOffset ? curr : prev;
    });

    const id = closest.target.id;
    const matching = links.find(
      l => l.getAttribute("href") === `#${id}`
    );

    if (matching) setActiveLink(matching);
  },
  {
    root: null,
    rootMargin: `-${75.2}px 0px -60% 0px`,
    threshold: [0, 0.1, 0.25, 0.5]
  }
);

  items.forEach(({ section }) => observer.observe(section));

  // If page loads with a hash, set it active
  if (window.location.hash) setActive(window.location.hash);
});
