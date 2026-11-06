# Debugger <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="intro"></a>
## What this is

**Debugger** shows the raw records the scanner reported, grouped by kind, without the scoring,
governance and findings the other pages add. Use it when a page looks empty or wrong, to tell
whether the data is missing or only not shown.

<a id="layout"></a>
## What is on the screen

One tab per kind of record: **Data providers**, **MCP servers**, **Agents**, **Core platform APIs**,
**External APIs**, **User APIs**, **App platform**, **LLM** and **Topology API** (with a node
count). Each tab is a plain list that loads more as you scroll. Click a row to see the full record.

### When this page is empty

Every tab is empty until the scanner reports. See [Getting started](getting-started.md).

<a id="how-to-use-it"></a>
## How to use it

### Tell a missing record from a display problem
1. A page shows nothing you expected — for example, an agent is missing from **Registry**.
2. Open the matching **Debugger** tab (**Agents**).
3. If the record is here, the data arrived and the other page is not showing it. If it is not here
   either, the scanner never reported it — check **Settings → Scanners** and
   [Infrastructure](infrastructure.md).

<a id="navigation-out"></a>
## Where to go next

- [Registry](registry.md) — the same components, with governance.
- [Infrastructure](infrastructure.md) — whether a scanner covers the cluster at all.

<a id="navigation-in"></a>
## How you get here

- Sidebar → **Protect** → **Debugger**.
