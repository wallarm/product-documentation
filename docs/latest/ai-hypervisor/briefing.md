# Briefing <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a href="#role-and-altitude"><img src="../../images/role-executive.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="#role-and-altitude"><img src="../../images/role-security.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="#role-and-altitude"><img src="../../images/role-platform.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="#role-and-altitude"><img src="../../images/role-compliance.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="#role-and-altitude"><img src="../../images/role-developer.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a>

The **Briefing** is the role-tailored landing view you arrive at after signing in. It answers three questions: what is connected, what is normal, what should you look at first. The view populates within about 30 seconds of traffic flowing through labelled workloads.

**Briefing** also hosts the conversational agent, so any question about something on the screen turns into a chat.

## Role and altitude

You pick a **role** on first sign-in, and the dashboard adopts the **altitude** that matches:

* **Executive.** Overall AI-risk posture, top exposures, compliance readiness.
* **Security Engineer.** Agent-level findings, suspicious sessions, recent PII events.
* **Platform Engineer.** Coverage health (scanners alive, apps onboarded) and inventory deltas.
* **Compliance.** Control coverage against SOC 2, EU AI Act, NIST AI RMF, plus evidence gaps.
* **Developer.** Pre-deploy signals on the workloads you own: CVEs, missing A2AS components, risky tool exposures.

Role is a switch. Flip it at any time from the **Briefing** header; the same data is re-projected through the new facet.

## What you see

Layout is different per role, but four elements appear in all of them:

* **Platform posture.** A horizontal flow for the **Discover → Observe → Enforce → Govern** arc, with live counts at each stage: assets discovered, sessions observed, enforcement actions taken, evidence packs generated. The arc is the same as in [Overview](overview.md#the-problem-ai-hypervisor-solves), rendered against your tenant's current numbers.
* **Operator queue.** Pending actions for the operator: sign Behavior Cert drafts, review Pending policies, promote tolerated entities. This is the one counter that should grow when there is work to do.
* **Findings by dimension.** A heatmap-style row counting unsuperseded findings per detector dimension (PII, threat, block, anomaly, shadow, auth, compliance, access, supply, cert, fidelity). Each cell drills into the findings behind it. The taxonomy used is the canonical risk model in [Findings](findings.md).
* **Action bar.** A horizontal strip of drill-in tiles under the main canvas. The set of tiles is curated per role; the tile opens the corresponding view in place. See [Action bar per role](#action-bar-per-role) below.
* **Account menu.** The avatar in the top-right opens the cross-role surfaces: [Notifications](notifications.md), [Red Team](red-team.md), [Settings](settings.md). These three are available to every role.
* **Ask the Agent chat strip** sits at the bottom of the canvas. See below.

What varies by role — the tiles at the top and the right-side panel:

* **Executive.** Posture tiles and a *Needs a decision* panel grouped by exposure theme (**Data exposure**, **Ungoverned AI**, **Active threats**, **Access & authentication**, **Supply-chain risk**). Each finding row inside the panel carries its own **Block …** action — the label depends on the finding's category (*Block PII egress* on PII findings, *Block unauthenticated calls* on auth findings, *Block this target* on access findings, *Block the injection vector* on injection findings, and so on). Different rows show different labels at the same time; pressing one turns on a live estate-wide rule. See [Enforcement](enforcement.md).
* **Security Engineer.** Recent findings, suspicious sessions, and a verdict band of new PII events.
* **Platform Engineer.** Scanner and enforcement tiles plus the operator queue.
* **Compliance.** Attestation, scope, and data tiles plus a *Controls & evidence* panel grouped by control family.
* **Developer.** Pre-deploy signals on the workloads you own: CVEs, missing A2AS components, risky tool exposures.

## Action bar per role

The drill-in tiles under the **Briefing** canvas are curated per role:

| Role | Tiles in the action bar |
|---|---|
| **Executive** | [Registry](registry.md), [Compliance](compliance.md) |
| **Security Engineer** | [Registry](registry.md), [Behavior Cert](behavior-cert.md), [Shadow AI](shadow-ai.md), [Patterns](patterns.md), [Topology](topology.md), [Compliance](compliance.md), [Debugger](debugger.md) |
| **Platform Engineer** | [Debugger](debugger.md), [Registry](registry.md), [Behavior Cert](behavior-cert.md), [Topology](topology.md), [Shadow AI](shadow-ai.md) |
| **Compliance** | [Compliance](compliance.md), [Behavior Cert](behavior-cert.md), [Registry](registry.md), [Shadow AI](shadow-ai.md) |
| **Developer** | [Compliance](compliance.md), [Behavior Cert](behavior-cert.md), [Registry](registry.md), [Shadow AI](shadow-ai.md) |

[User Tracks](user-tracks.md) is not on the action bar in any role. You reach it by clicking through a session-count tile (for example, *Blocked sessions* on the Executive briefing) or by following a *sessions* link from a finding row.

## Ask the Agent

The chat strip at the bottom of the **Briefing** tray is your shortcut from *"I see a finding I do not understand"* to a concrete next step. The agent works against the data your tenant has observed and handles:

* **Explaining a finding** — *"What does this CVE mean for the `checkout-bot` app?"*
* **Why something is flagged** — *"Why is `support-bot` calling Cohere when our policy is OpenAI-only?"*
* **Suggesting a tailored fix** — *"How should I remediate the PII leak in the `internal-rag` flow?"*
* **Summarising recent activity** — *"What changed in our AI estate this week?"*
* **Pointing you to the right UI surface** — *"Where do I see every session that touched a credit card today?"*

The agent reads, explains, and recommends. It does not act on your behalf. Promotion, blocking, and configuration changes go through the corresponding UI controls.

## Cross-references

Most **Briefing** cards drill into the canonical view that owns the detail:

| **Briefing** element | Where the canonical detail lives |
|---|---|
| Platform-posture stage | The surface that owns the stage ([Findings](findings.md) for Discover, [Data Tracks](data-tracks.md) for Observe, [Compliance](compliance.md) for Govern) |
| Today's findings card | The affected entity in [Registry](registry.md) or session in [User Tracks](user-tracks.md) |
| Tool invocations card | [Registry](registry.md), Tools tab |
| Compliance card | [Compliance](compliance.md) |

## Settings that affect Briefing

* The cards that appear depend on what the tenant has observed. New applications onboarded via Helm and labelled `higgs.scan=enabled` start contributing within about 30 seconds (see [Labels and Annotations](annotations.md)).
