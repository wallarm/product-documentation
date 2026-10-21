# Scanner Installation <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

The **scanner** is the only AI Hypervisor component you install in your own environment. The dashboard, backend, and telemetry store are hosted by Wallarm, and your scanner uploads to that hosted service over HTTPS.

Onboarding is two steps: **subscribe and get a tenant** through AWS Marketplace, then **install the scanner** where your AI applications run. This page covers both steps end to end.

## Step 1: Get your tenant

A tenant is your private AI Hypervisor instance: a dedicated dashboard URL, isolated storage, and a unique scanner key. You get one through the AWS Marketplace subscription flow.

1. [Contact Wallarm sales](mailto:sales@wallarm.com) to discuss sizing and receive an AWS Marketplace private-offer link.
2. Accept the private offer in your AWS account. AWS records the entitlement and the Wallarm subscription appears on your AWS bill.
3. Wallarm provisions your tenant on Wallarm-hosted infrastructure and emails you the **tenant URL** (for example, `<your-name>.play.hypervisor.wallarm-cloud.com`) and a link to the first-time login screen.

After first-time login, **Briefing** shows **No applications scanned yet** and a **Scanner deploy command** box. The commands in it already contain your tenant address and your scanner key. **Settings** → **Scanners** → **Scanner deploy command** has the same commands in four tabs: **Kubernetes**, **AWS Fargate**, **AWS ECS on EC2**, and **macOS endpoint**.

!!! warning "The commands contain your scanner key"
    The scanner key authenticates the scanner to your tenant. Treat it as a secret.

## Step 2: Install the scanner

Choose the tab that matches where your AI applications run.

### Kubernetes

Requirements:

* A Kubernetes cluster, for example Amazon EKS, with Kubernetes 1.29 or later and worker-node kernel 5.10 or later
* `kubectl` and Helm 3.10 or later connected to the cluster, with permission to run a privileged DaemonSet
* Outbound HTTPS access from worker nodes to your tenant URL on `*.play.hypervisor.wallarm-cloud.com`

Steps:

1. Add the Helm repository:

    ```bash
    helm repo add wallarm https://raw.githubusercontent.com/wallarm/helm-charts/main && helm repo update
    ```

2. Install the scanner. Copy the command from your tenant: it carries your tenant address and key.

    ```bash
    helm upgrade --install aih-scanner wallarm/aih-scanner \
      --version 2.11.1 \
      --set config.backendUrl="<YOUR_TENANT_URL>" \
      --set scannerPrivateKey="<YOUR_PRIVATE_KEY>"
    ```

    The chart creates the `higgs-system` namespace and runs one scanner pod on each node. Your application pods are not modified. For every chart value, see [Chart Values](chart-values.md).

3. Check that the scanner is running. The pods must be **Running**:

    ```bash
    kubectl get pods -n higgs-system
    ```

