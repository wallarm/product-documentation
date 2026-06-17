# Install HIGGS Scanner <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

The **HIGGS Scanner** (Hypervisor Inspection & GenerativeAI Guarding Scanner) is the only AI Hypervisor component you install in your own environment. The dashboard, backend, and telemetry store are hosted by Wallarm — your scanner uploads to that hosted service over HTTPS.

Onboarding is two steps: **subscribe and get a tenant** through AWS Marketplace, then **install the HIGGS Scanner** as a Helm chart into your own Amazon EKS cluster. This page covers both steps end to end.


## Step 1: Get your tenant

A tenant is your private AI Hypervisor instance: a dedicated dashboard URL, isolated storage, and a unique scanner key. You get one through the AWS Marketplace subscription flow.

1. [Contact Wallarm sales](mailto:sales@wallarm.com) to discuss sizing and receive an AWS Marketplace private-offer link.
2. Accept the private offer in your AWS account. AWS records the entitlement and the Wallarm subscription appears on your AWS bill.
3. Wallarm provisions your tenant on Wallarm-hosted infrastructure and emails you the **tenant URL** (something like `<your-name>.play.hypervisor.wallarm-cloud.com`) and a link to the first-time login screen.

After first-time login, your tenant dashboard opens with the exact Helm commands for the next step, pre-filled with your tenant's `backendUrl` and `scannerPrivateKey`.

## Step 2: Install the scanner

The HIGGS Scanner is a Helm chart you install into the Amazon EKS cluster running your AI workloads. The scanner attaches to processes via eBPF, observes outbound calls, and reports to your tenant.

### Requirements

* **Amazon EKS only** — 1.31 or later, with worker-node kernel 6.1.0 or later

    GKE, AKS, and self‑hosted Kubernetes are not supported.
* Helm 3.12 or later
* `kubectl` configured for the target EKS cluster
* Outbound HTTPS access from worker nodes to your tenant URL on `*.play.hypervisor.wallarm-cloud.com`

### Install commands

Copy the two commands from your tenant dashboard's empty state and run them in a shell with `kubectl` and `helm` configured for the target cluster.

```bash
helm repo add wallarm https://charts.wallarm.com && helm repo update
```

```bash
helm upgrade --install aih-scanner wallarm/aih-scanner \
  --namespace higgs-system \
  --version 2.1.1 \
  --set config.backendUrl="<YOUR_TENANT_URL>" \
  --set scannerPrivateKey="<YOUR_PRIVATE_KEY>"
```

Replace `<YOUR_TENANT_URL>` and `<YOUR_PRIVATE_KEY>` with the values from your dashboard (the commands on the dashboard already contain them).

Both values are tenant-scoped:

* `config.backendUrl` points the scanner at your hosted backend.
* `scannerPrivateKey` authenticates the scanner to your tenant. Treat it as a secret.

[All chart values](chart-values.md)

### What the install creates

The chart deploys the HIGGS Scanner as a DaemonSet (one pod per node) that attaches to target processes via eBPF. Your application pods are not modified.

Wait until every scanner pod reports `Running`:

```bash
kubectl get pods -l app.kubernetes.io/name=aih-scanner -A -w
```

## Step 3: Onboard your workloads

You opt workloads in by labeling pods or namespaces. Once a workload carries the label, the scanner captures its sessions, attributes calls to users, and detects PII on the wire.

**Onboard a single deployment:**

```bash
kubectl label deployment <YOUR_DEPLOYMENT> \
  higgs.scan=enabled \
  --namespace=<YOUR_NAMESPACE>
```

**Onboard a whole namespace:**

```bash
kubectl label namespace <YOUR_NAMESPACE> \
  higgs.scan=enabled
```

The scanner picks up the new label within ~30 seconds and attaches to each pod's processes. In-process introspection covers Python, Go, Node.js, Java, and Ruby; containers running other runtimes are still discovered at the network layer.

!!! note "No restart needed"
    Adding the label does not trigger a pod restart. Instrumentation attaches in place via the scanner DaemonSet.

For all labels and annotations, see [Labels and Annotations](annotations.md).

## Step 4: Verify the install

Open your tenant URL in a browser and sign in. Three checks confirm a healthy install.

1. Open [Briefing](briefing.md). Within a few minutes, the *Findings by dimension* tile populates for the labeled workloads. An empty tile on the first scan is normal; refresh after one to two minutes.
2. Open [Registry](registry.md). The labeled workloads appear as rows, classified by asset type (Agents, MCP Servers, LLMs, APIs, Data). Status reads `active` once traffic has been observed.
3. Open [Topology](topology.md) with a single application selected. Cross-service edges appear as the labeled workloads make outbound calls.

If the tile stays empty for more than five minutes after labeling, see [Troubleshooting](#troubleshooting) below.

## Upgrading the scanner

To upgrade to a newer scanner version, repeat the `helm upgrade --install` command with the new `--version`:

```bash
helm upgrade --install aih-scanner wallarm/aih-scanner \
  --namespace higgs-system \
  --version <NEW_VERSION> \
  --reuse-values
```

The DaemonSet rolls out one node at a time. Scanner restarts do not interrupt observation; events buffer in memory until the new scanner attaches.

## Troubleshooting

**The Findings by dimension tile stays empty after five minutes**

Verify the scanner pods are actually running on every node and reaching the backend:

```bash
kubectl logs -l app.kubernetes.io/name=aih-scanner -A --tail=50
```

Look for lines containing `connected to backend`. Pods that cannot reach the backend log the connection error and retry every five seconds.

Verify your target workload is actually labeled:

```bash
# Check pod-level labels
kubectl get pods -n <YOUR_NAMESPACE> -L higgs.scan

# Check namespace-level labels
kubectl get namespace <YOUR_NAMESPACE> -L higgs.scan
```

**Scanner pods are crashlooping**

Most common cause is a kernel older than 6.1. Check kernel version on the affected node:

```bash
kubectl get node <NODE_NAME> -o jsonpath='{.status.nodeInfo.kernelVersion}'
```

If the kernel is older than 6.1, upgrade the node group's image to a recent Bottlerocket or Amazon Linux 2023 release.

**`Unauthorized` from the scanner**

The `scannerPrivateKey` may have been rotated or mistyped. Open your tenant dashboard, copy the install commands again, and re-run `helm upgrade --install`.

## Next steps

* Review your AI estate in the [Briefing](briefing.md).
* Open the [Registry](registry.md) and promote tolerated entities into the sanctioned baseline.
* Generate your first audit-ready artifact from observed traffic in [Compliance](compliance.md).
