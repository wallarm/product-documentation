# Registry <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="intro"></a>
## What this is

**Registry** is the inventory of every AI component the scanner has found: agents, MCP servers,
LLM providers, APIs, data sources and tools. It also lists **shadow** AI — namespaces whose pods
call AI services but are not yet opted in to scanning.

For each item you decide its governance state: **Sanctioned** (approved), **Tolerated** (seen, not
yet reviewed) or **Unsanctioned** (seen only from outside signals). New items arrive as
**Tolerated**.

<a id="layout"></a>
## What is on the screen

- **Application dropdown** (next to the page title) — **All applications**, or one application.
  The page shows only what belongs to your choice.
- **Tabs** — **All**, **Agents**, **MCP Servers**, **LLMs**, **APIs**, **Data**, **Tools**,
  **A2AS Certificates**, **Shadow**. Each tab except **Shadow** shows a count.
- **Governance filter** — **All**,
  **Sanctioned**, **Tolerated**,
  **Unsanctioned**, each with its count. Hidden on **Shadow**.
- **Table** / **Treemap** — switch between the table and a treemap.
- **Baseline inventory** — approves every Tolerated agent and MCP server of
  the application in one click. Pick one application first; it is disabled under **All
  applications**.

<a id="item-attributes"></a>
### Columns

Every tab has **Name**, **Type**, **Status** (`active`, `detected` or `unknown`), **Risk** (the
highest severity of the item's open findings) and **RPM** (recent requests per minute; on **Tools**
it is **Invocations**). **Agents**, **MCP Servers** and **All** add **Cert** (A2AS certification);
**Tools** adds **Sanctioned**. Some tabs add their own columns, for example **Model** on Agents,
**Spec** and **Latency** on APIs, **Data Class** on Data, **Category** on All.

### When this page is empty

On a new workspace every tab shows zero until the scanner reports. **Shadow** usually fills first:
it lists namespaces whose pods call AI services, before you opt them in. See
[Getting started](getting-started.md).

<a id="detail-drawer"></a>
### Detail panel

Click a row to open everything known about the item. The sections depend on the kind: agents show
**A2AS Components**, configuration (model, tools, owner, data class), performance and known CVEs;
MCP servers show transport, tools and how they were detected; APIs show detection source, protocol
and traffic; LLM providers show models and traffic; shadow detections show how the use was found
and which workload made it. The panel is read-only — change governance with the row buttons.

<a id="stats-panel"></a>
### Statistics panel

With no row selected, the side panel shows statistics for what the current tab and filter show:

- **Certification Rate** — the share of items that are A2AS certified.
- **Total**, **Sanctioned**, **Tolerated**, **Unsanctioned** — counts.
- **Risk Distribution** — items per severity.
- **By Type** — items per subtype.
- **Detection Coverage** (APIs tab only) — how APIs were detected: source code, HTTP probing,
  eBPF, inferred.
- The footer — **N of M not A2AS certified · X% shadow**.

<a id="how-to-use-it"></a>
## How to use it

### Bring shadow AI under coverage

1. Open **Shadow**, or find a row of type **Shadow Detection** in the table.
2. Click **Monitor** to record the namespace without blocking, or **Enforce** to record and block
   by your policies. It takes effect on the scanner's next cycle.
3. After **Enforce**, a namespace whose pods were already running shows **⚠ Restart to complete**.
   Click **Adopt**: it restarts the namespace's workloads (rolling restart) so their pods get the
   scanner proxy's certificate. Blocking works only after this.
4. **Revert** removes coverage from the namespace.

Enforce needs the scanner installed with its proxy — see
[Getting started](getting-started.md).

<a id="promote-action"></a>
### Approve or revoke items

- **Promote** — on Tolerated and Unsanctioned rows; approves the item
  (Sanctioned).
- **Demote** — on Sanctioned rows; revokes the approval (Tolerated).
- **Baseline inventory** — approves all Tolerated agents and MCP servers of
  the selected application at once. Useful right after onboarding, when what the scanner found is
  trusted.

To find what still needs review: click **Tolerated** and sort by
**Risk**.

### Check A2AS certification

Open **A2AS Certificates**, or open an agent and read its **A2AS
Components**. Each of the five components says why it is on or off:

- **Behavior Certificates** — on when the agent has a signed behaviour certificate that this
  workspace can verify and enforce. **Open certificate** opens it.
- **Authenticated Prompts**, **Security Boundaries**, **In-Context Defenses**, **Codified
  Policies** — each on only when the agent's A2AS profile turns it on in enforce mode **and** a
  request from the agent was instrumented with it in the last 24 hours.

**Configure A2AS**, or **Open A2AS** next to
a component, opens the [A2AS](a2as.md) page with the agent selected.

<a id="navigation-out"></a>
## Where to go next

| From | You land in |
|---|---|
| A tool's detail panel → **Recent Invocations** → a session | [Traffic](user-tracks.md), at that session |
| An agent's **Configure A2AS** / **Open A2AS** | [A2AS](a2as.md), with the agent selected |
| An agent's **Open certificate** | [Briefing](briefing.md), with that agent's behaviour certificate open |

<a id="navigation-in"></a>
## How you get here

- Sidebar → **Discover** → **Registry**.
- **Briefing** → a metric's detail → **Govern agents in the registry**.
