(function () {
  "use strict";

  var isNl = document.documentElement.lang === "nl";
  var copyLabel   = isNl ? "Kopieer"      : "Copy";
  var copiedLabel = isNl ? "Gekopieerd!"  : "Copied!";
  var copyAriaLabel = isNl ? "Kopieer opdrachten" : "Copy commands";

  // ── Wrap configuration steps in a CSS grid ──────────────────────────────
  // Steps are siblings in the DOM; we group them here so no markdown
  // container is needed (which would conflict with the :::step depth tracking).
  var settingsSteps = Array.from(document.querySelectorAll(".step"));
  if (settingsSteps.length > 0) {
    var wrapper = document.createElement("div");
    wrapper.className = "steps-grid";
    settingsSteps[0].parentNode.insertBefore(wrapper, settingsSteps[0]);
    settingsSteps.forEach(function (s) { wrapper.appendChild(s); });
  }

  // ── Copy-to-clipboard for .cli blocks ───────────────────────────────────
  document.querySelectorAll(".cli__copy").forEach(function (btn) {
    btn.textContent = copyLabel;
    btn.setAttribute("aria-label", copyAriaLabel);
    btn.addEventListener("click", function () {
      var code = btn.closest(".cli").querySelector(".cli__code code");
      if (!code) return;
      navigator.clipboard
        .writeText(code.textContent.trim())
        .then(function () {
          btn.textContent = copiedLabel;
          btn.classList.add("copied");
          setTimeout(function () {
            btn.textContent = copyLabel;
            btn.classList.remove("copied");
          }, 1600);
        })
        .catch(function () {
          var range = document.createRange();
          range.selectNode(code);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
        });
    });
  });

  var supportsPopover = "popover" in HTMLElement.prototype;

  // ── Popover polyfill for browsers without native support ─────────────────
  if (!supportsPopover) {
    document.querySelectorAll("[popovertarget]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var targetId = btn.getAttribute("popovertarget");
        var action = btn.getAttribute("popovertargetaction") || "toggle";
        var target = document.getElementById(targetId);
        if (!target) return;
        var isVisible = target.style.display !== "none" && target.style.display !== "";
        if (action === "hide") {
          target.style.display = "none";
        } else if (action === "show") {
          target.style.display = "block";
        } else {
          target.style.display = isVisible ? "none" : "block";
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        document.querySelectorAll(".more__popover").forEach(function (p) {
          p.style.display = "none";
        });
      }
    });
  }
})();
