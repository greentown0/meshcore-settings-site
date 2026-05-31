---
layout: base.njk
title: Recommended Meshcore settings for the Netherlands
seo_title: "Meshcore Netherlands — SF7 Settings & Switch Guide"
description: "Recommended Meshcore radio settings for the mesh network in the Netherlands — SF7, region scoping, advert intervals, and a step-by-step switch guide."
howto_steps:
  - name: "Firmware"
    text: "Update both your repeater and companion firmware to v1.15+ and use the latest version of the mobile app. Check that your repeater's 2-byte ID does not conflict with an existing node."
  - name: "Advert interval"
    text: "Set your flood advert interval to 50 hours or more. Zero-hop adverts should be 240 minutes (4 hours). Both settings are in your repeater's administration screen."
  - name: "Stop bots & scripts"
    text: "Review and stop any automated integrations — Home Assistant, custom scripts, and auto-reply bots in shared channels such as #test."
  - name: "Region scoping"
    text: "Configure regions on your repeater (region put eu/nl/province) and set your default region. Set a scope per channel in your companion app's Experimental Settings."
  - name: "Multi-byte path"
    text: "Enable 2-byte path hashing on your companion app (Experimental Settings → Default Path Hash Size = 2-byte) and on your repeater (set path.hash.mode 1)."
  - name: "Loop detection"
    text: "Enable loop detection (set loop.detect minimal) and enforce the 10% airtime duty cycle limit (set dutycycle 10) in the repeater CLI."
  - name: "Switch radio settings"
    text: "In the Meshcore app, set the radio preset to Custom. Enter SF7 / CR5, 869.618 MHz, 62.5 kHz. Confirm you can hear neighbours on the new settings."
  - name: "Strict region forwarding"
    text: "From 13 June 2026: apply region denyf * on your repeater to enable strict region forwarding. This instructs your repeater to drop any incoming packet that carries no region scope."
---

## Why we switched

The Meshcore mesh network in the Netherlands was heavily congested and increasingly unreliable. Community testing in March 2026 confirmed that switching to SF7 significantly increases network capacity and improves reliability for everyone.

