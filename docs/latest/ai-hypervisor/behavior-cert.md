# Behavior Cert <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a href="briefing.md#role-and-altitude"><img src="../../images/role-security.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-platform.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-compliance.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-developer.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a>

**Behavior Cert** is the per-agent A2AS (Agent-to-Agent Security) Behavior Certificate surface. A Behavior Certificate is a signed YAML declaration of what an agent is *intended* to do: the tools it may call, the data it may touch, the destinations it may reach. AI Hypervisor compares the agent's runtime behaviour against the declared cert and flags drift as a finding.

The view sits as a sub-panel inside the per-agent Tray on the [Briefing](briefing.md). It is the operator's interface for the A2AS framework ([a2as.org](https://a2as.org)): Wallarm provides the runtime enforcement layer that watches an A2AS-certified agent against its declared cert.

## States per agent

The view shows one of three states for every agent AI Hypervisor has discovered:

* **No cert.** The agent has been discovered but is not certified. The view offers a *Draft* action that auto-generates a cert proposal from the agent's observed behaviour.
* **Draft.** A cert is drafted (usually auto-proposed by the platform from recent traffic) and waiting for a human to sign. You review the declared actions and the proposed scope, edit if needed, and *Sign* to activate.
* **Signed.** The cert is in force. The view shows when it was signed, the current version, and the recent violation count (cases where the agent's behaviour drifted from the cert).

Drift between a signed cert and observed behaviour surfaces as a Behavior-cert drift [Pattern](patterns.md) and as a finding on the dimension heatmap. When the Policies card is enabled for your tenant, drift also seeds a proposal in the inline enforcement rule set — see [Enforcement](enforcement.md).

## Why this matters

A2AS certs make agent behaviour contractually explicit. Without one, every new agent is a black box: you find out what it does by tailing logs after the fact. With a signed cert, every drift is a contract violation surfaced as a finding within seconds. The audit benefit follows: for an EU AI Act Article 14 (human oversight) review, the signed cert is evidence of declared scope, and the violation log is evidence of monitoring.

## Cross-references

| From Behavior Cert | You land in |
|---|---|
| Agent identity | [Registry](registry.md), agent detail |
| Cert violation (finding) | [Findings](findings.md), affected agent |
| Drift-triggered rule proposal | [Enforcement](enforcement.md), inline rule set |
| Cert mentioned in audit pack | [Compliance](compliance.md), control coverage |
