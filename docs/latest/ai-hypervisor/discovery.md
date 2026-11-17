# Discovery <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

<a id="intro"></a>
## What this is

**Discovery** (title **Cloud Discovery**) connects your AWS accounts. It finds the resources running
in them and can mirror their network traffic to your workspace with AWS VPC Traffic Mirroring, so
you can see AI traffic from workloads that have no scanner installed.

**Discovery** is hidden by default. Turn it on in **Settings → Features → Cloud Discovery (AWS
accounts + VPC Traffic Mirroring)**; it then appears in the sidebar under **Discover**.

<a id="layout"></a>
## What is on the screen

Two tabs: **Accounts** and **Mirroring**.

### Accounts

Two views: **Accounts** and **Schedules**.

- **AWS Accounts** — your connected accounts. **+ Add Account** connects one. Per account:
  **Quick Scan** (scan now), **Multi-Region** (pick regions, **Select All** / **Clear All**, then
  **Start Discovery**) and **Delete**.
- **Recent Discovery Jobs** — each scan's status, with **Logs**. **Refresh** updates the list.
- **Schedules** — **Create New Schedule** (**Account**, **Region**, **Interval (min)**) and
  **Existing Schedules**.

**+ Add Account** asks for:

| Field | Notes |
|---|---|
| **Authentication Type** | **AWS SSO Profile**, **Cross-Account Role (Role ARN)** or **Static Access Keys**. |
| **Account ID**, **Account Name**, **Region** | The account to scan. |
| **AWS Profile** | For SSO profile authentication. |
| **Source Account**, **Role ARN** | For cross-account role authentication. |
| **Access Key ID**, **Secret Access Key** | For static keys. |
| **Enable scheduled discovery scan** | Optional; set **Scan Interval (minutes)**. |

### Mirroring

- **Traffic Mirroring** — **Enable Traffic Mirroring** does the whole setup in one click, showing
  its progress: **Detect endpoints**, **Provision target**, **Create sessions**, **Confirm
  traffic**. **Disable** removes it.
- **HTTP Endpoints** — the endpoints found to mirror.
- **Mirror Sessions** — active mirror sessions.
- **Provisioned Targets** — where mirrored traffic is sent.
- **GWLB Infrastructure** — the AWS Gateway Load Balancer that receives it: **GWLB ARN**,
  **Endpoint Service**, **Target Group ARN**, **Inspection VPC**, **VPC Endpoints**.
- **Logs** — the setup log.

### When this page is empty

**Accounts** is empty until you click **+ Add Account**. **Mirroring** needs a connected account
first. **No discovery jobs yet** and **No active mirror sessions.** mean nothing has run yet.

<a id="how-to-use-it"></a>
## How to use it

### Connect an AWS account
1. Click **+ Add Account** and pick an **Authentication Type**.
2. Fill in the account and the credentials for that type.
3. Optionally tick **Enable scheduled discovery scan** and set an interval.
4. Click **Quick Scan** on the account and watch **Recent Discovery Jobs**.

### Mirror traffic from an account
1. The connected account's credentials need these AWS permissions: `ec2:*TrafficMirror*`,
   `ec2:*VpcEndpoint*`, `ec2:DescribeNetworkInterfaces`, and `elasticloadbalancing:*` for the
   Gateway Load Balancer.
2. Open **Mirroring** and click **Enable Traffic Mirroring**.
3. Wait for **Confirm traffic** to complete.

Only network interfaces of Nitro-based EC2 instances can be mirrored; others are skipped. AWS bills
mirror sessions and the Gateway Load Balancer while they run — click **Disable** when you no longer
need mirroring.

<a id="navigation-out"></a>
## Where to go next

- [Traffic](user-tracks.md) and [Traffic → Flow](traffic.md) — the mirrored traffic, once it
  arrives.

<a id="navigation-in"></a>
## How you get here

- Sidebar → **Discover** → **Discovery** (after turning it on in **Settings → Features**).
- [Getting started](getting-started.md) → **Add more sources**.
