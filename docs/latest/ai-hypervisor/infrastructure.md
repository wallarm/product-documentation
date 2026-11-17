# Infrastructure <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="intro"></a>
## What this is

**Infrastructure** shows where your AI applications run: the clusters, nodes, Fargate tasks and
endpoint devices your scanners report from, how traffic reaches them from the internet, and
whether each scanner is healthy.

Everything here was reported by a scanner. A cluster with no scanner does not appear — absence
means "not observed", not "not there".

<a id="layout"></a>
## What is on the screen

Two tabs: **Clusters** and **Graph**.

### Clusters

One sheet per cluster or device, with what the scanner learned about it:

- **Name**, **Distribution**, **ID**.
- **Cloud provider** — **Provider**, **Region**, **Account**, **Instance types**,
  **Architectures**, **Total CPU**, **Total memory**, **Zones**, **OS image**, **Kernel**.
- **Network** — **CNI**, **DNS**, **Service Mesh**, **Pod CIDRs**, **Service CIDR**, **Ingress**.
- **Deploy technologies** found in the cluster.
- **Security** — **RBAC**, **Cluster roles**, **Network Policies**, **SELinux**, **TLS**.

On Fargate the sheet shows the **Task** (**Launch type**, **Family**, **Revision**,
**Containers**). On an endpoint it shows the **Device** (**Console user**, **Capture mode**,
**MDM managed**).

### Graph

One map of your estate, in tiers: environments, the **Front door** (addresses reachable from the
internet and the entry points behind them), services, nodes, and your scanners with their live
status.

- Environments start collapsed, showing totals of their services and ingresses. Open an
  environment's contents to page through what it holds; long lists end in a **+N more** card.
- Click a card to open it in place. A front-door card shows what reached the applications behind
  it: request rate, errors and status codes, latency, paths, which applications received the
  traffic, callers from inside and **From outside** the cluster, blocks, personal data and threats.
- A scanner card shows its capture coverage, config propagation and enforcement state.

### When this page is empty

- **Clusters**: **No cluster context data yet**.
- **Graph**: **No infrastructure reported yet** — a scanner must finish one discovery cycle first.

Both fill after a scanner reports. See [Getting started](getting-started.md).

<a id="how-to-use-it"></a>
## How to use it

### Check coverage before trusting a quiet page
Open **Clusters** and confirm every cluster you expect is listed. A missing cluster has no
scanner: nothing from it reaches any other page.

### See what the internet can reach
1. Open **Graph**.
2. Click a **Front door** card.
3. Read which applications received the traffic and who called **From outside**.

### Check a scanner's health
On **Graph**, click the scanner's card. For per-application scan status and upgrade commands, use
**Settings → Scanners**.

<a id="navigation-out"></a>
## Where to go next

- [Settings → Scanners](settings.md) — install, upgrade and manage scanners.
- [Traffic → Flow](traffic.md) — which applications talk to which services.

<a id="navigation-in"></a>
## How you get here

- Sidebar → **Observe** → **Infrastructure**.
