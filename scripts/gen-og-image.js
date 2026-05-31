#!/usr/bin/env node
/**
 * Generate src/assets/og-image.png (1200×630).
 * Uses only Node.js built-ins (zlib, fs) — no npm dependencies.
 *
 * Design:
 *   - Brand red (#D42B2B) background
 *   - Large white "M" glyph (drawn as filled rectangles, upper-center)
 *   - Lighter red bottom band with a thin white separator line
 */
"use strict";
const zlib = require("zlib");
const fs   = require("fs");
const path = require("path");

const W = 1200, H = 630;
const pixels = Buffer.alloc(W * H * 3);

// ── pixel helpers ─────────────────────────────────────────────────────────────
function setPixel(x, y, r, g, b) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + x) * 3;
  pixels[i] = r; pixels[i + 1] = g; pixels[i + 2] = b;
}

function fillRect(x, y, w, h, r, g, b) {
  for (let row = y; row < y + h; row++)
    for (let col = x; col < x + w; col++)
      setPixel(col, row, r, g, b);
}

// ── background ────────────────────────────────────────────────────────────────
fillRect(0, 0, W, H, 212, 43, 43);   // #D42B2B — brand red

// ── bottom band (darker red, with white separator) ────────────────────────────
fillRect(0, H - 160, W,   3, 255, 255, 255);   // white separator line
fillRect(0, H - 157, W, 157, 170,  18,  18);   // darker red band

// ── "M" glyph — centre upper area ────────────────────────────────────────────
// Total glyph bounding box: 260 × 300 px, stroke width 44 px
const mW = 260, mH = 300, sw = 44;
const mX = Math.round(W / 2 - mW / 2);  // 470
const mY = Math.round((H - 160) / 2 - mH / 2 + 20);  // vertically centred in red area

// Left vertical bar
fillRect(mX, mY, sw, mH, 255, 255, 255);
// Right vertical bar
fillRect(mX + mW - sw, mY, sw, mH, 255, 255, 255);

// Left diagonal arm: goes from (mX+sw, mY) to centre bottom of V
// Right diagonal arm: goes from (mX+mW-sw, mY) to same point — mirrored
//
// Meeting point (left edge of stroke at V bottom):
//   lx_end = mX + mW/2 - sw/2
//   rx_end = mX + mW/2 - sw/2  (same, both strokes share the base column)
const lxStart = mX + sw;
const rxStart = mX + mW - sw * 2;   // left edge of right diagonal stroke at top
const lrEnd   = Math.round(mX + mW / 2 - sw / 2);
const vDepth  = Math.round(mH / 2); // V goes halfway down the glyph

for (let row = 0; row <= vDepth; row++) {
  const t = row / vDepth;
  const lx = Math.round(lxStart + t * (lrEnd - lxStart));
  const rx = Math.round(rxStart + t * (lrEnd - rxStart));
  fillRect(lx, mY + row, sw, 1, 255, 255, 255);  // left arm scanline
  fillRect(rx, mY + row, sw, 1, 255, 255, 255);  // right arm scanline
}

// ── PNG encoder (pure Node.js) ────────────────────────────────────────────────
function crc32(buf) {
  let crc = 0xffffffff;
  for (const b of buf) {
    crc ^= b;
    for (let j = 0; j < 8; j++)
      crc = (crc & 1) ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const lenBuf  = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crcVal  = Buffer.alloc(4);
  crcVal.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([lenBuf, typeBuf, data, crcVal]);
}

// IHDR
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8]  = 8;  // bit depth
ihdr[9]  = 2;  // colour type: RGB (truecolour)
ihdr[10] = 0;  // compression: deflate
ihdr[11] = 0;  // filter: adaptive
ihdr[12] = 0;  // interlace: none

// IDAT — filter byte 0 (None) prepended to each scanline, then deflate
const scanlines = Buffer.alloc(H * (1 + W * 3));
for (let row = 0; row < H; row++) {
  const base = row * (1 + W * 3);
  scanlines[base] = 0;  // filter: None
  pixels.copy(scanlines, base + 1, row * W * 3, (row + 1) * W * 3);
}
const compressed = zlib.deflateSync(scanlines, { level: 6 });

// Assemble
const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const png  = Buffer.concat([
  sig,
  makeChunk("IHDR", ihdr),
  makeChunk("IDAT", compressed),
  makeChunk("IEND", Buffer.alloc(0)),
]);

const outPath = path.resolve(__dirname, "..", "src", "assets", "og-image.png");
fs.writeFileSync(outPath, png);
console.log(`✓ og-image.png written (${(png.length / 1024).toFixed(1)} KB)`);
