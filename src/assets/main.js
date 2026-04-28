(function () {
  "use strict";

  // ── Wrap preparation steps (all except #step-07) in a CSS grid ───────────
  // Steps are siblings in the DOM; we group them here so no markdown
  // container is needed (which would conflict with the :::step depth tracking).
  var prepSteps = Array.from(document.querySelectorAll(".step:not(#step-07):not(#step-08)"));
  if (prepSteps.length > 0) {
    var wrapper = document.createElement("div");
    wrapper.className = "steps-prep";
    prepSteps[0].parentNode.insertBefore(wrapper, prepSteps[0]);
    prepSteps.forEach(function (s) { wrapper.appendChild(s); });
  }

  // ── Copy-to-clipboard for .cli blocks ───────────────────────────────────
  document.querySelectorAll(".cli__copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var code = btn.closest(".cli").querySelector(".cli__code code");
      if (!code) return;
      navigator.clipboard
        .writeText(code.textContent.trim())
        .then(function () {
          btn.textContent = "Copied!";
          btn.classList.add("copied");
          setTimeout(function () {
            btn.textContent = "Copy";
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
