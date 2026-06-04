# Infrastructure Discovery Overview <a href="../../about-wallarm/subscription-plans/#wallarm-infrastructure-discovery"><img src="../../images/infrastructure-discovery-tag.svg" class="non-zoomable" style="border: none;"></a>

Wallarm Infrastructure Discovery is a SaaS product that continuously maps your cloud infrastructure, identifies vulnerable configurations, and gives you full visibility into what you have deployed and how resources are connected. Access is read-only — Infrastructure Discovery never modifies your cloud resources.

Infrastructure Discovery is distributed primarily through the [AWS Marketplace listing](https://aws.amazon.com/marketplace/pp/prodview-kvqg6s3jjelv6) and is available on all [Wallarm Cloud](../about-wallarm/api-security-overview.md#cloud) instances — US, EU, and ME. See [Setup → Get access](setup.md#1-get-access) for the sign-up flow.

!!! info "Supported cloud providers"
    Infrastructure Discovery currently supports **AWS**. Support for **Azure** and **GCP** is coming soon.

![Findings tab](../images/infrastructure-discovery/findings.png)

## Issues addressed by Infrastructure Discovery

Modern cloud environments grow organically: teams spin up resources across multiple accounts, regions, and services. Over time, misconfigurations accumulate — publicly exposed services, overly permissive security groups, unencrypted storage — while the gap between what you think is deployed and what is actually running widens. Infrastructure Discovery closes that gap by providing:

* **Security posture analysis** — built-in rules that automatically evaluate resource configurations against security best practices, flag vulnerable setups, and surface findings with severity levels. Policies let you tune how findings are handled for your environment.
* **AWS-native finding aggregation** — imports AWS Security Hub findings (Amazon GuardDuty, Amazon Inspector, IAM Access Analyzer, and more) and correlates them with discovered resources, so all findings live in one place.
* **Impact analysis** — a blast radius view for each finding that shows which connected resources could be affected, helping you prioritize remediation.
* **Full visibility into your cloud estate** — a continuously updated inventory of resources across all connected accounts and regions.
* **Relationship mapping** — a graph view showing how resources connect to each other (e.g. which EC2 instances sit behind which load balancers, which security groups are attached to which ENIs).
* **Change tracking** — comparison of successive scans highlighting created, updated, and deleted resources so you can spot unintended configuration changes.

## How it works

Infrastructure Discovery connects to your cloud accounts via read-only credentials and periodically scans resource metadata through the cloud provider APIs.

1. **Connect** — you add one or more cloud accounts by creating a cross-account IAM role or providing an access key. See [Setup](setup.md).
1. **Scan** — Infrastructure Discovery runs automated scans on a recurring schedule that enumerate resources, their configurations, and inter-resource relationships.
1. **Assess security** — built-in rules evaluate resource configurations against security best practices. Findings are surfaced with severity levels, and policies let you suppress or adjust them for known-benign patterns.
1. **Inventory** — scan results are assembled into a searchable inventory with a relationship graph. You can filter by account, region, service, and resource type.
1. **Track changes** — each scan is compared to the previous one. Created, updated, and deleted resources are highlighted so you can review what changed over time.

![!Infrastructure Discovery diagram](../images/infrastructure-discovery/how-it-works.png)

## What is discovered

Infrastructure Discovery inventories resources from the following AWS services:

| AWS service | Examples of discovered resources |
| --- | --- |
| **EC2** | Instances |
| **VPC networking** | VPCs, subnets, route tables, internet gateways, NAT gateways, security groups, network interfaces (ENIs), elastic IPs, VPC peering connections, transit gateways |
| **Elastic Load Balancing** | Application, Network, and Gateway Load Balancers; target groups; listeners and listener rules |
| **EKS** | Clusters, node groups, Fargate profiles |
| **Lambda** | Functions, layers |
| **API Gateway** | REST APIs, HTTP APIs, stages, VPC links |
| **IAM** | Roles, users, groups, policies, access keys |
| **Amazon Bedrock** | Foundation models, custom models, provisioned throughput, agents, knowledge bases |

In addition to inventorying resources, Infrastructure Discovery imports existing **AWS Security Hub** findings and correlates them with the resources it discovers, so that third-party security signals appear alongside Wallarm's own findings.

!!! info "Expanding coverage"
    The list of supported services and cloud providers is expanding. If you need coverage for a service not listed here, contact [Wallarm Sales](mailto:sales@wallarm.com).

## Data handling

Infrastructure Discovery stores **resource metadata only** — IDs, configurations, tags, and relationships. It does not access data-plane content (no S3 object reads, no RDS queries, no log reading).

All metadata is:

* Encrypted at rest and in transit.
* Isolated per tenant — each Wallarm account's data is stored separately with strict access controls.
* Processed in Wallarm's cloud backend; no on-premise component is required.

For details on AWS permissions, see [Setup → Required AWS permissions](setup.md#required-aws-permissions).

