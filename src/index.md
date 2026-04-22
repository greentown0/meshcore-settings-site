---
layout: base.njk
title: Dutch Meshcore — SF7 Settings
description: "Community-wide switch · Tentative date: 9 May 2026"
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

::: step 01 "Firmware" "v1.15+"
Update **both** your repeater firmware and companion app to version **1.15 or later** before making any other changes.

::: more "Why v1.15?"
Version 1.15 is the minimum required for this switch:

- **Default region scoping** — the repeater can tag its own traffic with a region automatically.
- **Correct packet blocking** — `region denyf *` only works reliably from v1.15 onwards.

Updates also include improvements to congestion handling.
:::

::: step 02 "Advert interval" "50 h minimum"
Set your **flood advert interval to 50 hours** or more. Zero-hop adverts should be **240 minutes** (4 hours).

::: more "Flood vs zero-hop adverts"
**Flood adverts** travel across the entire mesh and announce your repeater to the full network. Sending them too often is a leading cause of congestion. Set to at least **50 hours** — higher is fine.

**Zero-hop adverts** are heard only by your immediate neighbours. **240 minutes** (4 hours) is the recommended interval.

Both settings are in your repeater's administration screen.
:::

::: step 03 "Stop bots & scripts" "No auto-messages"
Review and stop any automated integrations — Home Assistant, custom scripts, auto-reply bots in shared channels such as **#test**.

::: more "Quick check"
Visit [mc-radar.woodwar.com/mesh-health](https://mc-radar.woodwar.com/mesh-health) to check whether your node is listed. Nodes there have an advert interval that is too short and are causing unnecessary load on the mesh. If yours appears, fix it before the switch.

**Auto-reply bots in shared channels are a significant congestion source** and should be stopped entirely before switch day.
:::

::: step 04 "Region scoping" "eu · nl · province"
Configure region scoping on both your **repeater** and your **companion app**. This is the single most impactful change you can make to reduce congestion.

Community tools make this easy:
- [All-in-one configurator →](https://www.mesh-up.nl/tools/regiocodes-instellen/)
- [Dashboard configurator →](https://dashboard-elburg.f3dp.nl/#tab=region-configurator)

::: more "CLI sequence & full instructions"
**Companion app:** In Experimental Settings, set **Default Region** to `nl`. Assign a scope to each channel you use — e.g. `nl-nh` for North Holland, `nl` for national, `eu` for Europe-wide.

Province codes: `nl-gr` · `nl-fr` · `nl-dr` · `nl-ov` · `nl-fl` · `nl-ge` · `nl-ut` · `nl-nh` · `nl-zh` · `nl-ze` · `nl-nb` · `nl-li`

**⚠ Only run `region denyf *` on or after switch day.** Running it earlier will cause your repeater to drop messages from nodes that have not yet completed the transition.

::: cli "Repeater CLI"
```
region put eu
region put nl
region put YOUR_REGION
region put YOUR_CITY
region default YOUR_REGION
region save

# On switch day only — run after switching radio:
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

::: step 06 "Loop detection" "set af 9"
Enable loop detection and enforce airtime limits. Run in the repeater CLI:
`set loop.detect minimal` and `set af 9`.

::: more "What do these commands do?"
**`set loop.detect minimal`** — Rejects flood packets that appear to be looping across the mesh. A faulty node can cause a packet to circulate up to the 64-hop limit, consuming significant airtime. The `minimal` setting catches clear loops without false positives.

Options: `off` (default) · `minimal` · `moderate` · `strict` — `minimal` is the recommended starting point.

**`set af 9`** — Enforces 10% duty cycle (value 9 = 10%). This is a **legal requirement** for operation in Europe on the 868 MHz sub-band used by Meshcore.
:::

## Switch day

Switch date: **TBC — tentative 9 May 2026.** Only step 7 needs to happen on the agreed date.

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

## Checklist

<div class="checklist-wrap">

**Before switch day — confirm you have completed the preparation steps:**

<ul>
<li>Step 1 — Firmware updated to v1.15 or later on repeater and companion app</li>
<li>Step 2 — Flood advert interval ≥ 50 hours; zero-hop adverts = 240 minutes</li>
<li>Step 3 — Bots and auto-reply scripts stopped; node not listed on mc-radar.woodwar.com/mesh-health</li>
<li>Step 4 — Region scoping configured: <code>eu</code>, <code>nl</code>, <code>province</code>; default region on repeater <code>province</code>; default region on companion <code>nl</code></li>
<li>Step 5 — Multi-byte path: companion Default Path Hash Size = 2-byte; repeater CLI: <code>set path.hash.mode 1</code></li>
<li>Step 6 — Loop detection: <code>set loop.detect minimal</code>; airtime factor: <code>set af 9</code></li>
</ul>

**On switch day (TBC — tentative 9 May 2026):**

<ul class="switch-day-items">
<li>Step 7 — Apply Netherlands preset (SF7/CR5, 869.618 MHz, 62.5 kHz)</li>
<li>Apply <code>region denyf *</code> followed by <code>region save</code></li>
<li>Confirm you can hear your neighbours on the new settings</li>
</ul>

</div>

## Resources

<div class="resources">
  <a href="https://assets.woodwar.com/meshcore_sf_test_plan.pdf" target="_blank" rel="noopener" class="resource-link">
    SF Test Plan
    <span class="resource-link__arrow">PDF document ↗</span>
  </a>
  <a href="https://assets.woodwar.com/meshcore_sf_test_report.pdf" target="_blank" rel="noopener" class="resource-link">
    SF Test Report
    <span class="resource-link__arrow">Full analysis ↗</span>
  </a>
  <a href="https://meshwiki.nl/wiki/Lijst_van_regio%27s" target="_blank" rel="noopener" class="resource-link">
    Region codes list
    <span class="resource-link__arrow">meshwiki.nl ↗</span>
  </a>
  <a href="https://mc-radar.woodwar.com/mesh-health" target="_blank" rel="noopener" class="resource-link">
    Mesh health check
    <span class="resource-link__arrow">mc-radar.woodwar.com ↗</span>
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
