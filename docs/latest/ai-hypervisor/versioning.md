# Versioning <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="intro"></a>
## The one number that matters

Your **AI Hypervisor Platform version** is the single version that describes the product you use —
the UI, its API, and the data layer behind them. It is what the **Settings → Data → Platform version**
panel shows, what **What is new** groups its entries by, and what **Settings → Data → Platform updates**
upgrades. When support asks "what version are you on," this is the number.

It is a standard three-part **`MAJOR.MINOR.PATCH`** number (for example `1.60.24`). No `v` prefix.

<a id="navigation-in"></a>
## How you got here

In the product, the **?** next to **Platform version** in **Settings** opens this page. It explains
what that number means and why other parts of the product show their own, different numbers.

<a id="layout"></a>
## Why you may see other numbers

The platform is assembled from components that each ship on their own schedule, so each keeps its
own version line. You only need the Platform version above; the others are shown where they are
relevant, labelled for what they are:

| You will see it as | Component | What it is |
|---|---|---|
| **AI Hypervisor (Platform)** | the `aih` release — UI, API, ClickHouse | the number you name |
| **Scanner** | the in-cluster eBPF scanner (`aih-scanner`) | upgraded from **Settings → Scanners → Scanner auto-update** |
| **Control plane** | signup / login / provisioning | operated by Wallarm; not user-upgraded |
| **Endpoint agent** | the macOS / Android agent | versioned with its own installer |

These numbers are **not** meant to match each other. A Scanner on `2.11.0` and a Platform on
`1.60.24` is normal — they are different components, not a contradiction.

<a id="how-to-use-it"></a>
## What a version change means

The Platform version follows semantic versioning, and the parts carry a promise:

- **MAJOR** (`2.0.0`) — a breaking change to a stable, documented contract (an API you call, an
  export format, a data shape). We call these out ahead of time and in **What is new**, where the
  entry is flagged **breaking**. A release that contains a breaking change is always a MAJOR.
- **MINOR** (`1.61.0`) — new, backward-compatible capability. Nothing you depend on is removed.
- **PATCH** (`1.60.25`) — fixes and hardening only; no new surface, nothing removed.

The version number is derived from what actually changed: a breaking commit forces a MAJOR, a new
feature forces a MINOR, and anything else is a PATCH — so the number is a promise, not a running
counter.

**Deprecation:** when something stable is going away, it is announced in a MINOR release, keeps
working for at least one MINOR cycle, and is removed no sooner than the next MAJOR — never silently.
Pre-release builds carry a `-rc.N` suffix (`1.61.0-rc.7`) and are not covered by these promises.

<a id="compatibility"></a>
## Your version and what it requires

One Platform version pins the component versions it was tested with, and the install overlay each
substrate needs. This table is generated from the shipped charts, not written by hand:


**Current product version:** AI Hypervisor `1.69.0` — the `aih` chart line (UI, API, ClickHouse).

This product version was built and tested against these component versions:

| Component | Chart | Version |
|---|---|---|
| AI Hypervisor (platform) | `aih` | `1.69.0` |
| Scanner component | `aih-scanner` | `2.18.0` |
| Control plane — auth | `aih-auth` | `1.35.0` |
| Control plane — provisioner | `aih-provisioner` | `1.35.0` |

Installing or upgrading applies the overlay for your substrate on top of `values.yaml`:

| Substrate | Required overlay |
|---|---|
| Azure AKS | `values-aks.yaml` |
| Local development | `values-dev.yaml` |
| Amazon EKS | `values-eks.yaml` |
| Gateway API ingress | `values-gateway.yaml` |
| Google GKE | `values-gke.yaml` |
| On-prem / self-managed | `values-onprem.yaml` |
| Wallarm hypervisor pool (us-east-2) | `values-us-east-2.yaml` |


<a id="release-notes"></a>
## Release notes

Where to read what actually changed in a release:

- **What is new** (profile menu) — the user-facing highlights, grouped by the Platform version that
  shipped them. A change that needs action from you is flagged **breaking**.
- The full per-release changelog ships with the platform as `CHANGELOG.md` — one section per
  release, newest first.

<a id="navigation-out"></a>
## Where to read each version in the product

- **Settings → Data → Platform version** — your Platform number + build commit.
- **What is new** (profile menu) — changes, grouped by the Platform version that shipped them.
- **Settings → Data → Platform updates** — current vs. available Platform version, and your update channel.
- **Settings → Scanners → Scanner auto-update** — the Scanner version and its upgrade.

If two of these show different numbers, that is expected — they are naming different components, per
the table above.
