# Routing Traffic to the Wallarm Node on AWS

After deploying the Wallarm Node on AWS, you need to configure your AWS infrastructure so that all traffic passes through the Node before reaching your application. This guide covers the most common AWS deployment scenarios: Application Load Balancer (ALB), Network Load Balancer (NLB), Amazon CloudFront, and Amazon API Gateway.

This guide applies to **inline deployments** where the Wallarm Node acts as a reverse proxy:

* [NGINX Node AMI](ami.md)
* [Docker image (NGINX Node) on AWS ECS](../../../installation/cloud-platforms/aws/docker-container.md)

If you deployed the [Native Node AMI](../../../installation/native-node/aws-ami.md) for use with connectors or TCP traffic mirror, traffic routing is configured differently — see the respective [connector guide](../../../installation/connectors/overview.md#supported-platforms) or [TCP traffic mirror deployment guide](../../../installation/oob/tcp-traffic-mirror/deployment.md).

## Overview

Regardless of which AWS service fronts your traffic, the pattern is always the same:

1. Route all traffic through the Wallarm Node — the Node must sit in the request path between the internet-facing endpoint and your application.
1. Restrict direct access to the application — use security groups, network ACLs, or service-level policies to ensure the application only accepts traffic from the Wallarm Node.
1. Validate — confirm that requests bypassing the Node are rejected.

The sections below cover ALB, NLB, CloudFront, and API Gateway — the most common AWS deployment scenarios. If your infrastructure uses a different entry point (e.g., [AWS Global Accelerator](https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html), [AWS App Mesh](https://docs.aws.amazon.com/app-mesh/latest/userguide/what-is-app-mesh.html), or a third-party reverse proxy on EC2), the same three-step pattern applies: route traffic through the Node, lock down direct access using [security groups](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html) and [network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html), and verify.

## Application Load Balancer (ALB)

If your application is already behind an [ALB](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html), you need to insert the Wallarm Node between the ALB and the application. The ALB forwards traffic to the Wallarm Node, which then proxies it to the application.

```
Internet → ALB (existing) → Wallarm Node (new target group) → Application
```

1. [Create a target group](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-target-group.html) for the Wallarm Node (e.g., `wallarm-tg`) containing the Wallarm Node EC2 instance(s) or [Auto Scaling Group](../../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md).
1. [Update your ALB listener rules](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-update-rules.html) to forward traffic to the `wallarm-tg` target group instead of the application target group.
1. Configure the Wallarm Node to proxy traffic to the application. Point it to your application's internal DNS, IP, or load balancer endpoint:

    * NGINX Node AMI — use the [`--proxy-pass`](ami.md#4-connect-the-instance-to-the-wallarm-cloud) flag during setup
    * Docker image on ECS — set the [`NGINX_BACKEND`](../../../installation/cloud-platforms/aws/docker-container.md) environment variable
1. Update the application's security group to only allow inbound traffic from the Wallarm Node. The inbound rules should look like this:

    | Protocol | Port   | Source          |
    |----------|--------|-----------------|
    | TCP      | 80/443 | sg-wallarm-node |

    !!! warning "Remove any rules allowing direct internet access"
        Ensure there are **no** inbound rules allowing `0.0.0.0/0` on the application security group. Any such rule would allow traffic to bypass the Wallarm Node. For more details on controlling traffic at each network layer, see [SEC05-BP02 – Control traffic flow within your network layers](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/sec_network_protection_control_traffic.html) in the AWS Well-Architected Framework.

## Network Load Balancer (NLB)

If your application is behind an [NLB](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html), the approach is similar to ALB: insert the Wallarm Node between the NLB and the application. NLBs operate at Layer 4 and forward TCP connections, so your security group rules must account for client IP preservation behavior.

```
Internet → NLB (existing) → Wallarm Node (new target group) → Application
```

1. [Create a target group](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/create-target-group.html) for the Wallarm Node containing the Node instance(s) or [Auto Scaling Group](../../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md). Register it with your existing NLB.
1. [Update NLB listeners](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/listener-update-rules.html) to forward traffic to the Wallarm Node target group instead of the application target group.
1. Configure the Wallarm Node to proxy traffic to the application. Point it to your application's internal DNS, IP, or load balancer endpoint:

    * NGINX Node AMI — use the [`--proxy-pass`](ami.md#4-connect-the-instance-to-the-wallarm-cloud) flag during setup
    * Docker image on ECS — set the [`NGINX_BACKEND`](../../../installation/cloud-platforms/aws/docker-container.md) environment variable
1. Update the application's security group to only allow inbound traffic from the Wallarm Node. The inbound rules should look like this:

    | Protocol | Port   | Source          |
    |----------|--------|-----------------|
    | TCP      | 80/443 | sg-wallarm-node |

    !!! info "Client IP preservation"
        If your NLB has [client IP preservation](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-target-groups.html#client-ip-preservation) enabled, traffic arrives at the Wallarm Node with the original client IP as the source. In this case, the application security group must allow traffic from the Wallarm Node's **private IP range** (e.g., the VPC CIDR) rather than a specific security group. For tighter control, place the Wallarm Nodes in a dedicated subnet and restrict the application to that subnet CIDR.
1. Use network ACLs as an additional layer. Restrict the application subnet's NACL to only accept traffic from the Wallarm Node subnet. The inbound rules should look like this:

    | Rule | Protocol | Port   | Source                |
    |------|----------|--------|-----------------------|
    | 100  | TCP      | 80/443 | 10.0.1.0/24 (wallarm) |
    | *    | All      | All    | 0.0.0.0/0 DENY        |

## Amazon CloudFront

If you use [CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html) as a CDN, update the origin to point to the Wallarm Node instead of directly to the application. The Node then proxies traffic to the application.

```
Internet → CloudFront (existing) → Wallarm Node (new origin) → Application
```

1. In your CloudFront distribution, [change the origin domain](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistS3AndCustomOrigins.html#concept_CustomOrigin) to point to the Wallarm Node instead of the application. Use the same type of endpoint you already have as an origin:

    * If your current origin is an ALB or NLB — create a Wallarm Node target group in that load balancer (as described in the [ALB](#application-load-balancer-alb) or [NLB](#network-load-balancer-nlb) sections) and keep the load balancer as the CloudFront origin.
    * If your current origin is a single EC2 instance — replace it with the Wallarm Node's EC2 public DNS as the new origin. For production workloads, consider placing the Node behind an ALB with an [Auto Scaling Group](../../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md) for high availability.
1. Configure CloudFront to pass a secret header to the origin (e.g., `X-CloudFront-Secret: <value>`). This serves as a shared secret to verify that traffic comes from CloudFront.

    In the CloudFront distribution, under **Origins**, add a custom header:

    | Header name          | Value             |
    |----------------------|-------------------|
    | `X-CloudFront-Secret` | `<value>` |

1. Configure the Wallarm Node (via NGINX configuration) to reject requests that do not include the correct header:

    ```nginx
    # /etc/nginx/conf.d/cloudfront-check.conf
    if ($http_x_cloudfront_secret != "<value>") {
        return 403;
    }
    ```
1. Restrict the Wallarm Node's security group to CloudFront IPs only. Use an [AWS-managed prefix list](https://docs.aws.amazon.com/vpc/latest/userguide/managed-prefix-lists-referencing.html) for [CloudFront IP ranges](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/LocationsOfEdgeServers.html). The inbound rules should look like this:

    | Protocol | Port   | Source                                        |
    |----------|--------|-----------------------------------------------|
    | TCP      | 80/443 | com.amazonaws.global.cloudfront.origin-facing  |
1. Lock down the application to only accept traffic from the Wallarm Node, as described in the [ALB section above](#application-load-balancer-alb).

## Amazon API Gateway

If your application is behind [Amazon API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html) (REST or HTTP APIs), route the API Gateway integration through a VPC Link to the Wallarm Node.

```
Internet → API Gateway (existing) → VPC Link → Wallarm Node (NLB/ALB) → Application
```

1. Update the API Gateway integration to route through the Wallarm Node. The approach depends on your current setup:

    * If your API Gateway already uses a VPC Link — update the target NLB/ALB target group to point to the Wallarm Node (as described in the [ALB](#application-load-balancer-alb) or [NLB](#network-load-balancer-nlb) sections).
    * If your API Gateway uses a public endpoint integration — create a [VPC Link](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vpc-links.html) pointing to an NLB or ALB that fronts the Wallarm Node, then update API Gateway routes to use this VPC Link integration. For production workloads, place the Node behind a load balancer with an [Auto Scaling Group](../../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md) for high availability.
1. Configure the Wallarm Node to proxy traffic to the application. Point it to your application's internal DNS, IP, or load balancer endpoint:

    * NGINX Node AMI — use the [`--proxy-pass`](ami.md#4-connect-the-instance-to-the-wallarm-cloud) flag during setup
    * Docker image on ECS — set the [`NGINX_BACKEND`](../../../installation/cloud-platforms/aws/docker-container.md) environment variable
1. Update the application's security group to only allow inbound traffic from the Wallarm Node. The inbound rules should look like this:

    | Protocol | Port   | Source          |
    |----------|--------|-----------------|
    | TCP      | 80/443 | sg-wallarm-node |

1. For REST APIs, add a [resource policy](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html) that restricts invocations to known source VPCs or IP ranges if applicable.
1. For an additional layer of authentication between API Gateway and the Wallarm Node, configure [mutual TLS](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-mutual-tls.html) on the API Gateway.

## Verification checklist

After configuring traffic routing, verify that the Node cannot be bypassed:

- [ ] **Direct access test**: Attempt to access the application directly (by its private/public IP or DNS name, bypassing the load balancer/CDN). Connection should be refused or time out.
- [ ] **Bypass header test** (CloudFront): Send a request to the Wallarm Node without the shared secret header. The request should be rejected with a `403`.
- [ ] **Attack detection test**: Send a test attack through the full path and verify it appears in Wallarm Console → **Attacks**:

    ```bash
    curl -H "Host: <your-domain>" https://<entry-point>/etc/passwd
    ```

- [ ] **Security group audit**: Review all security groups associated with the application instances and confirm there are no rules allowing direct internet access (`0.0.0.0/0`).
- [ ] **VPC Flow Logs**: Enable [VPC Flow Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html) on the application subnet to detect any traffic that does not originate from the Wallarm Node.

## Additional recommendations

* **Use private subnets** for application instances. Placing your application in a private subnet with no internet gateway route ensures that the only path to the application is through the Wallarm Node. For guidance on network segmentation, see [Network design](https://docs.aws.amazon.com/prescriptive-guidance/latest/security-reference-architecture/network.html) in the AWS Security Reference Architecture.
* **Enable AWS Config rules** to continuously monitor security group compliance. The managed rule [`restricted-common-ports`](https://docs.aws.amazon.com/config/latest/developerguide/restricted-common-ports.html) can alert you if an application security group is modified to allow direct internet access.
* **Use AWS CloudTrail** to audit security group changes and detect unauthorized modifications. For details, see [SEC04-BP01 – Configure service and application logging](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/sec_detect_investigate_events_app_service_logging.html) in the AWS Well-Architected Framework.
