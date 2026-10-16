# Heatmap <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="intro"></a>
## What this is

Heatmap is a matrix-shaped lens on your AI estate's **[findings](briefing.md#finding)** — the same findings the [Briefing](briefing.md) ranks and acts on, laid out here as a grid so you can scan *which kinds of risk land on which kinds of asset* at a glance. It is in the sidebar under **Observe**.

Two lenses on the same data are one click apart in the header: **Risk matrix** groups findings by entity class (agents, MCP servers, LLMs, data sources, runtime, supply chain); **Full stack** groups the same findings by stack layer (Interface, Identity, Orchestration, Cognitive firewall, Inference, Protocol, Connectivity, Knowledge, Infrastructure). Flip between them as the question shifts.

<a id="finding"></a>
### What a finding is

A **finding** is a single risk issue the platform has detected. The canonical definition of a finding, and how findings roll up into the Security score (0–100), live on the [Briefing](briefing.md#finding). Heatmap counts those same finding records — arranged here by the **risk categories** it uses as columns (defined in [Risk categories](#risk-categories) below). Everything on Heatmap — every cell number, every tile, the overall score — is an aggregation of them.

The two lenses look at the same findings from different angles. **Risk matrix** groups them by entity class — the row dimension is labeled *asset domain* (Agents, API, Data, LLM, MCP, Runtime, Supply). **Full stack** groups the same assets by functional role in the system — the row dimension there is labeled *stack layer* (Interface, Identity, Orchestration, etc.). Different labels, same underlying assets. The columns (risk categories in Risk matrix, security controls in Full stack) are also the same set of concerns under two names.

<a id="layout"></a>
## What is on Heatmap

In page order:

**1. The lens** — pick **Risk matrix** (default) to group findings by entity class × risk category, or **Full stack** to group the same findings by stack layer × security control. Same data, two ways to read it. The choice is remembered per user.

**2. <a id="caller-mix"></a>The Caller mix bar** — a collapsible row above the matrix, showing each application's recent traffic broken down by **who is calling**. A horizontal stacked bar per app surfaces the AI-vs-human composition at a glance. The caller classes:

- **Human (browser)** — interactive sessions from a real user in a web browser
- **Human (CLI)** — operators using shell scripts and command-line tooling
- **AI agent** — an agent making tool calls
- **AI bot (known)** — automated clients whose fingerprint the platform recognizes
- **AI bot (suspected)** — traffic shaped like bot activity, without a confirmed fingerprint
- **Endpoint device** — calls from an enrolled endpoint (macOS)
- **Service internal** — service-to-service calls inside your environment
- **Infra probe** — health checks, monitors, Kubernetes liveness probes
- **Unknown** — caller class cannot be classified yet

A new app suddenly serving heavy *AI bot (suspected)* traffic is a signal worth investigating — either you have a real agent integration nobody told you about, or someone is fingerprint-evading. The same caller-class colors carry over to [Traffic](user-tracks.md) — the session-mix summary bar above the session list, the per-session caller class, and the per-step caller class in the waterfall all use this palette.

**3. The view-mode tabs** below Caller mix — switch between **Matrix** (the heatmap grid, default) and **Cards** (one summary per application), with an *N applications* counter next to them. Different presentations of the same underlying data. These tabs are only visible when the application dropdown at the right of the page title is set to **All applications** — when a single app is selected, the matrix renders directly and there is nothing to switch between.

**4. The matrix grid** — the main canvas. Rows are **asset domains** (Agents, API, Data, LLM, MCP, Runtime, Supply) in Risk matrix mode, or **stack layers** (Interface, Identity, Orchestration, ...) in Full stack mode. Columns are the **risk categories** (Access, Authentication, Compliance, CVE, Injection, PII, Shadow).

Each cell shows:

- **A number** — the count of open **[findings](#intro)** at that (row × column) intersection. The expanded cell labels this **Total findings**.
  - It is **not** the count of assets — the row header shows that separately as "X assets" (the deduplicated asset count for the domain).
  - It is **not** a risk score either — that is the **Overview** panel (see point 5 below).
- **A sparkline** of the count's recent history (rising / falling / flat).
- **A color** representing the risk (see the legend).

Click a cell to expand it; click a row or column header to focus that slice.

<a id="open-finding"></a>
In an expanded cell, each finding opens its asset: a session in [Traffic](user-tracks.md), a
package in [Supply Chain](supply-chain.md) with its details open, an outside destination on the
[Flow graph](traffic.md) with its details open, an application on [Topology](topology.md). A
finding whose asset has no page of its own (a container) is listed but cannot be opened; hover it
for the reason.

### When this page is empty

**No risk matrix yet** — the matrix fills from scanner findings, usually within a minute of the scanner reporting on an opted-in namespace. If it stays empty, check **Settings → Scanners** (see [Getting started](getting-started.md)).

<a id="overview-panel"></a>
**5. The Overview panel** — visible when the application dropdown is set to a single application (not *All applications*). It is the "same risk as a score" view of the matrix.

What it shows when no row is selected:

- A **Security score** gauge (0–100) for the whole application.
- A **per-row breakdown** — for every row in the matrix (asset domain in Risk matrix, stack layer in Full stack), a thin bar with the row's name, color, and score.
- A quick-stats grid: total row count + count of rows currently at risk.

What it shows when you click a row in the matrix:

- The row's own Security score gauge.
- The row's **Score** + **Weight** numbers.
- A status label naming the score in plain language (*Low risk* / *Medium risk* / *High risk* / *Critical risk*).
- A **Contribution to overall** bar showing the weighted contribution of this row to the application's overall score.

**How the Security score reads.** Every open [finding](#intro) lowers the single 0–100 number where **100 = no risk**; the more open findings (and the more severe they are), the lower the score. The canonical definition lives on the [Briefing](briefing.md#security-score). Per-row scores apply the same logic scoped to that row; the overall score combines them using each row's **Weight**.

The cell number on the matrix and the Security score in the Overview panel are **two views of the same underlying findings**, but they run in opposite directions: a cell with more findings shows a *higher* count and a warmer color, while a score with more findings shows a *lower* number. The status label names the same value in human terms.

<a id="risk-categories"></a>
## Risk categories

The same **risk categories** form the columns of Heatmap in both lenses — in Risk matrix they intersect with asset domains (rows), in Full stack they intersect with stack layers (rows). Same concerns, same definitions, just plotted against a different vertical axis. The descriptions below apply to whichever lens is active; the highlight links work in both.

<a id="control-access"></a>
### Access

Access — *who is allowed to invoke which agents, tools, or data sources*. A high access risk usually means an entity is reachable by callers outside its intended audience, or that role-scoped restrictions are not in force. Investigate by opening the affected entity in [Registry](registry.md) — its detail panel shows the Owner, the tools/data it connects to, and its risk level. Resolution happens in the entity's own configuration (its IdP, gateway, or service definition) — the platform surfaces the risk, it does not enforce the rule.

<a id="control-auth"></a>
### Authentication

Authentication — *identity verification, token validity, session integrity*. A high auth risk indicates missing or weak credentials on a component: anonymous calls accepted, tokens that never rotate, identity implied rather than asserted. Trace the failing flows in [Traffic](user-tracks.md) to see the calling pattern. Resolution happens in the entity's own auth configuration (IdP, gateway, service definition) — the platform surfaces the risk, it does not enforce the rule.

<a id="control-compliance"></a>
### Compliance

Compliance posture against the frameworks the platform reports on — **SOC2**, **EU AI Act** and **NIST AI RMF**. A high compliance risk means at least one control in those frameworks lacks runtime evidence. Export the gap from [Compliance](compliance.md), which covers the same fixed set.

<a id="control-cve"></a>
### CVE

Known vulnerabilities (Common Vulnerabilities and Exposures) detected in the components that make up your AI stack — packages, model weights, MCP server binaries. A high CVE risk surfaces components that need patching or replacement; drill into the entity's [Registry](registry.md) detail for the affected versions and remediation steps.

<a id="control-injection"></a>
### Injection

Prompt injection — *adversarial inputs designed to subvert an AI agent's instructions*. A high injection risk means adversarial inputs are reaching an agent undetected, or that detected attempts have not been blocked.

<a id="control-pii"></a>
### PII

PII (Personally Identifiable Information) handling — *what sensitive data each entity has touched, where it has flowed, and whether egress to external AI providers is restricted*. A high PII risk indicates sensitive data flowing to a destination the policy does not sanction. Verify per-flow on the [Flow](traffic.md#boundary) map, where personal data leaving the network is drawn in red.

<a id="control-shadow"></a>
### Shadow

Shadow AI — *AI components observed in external signals but absent from the scanner's inventory entirely*. The platform tracks three governance states across the same data: **Sanctioned** (in the approved-assets baseline), **Tolerated** (in inventory but not approved), and **Unsanctioned** — that is, shadow AI (only seen in external logs, no inventory row). The Shadow risk category counts that third group — the AI vendors a team started using without telling anyone. Often the first signal of an unannounced integration. Spot them in [Hyper Graph](hyper-graph.md) (which renders shadow nodes alongside the rest of the topology), then promote or block them from the row actions in [Registry](registry.md).

<a id="asset-domains"></a>
## Asset domains

The **Risk matrix** lens groups findings by **asset domain** (row). Each domain is a class of entity the platform observes. A high severity in a row means the underlying entities of that class need attention.

<a id="domain-agents"></a>
### Agents

The AI agents your teams run — anything that takes a goal, decides what to do, and calls tools or APIs to get it done. Includes both off-the-shelf agent frameworks and your own bespoke orchestrators. Risks on this row usually mean an agent is exposed without authorization, is mishandling PII, or is calling tools outside its sanctioned scope.

<a id="domain-api"></a>
### API

Service endpoints your agents and applications expose or consume. Includes any callable surface reachable over the network — internal services and external APIs alike — regardless of the underlying protocol or API style (REST, gRPC, GraphQL, WebSocket, webhooks, etc.). For governance, the protocol is incidental; what matters is which callers can reach the endpoint, what data passes through, and whether that flow is sanctioned.

<a id="domain-data"></a>
### Data

Data sources your agents read from and write to — **databases** (relational / document / key-value) and **vector stores**. The platform discovers them from observed runtime activity. Risks here surface PII flowing through agent sessions, missing encryption on the data source itself, and PII egress to third-party AI providers.

<a id="domain-llm"></a>
### LLM

The language models in use — externally-hosted commercial models, cloud-provider-hosted models, and locally-served open-weight models — plus the inference traffic that flows to them. Risks include unsanctioned providers, missing prompt-injection defense, and PII reaching external endpoints.

<a id="domain-mcp"></a>
### MCP

MCP (Model Context Protocol) servers and the tools they expose. Each MCP server is a structured connector that your agents can call. Risks here include over-permissive tool catalogs, unapproved servers, and dangerous tool combinations.

<a id="domain-runtime"></a>
### Runtime

Container, sandbox, and process-level concerns — the environment your agents and connectors run in. Risks include over-privileged containers, lateral access, missing sandboxing, and unmanaged shell access from agent code.

<a id="domain-supply"></a>
### Supply

Supply-chain — the third-party code your AI stack depends on: packages (with their version, ecosystem, license, and CVEs), the libraries they pull in as dependencies, and AI models loaded via deserializable formats where arbitrary-code execution at load time is a risk. Findings here surface CVE-affected package versions and unsafe-pickle model loading as compliance risks.

<a id="stack-layers"></a>
## Stack layers (Full stack lens)

The **Full stack** lens groups the same findings by **stack layer** instead of asset domain. Layers are organized by zone (Entry / Brain / Hands / Foundation). Each layer is a vertical slice of the platform that owns a specific kind of risk.

<a id="layer-interface"></a>
### Interface layer

The public front door — your REST / GraphQL / WebSocket entry points. WAF, rate limiting, DDoS protection, schema validation. The first place external requests touch the platform.

<a id="layer-identity"></a>
### Identity layer

Authentication and Non-Human Identity (NHI). Verifies users and mints service tokens for agents. On-Behalf-Of tokens, service-to-service trust, agent identity assertions.

<a id="layer-orchestration"></a>
### Orchestration layer

The "agent manager" — the layer that decides what to do, sequences tool calls, and routes intermediate results. Authorization of workflows, preventing infinite loops, human-in-the-loop approvals.

<a id="layer-guardrails"></a>
### Cognitive firewall

The text-scanning **guardrail** layer in front of the model. Prompt-injection blocking, PII redaction, jailbreak detection.

<a id="layer-inference"></a>
### Inference layer

The model itself — wherever inference is actually run, commercial or self-hosted. Data-privacy concerns (zero retention, residency), model switching and fallback.

<a id="layer-protocol"></a>
### Protocol layer

MCP (Model Context Protocol) Hypervisor — the standard connector between agents and tools. Tool allowlisting, read-only enforcement, blocking dangerous parameters.

<a id="layer-connectivity"></a>
### Connectivity layer

External APIs and SaaS that agents reach out to, plus any API gateway / integration middleware that sits in front of them. Scope restriction, egress filtering, third-party rate limits.

<a id="layer-knowledge"></a>
### Knowledge layer

The memory — internal databases, vector stores, object storage. Row-level security (RLS), RAG poisoning defense, sensitive-document handling.

<a id="layer-infrastructure"></a>
### Infrastructure layer

The container and the code. Supply-chain scanning (model weights, libraries), runtime sandboxing (eBPF), preventing shell access from agent code.

<a id="how-to-use-it"></a>
## How to use it

### Read the matrix
Scan for cells with high counts and warmer colors — these are the (asset × risk) intersections where the most findings are concentrated. The footer shows the **Overall score** for the current scope (a single application or the aggregate).

### Drill into a cell
Click any cell to open its expanded view. You see the **Total findings** count for that intersection plus a per-finding list. The `?` icon next to **Total findings** opens this doc's "What a finding is" section. Close with `×` or by clicking outside the expanded view.

### Focus on a row or column
Click an asset-domain row header (or stack-layer row, in Full stack) to expand that whole row — the expanded view shows the breakdown across all risk categories. Click a risk-category column header to expand the column — breakdown across all asset domains (or stack layers). Each card inside the expanded view has its own `?` to deep-link into the docs.

### Switch the lens
Pick **Risk matrix** or **Full stack** in the page header to re-group the same findings by stack layer instead of by entity class. The choice persists per user.

### Switch the scope
The application dropdown next to the page title switches between **All applications** (aggregate) and a single application. In aggregate mode, you also get the **Matrix / Cards** view tabs below the Caller mix bar. In single-app mode, the right-side **Overview** panel shows the per-app Security score and (when a row is selected) the per-row score, weight, status, and contribution to overall.

<a id="navigation-in"></a>
## How you get here

- Sidebar → **Observe** → **Heatmap**.

<a id="navigation-out"></a>
## Where Heatmap takes you

Heatmap is largely a destination — most actions open in-page expanded views (cell / row / column) rather than navigating away. To leave, use the sidebar.

| From this affordance | You land in |
|---|---|
| Cell click | Expanded cell view (same screen) — finding list + the **Suggest a tailored fix** action |
| Row header click | Expanded row view — breakdown across the risk categories |
| Column header click | Expanded column view — breakdown across all asset domains (or stack layers) |
| Card inside an expanded view | The OTHER axis's expanded view (e.g., from "Agents row → Access card" you can pivot into the Access column) |
| `?` icon anywhere on the page | This doc in the help panel, scrolled to the relevant section |

<a id="settings"></a>
## Settings that affect Heatmap

Configured in **Settings**:

- **Scan frequency** — how often the scanner reports (decides how fresh the cell counts are)

The applications in the dropdown are the ones you opted in to scanning — see [Getting started](getting-started.md).
