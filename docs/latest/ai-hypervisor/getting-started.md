# Getting Started <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="intro"></a>
## What this is

Your workspace starts empty. Nothing appears until a scanner reports from your own
infrastructure. This page takes you from a new workspace to seeing your own AI applications:
connect a scanner, choose what it watches, and check that data arrives.

The scanner runs in your environment. It records AI traffic and the dependencies of your
applications and sends the results only to your workspace.

<a id="layout"></a>
## What you see on day one

- **First sign-in.** **Welcome to AI Hypervisor** asks for your role: **Executive**,
  **Security Engineer**, **Platform Engineer**, **Compliance** or **Developer**. Pick one and
  click **Continue**. The role only sets how **Briefing** is arranged.
- **Briefing** shows **No applications scanned yet** and a **Scanner deploy command** box with
  the Kubernetes commands. They already contain your workspace address and your scanner key. For
  AWS ECS on EC2, AWS Fargate or a macOS endpoint, open **Settings → Scanners** — the **Scanner
  deploy command** there has a tab for each.
- Every other page stays empty until the scanner reports.
- **Code** and **Mirroring** are hidden from the sidebar by default. Turn them on in
  **Settings → Features**.

To open Settings: click your name at the bottom of the sidebar, then **Settings**.

<a id="how-to-use-it"></a>
## Connect a scanner

Choose where your AI applications run. The exact commands, with your values filled in, are in
**Settings → Scanners** under **Scanner deploy command**, in four tabs: **Kubernetes**,
**AWS Fargate**, **AWS ECS on EC2** and **macOS endpoint**.

The commands contain your scanner key. Treat it as a secret.

### Kubernetes

You need `kubectl` and `helm` connected to the cluster, and permission to run a privileged
DaemonSet.

The app's install block offers two ways — **Helm** (the key in a Kubernetes Secret) and **GitOps
(ArgoCD)** (see below). Each shows its own numbered steps; the steps here are the Helm ones.

<a id="scanner-namespace"></a>**Install into namespace.** The Kubernetes namespace the scanner
itself runs in. `higgs-system` works on any cluster; change it only if your cluster keeps tools in
another namespace, and every command (and the GitOps Application) follows. It is not a name for the
cluster. **Namespaces to scan** is a different input: the namespaces your AI applications run in,
which the last step labels (step 5).

<a id="cluster-name"></a>**Cluster name (optional).** What AI Hypervisor calls this cluster
everywhere — Infrastructure, the graphs, filters and reports — for example `audit`. Leave it empty
to keep the name the scanner detects (on many clusters there is none, and the app falls back to a
namespace or the cloud location). 1-63 characters: letters, digits, space, `.`, `_`, `-`. It is a
label only: renaming a cluster later (`helm upgrade … --set clusterName=…`, or a Git commit) never
splits or merges its data. Fargate and ECS take it as the `CLUSTER_DISPLAY_NAME` environment value.

1. Add the Helm repository:
   `helm repo add wallarm https://charts.wallarm.com && helm repo update`
2. Install the scanner. Copy this command from the app — it carries your workspace address and
   keeps the key off the command line:
   `helm upgrade --install aih-scanner wallarm/aih-scanner --version <version> --set config.backendUrl="<your workspace>" --set existingSecret.name=aih-scanner-private-key`
   The chart creates the namespace `higgs-system` and runs one scanner pod on each node.
3. Store the key in a Kubernetes Secret (copy it from the app too):
   `kubectl create secret generic aih-scanner-private-key -n higgs-system --from-literal=scanner-private-key="<your key>"`
   The pods start as soon as the Secret exists. A secret manager (Vault, External Secrets, Sealed
   Secrets) can produce this Secret instead.
4. Check the scanner is running: `kubectl get pods -n higgs-system`. The pods should be
   **Running**.
5. Choose what to watch. **The scanner records nothing until you opt a namespace in.** Type the
   namespaces your AI applications run in under **Namespaces to scan**; the app builds one command
   per namespace, for example `kubectl label namespace payments higgs.scan=enabled`.
   The scanner re-reads labels every 60 seconds.

**Monitor or Enforce.** Put one of these labels on each namespace:

| Label | Mode | What it does |
|---|---|---|
| `higgs.scan=enabled` | Monitor | Records traffic, sessions and personal data. Never blocks anything. |
| `higgs.io/enforce=enabled` | Enforce | Everything Monitor does, plus blocking by your policies. |

Blocking needs the scanner's proxy. To use Enforce, turn on **Enable blocking** under step 2
before you copy the install command: it adds `--set proxy.enabled=true` and changes the opt-in
step to the Enforce label.

