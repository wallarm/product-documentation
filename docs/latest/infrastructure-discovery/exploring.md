# Exploring Infrastructure Inventory

Once your cloud accounts are [connected](setup.md) and the first scan completes, the Infrastructure Discovery section in Wallarm Console provides a full view of your cloud resources, their security posture, and configuration changes over time.

## Security & Drift

The **Security & Drift** section is the primary tool for identifying vulnerable configurations across your infrastructure. It is organized into several tabs:

* **Assets** — the resource inventory (see [Inventory view](#inventory-view))
* **Findings** — security findings produced by rules
* **Drift Events** — configuration changes between scans (see [Change tracking](#change-tracking))
* **Policies** — controls for how findings are handled
* **Rules** — conditions that produce findings

### Rules

Rules define conditions that flag potentially risky configurations. Infrastructure Discovery ships with **built-in rules** and lets you add your own **custom rules** with the **Add rule** button on the Rules tab. Built-in rules check for common issues such as:

* Security groups open to the internet, including SSH, RDP, and database ports
* Compute instances with public IP addresses
* Internet-facing load balancers
* Load balancer listeners that serve HTTP without redirecting to HTTPS
* EKS clusters with a public API endpoint or without secrets encryption
* Deletion of critical infrastructure resources
* Misconfigured or stale Amazon Bedrock resources, such as agents without instructions or knowledge bases without storage

Each rule match produces a **finding** with a severity level (Critical, High, Medium, Low, Info).

### Findings

The **Findings** tab lists every finding produced across your infrastructure. Each finding shows:

* **Severity** — Critical, High, Medium, Low, or Info
* **Status** — Open, Resolved, or Dismissed (a finding is resolved automatically when the underlying issue is no longer detected, and dismissed when a policy suppresses it)
* **Source** — where the finding came from: **Infrastructure Discovery** for Wallarm's own rules, or **AWS Security Hub** for findings imported from AWS security services (Amazon GuardDuty, Amazon Inspector, IAM Access Analyzer, Amazon Macie, AWS Config)
* **Rule** — the rule that produced the finding
* **Affected asset** — the resource the finding applies to
* **Explanation** and **Recommendation** — what the risk is and how to address it

You can group the list **by finding** or **by rule**, and filter it by severity, status, and source. Filtering by source lets you separate Wallarm findings from AWS Security Hub findings, or focus on a single AWS product.

![Findings tab](../images/infrastructure-discovery/findings.png)

!!! info "AWS Security Hub findings"
    If you use AWS Security Hub, Infrastructure Discovery imports its findings and correlates them with the resources it has discovered. Imported findings keep their original product attribution and appear alongside Wallarm's own findings. No extra configuration is required beyond the [Security Hub permissions](setup.md#required-aws-permissions) in the connected account's policy.

### Finding details and blast radius

Click any finding to open its detail view, which shows:

* The **severity**, the **source** (and the AWS Security Hub product, if imported), a plain-language **explanation**, and a recommended **fix**
* The **rule** that produced the finding
* The **affected asset** — name, type, service, region, account, and ARN
* **Connections** — the resources directly related to the affected asset, with their relationship types (for example, `associated_with_eni`)
* The finding **status** and when it was first **discovered**
* A **blast radius graph** that visualizes how the asset is exposed and which resources are reachable from it — for example, an `Internet → exposed → asset` path through the connected network interfaces and instances

![Finding details and blast radius](../images/infrastructure-discovery/finding-blast-radius.png)

### Policies

Policies sit on top of rules and control how findings are handled. Where a rule answers "is this asset in a risky configuration?", a policy answers "what should we do with the finding?". A policy can apply one of the following actions to matching findings:

* **Dismiss** — hide a finding when the asset is intentionally in that state
* **Downgrade** — lower the severity of a finding for a known-benign pattern
* **Upgrade** — raise the severity of specific findings
* **Annotate** — attach a note to matching findings without changing their severity

You can create custom policies with the **Add policy** button on the Policies tab.

### AI-assisted finding enrichment

On paid subscription plans, Infrastructure Discovery can use AI to enrich findings. For each finding, the AI:

* Adds a plain-language **explanation** of why the configuration is risky
* Suggests a **recommendation** for remediation
* Reduces noise by assessing whether a rule match is a genuine concern in context

AI enrichment processes only the resource metadata already collected during scanning, and it never modifies your cloud resources.

!!! info "Availability"
    AI-assisted finding enrichment is available only on paid subscription plans. Contact your Wallarm account team to enable it.

## Inventory view

The main inventory view (the **Assets** tab) displays all discovered resources in a table. For each resource, you can see:

* **Name** — the resource name from its cloud provider tags
* **Service** — the AWS service the resource belongs to (for example, EC2, VPC, Lambda)
* **Type** — the resource type (for example, instance, security group, load balancer)
* **Resource ID** — the cloud provider identifier of the resource
* **Account** and **Region**
* **Discovered** — when the resource was first found by a scan

Click any row to open the resource detail view with its full configuration, tags, and findings.

![Assets inventory](../images/infrastructure-discovery/assets.png)

### Filtering and search

Use the filter bar to narrow down the inventory by:

* **Service** — show only resources of a specific AWS service
* **Resource type** — show only instances, security groups, load balancers, and so on
* **Region** — view resources in a particular region
* **Account** — focus on a specific cloud account

Free-text search matches against resource names and IDs.

## Resource details

Click any resource to open its detail view, which includes:

* **Summary** — the service, account, and region of the resource at a glance
* **Details** — key properties such as type, name, resource ID, ARN, region, account, and the dates the resource was first discovered and last updated
* **Configuration** — the configuration captured for the resource
* **Tags** — the resource's cloud provider tags
* **Security findings** — any rules that matched this resource's configuration, with severity and recommendation

Relationships between resources are visualized in the [relationship graph](#relationship-graph) rather than in the detail view; use **View in Graph** in the detail view to open the resource directly in the graph.

## Relationship graph

The **Graph** tab provides a visual map of your cloud resources and how they connect. Resources are grouped by **account, region, and VPC**, so you can read the topology at any zoom level — from a high-level cluster view down to individual resources and their connections. From the graph you can trace how traffic reaches a resource (for example, from an internet gateway through a load balancer to a compute instance) and spot isolated or unexpectedly connected resources.

![Relationship graph](../images/infrastructure-discovery/graph.png)

A **Results** panel summarizes the current view with counts such as **Critical** findings, **Entry points**, **New this week**, and **Orphaned** (unconnected) resources, plus a **Top 10 critical assets** list.

Use the filters to narrow the graph by **account**, **region**, **service**, **resource type**, and **severity**.

## Change tracking

Infrastructure Discovery automatically compares each scan to the previous one and records configuration changes on the **Drift Events** tab. Each change is classified as one of:

* **Created** — a resource newly discovered since the last scan
* **Updated** — a resource whose configuration changed between scans
* **Deleted** — a resource that was present in the previous scan but is no longer found

You can filter drift events by severity, change type, service, and account to review what changed in a given scan cycle.

![Drift events](../images/infrastructure-discovery/drift-events.png)
