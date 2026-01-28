# Multi-Cloud and Multi-Region Deployment of Security Edge Inline <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

You can deploy the inline Edge Nodes across multiple regions and cloud providers to achieve geo‑redundancy and low latency.

When [configuring Security Edge](deployment.md), you can select one or more regions across the supported cloud providers - **AWS** and **Azure**.

## Multi-region deployment

When selecting multiple regions within a single cloud provider, traffic is routed based on latency - each request goes to the nearest available region.

This is the most common setup, recommended when you serve requests from multiple locations.

![!](../../../images/waf-installation/security-edge/inline/multi-region-edge-nodes.png)

Available regions depend on your [Wallarm Cloud](../../../about-wallarm/overview.md#cloud) (US → US regions, EU → EU regions and UAE North).

## Multi-cloud deployment

When multiple regions across different cloud providers are selected, all requests are distributed across the selected regions and providers using a **[round‑robin](https://en.wikipedia.org/wiki/Round-robin_DNS)** strategy, regardless of latency.

This setup is recommended in the following cases:

* Cloud provider redundancy - traffic is distributed across all selected providers, ensuring that if one becomes unavailable (e.g., AWS), others (e.g., Azure) continue handling traffic without disruption.
* Regional high availability - for example, selecting both `AWS US East 1` and `Azure East US` ensures traffic remains balanced across regions, and service continues even if one region or provider becomes unavailable.

![!](../../../images/waf-installation/security-edge/inline/multi-cloud-edge-nodes.png)

## Wallarm IP ranges for origin access

We recommend securing connections from Security Edge to your origins with [mTLS](mtls.md). This avoids the need to update IP allowlists when Wallarm IPs change.

If mTLS cannot be used, allow incoming traffic from the Wallarm IP addresses of the selected regions:

* AWS

    === "US East 1"
        ```
        18.215.213.205
        44.214.56.120
        44.196.111.152
        ```
    === "US West 1"
        ```
        52.8.91.20
        13.56.117.139
        54.177.237.34
        50.18.177.184
        ```
    === "EU Central 1 (Frankfurt)"
        ```
        18.153.123.2
        18.195.202.193
        3.76.66.246
        3.79.213.212
        ```
    === "EU Central 2 (Zurich)"
        ```
        51.96.131.55
        16.63.191.19
        51.34.0.90
        51.96.67.145
        ```

* Azure

    === "Central US"
        ```
        104.43.139.76
        104.43.139.77
        ```
    === "East US 2"
        ```
        20.65.88.253
        20.65.88.252
        ```
    === "West US 3"
        ```
        20.38.2.233
        20.38.2.232
        ```
    === "Germany West Central"
        ```
        20.79.250.104
        20.79.250.105
        ```
    === "Switzerland North"
        ```
        20.203.240.193
        20.203.240.192
        ```
    === "UAE North"
        ```
        20.74.249.13
        20.74.249.12
        ```

## CNAME records

If your protected host is a third-level (or higher-level) domain (e.g., `api.example.com`), you need to [specify the CNAME record pointing to the Wallarm‑proided FQDN in your DNS zone](deployment.md#7-routing-traffic-to-the-edge-node). This record is returned as the **Traffic CNAME**.

* Single cloud deployment: use the **Traffic CNAME for the selected cloud provider**.
* Multi-cloud deployment: use the **Traffic CNAME (Global)** to automatically distribute traffic across all selected regions and providers.

    Per-provider CNAMEs are also available if you need to enforce routing to a specific provider - for example, to test latency or performance across providers.

![](../../../images/waf-installation/security-edge/inline/traffic-cname.png)

## A records

If your protected host is an apex domain (e.g., `example.com`), a CNAME cannot be used. In this case, the DNS setup must use **A records**, which are returned once the deployment becomes [**Active**](upgrade-and-management.md#statuses).

If you have selected multiple regions or providers for Edge Node deployment, you need to configure all returned A records in your DNS zone.

![](../../../images/waf-installation/security-edge/inline/a-records.png)

Traffic routing in this case is managed by your DNS provider. By default, most DNS providers use [round-robin](https://en.wikipedia.org/wiki/Round-robin_DNS) logic, but some may support latency-based routing as well.

## Removing a cloud provider or a region

* Before removing a cloud provider, switch your DNS setup to use the [Traffic CNAME of the remaining provider](#cname-records).

    When a cloud provider is removed, its **Traffic CNAME** is deleted.
    
    If only one provider remains, the **Traffic CNAME (Global)** is also removed and becomes unavailable.
* Before removing a region, update your [A records](#a-records) accordingly.

    If a region is removed, the associated A records will no longer be available.
