---
layout: base.njk
title: Dutch Meshcore — SF7 Settings
description: "Community-wide switch · 9 May 2026"
---

## Settings at a glance

::: settings
| Parameter | Value |
| :--- | :--- |
| Radio preset | Netherlands |
| SF / CR | SF7 / CR5 |
| Frequency | 869.618 MHz |
| Bandwidth | 62.5 kHz |
| Advert interval | 50 h+ (flood) |
| Firmware | v1.15+ |
:::

## Preparation steps

Steps 1–6 can be completed **before switch day**, at your own pace.

The steps below are a compressed version of the [full switch instructions (PDF) ↗](https://assets.woodwar.com/meshcore_sf7_switch_instructions.pdf).


::: step 01 "Firmware" "v1.15+"
Update **both** your repeater and companion firmware to **v1.15+** and make sure you are using the latest version of the mobile app.

::: more "Why v1.15?"
Version 1.15 is the minimum required for this switch:

- **Default region scoping** — the repeater can tag its own traffic with a region automatically.
- **Correct packet blocking** — `region denyf *` only works reliably from v1.15 onwards.

Updates also include improvements to congestion handling.
:::

::: step 02 "Advert interval" "50 h minimum"
Set your **flood advert interval to 50 hours** or more. Zero-hop adverts should be **240 minutes** (4 hours).

::: more "Flood vs zero-hop adverts"
Visit [mc-radar.woodwar.com/mesh-health](https://mc-radar.woodwar.com/mesh-health) to check whether your node is listed. Nodes there have an advert interval that is too short and are causing unnecessary load on the mesh. If yours appears, fix it before the switch.

**Flood adverts** travel across the entire mesh and announce your repeater to the full network. Sending them too often is a leading cause of congestion. Set to at least **50 hours** — higher is fine.

**Zero-hop adverts** are heard only by your immediate neighbours. **240 minutes** (4 hours) is the recommended interval.

Both settings are in your repeater's administration screen.
:::

::: step 03 "Stop bots & scripts" "No auto-messages"
Review and stop any automated integrations — Home Assistant, custom scripts, auto-reply bots in shared channels such as **#test**.

:::

::: step 04 "Region scoping" "eu · nl · province"
Configure region scoping on both your **repeater** and your **companion app**. This is one of the most impactful changes you can make to reduce congestion.

Two repeater tasks to complete now: **A.1** — add region codes, and **A.2** — set your default region. Step A.3 (blocking unscoped packets) is a separate phase scheduled for **13 June 2026** — do not apply it yet.

Community tools make this easy:
- [All-in-one configurator →](https://www.mesh-up.nl/tools/regiocodes-instellen/)
- [Dashboard configurator →](https://dashboard-elburg.f3dp.nl/#tab=region-configurator)

::: more "CLI sequence & full instructions"
**Companion app:** In Experimental Settings, set **Default Region** to `nl`. Assign a scope to each channel you use — e.g. `nl-nh` for North Holland, `nl` for national, `eu` for Europe-wide.

Province codes: `nl-gr` · `nl-fr` · `nl-dr` · `nl-ov` · `nl-fl` · `nl-ge` · `nl-ut` · `nl-nh` · `nl-zh` · `nl-ze` · `nl-nb` · `nl-li`

**⚠ Step A.3 (`region denyf *`) is Phase 8 — 13 June 2026.** Do not run it on switch day. Enabling it before then will cause your repeater to drop messages from nodes that have not yet configured region scoping.

::: cli "Repeater CLI"
```
region put eu
region put nl
region put YOUR_REGION
region put YOUR_CITY
region default YOUR_REGION
region save

# Phase 8 only (13 June 2026):
region denyf *
region save
```
:::

::: step 05 "Multi-byte path" "2-byte hash"
Enable 2-byte path hashing on your **companion app** (most important) and your **repeater**. This improves the observability of packets in the network.

**Companion app:** Experimental Settings → **Default Path Hash Size = 2-byte**

::: cli "Repeater CLI"
```
set path.hash.mode 1
```
:::

::: step 06 "Loop detection" "set dutycycle 10"
Enable loop detection and enforce airtime limits. Run in the repeater CLI:
`set loop.detect minimal` and `set dutycycle 10`.

::: more "What do these commands do?"
**`set loop.detect minimal`** — Rejects flood packets that appear to be looping across the mesh. A faulty node can cause a packet to circulate up to the 64-hop limit, consuming significant airtime. The `minimal` setting catches clear loops without false positives.

Options: `off` (default) · `minimal` · `moderate` · `strict` — `minimal` is the recommended starting point.

**`set dutycycle 10`** — Enforces 10% duty cycle. This is a **legal requirement** for operation in Europe on the 868 MHz sub-band used by Meshcore.
:::

## Switch day

Switch date: **9 May 2026.** Only step 7 needs to happen on the agreed date.

::: step 07 "Switch radio settings" "SF7 / CR5"
In the Meshcore app, open your repeater settings and select the **Netherlands** radio preset. This preset configures all parameters automatically.

Only the spreading factor and coding rate change — the frequency (869.618 MHz) is identical to the current SF8 setting.

After applying the preset, confirm you can hear your neighbours on the new settings before considering the switch complete.

::: cli "New radio settings"
```
Preset:     Netherlands
SF / CR:    SF7 / CR5
Frequency:  869.618 MHz
Bandwidth:  62.5 kHz
```
:::

## Phase 8 — Strict region forwarding

Approximately one month after the main switch, the community will enable strict region forwarding. This turns the mesh into connected regional zones — problems or congestion in one area no longer cascade across the whole network, and adverts are scoped to their region.

Phase 8 date: **13 June 2026.** Only step 8 needs to happen on this date.

::: step 08 "Strict region forwarding" "13 Jun 2026"
Apply the final region command on your repeater. This instructs your repeater to silently drop any incoming packet that carries no region scope — from this point, every message entering your repeater must carry an explicit region tag. This creates a strong incentive for all operators to configure regions correctly, and results in a more stable and reliable mesh for the whole community.

From the **UI**: In the Manage Regions screen, set **Deny Flood** in the **Packets without region set** option.

::: cli "Repeater CLI"
```
region denyf *
region save
```
:::

## Checklist

<div class="checklist-wrap checklist-wrap--green">
  <p><strong>Before switch day — confirm you have completed the preparation steps:</strong></p>
  <ul>
    <li>Step 1: Firmware updated to v1.15 or later — repeater and companion app</li>
    <li>Step 2: Flood advert interval ≥ 50 h; zero-hop adverts 240 min</li>
    <li>Step 3: Bots and auto-reply scripts stopped; mc-radar.woodwar.com/mesh-health checked</li>
    <li>Step 4: Region scoping configured (A.1 + A.2) on repeater and companion app</li>
    <li>Step 5: Multi-byte path — companion app Default Path Hash Size = 2-byte; repeater CLI: <code>set path.hash.mode 1</code></li>
    <li>Step 6: Loop detection — <code>set loop.detect minimal</code>; airtime factor — <code>set dutycycle 10</code></li>
  </ul>
  <p><strong>Switch day (9 May 2026):</strong></p>
  <ul class="switch-day-items">
    <li>Step 7: Apply the Netherlands radio preset (SF7 / CR5, 869.618 MHz, 62.5 kHz)</li>
    <li>Confirm you can hear your neighbours on the new settings</li>
  </ul>
</div>

<div class="checklist-wrap checklist-wrap--purple">
  <p><strong>Phase 8 — Strict region forwarding (13 June 2026):</strong></p>
  <ul class="switch-day-items">
    <li>All preparation steps (1–6) completed</li>
    <li>Step 4 region scoping (A.1 + A.2) confirmed working — channels scoped correctly</li>
    <li>Step 8: Apply strict region forwarding on your repeater (<code>region denyf *</code>)</li>
  </ul>
</div>

## Resources

<div class="resources">
  <a href="https://assets.woodwar.com/meshcore_sf7_switch_instructions.pdf" target="_blank" rel="noopener" class="resource-link">
    Switch instructions
    <span class="resource-link__arrow">PDF document ↗</span>
  </a>
  <a href="https://mc-radar.woodwar.com/mesh-health" target="_blank" rel="noopener" class="resource-link">
    Mesh health check
    <span class="resource-link__arrow">mc-radar.woodwar.com ↗</span>
  </a>
  <a href="https://cornmeister.nl/" target="_blank" rel="noopener" class="resource-link">
    Mesh status
    <span class="resource-link__arrow">cornmeister.nl ↗</span>
  </a>
  <a href="https://analyzer.letsmesh.net/" target="_blank" rel="noopener" class="resource-link">
    Mesh analyser
    <span class="resource-link__arrow">analyzer.letsmesh.net ↗</span>
  </a>
  <a href="https://meshwiki.nl/wiki/Lijst_van_regio%27s" target="_blank" rel="noopener" class="resource-link">
    Region codes list
    <span class="resource-link__arrow">meshwiki.nl ↗</span>
  </a>
  <a href="https://www.mesh-up.nl/tools/regiocodes-instellen/" target="_blank" rel="noopener" class="resource-link">
    Region configurator
    <span class="resource-link__arrow">mesh-up.nl ↗</span>
  </a>
  <a href="https://dashboard-elburg.f3dp.nl/#tab=region-configurator" target="_blank" rel="noopener" class="resource-link">
    Dashboard configurator
    <span class="resource-link__arrow">f3dp.nl ↗</span>
  </a>
</div>
