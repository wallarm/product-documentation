# Settings <a href="overview.md#subscription"><img src="../../images/ai-hypervisor-tag.svg" style="border: none;"></a>

Settings is the tenant-level admin surface — everything that is configured once per tenant rather than per page: who has access, how the scanners are running, and the platform's own configuration knobs. This page documents what each section owns.

## Demo / Onboarding

Controls how long the tenant stays in the initial demo / proof-of-value mode before transitioning to standard billing semantics. Default `7d`; accepts duration strings (`24h`, `48h`, `7d`, `14d`). This is a sales-engineering knob — most customers do not change it after provisioning.

## Custom Layers

Pins the stack layers you want surfaced first across the platform. The full layer list matches the **Full-stack** lens on [Heatmap](heatmap.md) (Interface, Identity, Orchestration, Cognitive firewall, Inference, Protocol, Connectivity, Knowledge, Infrastructure). Pinned layers render at the top of per-application stack views; unpinned layers are still observed.

The selection is per-user (stored in browser `localStorage`); your colleagues are not affected by what you pin. The section also lists every application discovered by the topology endpoint with its current `app_tag` annotation (from `aih.wallarm.com/tag` on the pod — see [Labels and Annotations](annotations.md)) so you can see which apps still need an operator tag.

## Team Members

Manages who can sign in to your tenant. Two roles, canonical:

| Role | Capabilities |
|---|---|
| **Owner** | Full access. Invites and removes members, changes all settings. Exactly one owner per tenant; the owner cannot be removed. The user who created the tenant is the initial owner. |
| **Member** | Full read-write access to the product (Heatmap, Registry, User Tracks, Data Tracks, Reports, and so on). Cannot remove other members. |

There is no separate viewer, editor, or admin role — once a person is in the tenant, they see everything the tenant sees. The owner invites new members by email; a join link expires after a fixed period and a fresh invite is needed if it does.

Ownership transfer is not yet supported in the UI.

## Backend Build

Read-only panel showing the current backend version, build commit, and feature flags active for your tenant. Include the build hash in support tickets.

## Cluster Infrastructure

Lists every HIGGS Scanner that has reported to your backend, grouped by Kubernetes node, with per-scanner identity, version, architecture (`amd64` / `arm64`), uptime, last pulse time, observed application count, and an *update available* indicator when the chart has a newer version than the running pod.

Per-scanner actions cover **pause / resume** (stop observing without killing the pod), **rescan now** (immediate full scan instead of waiting for the next cycle), and **terminate** (kill the scanner pod — the DaemonSet recreates it). Tenant-wide equivalents (**Terminate all**, **Rescan all**) apply the same actions across every scanner — useful after a config change you want to apply quickly. Per-scanner runtime metrics (memory, CPU, scan duration, pulse count) help triage a slow or failing scanner.

## Scanner Targets

Lists every workload the scanner is currently observing — one row per pod, grouped by application and namespace, with the current scan state (`idle`, `scanning`, `failed`), the time of the last completed scan, and the number of packages the scanner found inside the pod on that scan.

The list is the per-workload view of *"what is the scanner actually looking at."* The **Cluster Infrastructure** section above is the inventory of scanner pods themselves (one per node); **Scanner Targets** is the inventory of customer workloads each scanner has been told to observe via the `higgs.scan=enabled` label.

Use this section to triage:

* *"I labelled my pod 30 minutes ago but it does not appear in [Registry](registry.md) yet."* — Find it here; if the row exists with `state: idle` and a recent `last_scan`, the scanner has already covered it and Registry should refresh on the next reconcile. If the row is missing, the label has not propagated.
* *"The scanner keeps reporting zero packages for this app."* — Stale scanner version vs. backend signature mismatch is the most common cause. Check the scanner version in [Cluster Infrastructure](#cluster-infrastructure) and upgrade via Helm (see [Install HIGGS Scanner](deploy.md#upgrading-the-scanner)).
* *"This namespace should be scanned but the row is missing."* — Verify the `higgs.scan=enabled` label is on the namespace or the individual pod (see [Labels and Annotations](annotations.md)).

For deploy-time configuration not in this view, see [Chart Values](chart-values.md) (Helm values) and [Labels and Annotations](annotations.md) (pod and namespace labels).
