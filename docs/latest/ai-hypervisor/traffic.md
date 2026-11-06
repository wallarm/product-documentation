# Traffic Flow Map <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="intro"></a>
## What this is

**Flow** is a map of who talks to whom: your applications and the LLM providers, MCP servers,
APIs and other applications they reach. Every line is traffic the scanner actually saw — nothing
is inferred from configuration. The same map shows where personal data goes, including what
leaves your network.

**Flow** is the fourth view on the [Traffic](user-tracks.md) page.

<a id="layout"></a>
## What is on the screen

- **Personal-data summary** — one line above the map: flows carrying
  personal data by where they went (left the network, other clusters, inside this cluster, …) and
  what DLP did (blocked, let through, not inspected). Hover a number for its detections.
- **Filter apps and environments…** — narrows what is drawn. It does not change what was recorded.
- **The map** — applications and the services they reach, grouped by environment. Lines are
  observed calls, in request direction.
- **Detail panel** — click an application for its **Application**, **Environment**,
  **Namespace**, **Traffic** (requests per minute) and **Connections** (what it reached).

### When this page is empty

An empty map means the scanner has recorded no AI traffic yet. Applications appear once they make
calls from an opted-in namespace — see [Getting started](getting-started.md). An application
without a scanner draws nothing, so its absence is a coverage gap, not proof it is quiet.

<a id="how-to-use-it"></a>
## How to use it

### See what an application reaches
Pick the application in the application dropdown, or type it into **Filter apps and
environments…**, and read outward. Services nobody declared show up like any other.

<a id="blast-radius"></a>
### See an application's blast radius
1. Click an application (or one of its entry points) on the map → its details open.
2. Click **Show blast radius** → everything the application can
   reach stays lit and the rest of the map dims. When it calls another of your applications, that
   application's own destinations count too, in any environment.
3. Read the counts under the button: applications reached (and how many are in another
   environment), destinations per zone, and the personal data and DLP events moving inside it.
   The reach covers the whole estate; a destination not on the current page lights the group or
   pager that holds it.
4. Click **Hide blast radius** (or close the details) → the map returns to normal.

### See a session's path
In [Traffic](user-tracks.md), open a session and click **Trace on Graph**. The map opens with that
session's path highlighted. **Trace Flow on Graph** (a personal-data record) and **Trace Canary
Flow on Graph** (a canary) work the same way.

A line above the map says what the trace shows: how many nodes on the path are drawn, that the
path is outside the current view, that the item has no path at all, or that the trace could not
be loaded. **Back to Traffic** returns to where you started; **Clear trace** shows the whole map
again.

<a id="boundary"></a>
### See where personal data goes

Personal data — an email address, a card number, an IP address — that an application sent in an
outbound request or response is drawn on the same map. The counts come from the scanner's
per-request detections.

- **Where each destination is.** The Egress column is grouped by location, each group
  opening on its own from its summary node and folding back from its
  caption:
  - **Outside the network** — third parties (model providers found by discovery, public host
    names, public addresses). Framed solid.
  - **Other clusters** — your own applications, or pod addresses, in another cluster: traffic that
    crosses the internet between your clusters. Framed blue.
  - **This cluster** — your applications, pods and services in the sender's cluster, and the node
    itself (loopback, link-local, the instance metadata service).
  - **Private network** — private addresses outside every cluster the scanner has seen pods in.
  - **Not located** — destinations recorded without an address, such as MCP servers declared in
    an agent's configuration.
- **What went wrong where.** Marked on the line and the destination, in their own colours:
  - **Red** — personal data reached it (detected, or DLP let it through). Badge **PII** / **DLP**.
  - **Dark red, dashed** — DLP blocked it. Badge **Blocked**.
  - **Amber, dotted** — DLP could not read the traffic: a possible leak. Badge **?**.

  Hover a line or a badge for the counts and data classes. Destinations with something marked are
  listed first in their group.
- **Red dashed lines between two applications** — personal data one sent to the other. With one
  application picked, the applications that sent it personal data are drawn beside it.
- **Sensitive-data flows** (on the map) opens every flow in
  a drawer: sender, destination, where it is, data classes, detections, last seen, and what a block
  would do today. Click a row for its details. A destination's or an
  application's details panel offers the same list narrowed to it.

Applications whose personal data left the network are listed first in their environment, then the
ones that exchanged personal data with another application. A cluster is recognised by the pod
addresses the scanner has seen in it, so a pod that has since gone still counts as that cluster's.

A destination counts as outside the network when the address or host the scanner saw is public.
Traffic through an ingress or proxy is shown at that first hop. For external destinations,
**TLS** reads **Handshake observed** (the scanner saw a TLS handshake) or **Not observed** (it did
not — this does not prove the traffic was unencrypted).

In a flow's details:

- **Open latest session** — opens the most recent session that carried this data, in
  [Traffic](user-tracks.md).
- **Block** — creates an [Enforcement](enforcement.md) rule: to a named external host, it refuses
  that application's requests to the host; to another application, it refuses calls from the
  sender to it. The details say which application's proxy enforces it. If that application's
  namespace is in Monitor mode, the rule is saved but blocks nothing until the namespace is
  switched to Enforce. A flow to an address with no observed host name, or to a bare service
  name, cannot be blocked, and the details say why.

<a id="navigation-out"></a>
## Where to go next

- **Sensitive-data flows → a flow → Open latest session** → that session in [Traffic](user-tracks.md).
- **Sensitive-data flows → a flow → Block** → the new rule in [Enforcement](enforcement.md).

<a id="navigation-in"></a>
## How you get here

- Sidebar → **Observe** → **Traffic** → **Flow**.
- **Trace on Graph**, **Trace Flow on Graph** or **Trace Canary Flow on Graph** in
  [Traffic](user-tracks.md).
- [Heatmap](heatmap.md#open-finding) → an expanded cell → a finding about an outside destination
  → the graph opens with that destination drawn and its details open. If the graph has no such
  destination, a line above it says so.
