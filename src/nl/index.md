---
layout: base.njk
title: Dutch Meshcore — Instellingen
description: "SF7-instellingen voor het Dutch Meshcore-mesh"
---

## Waarom zijn we overgeschakeld?

Het Dutch Meshcore-mesh was zwaar overbelast en steeds onbetrouwbaarder. Community-tests in maart 2026 bevestigden dat overstappen naar SF7 de netwerkcapaciteit aanzienlijk vergroot en de betrouwbaarheid voor iedereen verbetert.

- [Testvoorbereiding (PDF) ↗](https://assets.woodwar.com/meshcore_sf_test_plan.pdf) — het testplan, de procedure en instellingen van het maart 2026 testweekend
- [Testrapport (PDF) ↗](https://assets.woodwar.com/meshcore_sf_test_report.pdf) — volledige analyse van de resultaten, inclusief data, bevindingen en de aanbeveling om over te stappen naar SF7

## Instellingen in één oogopslag

::: settings
| Parameter | Waarde |
| :--- | :--- |
| Radio preset | Custom |
| SF / CR | SF7 / CR5 |
| Frequentie | 869.618 MHz |
| Bandbreedte | 62.5 kHz |
| Advert interval | 50 u+ (flood) |
| Firmware | v1.15+ |
:::

## Voorbereidingsstappen

Voer alle stappen uit. Sla er geen over.

De onderstaande stappen zijn een verkorte versie van de [volledige schakelinstructies (PDF) ↗](https://assets.woodwar.com/meshcore_sf7_switch_instructions.pdf).


::: step 01 "Firmware" "v1.15+"
Werk zowel je repeater- als companion-firmware bij naar **v1.15+** en zorg ervoor dat je de nieuwste versie van de mobiele app gebruikt.

::: more "Waarom v1.15?"
Versie 1.15 is minimaal vereist voor deze omschakeling:

- **Standaard regioscoping** — de repeater kan zijn eigen verkeer automatisch markeren met een regio.
- **Correct pakket blokkeren** — `region denyf *` werkt pas betrouwbaar vanaf v1.15.

Updates bevatten ook verbeteringen voor congestiebeheer.
:::

::: step 02 "Advert interval" "minimaal 50 uur"
Stel je **flood advert interval in op 50 uur** of meer. Zero-hop advertenties moeten **240 minuten** (4 uur) zijn.

::: more "Flood vs zero-hop advertenties"
Bezoek [mc-radar.woodwar.com/mesh-health](https://mc-radar.woodwar.com/mesh-health) om te controleren of je node vermeld staat. Nodes die daar voorkomen hebben een te kort advert interval en veroorzaken onnodige belasting op het mesh. Als jouw node verschijnt, herstel dit dan.

**Flood advertenties** reizen door het gehele mesh en kondigen je repeater aan bij het volledige netwerk. Ze te vaak sturen is een hoofdoorzaak van congestie. Stel in op minimaal **50 uur** — hoger is prima.

**Zero-hop advertenties** worden alleen gehoord door je directe buren. **240 minuten** (4 uur) is het aanbevolen interval.

Beide instellingen zijn te vinden in het beheerscherm van je repeater.
:::

::: step 03 "Stop bots & scripts" "Geen automatische berichten"
Controleer en stop geautomatiseerde integraties — Home Assistant, eigen scripts, auto-reply bots in gedeelde kanalen zoals **#test**.

:::

::: step 04 "Regioscoping" "eu · nl · provincie"
Configureer regio's op je **repeater** en stel scope in via je **companion app**. Dit is een van de meest effectieve wijzigingen om congestie te verminderen.

Twee taken nu uit te voeren: regiocodes toevoegen aan je repeater en je standaardregio instellen. Ongescopede pakketten blokkeren (strikte doorsturing) is een aparte fase gepland voor **13 juni 2026** — pas dit nog niet toe.

Community-tools maken dit eenvoudig:
- [All-in-one configurator →](https://www.mesh-up.nl/tools/regiocodes-instellen/)
- [Dashboard configurator →](https://dashboard-elburg.f3dp.nl/#tab=region-configurator)

::: more "CLI-reeks & volledige instructies"
**Companion app:** Stel in Experimentele Instellingen de **Standaard Regio** in op `nl`. Wijs een scope toe aan elk kanaal dat je gebruikt — bijv. `nl-nh` voor Noord-Holland, `nl` voor nationaal, `eu` voor Europa-breed. Zie de [referentielijst publieke kanalen →](https://meshwiki.nl/wiki/Publieke_kanalen) voor een overzicht met aanbevolen scopes.

Provinciecodes: `nl-gr` · `nl-fr` · `nl-dr` · `nl-ov` · `nl-fl` · `nl-ge` · `nl-ut` · `nl-nh` · `nl-zh` · `nl-ze` · `nl-nb` · `nl-li`

**⚠ `region denyf *` is Fase 8 — 13 juni 2026.** Voer dit nog niet uit. Dit te vroeg inschakelen zorgt ervoor dat je repeater berichten van nodes zonder regioscoping weigert.

::: cli "Repeater CLI"
```
region put eu
region put nl
region put bx
region put JOUW_PROVINCIE
region put JOUW_STAD
region default JOUW_PROVINCIE
region save

# Alleen Fase 8 (13 juni 2026):
region denyf *
region save
```
:::

::: step 05 "Multi-byte pad" "2-byte hash"
Schakel 2-byte pad-hashing in op je **companion app** (het belangrijkst) en je **repeater**. Dit verbetert de zichtbaarheid van pakketten in het netwerk.

**Companion app:** Experimentele Instellingen → **Default Path Hash Size = 2-byte**

::: cli "Repeater CLI"
```
set path.hash.mode 1
```
:::

::: step 06 "Lusdetectie" "set dutycycle 10"
Schakel lusdetectie in en handhaaf de zendtijdlimieten. Voer beide opdrachten uit in de repeater CLI:

```
set loop.detect minimal
set dutycycle 10
```

::: more "Wat doen deze opdrachten?"
**`set loop.detect minimal`** — Weigert flood-pakketten die lijken te lussen door het mesh. Een defecte node kan een pakket laten circuleren tot de 64-hop limiet, waarbij aanzienlijke zendtijd wordt verbruikt. De instelling `minimal` detecteert duidelijke lussen zonder valse positieven.

Opties: `off` (standaard) · `minimal` · `moderate` · `strict` — `minimal` is het aanbevolen startpunt.

**`set dutycycle 10`** — Handhaaft 10% dutycycle. Dit is een **wettelijke vereiste** voor gebruik in Europa op het 868 MHz sub-band dat door Meshcore wordt gebruikt.
:::

::: step 07 "Radioinstelling wijzigen" "SF7 / CR5"
Open in de Meshcore app de instellingen van je repeater en stel het radio preset in op **Custom**. Voer de volgende parameters handmatig in:

Alleen de spreidingsfactor en coderingsnelheid veranderen — de frequentie (869.618 MHz) is identiek aan de huidige SF8-instelling.

Bevestig na het toepassen van de preset dat je je buren kunt horen op de nieuwe instellingen voordat je de omschakeling als voltooid beschouwt.

::: cli "Nieuwe radio-instellingen"
```
Preset:      Custom
SF / CR:     SF7 / CR5
Frequentie:  869.618 MHz
Bandbreedte: 62.5 kHz
```
:::

## Fase 8 — Strikte regio-doorsturing

Ongeveer een maand na de hoofdomschakeling schakelt de community strikte regio-doorsturing in. Dit verandert het mesh in verbonden regionale zones — problemen of congestie in één gebied cascaderen niet meer door het hele netwerk, en advertenties zijn beperkt tot hun regio.

Fase 8 datum: **13 juni 2026.** Alleen stap 8 moet op deze datum worden uitgevoerd.

::: step 08 "Strikte regio-doorsturing" "13 jun 2026"
Pas de definitieve regio-opdracht toe op je repeater. Dit instrueert je repeater om elk inkomend pakket zonder regioscoping stil te verwijderen — vanaf dit moment moet elk bericht dat je repeater binnenkomt een expliciete regiotag bevatten. Dit creëert een sterke prikkel voor alle operators om regio's correct te configureren, en resulteert in een stabielere en betrouwbaardere mesh voor de hele community.

Vanuit de **UI**: Stel in het scherm Regio's Beheren bij de optie **Pakketten zonder regio ingesteld** de waarde in op **Flood weigeren**.

::: cli "Repeater CLI"
```
region denyf *
region save
```
:::
Strikte doorsturing blokkeert alleen pakketten die **helemaal geen regiotag** bevatten (en anders door heel Europa herhaald zouden worden, wat de congestie vergroot). Het voorkomt geen communicatie met naburige provincies, met heel Nederland of met de landen in de EU. Het vereist echter wel een beter begrip van de technologie.

## Probleemoplossing

Als je problemen ervaart met de nieuwe instellingen, zijn de onderstaande instellingen de meest voorkomende oorzaken.

**Zwakke verbindingen (stap 7)**

Bij zwakke verbindingen na het toepassen van SF7 kan het wijzigen van de coderingsnelheid van CR5 naar CR8 de stabiliteit verbeteren ten koste van hoger zendtijdgebruik. Dit heeft alleen effect op uitgaande transmissies — het voegt extra foutcorrectie toe maar verbetert de ontvangst niet. Het effect is marginaal; een beter geplaatste of betere kwaliteitsantenne heeft een merkbaarder effect.

**Multibyte pad (stap 5)**

Voor een correct werkend multi-byte pad moet je companion app correct ingesteld zijn in Experimentele Instellingen, en moeten alle repeaters langs je pad firmware v1.14 of later draaien. Een repeater die is omgeschakeld maar de firmware niet heeft bijgewerkt, stuurt je multi-byte pad-berichten niet door.

Om dit op te lossen, schakel je multi-byte pad uit: stel in je companion app **Experimentele Instellingen → Standaard Pad Hash Grootte = 1-byte** in.

Dezelfde instelling op je repeater beïnvloedt de advertenties die hij verstuurt. Als je repeater advertenties verstuurt met een 2-byte pad, maar nabijgelegen repeaters zijn nog niet bijgewerkt, worden die advertenties niet doorgestuurd. Om de instelling van de repeater terug te zetten:

::: cli "Repeater CLI"
```
set path.hash.mode 0
```
:::

**Regio's (stap 4)**

Als regio's niet correct zijn geconfigureerd bij je buurrepeaters, worden de gescopede berichten die je vanuit je companion app verstuurt niet begrepen en worden ze verwijderd. Om dit op te lossen, schakel je de scope uit op het kanaal waarop je berichten verstuurt. Als het probleem dan verdwijnt, is er sprake van een regioconfiguratiefout in je lokale mesh.

## Bronnen

<div class="resources">
  <a href="https://assets.woodwar.com/meshcore_sf7_switch_instructions.pdf" target="_blank" rel="noopener" class="resource-link">
    Schakelinstructies
    <span class="resource-link__arrow">PDF document ↗</span>
  </a>
  <a href="https://mc-radar.woodwar.com/mesh-health" target="_blank" rel="noopener" class="resource-link">
    Mesh gezondheidscheck
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
    Regiocodes lijst
    <span class="resource-link__arrow">meshwiki.nl ↗</span>
  </a>
  <a href="https://www.mesh-up.nl/tools/regiocodes-instellen/" target="_blank" rel="noopener" class="resource-link">
    Regio configurator
    <span class="resource-link__arrow">mesh-up.nl ↗</span>
  </a>
  <a href="https://dashboard-elburg.f3dp.nl/#tab=region-configurator" target="_blank" rel="noopener" class="resource-link">
    Dashboard configurator
    <span class="resource-link__arrow">f3dp.nl ↗</span>
  </a>
</div>
