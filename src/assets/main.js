(function () {
  "use strict";

  // ── Dropdown controls (chip trigger + floating menu), matching the DMC navbar ─
  var dropdowns = Array.prototype.slice.call(document.querySelectorAll(".dd"));

  function closeDropdowns(except) {
    dropdowns.forEach(function (dd) {
      if (dd === except) return;
      dd.classList.remove("open");
      var trig = dd.querySelector(".dd-trig");
      if (trig) trig.setAttribute("aria-expanded", "false");
    });
  }

  dropdowns.forEach(function (dd) {
    var trig = dd.querySelector(".dd-trig");
    var menu = dd.querySelector(".dd-menu");
    if (!trig) return;
    trig.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = !dd.classList.contains("open");
      closeDropdowns(dd);
      dd.classList.toggle("open", open);
      trig.setAttribute("aria-expanded", String(open));
    });
    if (menu) menu.addEventListener("click", function (e) { e.stopPropagation(); });
  });

  document.addEventListener("click", function () { closeDropdowns(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDropdowns();
  });

  // ── Theme (system / dark / light), persisted to localStorage ─────────────────
  var themeButtons = Array.prototype.slice.call(document.querySelectorAll("[data-set-theme]"));
  var themeIcon = document.getElementById("theme-icon");
  var THEME_ICONS = { system: "🖥", dark: "🌙", light: "☀" };
  var lightMql = window.matchMedia("(prefers-color-scheme: light)");

  function applyTheme(pref) {
    var light = pref === "light" || (pref === "system" && lightMql.matches);
    if (light) document.documentElement.setAttribute("data-theme", "light");
    else document.documentElement.removeAttribute("data-theme");
  }

  function setTheme(pref) {
    applyTheme(pref);
    themeButtons.forEach(function (b) {
      b.setAttribute("aria-checked", String(b.getAttribute("data-set-theme") === pref));
    });
    if (themeIcon) themeIcon.textContent = THEME_ICONS[pref] || THEME_ICONS.dark;
    try { localStorage.setItem("meshcore-theme", pref); } catch (e) {}
  }

  themeButtons.forEach(function (b) {
    b.addEventListener("click", function () {
      setTheme(b.getAttribute("data-set-theme"));
      closeDropdowns();
    });
  });

  if (lightMql.addEventListener) {
    lightMql.addEventListener("change", function () {
      var pref = "dark";
      try { pref = localStorage.getItem("meshcore-theme") || "dark"; } catch (e) {}
      if (pref === "system") applyTheme("system");
    });
  }

  var savedTheme = "dark";
  try { savedTheme = localStorage.getItem("meshcore-theme") || "dark"; } catch (e) {}
  setTheme(savedTheme);

  var lang = document.documentElement.lang;
  var COPY = {
    nl: { label: "Kopieer",  done: "Gekopieerd!", aria: "Kopieer opdrachten" },
    de: { label: "Kopieren", done: "Kopiert!",    aria: "Befehle kopieren" },
    en: { label: "Copy",     done: "Copied!",     aria: "Copy commands" }
  };
  var copyStrings = COPY[lang] || COPY.en;
  var copyLabel   = copyStrings.label;
  var copiedLabel = copyStrings.done;
  var copyAriaLabel = copyStrings.aria;

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
