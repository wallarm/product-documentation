# Traffic <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="intro"></a>
## What this is

**Traffic** shows every AI interaction the scanner recorded, as sessions: a user (or another
agent) prompts an agent, the agent calls LLMs and tools, and responses come back. Each session
shows its steps in order, the personal data it touched, and any policy verdicts.

From here you can also block a misbehaving user with **Kill Session**.

<a id="layout"></a>
## What is on the screen

- **Application dropdown** (next to the page title) — **All applications** or one application.
- Four views, switched in the page header: **Sessions** (default), **Sensitive data**, **Canary
  track** and **Flow**.

### When this page is empty

**No sessions yet** means no application has made an AI call that the scanner recorded. Sessions
appear live as the scanner reports them. An application appears here only after it makes LLM,
MCP or tool calls, and only if its namespace is opted in — see
[Getting started](getting-started.md).

### Sessions

- A **session list**, newest first. Each row shows the user, how
  long ago, the applications the session touched, the number of tool calls, and — when present —
  blocked steps and personal data (**PII**).
- <a id="status-filter"></a>**Status filter** — **All status**,
  **Blocked**, **Active**, **Completed**, **Killed**, **Error**, **Timeout**.
- **Any** / **Multi-app** — **Multi-app** shows only sessions that crossed more than one
  application.
- **Hide thoughts** / **Agent Thoughts** — shows or hides the agent's reasoning steps. Appears only
  when there are such steps.

<a id="session-waterfall"></a>
Click a session to open its **step-by-step timeline**: user prompts,
LLM calls, tool intents and calls, MCP responses, API calls, guardrail checks, responses and
errors, in the order they happened. Click a step for its full detail, including its verdict and
the types of personal data found in it.

<a id="kill-session"></a>
**Kill Session** appears on sessions that are **Active**. It does not
only stop this session: it **blocks every future request from that user** for the duration you
choose. The dialog **Kill session?** shows how many sessions and applications that user has, and
asks for:

- **Duration** — **5 minutes**, **15 minutes**, **1 hour**, **8 hours**, **24 hours**,
  **7 days**, **30 days** or **Until manually lifted**. It starts at the default set in
  **Settings → Preferences → Kill duration — operator kills**.
- **Reason (required)**.

Click **Kill session** to confirm. The user appears on the [Block List](enforcement.md#block-list) until the
duration ends or someone lifts the block. The session's timeline stays available.

<a id="sensitive-data"></a>
### Sensitive data

Follows individual pieces of personal data — an email address, a Social
Security number, a token — instead of sessions. One row per record: its data class, the masked
value, the source application and when it was last seen.

Click a record for its **Risk Score**, how many **Accesses** were seen, how many **Agents** touched
it, and its journey over a **Time Window** of **1h**, **24h** (default),
**7d** or **custom**. **Trace Flow on Graph** opens **Flow** with that record's path highlighted.

<a id="canary-track"></a>
### Canary track

A canary is a decoy value you plant in your own data stores. If the scanner sees it in traffic,
someone read it and moved it.

- **Catalog** (left) — your canaries, filtered by **All**, **Tokens**,
  **Patterns**, **Segments**. Each shows its status (`active`, `dormant`, `breached`), the planted
  value with a copy button, how many detections and agents, and the last hit. **Register canary**
  adds one by hand.
- **Detection history** (center) — for the selected canary: hits, last trigger, and an
  incident summary per session, headed **Breach**, **External egress** or
  **Internal detection**, with the user, agent and the path the value took. A dashed
  trust boundary line marks where it left your network. **Trace
  Canary Flow on Graph** shows the path on **Flow**.
- **Watchlist Generator** (right) — creates canaries in bulk. Pick a pattern (**Email**, **SSN**,
  **JWT**, **API Key**) and a count, then click **Generate & register**. Copy the values from
  **Copy & Plant** into the data stores you want to watch.

<a id="flow"></a>
### Flow

A map of which applications reach which LLM providers, MCP servers, APIs and other applications,
drawn only from observed traffic. The same map shows where personal data goes and what leaves
your network. See [Traffic → Flow](traffic.md).

<a id="how-to-use-it"></a>
## How to use it

### Investigate a session
1. In **Sessions**, filter by status or application.
2. Click the session and read its timeline top to bottom.
3. Click a step to see its payload, verdict and personal data.

### Block a user who is misbehaving
1. Open the user's **Active** session and click **Kill Session**.
2. Pick a **Duration**, type a **Reason**, click **Kill session**.
3. To lift the block early, open **Block List**.

### Watch for data theft with canaries
1. In **Canary track** → **Watchlist Generator**, pick a pattern and a count, click
   **Generate & register**.
2. Copy the values and plant them in the data stores you want to watch.
3. A canary that turns `breached` was seen in traffic. Open it to see who moved it and where.

<a id="navigation-out"></a>
## Where to go next

| From | You land in |
|---|---|
| A session's timeline → **Trace on Graph** | **Flow**, with the session's path highlighted |
| A record → **Trace Flow on Graph** | **Flow**, with the record's path highlighted |
| A canary → **Trace Canary Flow on Graph** | **Flow**, with the canary's path highlighted |
| **Kill session** | The user is added to the [Block List](enforcement.md#block-list) |

<a id="navigation-in"></a>
## How you get here

- Sidebar → **Observe** → **Traffic**.
- **Hits**, **Block List** and **Enforcement** open the session behind an event here.
- **Registry** → a tool's **Recent Invocations** → a session.
- **Flow** → **Sensitive-data flows** → a flow → **Open latest session**.

## How it works

### How user attribution works across service hops

When a session crosses multiple services (for example, a browser request enters service A, which calls service B, which calls an LLM) AI Hypervisor stitches the same user identity across all three hops. The downstream LLM call is attributed to the original caller even when the intermediate services did not forward the identity.

Stitching uses two methods:

1. **Trace correlation.** If the request carries a W3C `traceparent` header, the scanner reads it and joins on the trace ID.
2. **Kernel TID correlation.** For services that do not propagate trace headers, the scanner correlates outbound socket activity to the inbound request via the kernel thread ID and a short observation window.

The result is the per-session waterfall described above: the original user's identity is attached to every step the session triggered, regardless of how many service hops separate the entry point from the model call.
