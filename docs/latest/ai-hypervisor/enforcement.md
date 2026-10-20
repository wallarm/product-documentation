# Enforcement <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="capabilities"></a>

<a id="intro"></a>
## What this is

Three sidebar pages work together to stop risky AI behaviour at runtime:

| Page | Sidebar | What it is for |
|---|---|---|
| **Enforcement** | **Govern** | The rules: what to watch for and what to do when it happens. |
| **Hits** | **Protect** | Every time a rule fired, newest first. |
| **Block List** | **Protect** | Who is blocked right now, for how long — and lifting blocks. |

Rules act only on namespaces opted in with **Enforce**, through the scanner's proxy. In a
**Monitor** namespace a rule records what it would have done but blocks nothing. See
[Getting started](getting-started.md).

<a id="layout"></a>
## Enforcement (rules)

- **Application dropdown** — **All applications** or one application.
- The rule list. Each rule shows its name, condition and action, a switch to turn it on or off,
  edit and delete. **Add rule** creates one.
- After you change rules, a bar shows the scanners picking up the new rule set.

### Default rules on a new workspace

Every workspace starts with these rules, all switched on:

| Rule | Action |
|---|---|
| **Block Prompt Injection** | Block |
| **Block Jailbreaks** | Block |
| **High Risk Session Block** — after more than 3 blocks in a session | Block |
| **Scanner-Flagged Session Block** — sessions the scanner flagged for jailbreak or injection | Block |
| **Non-AI Egress Block** — personal data sent to non-AI destinations | Block |
| **Unauthenticated MCP Block** — MCP calls without authentication | Block |
| **PII Exfiltration Alert** — personal data in session traffic | Alert |
| **Critical CVE Alert** — sessions from applications with critical or high CVEs | Alert |

They block only in namespaces opted in with **Enforce**; in **Monitor** namespaces they record what
they would have done. To stop a default rule, switch it off rather than deleting it.

If you delete every rule, the list says **Click "Add rule" to create one**.

### Rule fields

| Field | What you set |
|---|---|
| **Rule name**, **Description** | Your label for the rule. |
| **Category** | **Prompt security**, **Data protection**, **Runtime controls**, **Network egress**, **MCP tools**, **Supply chain**. |
| **Severity** | How serious a hit is. |
| **Source**, **Destination** | Which traffic the rule applies to. |
| **Condition Type** and **Condition Value** | What triggers it — see below. Some types use **Measured over the last** (a time window). |
| **Action** | **Block**, **Quarantine**, **Alert**, **Log**; **Redact** (mask the matched content) on content conditions only. |
| **Blast radius** | Who is blocked: **This identity, in this app**, **This identity, everywhere**, **This run only**, **This app pair only**, **This endpoint only**. |
| **Kill duration** | How long a block lasts. **Tenant default** uses **Settings → Preferences → Kill duration — automatic rule blocks**. |
| **Enabled** | **Rule is active and enforced** when on. |

Condition types: **Regex pattern**, **Findings in session >=**, **Injection detections >=**,
**PII items leaving >=**, **Blocked destination host**, **Unauthenticated MCP tool call**, **Scanner
flagged the session**, **Blocked requests in window >=**, **Supply-chain CVE severity**, **App must
not call app**, **Endpoint must not be served**. **Redact** is offered for **Regex pattern**,
**Blocked destination host** and **Unauthenticated MCP tool call**.

When you delete a rule that still has active blocks, the dialog offers to lift them too.

<a id="hits"></a>
## Hits

Every time a rule fired. Filter by action: **All actions**, **Blocked**, **Quarantined**,
**Alerted**, **Redacted**, **Monitor (recorded, not blocked)**, **Lifted**. Each row shows when it
happened and the flow it acted on. Expand a row for details, then open:

- the **session** it acted on, in [Traffic](user-tracks.md);
- the user's entries on the **Block List**.

**No enforcement events yet** means no rule has fired: either there are no rules, or nothing has
matched them.

<a id="block-list"></a>
## Block List

Everyone who is blocked right now. Blocks come from **Kill Session** in
[Traffic](user-tracks.md) and from rules whose action blocks.

- The count of active entries, and an application filter that lists only applications that hold
  blocks.
