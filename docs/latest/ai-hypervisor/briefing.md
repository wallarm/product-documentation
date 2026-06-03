# Briefing <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a href="#role-and-altitude"><img src="../../images/role-executive.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="#role-and-altitude"><img src="../../images/role-security.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="#role-and-altitude"><img src="../../images/role-platform.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="#role-and-altitude"><img src="../../images/role-compliance.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="#role-and-altitude"><img src="../../images/role-developer.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a>

The **Briefing** view is the **role-tailored, agent-first overview** of your AI estate. It is the first thing you see after signing in. It answers *"what is connected, what is normal, what should I look at first"* on a single screen — populated from real runtime data within ~30 seconds of traffic starting through the labelled workloads.

Briefing is also where the built-in conversational agent lives, so a question about anything visible on the screen turns into a conversation in place.

## Role and altitude

On first sign-in you pick a **role**; the dashboard lays itself out at the **altitude** that fits that role. Roles supported today:

* **CISO / Security Officer** — overall AI-risk posture, top exposures, compliance readiness at a glance.
* **Security Engineer / SOC Analyst** — agent-level findings, suspicious sessions, recent PII events.
* **Platform / SRE / DevOps Engineer** — coverage health (scanners alive, applications onboarded), inventory deltas.
* **Compliance / GRC / Risk Officer** — control-coverage status against SOC 2 / EU AI Act / NIST AI RMF, evidence gaps.
* **Developer / ML Engineer / AI Engineer** — pre-deploy signals on the specific workloads you own — CVEs, missing A2AS components, risky tool exposures.

Role is a switch — flip it at any time from the Briefing header, and the same underlying data is re-projected through the new facet.

## What it puts in front of you

* **Platform posture** — a horizontal flow visualising the **Discover → Observe → Govern** arc, with live counts at each stage (assets discovered, sessions observed, findings under audit, evidence packs generated). It is the same arc described in [Overview](overview.md#the-problem-ai-hypervisor-solves) but rendered against current-tenant numbers — useful for *"are all the moving parts actually moving."*
* **Today's findings** — the most consequential signals from the period: new shadow vendors detected, PII flows of note, fresh CVEs against components you run, suspicious sessions worth opening.
* **Drill-in cards** — short summaries of single subjects (a specific agent's recent activity, a tool's recent invocations, an open Red Team proposal, a compliance gap), each of which expands in place when you focus on it.
* **Ask-the-Agent chat strip** — see below.

## Ask the Agent

The chat strip at the bottom of the Briefing tray is your shortcut from *"I see a finding I do not understand"* to *"I know what it means and what to do next"* — without leaving the dashboard. The agent is scoped to data your tenant has observed and is good at:

* **Explaining a finding** — *"What does this CVE actually mean for the `checkout-bot` app?"*
* **Why something is flagged** — *"Why is `support-bot` calling Cohere when our policy is OpenAI-only?"*
* **Suggesting a tailored fix** — *"How should I remediate the PII leak in the `internal-rag` flow?"*
* **Summarising recent activity** — *"What changed in our AI estate this week?"*
* **Pointing you to the right UI surface** — *"Where do I see every session that touched a credit card today?"*

It reads, explains, and recommends — it does not run actions on your behalf. Promotion, blocking, and configuration changes go through their own UI controls.

## Cross-references

Briefing is a triage surface — most cards drill into the canonical view that owns the detail:

| Briefing element | Where the canonical detail lives |
|---|---|
| Platform-posture stage | The surface that owns that stage ([Heatmap](heatmap.md) for Discover, [Data Tracks](data-tracks.md) for Observe, [Reports](reports.md) for Govern) |
| Today's findings card | The affected entity in [Registry](registry.md) or session in [User Tracks](user-tracks.md) |
| Tool invocations card | [Registry](registry.md), Tools tab |
| Compliance card | [Reports](reports.md) |

## Settings that affect Briefing

* The cards that appear depend on what the tenant has observed; new applications onboarded via Helm and labelled `higgs.scan=enabled` start contributing within ~30 seconds (see [Labels and Annotations](annotations.md)).
* The Bedrock-Claude integration powering Ask the Agent is on by default and can be disabled in [Settings](settings.md).
