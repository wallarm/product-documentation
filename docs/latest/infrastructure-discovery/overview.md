# Infrastructure Discovery Overview (Early Access)

Wallarm Infrastructure Discovery is a SaaS product that continuously maps your cloud infrastructure, identifies vulnerable configurations, and gives you full visibility into what you have deployed and how resources are connected. Access is read-only — Infrastructure Discovery never modifies your cloud resources.

!!! info "Early Access"
    Infrastructure Discovery is available as an Early Access feature with a separate subscription. Contact [sales@wallarm.com](mailto:sales@wallarm.com) to request access.

!!! info "Supported cloud providers"
    Infrastructure Discovery currently supports **AWS**. Support for **Azure** and **GCP** is coming soon.

## Issues addressed by Infrastructure Discovery

Modern cloud environments grow organically: teams spin up resources across multiple accounts, regions, and services. Over time, misconfigurations accumulate — publicly exposed services, overly permissive security groups, unencrypted storage — while the gap between what you think is deployed and what is actually running widens. Infrastructure Discovery closes that gap by providing:

* **Security posture analysis** — built-in rules that automatically evaluate resource configurations against security best practices, flag vulnerable setups, and surface findings with severity levels. Policies let you tune how findings are handled for your environment.
* **Full visibility into your cloud estate** — a continuously updated inventory of resources across all connected accounts and regions.
* **Relationship mapping** — a graph view showing how resources connect to each other (e.g. which EC2 instances sit behind which load balancers, which security groups are attached to which ENIs).
* **Change tracking** — comparison of successive scans highlighting added, removed, and modified resources so you can spot unintended configuration changes.

## How it works

Infrastructure Discovery connects to your cloud accounts via read-only credentials and periodically scans resource metadata through the cloud provider APIs.

1. **Connect** — you add one or more cloud accounts by creating a cross-account IAM role or providing an access key. See [Setup](setup.md).
1. **Scan** — Infrastructure Discovery runs automated scans (every 6 hours by default) that enumerate resources, their configurations, and inter-resource relationships.
1. **Assess security** — built-in rules evaluate resource configurations against security best practices. Findings are surfaced with severity levels, and policies let you suppress or adjust them for known-benign patterns.
1. **Inventory** — scan results are assembled into a searchable inventory with a relationship graph. You can filter by account, region, resource type, and tags.
1. **Track changes** — each scan is compared to the previous one. Added, removed, and modified resources are highlighted so you can review what changed over time.

## What is discovered

Infrastructure Discovery inventories resources from the following AWS services:

| AWS service | Examples of discovered resources |
| --- | --- |
| **EC2** | Instances, security groups, ENIs, key pairs |
| **VPC** | VPCs, subnets, route tables, internet gateways, NAT gateways |
| **Elastic Load Balancing** | ALBs, NLBs, target groups, listeners |
| **EKS** | Clusters, node groups |
| **Lambda** | Functions, event source mappings |
| **API Gateway** | REST APIs, HTTP APIs, stages |

!!! info "Expanding coverage"
    The list of supported services and cloud providers is expanding. If you need coverage for a service not listed here, contact your Wallarm account team.

## Data handling

Infrastructure Discovery stores **resource metadata only** — IDs, configurations, tags, and relationships. It does not access data-plane content (no S3 object reads, no RDS queries, no log reading).

All metadata is:

* Encrypted at rest and in transit.
* Isolated per tenant — each Wallarm account's data is stored separately with strict access controls.
* Processed in Wallarm's cloud backend; no on-premise component is required.

For details on AWS permissions, see [Setup → Required AWS permissions](setup.md#required-aws-permissions).

## Getting started

To start using Infrastructure Discovery:

1. Ensure you have an active Infrastructure Discovery subscription. Contact [sales@wallarm.com](mailto:sales@wallarm.com) if needed.
1. [Connect your cloud accounts](setup.md).
1. Wait for the first scan to complete (typically a few minutes depending on account size).
1. [Explore your inventory](exploring.md) in the Wallarm Console.