- Each entry: the identity, the application, the scope (**Everywhere**, **This app**, **This
  run**, …; **Whole source IP** when no identity could be resolved), the reason, and when it
  expires (for example **in 47m**, or **Never** for blocks set **Until manually lifted**).
- **Lift** ends one block. When the list is filtered to one identity, **Lift all for <identity>**
  ends all of theirs. Traffic is allowed again as soon as the scanner picks up the change.

<a id="how-to-use-it"></a>
## How to use it

### Create a rule
1. Open **Enforcement** → **Add rule**.
2. Pick a **Category**, a **Condition Type** and its **Condition Value**.
3. Pick an **Action** and a **Blast radius**. Start with **Alert** or **Log** to see what would
   match, then switch to **Block**.
4. Make sure **Enabled** is on, click **Save**.

### Find out why something was blocked
1. Open **Hits** and filter by **Blocked**.
2. Expand the row and open the session to see the exact request.

### Unblock someone
1. Open **Block List** and find the identity.
2. Click **Lift**.

<a id="navigation-out"></a>
## Where to go next

| From | You land in |
|---|---|
| A hit → session | [Traffic](user-tracks.md), at that session |
| A hit → block list entries | **Block List**, filtered to that user |
| A Block List entry → session | [Traffic](user-tracks.md), at that session |

<a id="navigation-in"></a>
## How you get here

- Sidebar → **Govern** → **Enforcement**; sidebar → **Protect** → **Hits** or **Block List**.
- **Kill Session** in [Traffic](user-tracks.md) adds the user to the **Block List**.
- **Flow** → **Boundary** → **Block** creates a rule here — see [Traffic → Flow](traffic.md#boundary).

## How it works

#### How session-level termination is implemented

The scanner attaches eBPF programs to TCP egress hooks on each instrumented pod. Every outbound connection is recorded in an in-kernel map keyed by connection tuple (source IP, source port, destination, PID), with the session ID the scanner has stitched for that flow attached. A second map carries the per-session verdict: `allow` (default) or `block`.

When the verdict for a session flips to `block` — because an operator pressed **Kill Session** in [Traffic](user-tracks.md), or because an inline rule fired on a call inside that session — the eBPF program emits a TCP **RST** on the next packet of every matching connection instead of forwarding it. The connection is reset, not drained: the agent sees `ECONNRESET` on every active socket of that session within one round-trip. Other sessions on the same pod, and sessions of other pods on the same node, are untouched.

The same eBPF path handles two cases:

* *Block this session now* (operator-initiated, from a session row).
* *Block calls matching this inline rule from now on* (rule-initiated, after the proxy detects a match the scanner sets the verdict for that session).

The verdict map is queried by the local MITM proxy over a localhost endpoint (`GET /api/policy?src_ip=…`), so HTTPS sessions are caught at the proxy layer in addition to the kernel-level RST — the proxy refuses to relay the bytes onward and the kernel reset stops any retry attempt on the same socket.

### What the agent sees when something is blocked

The exact failure surface depends on which primitive fired:

* **Namespace quarantine.** Outbound connections to AI provider domains fail at connect time. Most SDKs surface this as `ECONNREFUSED` or DNS-resolution failure if the resolver itself is short-circuited.
* **Inline block.** The proxy returns a synthetic error response to the agent (HTTP 4xx with a structured body for OpenAI-shaped APIs, `tool_result.is_error=true` for MCP tool calls). The model provider never sees the call.
* **Session termination.** Every open connection of the session terminates with `ECONNRESET`. SDKs surface this as a retryable network error; depending on retry behavior, the next attempt either matches an inline rule (and is rejected) or hits a fresh session ID.

Application code that retries unconditionally may still complete the action on a fresh session. For consistent enforcement of intent, pair the session kill with an inline rule that prevents the next attempt.

### Auditability

Every enforcement decision is logged. The proxy emits one record per evaluated call (matched rule, action taken, latency); the kernel-side quarantine emits a record per first-blocked connection; session terminations emit a record per killed session. Records carry the rule identifier, the operator who applied the rule, and a hash of the matched field. They appear in [Notifications](notifications.md), in the per-app finding feed, and in the audit trail packaged by [Compliance](compliance.md).
