(function () {
  "use strict";

  var isNl = document.documentElement.lang === "nl";
  var copyLabel   = isNl ? "Kopieer"      : "Copy";
  var copiedLabel = isNl ? "Gekopieerd!"  : "Copied!";
  var copyAriaLabel = isNl ? "Kopieer opdrachten" : "Copy commands";

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

  // ── Countdown to switch day (9 May 2026) ─────────────────────────────────
  var cdEl = document.getElementById("countdown");
  if (cdEl) {
    var switchDate = new Date("2026-05-09T00:00:00+02:00");

    var headingEl = document.createElement("p");
    headingEl.className = "countdown__heading";
    headingEl.textContent = isNl ? "Aftellen naar schakeldag" : "Counting down to switch day";

    var unitsEl = document.createElement("div");
    unitsEl.className = "countdown__units";

    [
      { id: "cd-d", label: isNl ? "dagen" : "days" },
      { id: "cd-h", label: isNl ? "uren" : "hours" },
      { id: "cd-m", label: "min" },
      { id: "cd-s", label: "sec" },
    ].forEach(function (u) {
      var unit = document.createElement("div");
      unit.className = "countdown__unit";
      unit.innerHTML =
        '<span class="countdown__num" id="' + u.id + '">--</span>' +
        '<span class="countdown__lbl">' + u.label + "</span>";
      unitsEl.appendChild(unit);
    });

    cdEl.appendChild(headingEl);
    cdEl.appendChild(unitsEl);
    cdEl.removeAttribute("hidden");

    function pad(n) { return n < 10 ? "0" + n : String(n); }

    function tick() {
      var diff = switchDate.getTime() - Date.now();
      if (diff <= 0) {
        cdEl.innerHTML =
          '<p class="countdown__done">' +
          (isNl ? "Schakeldag is aangebroken!" : "Switch day is here!") +
          "</p>";
        return;
      }
      var s = Math.floor(diff / 1000);
      var m = Math.floor(s / 60); s %= 60;
      var h = Math.floor(m / 60); m %= 60;
      var d = Math.floor(h / 24); h %= 24;
      document.getElementById("cd-d").textContent = d;
      document.getElementById("cd-h").textContent = pad(h);
      document.getElementById("cd-m").textContent = pad(m);
      document.getElementById("cd-s").textContent = pad(s);
    }

    tick();
    setInterval(tick, 1000);
  }

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
