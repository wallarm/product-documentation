# Shadow AI <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a href="briefing.md#role-and-altitude"><img src="../../images/role-security.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-platform.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-compliance.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-developer.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a>

**Shadow AI** surfaces AI components your organization is using but has not formally approved: vendors a team started consuming without telling security, agents running on unmanaged infrastructure, MCP servers reached over DNS that have no registry footprint.

The view is app-independent. It does not require the workload to be labeled `higgs.scan=enabled`. Shadow AI is detected from external signals that arrive even when the in-cluster scanner has no foothold inside the calling pod. That is the point: the workloads you do not know about are the ones you cannot label.

![AI Hypervisor Shadow AI](../../images/ai-hypervisor/aih-shadow-ai.png)

## Detection signals

AI Hypervisor recognizes shadow AI from four orthogonal signals:

* **DNS queries.** Pods inside your cluster resolving hostnames that match a known AI provider (Anthropic, OpenAI, Bedrock endpoints, Cohere, Mistral, Together). Wallarm's CoreDNS log plug-in feeds these.
* **Cloud audit logs.** Managed AI services consumed via AWS APIs (Bedrock invocations from accounts not in your sanctioned set, SageMaker endpoint usage) recovered from CloudTrail-style sources.
* **Ingress traffic patterns.** Inbound HTTP that matches the request signature of a hosted AI provider's API, suggesting your services are exposing AI capabilities that were not declared.
* **Cross-cluster correlation.** DNS or audit signals from one application pointing at endpoints another application already declared. Catches accidental cross-tenant calls.

Each signal carries enough context to identify the component and the namespace or account it was observed in, but not the per-call payload. That is the trade-off for catching unsanctioned usage you do not have an instrumentation foothold on.

## What the view shows

Shadow AI groups un-governed assets by the namespace where they were observed. The header reads `N un-governed AI assets across M non-AIH namespaces`. Each namespace becomes its own card, labeled **non-AIH namespace** (the namespace does not yet carry the `higgs.scan=enabled` label).

Under each card, the assets are listed with the signal that surfaced them: `dns_detected` for DNS-pattern matches, `llm_egress` when a known provider's request signature was seen, the resolved provider name (`Anthropic`, `OpenAI`, and so on) when the classifier was able to pin it.

## Actions

Each namespace card carries four actions that operate on the whole namespace at once:

* **Monitor** — keep observing without changing anything. Use this when you want the activity logged but are not yet ready to bring the namespace under AI Hypervisor governance.
* **Enforce** — block subsequent un-governed calls from the namespace. The button applies the namespace-quarantine primitive (kernel-level cgroup_skb drop) — see [Enforcement](enforcement.md).
* **Adopt** — bring the namespace under AI Hypervisor governance: the scanner is instructed to start observing the workloads in it as if `higgs.scan=enabled` were set, and the assets graduate out of Shadow AI into [Registry](registry.md).
* **Revert** — undo the last action applied to the namespace.

The actions surface in the [Briefing](briefing.md) Shadow-AI card and in the dedicated **Shadow AI** view.

## Why this matters

Sanctioned governance covers what you declared. Shadow AI is the negative surface: what you did not declare that is still happening. For an EU AI Act Article 10 (data governance) audit, the auditor's first question is *how do you know you did not miss something.* Shadow AI is the answer: every signal AI Hypervisor recovered from outside the sanctioned set, with timestamps and namespaces, ready for review.

## Cross-references

| From Shadow AI | You land in |
|---|---|
| Adopt a namespace | [Registry](registry.md), the namespace's workloads classified as sanctioned assets |
| Enforce on a namespace | [Enforcement](enforcement.md), the namespace-quarantine primitive |
| Investigate a signal | [Debugger](debugger.md), the source events for the asset |
| Compliance evidence | [Compliance](compliance.md), Shadow risk column in [Findings](findings.md) |