- [Test preparation (PDF) ↗](https://assets.woodwar.com/meshcore_sf_test_plan.pdf) — the test plan, procedure, and settings used during the March 2026 weekend test
- [Test report (PDF) ↗](https://assets.woodwar.com/meshcore_sf_test_report.pdf) — full analysis of the results, including data, findings, and the recommendation to switch to SF7

## Settings at a glance

::: settings
| Parameter | Value |
| :--- | :--- |
| Radio preset | Custom |
| SF / CR | SF7 / CR5 |
| Frequency | 869.618 MHz |
| Bandwidth | 62.5 kHz |
| Advert interval | 50 h+ (flood) |
| Firmware | v1.15+ |
:::

## Preparation steps

Complete all steps. Do not skip any.

The steps below are a compressed version of the [full switch instructions (PDF) ↗](https://assets.woodwar.com/meshcore_sf7_switch_instructions.pdf).


::: step 01 "Firmware" "v1.15+"
Update **both** your repeater and companion firmware to **v1.15+** and make sure you are using the latest version of the mobile app.

If you have a repeater, make sure its 2-byte ID does not conflict with an existing repeater. Use the [prefix tool](https://cornmeister.nl/#/analytics?tab=prefix-tool) to check for available prefixes without conflict. If you are already using a prefix that another node chose first, please change it — this helps the mesh by improving observability.

::: more "Why v1.15?"
Version 1.15 is the minimum required for this switch:

- **Default region scoping** — the repeater can tag its own traffic with a region automatically.
- **Correct packet blocking** — `region denyf *` only works reliably from v1.15 onwards.

Updates also include improvements to congestion handling.
:::

::: step 02 "Advert interval" "50 h minimum"
Set your **flood advert interval to 50 hours** or more. Zero-hop adverts should be **240 minutes** (4 hours).

::: more "Flood vs zero-hop adverts"
Visit [mc-radar.woodwar.com/mesh-health](https://mc-radar.woodwar.com/mesh-health) to check whether your node is listed. Nodes there have an advert interval that is too short and are causing unnecessary load on the mesh. If yours appears, fix it.

**Flood adverts** travel across the entire mesh and announce your repeater to the full network. Sending them too often is a leading cause of congestion. Set to at least **50 hours** — higher is fine.

**Zero-hop adverts** are heard only by your immediate neighbours. **240 minutes** (4 hours) is the recommended interval.

Both settings are in your repeater's administration screen.
:::

::: step 03 "Stop bots & scripts" "No auto-messages"
Review and stop any automated integrations — Home Assistant, custom scripts, auto-reply bots in shared channels such as **#test**.

:::

::: step 04 "Region scoping" "eu · nl · province"
Configure regions on your **repeater** and set scope in your **companion app**. This is one of the most impactful changes you can make to reduce congestion.

Two tasks to complete now: add your region codes to the repeater and set your default region. Blocking unscoped packets (strict forwarding) is a separate phase scheduled for **13 June 2026** — do not apply it yet.

Community tools make this easy:
- [All-in-one configurator →](https://www.mesh-up.nl/tools/regiocodes-instellen/)
- [Dashboard configurator →](https://dashboard-elburg.f3dp.nl/#tab=region-configurator)

::: more "CLI sequence & full instructions"
**Companion app:** In Experimental Settings, set **Default Region** to `nl`. Assign a scope to each channel you use — e.g. `nl-nh` for North Holland, `nl` for national, `eu` for Europe-wide. See the [public channel reference →](https://meshwiki.nl/wiki/Publieke_kanalen) for a full list with recommended scopes.

Province codes: `nl-gr` · `nl-fr` · `nl-dr` · `nl-ov` · `nl-fl` · `nl-ge` · `nl-ut` · `nl-nh` · `nl-zh` · `nl-ze` · `nl-nb` · `nl-li`

**⚠ `region denyf *` is Phase 8 — 13 June 2026.** Do not run it yet. Enabling it before then will cause your repeater to drop messages from nodes that have not yet configured region scoping.

::: cli "Repeater CLI"
```
region put eu
region put nl
region put bx
region put YOUR_PROVINCE
region put YOUR_CITY
region default YOUR_PROVINCE
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
Enable loop detection and enforce airtime limits. Run both commands in the repeater CLI:

```
set loop.detect minimal
set dutycycle 10
```

::: more "What do these commands do?"
**`set loop.detect minimal`** — Rejects flood packets that appear to be looping across the mesh. A faulty node can cause a packet to circulate up to the 64-hop limit, consuming significant airtime. The `minimal` setting catches clear loops without false positives.

Options: `off` (default) · `minimal` · `moderate` · `strict` — `minimal` is the recommended starting point.

**`set dutycycle 10`** — Enforces 10% duty cycle. This is a **legal requirement** for operation in Europe on the 868 MHz sub-band used by Meshcore.
:::

::: step 07 "Switch radio settings" "SF7 / CR5"
In the Meshcore app, open your repeater settings and set the radio preset to **Custom**. Enter the following parameters manually:

Only the spreading factor and coding rate change — the frequency (869.618 MHz) is identical to the current SF8 setting.

After applying the preset, confirm you can hear your neighbours on the new settings before considering the switch complete.

::: cli "New radio settings"
```
Preset:     Custom
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
Strict forwarding only blocks packets that carry **no region tag at all** (and would otherwise be repeated across the whole of the EU, increasing congestion). It does not prevent communication with neighbouring provinces, with the whole country, or with the countries in the EU. It does however require better understanding of the technology.

## Troubleshooting

If you are experiencing trouble with the new settings, the issues below are the most common causes.

**Weak connections (step 7)**

If connections are weak after applying SF7, changing the coding rate from CR5 to CR8 can improve stability at the expense of higher airtime usage. This affects only outgoing transmissions — it adds extra error correction but does not improve reception. The effect is marginal; a better-placed or better-quality antenna produces a more noticeable improvement.

**Multibyte path (step 5)**

For multi-byte path to work, your companion app must be set correctly in Experimental Settings, and all repeaters along your path must be running firmware v1.14 or later. A repeater that switched but did not update its firmware will not forward your multi-byte path messages.

To troubleshoot, disable multi-byte path: in your companion app, set **Experimental Settings → Default Path Hash Size = 1-byte**.

The same setting on your repeater affects the adverts it sends. If your repeater sends adverts with a 2-byte path but nearby repeaters are not yet updated, those adverts will not be forwarded. To revert the repeater setting:

::: cli "Repeater CLI"
```
set path.hash.mode 0
```
:::

**Regions (step 4)**

If regions are not configured correctly on your neighbours' repeaters, the scoped messages you send from your companion will not be understood and will be dropped. To troubleshoot, disable the scope on the channel where you are sending messages — if the problem goes away, it points to a region misconfiguration in your local mesh.

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
