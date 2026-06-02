# Exploring Infrastructure Inventory (Early Access)

Once your cloud accounts are [connected](setup.md) and the first scan completes, the Infrastructure Discovery section in Wallarm Console provides a full view of your cloud resources, their security posture, and configuration changes over time.

## Security & Drift

The **Security & Drift** section is the primary tool for identifying vulnerable configurations across your infrastructure.

### Rules

Rules define conditions that flag potentially risky configurations. Infrastructure Discovery includes built-in rules that check for common issues such as:

* Publicly accessible services
* Overly permissive security groups
* Unencrypted storage or communication
* Missing tags or naming conventions

Each rule match produces a **finding** with a severity level (Critical, High, Medium, Low, Info).

### Policies

Policies sit on top of rules and control how findings are handled. Where a rule answers "is this asset in a risky configuration?", a policy answers "what should we do with the finding?" — for example:

* **Dismiss** a finding if the asset is intentionally exposed
* **Downgrade severity** for a known-benign pattern
* **Escalate** specific findings by raising their severity

You can create custom policies via the **+ Add policy** button on the Policies tab.

## Inventory view

The main inventory view displays all discovered resources in a table format. For each resource, you can see:

* **Resource type** (e.g. EC2 Instance, ALB, Lambda Function)
* **Resource ID** and **Name** (from cloud provider tags)
* **Account** and **Region**
* **Status** and key configuration properties
* **Security findings** count, if any rules matched
* **First seen** and **Last seen** timestamps

### Filtering and search

Use the filter bar to narrow down the inventory by:

* **Account** — focus on a specific cloud account
* **Region** — view resources in a particular region
* **Resource type** — show only EC2 instances, security groups, load balancers, etc.
* **Tags** — filter by resource tags
* **Security findings** — show only resources with active findings

Free-text search matches against resource IDs, names, and tags.

## Resource details

Click any resource to open its detail view, which includes:

* **Configuration** — key properties of the resource (instance type, VPC, security group rules, listener protocols, etc.)
* **Relationships** — other resources connected to this one (e.g. the security groups attached to an instance, the target groups behind a load balancer)
* **Security findings** — any rules that matched this resource's configuration, with severity and recommendation
* **Change history** — a timeline of when the resource was first discovered and what changed across scans

## Relationship graph

The relationship graph provides a visual representation of how resources connect across your infrastructure. You can:

* Start from any resource and expand its connections
* Trace traffic paths from internet gateways through load balancers to compute resources
* Identify isolated or unexpectedly connected resources

## Change tracking

Infrastructure Discovery automatically compares each scan to the previous one and highlights changes:

* **Added resources** — newly discovered resources since the last scan
* **Removed resources** — resources that were present in the previous scan but are no longer found
* **Modified resources** — resources whose configuration changed between scans

You can filter the inventory view by change type to review what changed in a given scan cycle.
