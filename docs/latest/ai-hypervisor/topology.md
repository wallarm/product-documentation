# Topology <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="intro"></a>
## What this is

**Topology** draws how the AI components inside your applications connect: agents, the LLMs they
call, MCP servers and tools, APIs and data stores. It is built from the traffic the scanner
records.

For "who talks to whom across applications, and where does personal data go", use
[Traffic → Flow](traffic.md). For the list of components and their governance, use
[Registry](registry.md).

<a id="layout"></a>
## What is on the screen

What you see depends on the **application dropdown** next to the page title.

**All applications**

- **Graph** / **Cards** — **Graph** draws one node per application; **Cards** shows one summary
  card per application. A counter shows how many applications there are.
- In **Graph**, click an application to see its components drawn in named layers, from
  **Interface** first to **Infrastructure** last.

**One application**

- A flow tree of that application's components: what calls what, left to right.
- **Show N dependencies** / **Hide dependencies** — adds or removes the application's software
  dependencies from the tree.

<a id="pipeline-overview"></a>
### Detail panel

With nothing selected, the panel shows the **Pipeline overview** for the application: **Total
agents**, **Critical** and **Warning** counts, **Pipeline Stats** (**Pipelines**, **Total RPM**,
**Daily cost**, **PII flows**) and **Infrastructure** (**Nodes**). **Add custom pipeline** is shown
but not available yet.

Click a node for its details. A node that is not yet approved shows its **Governance** state
(**Tolerated** or **Unsanctioned**) and two buttons:

- **Promote to Inventory** — approves it; it then appears in [Registry](registry.md) as
  **Sanctioned**.
- **Block Access** — blocks the application from reaching it.

Click empty canvas to return to the overview.

### When this page is empty

**No topology yet** means the scanner has not recorded traffic for these applications. The first
nodes appear within about a minute of the scanner starting on an opted-in namespace. If it stays
empty, check **Settings → Scanners** (see [Getting started](getting-started.md)). On a macOS
endpoint workspace, nodes appear once the device reports.

<a id="how-to-use-it"></a>
## How to use it

### See how one application is wired
1. Pick the application in the application dropdown.
2. Read the tree left to right. Click a node for details.
3. Click **Show N dependencies** to add its packages.

### Compare applications
1. Choose **All applications**.
2. Use **Graph** to see them side by side, or **Cards** for their summaries.
3. In **Graph**, click an application to see its components by layer.

### Approve or block an unknown component
1. Click the node.
2. Click **Promote to Inventory** if it belongs, or **Block Access** if it does not.

### Block all traffic in or out of an application

Each application in **Graph** has two ports: the **inbound** port (where its callers arrive) and the
**outbound** port (where its own connections leave).

1. Choose **All applications** → **Graph**.
2. Click the application's **inbound** port to stop callers from outside reaching it, or its
   **outbound** port to stop it reaching anything outside. A panel opens, titled
   **Traffic from outside the cluster to *app*** (or **Traffic from *app* to outside the cluster**).
3. Click **Block**. The panel shows **Blocking…**, then the port turns blocked. Calls between your
   own applications are not affected.
4. To undo, click the port again and click **Unblock**.

Every refused connection appears in [Enforcement](enforcement.md) → **Hits** with the rule that
refused it.

What each runtime can enforce:

| Runtime | Block traffic in | Block traffic out |
|---|---|---|
| Kubernetes | Yes: every caller from outside the cluster, on every endpoint | Yes |
| AWS Fargate | Yes, once the inbound lane is enabled for the task | Yes |
| macOS (endpoint agent) | Yes: connections other devices open to the application; local connections on the same Mac still pass | Yes |
| Android (endpoint agent) | Partly: the application receives nothing over the connections it opens itself. Connections other devices open to an application listening on the phone do not pass through the agent, so they cannot be refused | Yes |

When a direction cannot be enforced, the port is shown muted with the reason, and a rule that
cannot act anywhere is refused when you save it (see [Enforcement → Rules that cannot act
everywhere](enforcement.md#rule-limits)).

<a id="navigation-out"></a>
## Where to go next

- [Registry](registry.md) — the same components as a list, with governance.
- [Traffic → Flow](traffic.md) — traffic between applications and personal data leaving the network.
- [Infrastructure](infrastructure.md) — the clusters and nodes these applications run on.

<a id="navigation-in"></a>
## How you get here

- Sidebar → **Discover** → **Topology**.
