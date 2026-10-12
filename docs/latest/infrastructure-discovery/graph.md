# Graph in Infrastructure Discovery <a href="../../about-wallarm/subscription-plans/#wallarm-infrastructure-discovery"><img src="../../images/infrastructure-discovery-tag.svg" class="non-zoomable" style="border: none;"></a>

Once your cloud accounts are [connected](setup.md) and the first scan completes, the **Infrastructure Discovery** section in Wallarm Console gives you a full view of your cloud resources, their security posture, and configuration changes over time, across three top-level tabs: **Graph**, [Security](security.md), and [Attack Paths](attack-paths.md). This page covers **Graph**.

The **Graph** tab provides a visual map of your cloud resources and how they connect. Resources are grouped by **account, region, and VPC**, so you can read the topology at any zoom level — from a high-level cluster view down to individual resources and their connections. From the graph you can trace how traffic reaches a resource (for example, from an internet gateway through a load balancer to a compute instance) and spot isolated or unexpectedly connected resources.

Use the filters on the left to narrow the graph by account, region, service, resource type, and severity. The **Results** panel summarizes the current view with counts such as **Critical** findings, **Entry points**, **New this week**, and **Orphaned** (unconnected) resources, plus a **Top 10 critical assets** list.

Select any node to open its details and highlight its connections.

![Graph resource details](../images/infrastructure-discovery/graph-detail.png)
