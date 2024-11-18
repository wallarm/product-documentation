# Overview of the Wallarm Out-of-Band Deployment

Wallarm can be deployed as a self-hosted Out-of-Band (OOB) security solution inspecting requests via a mirror of the traffic. This article explains the approach in detail.

The OOB approach involves placing the Wallarm solution on a separate network segment, where it can inspect incoming traffic without affecting the primary data path and, as a result, the application performance. All incoming requests including malicious ones reach the servers they are addressed.

## Use cases

Traffic mirroring is a key component of the OOB approach. A mirror (copy) of the incoming traffic is sent to the Wallarm OOB solution, which operates on the copy, rather than the actual traffic.

As the OOB solution only records malicious activity but does not block it, it is an effective way to implement web application and API security for organizations with less stringent real-time protection requirements. The OOB solution is suitable for the following use cases:

* Get knowledge about all the potential threats web applications and APIs may encounter, without affecting the application performance.
* Train the Wallarm solution on the traffic copy before running the module [in-line](../inline/overview.md).
* Capture security logs for auditing purposes. Wallarm provides [native integrations](../../user-guides/settings/integrations/integrations-intro.md) with many SIEM systems, messengers, etc.

The diagram below provides a visual representation of the general traffic flow in an out-of-band deployment of Wallarm. The diagram may not capture all possible infrastructure variations. The traffic mirror can be generated at any supporting layer of the infrastructure and sent to the Wallarm nodes. Additionally, specific setups may involve varying load balancing and other infrastructure-level configurations.

![OOB scheme](../../images/waf-installation/oob/wallarm-oob-deployment-scheme.png)

## Advantages

The OOB approach to the Wallarm deployment offers several advantages over other deployment methods, such as in-line deployments:

* It does not introduce latency or other performance issues that can occur when the security solution operates in-line with the primary data path. 
* It provides flexibility and ease of deployment, as the solution can be added or removed from the network without affecting the primary data path.

## Limitations

Despite the OOB deployment approach safety, it has some limitations. The table below details the limitations associated with various deployment options:

| Feature | [eBPF](ebpf/deployment.md) | [TCP mirror](tcp-traffic-mirror/deployment.md) | [Web server mirror](web-server-mirroring/overview.md) |
| --- | --- | --- | --- | 
| Instant blocking of malicious requests | - | - | - |
| Vulnerability discovery using the [passive detection](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) | - | + | - |
| [API Discovery](../../api-discovery/overview.md) | + (excludes response structure) | + | - |
| [Protection against forced browsing](../../admin-en/configuration-guides/protecting-against-bruteforce.md) | + | + | - |
| [Rate limiting](../../user-guides/rules/rate-limiting.md) | - | - | - |
| [IP lists](../../user-guides/ip-lists/overview.md) | - | - | - |

## Supported deployment options

Wallarm offers the following Out-of-Band (OOB) deployment options:

* [eBPF-based solution](ebpf/deployment.md)
* The solution for [TCP traffic mirror analysis](tcp-traffic-mirror/deployment.md)
* Many available Wallarm artifacts can be used to [deploy Wallarm for analyzing traffic mirrored by services like NGINX, Envoy, Istio, etc.](web-server-mirroring/overview.md) These services typically offer built-in features for traffic mirroring, and Wallarm artifacts are well-suited for analyzing traffic mirrored by such solutions.