**What works without a restart.** Labeling a namespace never restarts anything, and never breaks
a running pod:

| | Pods running before you labeled | Pods created after |
|---|---|---|
| Discovery, sessions, personal data on HTTPS (OpenSSL, Go, Java, GnuTLS) | Yes, within a minute | Yes |
| Destinations and outbound requests of Rust apps using rustls | Yes, within a minute | Yes |
| Destination policy, kill session | Yes | Yes |
| Content-level policy on HTTPS (body inspection, redaction, prompt blocking) | After a restart | Yes |

A running pod does not trust the proxy's certificate, so the proxy passes its HTTPS through
without decrypting it until the pod restarts. Nothing breaks either way: a connection the proxy
cannot decrypt is passed through, and connection-level policy still applies.

**Settings → Scanners** shows, per app, what the proxy actually did with its HTTPS in the last
15 minutes (scanner 2.19.0 and later):

| Badge | Meaning | What to do |
|---|---|---|
| **Content inspected** | The proxy decrypted the app's HTTPS. Content-level policy applies. | Nothing. |
| **Connection-level · N pods** | The pods started before they were opted in, so they do not have the proxy's certificate. | Restart them (below). |
| **Not inspected · N pods** | The app's TLS library rejects the proxy's certificate even though the pod has it, for example a client that only trusts its own built-in roots or pins certificates. Its HTTPS is passed through. | A restart does not help; the pods are listed so you can check the client's trust settings. |
| **Partly inspected** | Some pods are decrypted, others reject the certificate. | As above, for the listed pods. |
| **No HTTPS yet** | The proxy has not seen an HTTPS connection from the app. | Nothing. |

To restart the pods that need it, either expand the app and click **Restart to inspect content**,
or in **Registry** click **Adopt** on the namespace. Both are rolling restarts of the Deployments,
StatefulSets and DaemonSets. You can also restart them yourself, for example
`kubectl rollout restart deployment -n <your-namespace>`.

Opting a namespace in sets its Pod Security level to `privileged`, because the scanner's agent
needs it.

**Opt in from the app instead.** A namespace whose pods call AI services appears under
**Registry → Shadow** even before you label it — the scanner reads cluster DNS for AI provider
domains. Click **Monitor** or **Enforce** on that namespace. It takes effect on the scanner's next
cycle. **Revert** removes it. When **Supply Chain** is empty and the scanner has seen a
namespace calling AI services, it offers the same two buttons for that namespace.

If your cluster's CoreDNS configuration is managed elsewhere (for example by GitOps), the
scanner's DNS logging change can be overwritten and **Shadow** stays empty. Label namespaces with
`kubectl` instead.

### Kubernetes with GitOps (ArgoCD / Flux)

Git holds the chart version and values; the key never goes into Git. **Settings → Scanners →
Kubernetes** builds the complete ArgoCD Application — commit it as it is (scanner 2.17.3 and later).

1. Set **Install into namespace** if you keep the scanner somewhere other than `higgs-system`.
2. Pick the **Key source**: a Secret your tooling creates (`aih-scanner-private-key`, key
   `scanner-private-key`), the External Secrets Operator, the Vault Secrets Operator, Sealed Secrets
   or the Vault agent injector. Fill in the names it asks for (your secret store, Vault path); the
   copy button appears when the Application is complete.
3. Commit the Application. What it sets, and why:
   - `gitops: true` — every render is identical. The proxy CA, the internal tokens and the webhook
     certificate are created once by a PreSync Job; the webhook writes its own CA into its
     configuration. No cert-manager and no certificate values needed.
   - `namespace.create: false` with `syncOptions: [CreateNamespace=true]` and the
     `pod-security.kubernetes.io/enforce: privileged` label — the namespace must exist before that
     Job runs.
   - The in-cluster upgrader stays off: Git owns the version.
4. Label the namespaces to scan (step 5 above) — in Git as well.
5. Upgrade by changing `targetRevision` in Git; **Settings → Scanners** shows GitOps-managed
   scanners the `targetRevision` to set.
6. Rotate the key in your secret manager; the scanners pick it up without a restart. Give each
   cluster or team its own key (**Settings → Scanners → Scanner keys → Add key**) so one can be
   rotated or revoked without touching the others.

Flux runs a real `helm install`, which can look objects up: it needs neither `gitops: true` nor
the namespace settings. Also settable: your own proxy CA (`proxy.ca.existingSecret`), your PKI for
the webhook (`webhook.tls.certManager` or `webhook.tls.existingSecret`), pod annotations and labels
(`podAnnotations`, `podLabels`), metadata on the key Secret (`secret.annotations`,
`secret.labels`) and extra env sources (`extraEnvFrom`).

