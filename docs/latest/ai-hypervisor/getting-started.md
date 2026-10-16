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
- **Code** and **Discovery** are hidden from the sidebar by default. Turn them on in
  **Settings → Features**.

To open Settings: click your name in the sidebar, then **Settings**.

<a id="how-to-use-it"></a>
## Connect a scanner

Choose where your AI applications run. The exact commands, with your values filled in, are in
**Settings → Scanners** under **Scanner deploy command**, in four tabs: **Kubernetes**,
**AWS Fargate**, **AWS ECS on EC2** and **macOS endpoint**.

The commands contain your scanner key. Treat it as a secret.

### Kubernetes

You need `kubectl` and `helm` connected to the cluster, and permission to run a privileged
DaemonSet.

1. Add the Helm repository:
   `helm repo add wallarm https://raw.githubusercontent.com/wallarm/helm-charts/main && helm repo update`
2. Install the scanner. Copy this command from the app — it carries your workspace address and key:
   `helm upgrade --install aih-scanner wallarm/aih-scanner --version <version> --set config.backendUrl="<your workspace>" --set scannerPrivateKey="<your key>"`
   The chart creates the namespace `higgs-system` and runs one scanner pod on each node.
3. Check the scanner is running: `kubectl get pods -n higgs-system`. The pods should be
   **Running**.
4. Choose what to watch. **The scanner records nothing until you opt a namespace in:**
   `kubectl label namespace <your-namespace> higgs.scan=enabled`
   The scanner re-reads labels every 60 seconds.

**Monitor or Enforce.** Put one of these labels on each namespace:

| Label | Mode | What it does |
|---|---|---|
| `higgs.scan=enabled` | Monitor | Records traffic, sessions and personal data. Never blocks anything. |
| `higgs.io/enforce=enabled` | Enforce | Everything Monitor does, plus blocking by your policies. |

Blocking needs the scanner's proxy. To use Enforce, turn on **Enable blocking** under step 2
before you copy the install command: it adds `--set proxy.enabled=true` and changes step 3 to the
Enforce label. Pods that were already running when you switched a namespace to
Enforce must restart to get the proxy's certificate: in **Registry**, click **Adopt** on the
namespace (a rolling restart of its Deployments, StatefulSets and DaemonSets), or restart them
yourself, for example `kubectl rollout restart deployment -n <your-namespace>`.
Start with Monitor — it needs no restart.

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

Most pages have an **application dropdown** next to the page title. **All applications**
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
- **Cloud accounts.** Turn on **Cloud Discovery** in **Settings → Features**, then click
  **+ Add Account** on the **Discovery** page. See [Discovery](discovery.md).
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
