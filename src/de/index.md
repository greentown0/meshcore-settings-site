---
layout: base.njk
title: Empfohlene Meshcore-Einstellungen für die Niederlande
seo_title: "Meshcore Niederlande — Empfohlene SF7-Einstellungen"
description: "Empfohlene Meshcore-Funkeinstellungen für das Mesh-Netzwerk in den Niederlanden — SF7, Region-Scoping, Advert-Intervalle und eine Schritt-für-Schritt-Anleitung zur Konfiguration."
howto_steps:
  - name: "Firmware"
    text: "Aktualisiere sowohl deine Repeater- als auch deine Companion-Firmware auf v1.15+ und verwende die neueste Version der mobilen App. Prüfe, ob die 2-Byte-ID deines Repeaters nicht mit einem bestehenden Knoten kollidiert."
  - name: "Advert-Intervall"
    text: "Stelle dein Flood-Advert-Intervall auf 47 Stunden oder mehr ein. Zero-Hop-Adverts sollten 240 Minuten (4 Stunden) betragen. Beide Einstellungen findest du im Verwaltungsbildschirm deines Repeaters."
  - name: "Bots & Skripte stoppen"
    text: "Überprüfe und stoppe alle automatisierten Integrationen — Home Assistant, eigene Skripte und Auto-Reply-Bots in geteilten Kanälen wie #test."
  - name: "Region-Scoping"
    text: "Konfiguriere die Regionen auf deinem Repeater (region put eu/nl/Provinz) und lege deine Standardregion fest. Setze pro Kanal einen Scope in den Experimental Settings deiner Companion-App."
  - name: "Multi-Byte-Pfad"
    text: "Aktiviere 2-Byte-Path-Hashing in deiner Companion-App (Experimental Settings → Default Path Hash Size = 2-byte) und auf deinem Repeater (set path.hash.mode 1)."
  - name: "Loop-Erkennung"
    text: "Aktiviere die Loop-Erkennung (set loop.detect minimal) und erzwinge das 10-%-Duty-Cycle-Limit für die Sendezeit (set dutycycle 10) im Repeater-CLI."
  - name: "Funkeinstellungen"
    text: "Stelle in der Meshcore-App das Radio-Preset auf Netherlands. Gib SF7 / CR5, 869.618 MHz, 62.5 kHz ein. Bestätige, dass du deine Nachbarn mit den konfigurierten Einstellungen hören kannst."
  - name: "Strikte Region-Weiterleitung"
    text: "Wende nach dem Konfigurieren deiner Regionen region denyf * auf deinem Repeater an, um die strikte Region-Weiterleitung zu aktivieren. Damit verwirft dein Repeater jedes eingehende Paket, das keinen Region-Scope trägt."
---

## Einstellungen auf einen Blick

::: settings
| Parameter | Wert |
| :--- | :--- |
| Radio-Preset | Netherlands |
| SF / CR | SF7 / CR5 |
| Frequenz | 869.618 MHz |
| Bandbreite | 62.5 kHz |
| Advert-Intervall | 47 h+ (flood) |
| Firmware | v1.15+ |
| Region (Companion) | Pro Kanal wählen |
| Pfad-Hash (Companion) | 2-byte |
:::

## Empfohlene Konfiguration

Führe alle Schritte aus. Überspringe keinen.