### AWS ECS on EC2

1. Copy the scanner task definition from the app. Replace the `<paste …>` spot with your ECS
   task execution role ARN.
2. Register it and create the DAEMON service with the two commands shown. One scanner runs on
   each instance; new instances are covered automatically.
3. Opt applications in: add `"dockerLabels": { "higgs.scan": "enabled" }` to each task
   definition you want scanned.

Instances need an ECS-optimized Amazon Linux 2023 AMI and a security group that allows outbound
traffic. For production, move `SCANNER_PRIVATE_KEY` out of the task definition into AWS Secrets
Manager and reference it with `secrets[].valueFrom`.

### AWS Fargate

Fargate has no hosts to run a scanner on, so the scanner runs as extra containers inside your
application's task.

1. Copy the containers JSON from the app into your application's ECS task definition.
2. Replace the two `<paste …>` spots: your ECS task execution role ARN and your application's
   container image. If your application does not listen on port `8080`, change `8080` in
   `AppPorts` and `portMappings`.
3. Register the task definition. Your service redeploys automatically.

Optional: to also scan dependencies for known vulnerabilities, merge the add-on shown in the app
(`"pidMode": "task"` and the `SYS_PTRACE` capability). Skip it if your account does not allow
`pidMode`. **Registry → Shadow** onboarding does not apply to Fargate.

### macOS endpoint

Records AI traffic from a Mac, for example a developer laptop.

1. Install the signed package your admin gives you:
   `sudo installer -pkg AIHDiscoveryHost.pkg -target /`
2. Open **System Settings → Privacy & Security**. Click **Allow** for the "Wallarm, Inc." system
   extension, then allow it to filter network content.
3. Point it at your workspace (copy the command from the app):
   `sudo defaults write /Library/Preferences/com.wallarm.aih BACKEND_URL "<your workspace>"`

The Mac enrolls itself — no key or account to enter. It appears in your workspace within a
minute. Its AI calls show up in **Traffic** and **Topology**, and per person and program in
**Egress** (which only endpoints feed).

<a id="check-data"></a>
## Check that data arrives

1. Open **Settings → Scanners**. Under **Scanner Targets**, the header shows how many scanner
   daemons are online and how many applications they monitor. Each opted-in application is a
   row; a new row shows **No scan data yet** until its first scan uploads.
2. As the scanner detects your applications, they appear in **Registry** (agents, MCP servers,
   LLMs, APIs, data sources) and **Topology**. After the first scan, their dependencies and known
   vulnerabilities appear in **Supply Chain**.
3. **Traffic** fills only when an application makes AI calls — LLM requests, MCP or tool calls.
   An application that makes no AI calls has no sessions.
4. **Briefing** fills once there is something to rank.

Most pages have an **application dropdown** at the right of the page title. **All applications**
shows everything; pick one application to see only its data. Applications are grouped by where
they run, for example **Kubernetes · <your cluster>**.

Nothing appears? Check, in this order:

1. The scanner pods are **Running**: `kubectl get pods -n higgs-system`.
2. The namespace carries the label: `kubectl get namespace <your-namespace> --show-labels`.
3. The scanner can reach your workspace address over outbound HTTPS.

## Add more sources (optional)

- **Source code.** Turn on **Code** in **Settings → Features**, then connect your repositories
  on the **Code** page. The switch shows the page; scanning also needs Code enabled for your
  workspace deployment — if connected repositories stay **Pending**, ask Wallarm support. See
  [Code](code.md).
- **Cloud accounts.** Turn on **Mirroring** in **Settings → Features**, then click
  **+ Add Account** on the **Mirroring** page. See [Mirroring](discovery.md).
- **Teammates.** Open **Settings → Data**, click **Team Members**, type an address into
  **Invite by email**, pick a role and click **Invite**.

## Finding help

Every page has a **?** icon next to its title. It opens the guide for that page. All guides are
listed in the [documentation index](overview.md).

<a id="navigation-out"></a>
## Where to go next

- [Registry](registry.md) — the inventory of what the scanner found.
- [Traffic](user-tracks.md) — every AI session, step by step.
- [Briefing](briefing.md) — what needs attention, ranked.
- [Settings](settings.md) — scanners, features, team and workspace preferences.

<a id="navigation-in"></a>
## How you get here

- The **?** next to **No applications scanned yet** on **Briefing**.
- The **?** next to **Scanner deploy command** in **Settings → Scanners**.
