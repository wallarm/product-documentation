# Hyper Graph <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="intro"></a>
## What this is

**Hyper Graph** draws every component the platform knows — agents, MCP servers, LLM providers,
data sources, APIs — and the traffic between them, in 3D. A second view, **PII movement**, shows
where personal data travels and lets you block a flow.

<a id="layout"></a>
## What is on the screen

- **Application dropdown** — **All applications** or one application. Under **All applications**,
  **Graph / Cards** switches between one node per application and
  one summary card per application; click an application to focus it.
- **Full** / **PII movement** — the two views.

### Full

The 3D graph. Drag to rotate, right-drag to pan, scroll to zoom. Click a
node for its details: **Type**, **Category**, **Source**, risk,
**Status**, and when known **Layer**, **Region**, **Classification**.

The control panel on the graph:

- **Layout** — **Clusters** (default, grouped by category),
  **Layers**, **Data Spheres**, **Skyline Towers**, **Tetra Pyramid**, **Free**.
- **Group by** and **Size by**.
- **Connection trace** — after you click a node: **Direct** (its
  neighbours), **Downstream**, **Upstream** or **Full trace** (both directions).
- **Filters** — **Flow types** and **Entity types**, each with a count;
  click one to show or hide it.

### PII movement

Where personal data moved during the selected window: **1h**, **24h** (default) or **7d**. Show it
as **Sankey** or **3D**. Click a flow for its **Destination zone**, **Records**, **Sessions** and
**Users**, and two actions:

- **Block PII egress** — creates an [Enforcement](enforcement.md) rule that blocks this flow. The
  button then reads **Enforcing — rule active**.
- **View session(s)** — opens the sessions behind the flow in [Traffic](user-tracks.md).

### When this page is empty

- **Full**: **No graph data available** — the scanner has not reported components yet. See
  [Getting started](getting-started.md).
- **PII movement**: **No PII movement in the selected window** — no personal data was seen moving.
  Try a longer window.

<a id="how-to-use-it"></a>
## How to use it

### See everything one component connects to
1. In **Full**, click the component's node.
2. Under **Connection trace**, choose **Full trace**.

### Stop personal data from reaching a destination
1. Switch to **PII movement** and pick a window.
2. Click the flow, check its **Records** and **Users**.
3. Click **Block PII egress**. The rule appears on the [Enforcement](enforcement.md) page.

<a id="navigation-out"></a>
## Where to go next

- **PII movement → View session(s)** → [Traffic](user-tracks.md).
- **PII movement → Block PII egress** → the new rule in [Enforcement](enforcement.md).

<a id="navigation-in"></a>
## How you get here

- Sidebar → **Observe** → **Hyper Graph**.