4. Choose what to watch. The scanner records nothing until you opt a namespace in. Proceed to [Step 3](#step-3-onboarding-your-workloads).

### AWS ECS on EC2

1. Copy the scanner task definition from your tenant. Replace the `<paste …>` placeholder with your ECS task execution role ARN.
2. Register the task definition and create the DAEMON service with the two commands shown. One scanner runs on each instance; new instances are covered automatically.
3. Opt applications in: add `"dockerLabels": { "higgs.scan": "enabled" }` to each task definition you want scanned.

Instances need an ECS-optimized Amazon Linux 2023 AMI and a security group that allows outbound traffic. For production, move `SCANNER_PRIVATE_KEY` out of the task definition into AWS Secrets Manager and reference it with `secrets[].valueFrom`.

### AWS Fargate

Fargate has no hosts to run a scanner on, so the scanner runs as extra containers inside your application task.

1. Copy the containers JSON from your tenant into the ECS task definition of your application.
2. Replace the two `<paste …>` placeholders: your ECS task execution role ARN and the container image of your application. If your application does not listen on port `8080`, change `8080` in `AppPorts` and `portMappings`.
3. Register the task definition. Your service redeploys automatically.

To also scan dependencies for known vulnerabilities, merge the add-on shown in your tenant (`"pidMode": "task"` and the `SYS_PTRACE` capability). Skip it if your account does not allow `pidMode`. Opting a namespace in from **Registry** → **Shadow** does not apply to Fargate.

### macOS endpoint

The macOS endpoint records AI traffic from a Mac, for example a developer laptop.

1. Install the signed package your administrator provides:

    ```bash
    sudo installer -pkg AIHDiscoveryHost.pkg -target /
    ```

2. Open **System Settings** → **Privacy & Security**. Click **Allow** for the Wallarm, Inc. system extension, then allow it to filter network content.
3. Point it at your tenant (copy the command from your tenant):

    ```bash
    sudo defaults write /Library/Preferences/com.wallarm.aih BACKEND_URL "<YOUR_TENANT_URL>"
    ```

The Mac enrolls itself with no key or account to enter, and appears in your tenant within a minute. Its AI calls show up in **Traffic** and **Topology**, and per person and program in **Egress**.

## Step 3: Onboarding your workloads

On Kubernetes, you opt workloads in by labeling namespaces (or individual pods). Put one of these labels on each namespace:

| Label | Mode | What it does |
|---|---|---|
| `higgs.scan=enabled` | Monitor | Records traffic, sessions, and personal data. Never blocks anything. |
| `higgs.io/enforce=enabled` | Enforce | Everything Monitor does, plus blocking by your policies. |

```bash
kubectl label namespace <YOUR_NAMESPACE> higgs.scan=enabled
```

The scanner re-reads labels every 60 seconds. In-process introspection covers Python, Go, Node.js, Java, and Ruby; containers running other runtimes are still discovered at the network layer. Opting a namespace in sets its Pod Security level to `privileged`, because the scanner agent needs it.

**Enforce needs the scanner proxy.** Turn on **Enable blocking** in the deploy command before you copy it: it adds `--set proxy.enabled=true` and switches the label to the Enforce label. Labeling never restarts or breaks a running pod. Pods that were already running are observed at once and connection-level policy applies to them, but their HTTPS is decrypted for content-level policy only after they restart and receive the proxy certificate: in **Settings → Scanners**, expand an app marked **Connection-level** and click **Restart to inspect content**, or in **Registry** click **Adopt** on the namespace (a rolling restart of its Deployments, StatefulSets, and DaemonSets), or restart them yourself, for example `kubectl rollout restart deployment -n <YOUR_NAMESPACE>`.

**Opting in from the tenant.** A namespace whose pods call AI services appears under **Registry** → **Shadow** even before you label it, because the scanner reads cluster DNS for AI provider domains. Click **Monitor** or **Enforce** on that namespace; it takes effect on the next scanner cycle. **Revert** removes it. If the CoreDNS configuration of your cluster is managed elsewhere (for example, by GitOps), the DNS logging change of the scanner can be overwritten and **Shadow** stays empty. In that case, label namespaces with `kubectl`.

For all labels and annotations, see [Labels and Annotations](annotations.md).

## Step 4: Verifying the install

Open your tenant URL and sign in. These checks confirm a healthy install:

1. Open **Settings** → **Scanners**. Under **Scanner Targets**, the header shows how many scanner daemons are online and how many applications they monitor. Each opted-in application is a row; a new row shows **No scan data yet** until its first scan uploads.
2. Open [Registry](registry.md) and [Topology](topology.md). Detected applications appear there; after the first scan, their dependencies and known vulnerabilities appear in [Supply Chain](supply-chain.md).
3. Open [Traffic](user-tracks.md). It fills only when an application makes AI calls: LLM requests, MCP calls, or tool calls. An application that makes no AI calls has no sessions.

## Upgrading the scanner

To upgrade to a newer scanner version, repeat the `helm upgrade --install` command with the new `--version`:

```bash
helm upgrade --install aih-scanner wallarm/aih-scanner \
  --version <NEW_VERSION> \
  --reuse-values
```

The DaemonSet rolls out one node at a time.

## Troubleshooting

If nothing appears in your tenant, check in this order:

1. The scanner pods are **Running**:

    ```bash
    kubectl get pods -n higgs-system
    ```

2. The namespace carries the label:

    ```bash
    kubectl get namespace <YOUR_NAMESPACE> --show-labels
    ```

3. The scanner can reach your tenant URL over outbound HTTPS.

**Scanner pods restart repeatedly.** The most common cause is a kernel older than 5.10. Check the kernel version on the affected node:

```bash
kubectl get node <NODE_NAME> -o jsonpath='{.status.nodeInfo.kernelVersion}'
```

If the kernel is older than 5.10, upgrade the node group image to a recent Bottlerocket or Amazon Linux 2023 release.

**The scanner is rejected by the tenant.** The scanner key may have been rotated or mistyped. Copy the deploy command from your tenant again and re-run `helm upgrade --install`.

## Next steps

* Follow [Getting Started](getting-started.md) from a new tenant to seeing your own AI applications.
* Review your AI estate in the [Briefing](briefing.md).
* Open the [Registry](registry.md) and promote tolerated entities into the sanctioned baseline.
* Generate your first audit-ready artifact from observed traffic in [Compliance](compliance.md).
