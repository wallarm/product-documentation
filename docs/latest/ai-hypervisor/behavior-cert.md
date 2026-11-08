# Behavior Cert <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a href="briefing.md#role-and-altitude"><img src="../../images/role-security.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-platform.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-compliance.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a> <a href="briefing.md#role-and-altitude"><img src="../../images/role-developer.svg" class="non-zoomable" style="border: none; vertical-align: middle; margin-right: 4px;"></a>

**Behavior Cert** is the per-agent A2AS (Agent-to-Agent Security) Behavior Certificate surface. A Behavior Certificate is a signed YAML declaration of what an agent is *intended* to do: the tools it may call, the data it may touch, the destinations it may reach. AI Hypervisor compares the agent's runtime behavior against the declared cert and flags drift as a finding.

The view sits as a sub-panel inside the per-agent Tray on the [Briefing](briefing.md). It is the operator's interface for the A2AS framework ([a2as.org](https://a2as.org)): Wallarm provides the runtime enforcement layer that watches an A2AS-certified agent against its declared cert.

## States per agent

The view shows one of three states for every agent AI Hypervisor has discovered:

* **No cert.** The agent has been discovered but is not certified. The view offers a *Draft* action that auto-generates a cert proposal from the agent's observed behavior.
* **Draft.** A cert is drafted (usually auto-proposed by the platform from recent traffic) and waiting for a human to sign. You review the declared actions and the proposed scope, edit if needed, and *Sign* to activate.
* **Signed.** The cert is in force. The view shows when it was signed, the current version, and the recent violation count (cases where the agent's behavior drifted from the cert).

Drift between a signed cert and observed behavior surfaces as a Behavior-cert drift [Pattern](patterns.md) and as a finding on the dimension heatmap. When the Policies card is enabled for your tenant, drift also seeds a proposal in the inline enforcement rule set — see [Enforcement](enforcement.md).

## Kubernetes API and Secrets

A cert can also limit two things an agent reaches without going through an AI provider.

Both need AI Hypervisor scanner 3.1.0 or later. Until a connected scanner runs 3.1.0 or later, the cert form does not show these fields and the **Govern Kubernetes API access by cert** switch cannot be turned on; a cert that already carries them keeps them editable.

### Kubernetes API access

The cert form's **Kubernetes API (control plane)** field has three values:

* **Not governed** — the agent reaches the Kubernetes API as before.
* **Allow** — the agent may call the API.
* **Deny** — the agent's own pod refuses new connections to the Kubernetes API service, to port 6443 on any address, and to the kubelet ports 10250, 10255, 10257 and 10259. In monitor mode the connections go through and each attempt is recorded. Every attempt is reported as **Kubernetes API access the cert denies**.

**Deny** applies only while **Settings › Preferences › Govern Kubernetes API access by cert** is on. It is off by default. Turning it off stops every such rule at the next sync, without re-signing. A drafted cert sets **Allow** for an agent seen calling the API, so turning the setting on does not cut off an agent that needs the API.

### Secrets

The **Secrets** section binds a Kubernetes Secret key to the destinations it may be sent to. **This agent reads** lists the Secrets the agent's pods use (names only). A request that carries a bound Secret to any other destination is reported as **Secret sent outside its binding**, and is refused in enforce mode. The check finds the value as is, base64, base64url, hex or URL-encoded, in headers and body. The value is never stored: the scanner reads it from the agent's own pod and passes only lengths and hashes to the proxy.

A drafted cert binds a Secret the agent sent to exactly one destination during the observation window.

**Pod holds** chooses what the pod gets:

* **The real value** — the pod reads the Secret as before, and only egress is checked.
* **A placeholder** — the pod receives `aih:resolve:<namespace>/<name>/<key>:<nonce>` instead of the value, in environment variables and in mounted Secret files. The proxy puts the value into a request only when the destination is one of the bound ones. Anywhere else the placeholder is sent unchanged, so the request fails at the destination and the value never leaves. This needs the scanner chart's `broker` capability, with the Secret listed in `broker.secrets` (see [Chart values](chart-values.md)). Pods get the placeholder when they are created, so restart the agent after signing.

#### Secrets on Amazon ECS and AWS Fargate

ECS has no Kubernetes Secret, so the task definition supplies what the scanner needs. **Settings › Scanners › AWS Fargate** shows the add-on. Scanner 3.2.0 or later is required.

1. Give each secret to the `higgs-scanner` container as `AIH_SECRET__<NAME>`, from AWS Secrets Manager or Systems Manager Parameter Store (`secrets` with `valueFrom`). The task execution role needs read access to it.
2. In the cert, refer to it as namespace `ecs`, Secret = the task family, key = `<NAME>`.
3. Choose what the app container gets:
    * **The real value** — keep the app's own variable as it is. Only egress is checked.
    * **A placeholder** — set the app's variable to `aih:resolve:ecs/<task family>/<NAME>:0` and add `CAP_BROKER=true` to the `higgs-scanner` container. The proxy puts the value into a request only toward the bound destinations.

The scanner reports which `AIH_SECRET__` secrets the task holds, so **This agent reads** lists them, and a drafted cert binds them as on Kubernetes. A placeholder needs a task without `"pidMode": "task"`, the package-scan add-on: with a shared process namespace the app could read the scanner container's environment, so the scanner does not provide values and the placeholder fails at the destination.

## Why this matters

A2AS certs make agent behavior contractually explicit. Without one, every new agent is a black box: you find out what it does by tailing logs after the fact. With a signed cert, every drift is a contract violation surfaced as a finding within seconds. The audit benefit follows: for an EU AI Act Article 14 (human oversight) review, the signed cert is evidence of declared scope, and the violation log is evidence of monitoring.

## Cross-references

| From Behavior Cert | You land in |
|---|---|
| Agent identity | [Registry](registry.md), agent detail |
| Cert violation (finding) | [Findings](findings.md), affected agent |
| Drift-triggered rule proposal | [Enforcement](enforcement.md), inline rule set |
| Cert mentioned in audit pack | [Compliance](compliance.md), control coverage |
