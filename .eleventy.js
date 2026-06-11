const markdownIt = require("markdown-it");
const markdownItContainer = require("markdown-it-container");
const markdownItAttrs = require("markdown-it-attrs");

// Counters for unique popover and CLI IDs — reset before each build
let moreCounter = 0;
let cliCounter = 0;

module.exports = function (eleventyConfig) {
  eleventyConfig.on("eleventy.before", () => {
    moreCounter = 0;
    cliCounter = 0;
  });

  // JSON-encode a value for safe inline use (used for JSON-LD in templates)
  eleventyConfig.addFilter("tojson", (val) => JSON.stringify(val));

  const md = markdownIt({
    html: true,
    breaks: false,
    linkify: true,
    typographer: true,
  })
    .use(markdownItAttrs)

    // ── :::settings — at-a-glance settings table ─────────────────────────────
    .use(markdownItContainer, "settings", {
      render(tokens, idx) {
        return tokens[idx].nesting === 1
          ? '<div class="settings-table">\n'
          : "</div>\n";
      },
    })

    // ── :::step N "Title" "Summary" ──────────────────────────────────────────
    .use(markdownItContainer, "step", {
      validate: (p) =>
        /^step\s+\d+\s+"[^"]+"\s+"[^"]+"/.test(p.trim()),
      render(tokens, idx) {
        const m = tokens[idx].info
          .trim()
          .match(/^step\s+(\d+)\s+"([^"]+)"\s+"([^"]+)"/);
        if (tokens[idx].nesting === 1) {
          const num = m[1].padStart(2, "0");
          const title = md.utils.escapeHtml(m[2]);
          const summary = m[3];
          return `<article class="step" id="step-${num}">
<div class="step__head">
<span class="step__num" aria-hidden="true">${num}</span>
<div class="step__meta">
<h3 class="step__title">${title}</h3>
<span class="step__summary">${summary}</span>
</div>
</div>
<div class="step__body">\n`;
        }
        return `</div>\n</article>\n`;
      },
    })

    // ── :::more "Label" — hover/tap popover ──────────────────────────────────
    .use(markdownItContainer, "more", {
      validate: (p) => /^more\s+"[^"]+"/.test(p.trim()),
      render(tokens, idx) {
        const m = tokens[idx].info.trim().match(/^more\s+"([^"]+)"/);
        if (tokens[idx].nesting === 1) {
          moreCounter++;
          const id = `more-${moreCounter}`;
          const label = md.utils.escapeHtml(m[1]);
          return `<div class="more">
<button class="more__trigger" popovertarget="${id}">${label}<span class="more__icon" aria-hidden="true">↗</span></button>
<div id="${id}" class="more__popover" popover>
<div class="more__inner">
<div class="more__popover-header">
<span class="more__popover-title">${label}</span>
<button class="more__close" popovertarget="${id}" popovertargetaction="hide" aria-label="Close">×</button>
</div>
<div class="more__popover-body">\n`;
        }
        // 4 closing divs: popover-body, inner, popover div, outer more div
        return `</div>\n</div>\n</div>\n</div>\n`;
      },
    })

    // ── :::cli "Label" — monospace command block with copy button ────────────
    .use(markdownItContainer, "cli", {
      validate: (p) => /^cli/.test(p.trim()),
      render(tokens, idx) {
        const m = tokens[idx].info
          .trim()
          .match(/^cli(?:\s+"([^"]+)")?/);
        if (tokens[idx].nesting === 1) {
          cliCounter++;
          const label = m?.[1] ? md.utils.escapeHtml(m[1]) : "CLI";
          return `<div class="cli">
<div class="cli__header">
<span class="cli__label">${label}</span>
<button class="cli__copy" aria-label="Copy commands">Copy</button>
</div>
<div class="cli__code">\n`;
        }
        return `</div>\n</div>\n`;
      },
    });

  eleventyConfig.setLibrary("md", md);
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/_redirects");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