Hintergründe zum Umstieg und weitere Details zu jeder Einstellung findest du in der [historischen Umstellungsanleitung (PDF) ↗](https://assets.woodwar.com/meshcore_sf7_switch_instructions.pdf).


::: step 01 "Firmware" "v1.15+"
Aktualisiere **sowohl** deine Repeater- als auch deine Companion-Firmware auf **v1.15+** und stelle sicher, dass du die neueste Version der mobilen App verwendest.

Wenn du einen Repeater hast, achte darauf, dass seine 2-Byte-ID nicht mit einem bestehenden Repeater kollidiert. Nutze das [Präfix-Tool](https://cornmeister.nl/#/analytics?tab=prefix-tool), um konfliktfrei verfügbare Präfixe zu prüfen. Wenn du bereits ein Präfix verwendest, das ein anderer Knoten zuerst gewählt hat, ändere es bitte — das hilft dem Mesh, indem es die Beobachtbarkeit verbessert.

::: more "Warum v1.15?"
Version 1.15 ist die Mindestvoraussetzung für diese Einstellungen:

- **Standard-Region-Scoping** — der Repeater kann seinen eigenen Datenverkehr automatisch mit einer Region markieren.
- **Korrektes Blockieren von Paketen** — `region denyf *` funktioniert erst ab v1.15 zuverlässig.

Die Updates enthalten außerdem Verbesserungen bei der Bewältigung von Überlastung (Congestion).
:::

:::: step 02 "Advert-Intervall" "mindestens 47 h"
Stelle dein **Flood-Advert-Intervall auf 47 Stunden** oder mehr ein. Zero-Hop-Adverts sollten **240 Minuten** (4 Stunden) betragen.

::: cli "Repeater-CLI"
```
set flood.advert.interval 47
set advert.interval 240
```
:::

::: more "Flood- vs. Zero-Hop-Adverts"
Besuche [mc-radar.woodwar.com/mesh-health](https://mc-radar.woodwar.com/mesh-health), um zu prüfen, ob dein Knoten dort aufgeführt ist. Knoten, die dort erscheinen, haben ein zu kurzes Advert-Intervall und verursachen unnötige Last im Mesh. Wenn deiner auftaucht, behebe das.

**Flood-Adverts** durchqueren das gesamte Mesh und kündigen deinen Repeater im kompletten Netzwerk an. Sie zu häufig zu senden ist eine der Hauptursachen für Überlastung. Stelle mindestens **47 Stunden** ein — höher ist in Ordnung.

**Zero-Hop-Adverts** werden nur von deinen unmittelbaren Nachbarn gehört. **240 Minuten** (4 Stunden) ist das empfohlene Intervall.

Beide Einstellungen findest du im Verwaltungsbildschirm deines Repeaters.
:::
::::

::: step 03 "Bots & Skripte stoppen" "Keine automatischen Nachrichten"
Überprüfe und stoppe alle automatisierten Integrationen — Home Assistant, eigene Skripte, Auto-Reply-Bots in geteilten Kanälen wie **#test**.

:::

::: step 04 "Region-Scoping" "eu · nl · Provinz"
Konfiguriere die Regionen auf deinem **Repeater** und lege den Scope in deiner **Companion-App** fest. Dies ist eine der wirkungsvollsten Änderungen, die du vornehmen kannst, um Überlastung zu reduzieren.

Füge zuerst deine Regionscodes zum Repeater hinzu und lege deine Standardregion fest. Sobald diese konfiguriert sind, aktiviere die strikte Weiterleitung in Schritt 8.

Community-Tools machen das einfach:
- [All-in-One-Konfigurator →](https://www.mesh-up.nl/tools/regiocodes-instellen/)
- [Dashboard-Konfigurator →](https://dashboard-elburg.f3dp.nl/#tab=region-configurator)

::: more "CLI-Abfolge & vollständige Anleitung"
**Companion-App:** Setze in den Experimental Settings die **Default Region** (Standardregion) auf `nl`. Weise jedem Kanal, den du nutzt, einen Scope zu — z. B. `nl-nh` für Nordholland, `nl` für landesweit, `eu` für europaweit. In der [Referenz zu öffentlichen Kanälen →](https://meshwiki.nl/wiki/Publieke_kanalen) findest du eine vollständige Liste mit empfohlenen Scopes.

Provinzcodes: `nl-gr` · `nl-fr` · `nl-dr` · `nl-ov` · `nl-fl` · `nl-ge` · `nl-ut` · `nl-nh` · `nl-zh` · `nl-ze` · `nl-nb` · `nl-li`

::: cli "Repeater-CLI"
```
region put eu
region put nl
region put bx
region put YOUR_PROVINCE
region put YOUR_CITY
region default YOUR_PROVINCE
region save
```
:::

::: step 05 "Multi-Byte-Pfad" "2-Byte-Hash"
Aktiviere 2-Byte-Path-Hashing auf deiner **Companion-App** (am wichtigsten) und deinem **Repeater**. Das verbessert die Beobachtbarkeit von Paketen im Netzwerk.

**Companion-App:** Experimental Settings → **Default Path Hash Size = 2-byte**

::: cli "Repeater-CLI"
```
set path.hash.mode 1
```
:::

:::: step 06 "Loop-Erkennung" "set dutycycle 10"
Aktiviere die Loop-Erkennung und erzwinge die Sendezeit-Limits. Führe beide Befehle im Repeater-CLI aus:

::: cli "Repeater-CLI"
```
set loop.detect minimal
set dutycycle 10
```
:::

::: more "Was bewirken diese Befehle?"
**`set loop.detect minimal`** — Weist Flood-Pakete zurück, die durch das Mesh zu kreisen scheinen. Ein fehlerhafter Knoten kann ein Paket bis zum 64-Hop-Limit zirkulieren lassen und dabei erhebliche Sendezeit verbrauchen. Die Einstellung `minimal` erkennt eindeutige Loops ohne Fehlalarme.

Optionen: `off` (Standard) · `minimal` · `moderate` · `strict` — `minimal` ist der empfohlene Ausgangspunkt.

**`set dutycycle 10`** — Erzwingt einen Duty Cycle von 10 %. Dies ist eine **gesetzliche Vorgabe** für den Betrieb in Europa auf dem von Meshcore genutzten 868-MHz-Unterband.
:::
::::

::: step 07 "Funkeinstellungen" "SF7 / CR5"
Öffne in der Meshcore-App die Einstellungen deines Repeaters und stelle das Radio-Preset auf **Netherlands**. Gib die folgenden Parameter manuell ein:

Bestätige nach dem Anwenden des Presets, dass du deine Nachbarn mit den konfigurierten Einstellungen hören kannst.

::: cli "Neue Funkeinstellungen"
```
Preset:     Netherlands
SF / CR:    SF7 / CR5
Frequency:  869.618 MHz
Bandwidth:  62.5 kHz
```
:::

::: step 08 "Strikte Region-Weiterleitung" "region denyf *"
Aktiviere nach Abschluss von Schritt 4 die strikte Weiterleitung. Sie verwirft nur Pakete **ganz ohne Region-Tag** und verhindert so, dass ungescopeter Datenverkehr über die gesamte EU weitergeleitet wird. Gescopeter Verkehr zu benachbarten Provinzen, in die Niederlande und in andere EU-Länder bleibt davon unberührt.

Über die **UI**: Setze im Bildschirm Manage Regions (Regionen verwalten) für die Option **Packets without region set** (Pakete ohne gesetzte Region) den Wert auf **Deny Flood**.

::: cli "Repeater-CLI"
```
region denyf *
region save
```
:::

## Fehlerbehebung

Wenn du mit den neuen Einstellungen Probleme hast, sind die folgenden Punkte die häufigsten Ursachen.

**Schwache Verbindungen (Schritt 7)**

Wenn die Verbindungen nach dem Anwenden von SF7 schwach sind, kann das Ändern der Coding Rate von CR5 auf CR8 die Stabilität verbessern — allerdings auf Kosten einer höheren Sendezeit. Das betrifft nur ausgehende Übertragungen: Es fügt zusätzliche Fehlerkorrektur hinzu, verbessert aber nicht den Empfang. Der Effekt ist marginal; eine besser platzierte oder hochwertigere Antenne bringt eine spürbarere Verbesserung.

**Multi-Byte-Pfad (Schritt 5)**

Damit der Multi-Byte-Pfad funktioniert, muss deine Companion-App in den Experimental Settings korrekt eingestellt sein, und alle Repeater entlang deines Pfads müssen Firmware v1.14 oder neuer ausführen. Ein Repeater mit älterer Firmware leitet deine Multi-Byte-Pfad-Nachrichten nicht weiter.

Zur Fehlersuche deaktiviere den Multi-Byte-Pfad: Setze in deiner Companion-App **Experimental Settings → Default Path Hash Size = 1-byte**.

Dieselbe Einstellung auf deinem Repeater beeinflusst die Adverts, die er sendet. Wenn dein Repeater Adverts mit einem 2-Byte-Pfad sendet, benachbarte Repeater aber noch nicht aktualisiert sind, werden diese Adverts nicht weitergeleitet. Um die Repeater-Einstellung zurückzusetzen:

::: cli "Repeater-CLI"
```
set path.hash.mode 0
```
:::

**Regionen (Schritt 4)**

Wenn die Regionen auf den Repeatern deiner Nachbarn nicht korrekt konfiguriert sind, werden die gescopeten Nachrichten, die du von deiner Companion-App sendest, nicht verstanden und verworfen. Zur Fehlersuche deaktiviere den Scope auf dem Kanal, über den du Nachrichten sendest — verschwindet das Problem daraufhin, deutet das auf eine fehlerhafte Region-Konfiguration in deinem lokalen Mesh hin.

## Warum wir gewechselt sind

Das Meshcore-Mesh-Netzwerk in den Niederlanden war stark überlastet und zunehmend unzuverlässig. Community-Tests im März 2026 bestätigten, dass der Wechsel zu SF7 die Netzwerkkapazität deutlich erhöht und die Zuverlässigkeit für alle verbessert.

Aufgrund dieser Ergebnisse führte das niederländische Mesh am **9. Mai 2026** die aktuellen SF7-Funkeinstellungen ein.

- [Testvorbereitung (PDF) ↗](https://assets.woodwar.com/meshcore_sf_test_plan.pdf) — der Testplan, das Vorgehen und die Einstellungen, die während des Wochenendtests im März 2026 verwendet wurden
- [Testbericht (PDF) ↗](https://assets.woodwar.com/meshcore_sf_test_report.pdf) — vollständige Analyse der Ergebnisse, einschließlich Daten, Erkenntnissen und der Empfehlung, zu SF7 zu wechseln

## Ressourcen

<div class="resources">
  <a href="https://assets.woodwar.com/meshcore_sf7_switch_instructions.pdf" target="_blank" rel="noopener" class="resource-link">
    Historische Umstellungsanleitung
    <span class="resource-link__arrow">PDF-Dokument ↗</span>
  </a>
  <a href="https://mc-radar.woodwar.com/mesh-health" target="_blank" rel="noopener" class="resource-link">
    Mesh-Statusprüfung
    <span class="resource-link__arrow">mc-radar.woodwar.com ↗</span>
  </a>
  <a href="https://cornmeister.nl/" target="_blank" rel="noopener" class="resource-link">
    Mesh-Status
    <span class="resource-link__arrow">cornmeister.nl ↗</span>
  </a>
  <a href="https://analyzer.letsmesh.net/" target="_blank" rel="noopener" class="resource-link">
    Mesh-Analyzer
    <span class="resource-link__arrow">analyzer.letsmesh.net ↗</span>
  </a>
  <a href="https://meshwiki.nl/wiki/Lijst_van_regio%27s" target="_blank" rel="noopener" class="resource-link">
    Liste der Regionscodes
    <span class="resource-link__arrow">meshwiki.nl ↗</span>
  </a>
  <a href="https://www.mesh-up.nl/tools/regiocodes-instellen/" target="_blank" rel="noopener" class="resource-link">
    Regionskonfigurator
    <span class="resource-link__arrow">mesh-up.nl ↗</span>
  </a>
  <a href="https://dashboard-elburg.f3dp.nl/#tab=region-configurator" target="_blank" rel="noopener" class="resource-link">
    Dashboard-Konfigurator
    <span class="resource-link__arrow">f3dp.nl ↗</span>
  </a>
</div>
