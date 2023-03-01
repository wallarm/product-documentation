# Overview of the Wallarm Out-of-Band Deployment

Wallarm can be deployed as an Out-of-Band (OOB) security solution inspecting requests via a mirror of the traffic. This article explains the approach in detail.

The OOB approach involves placing the Wallarm solution on a separate network segment, where it can inspect incoming traffic without affecting the primary data path and, as a result, the application performance. All incoming requests reach the servers they are addressed.

## Traffic flow

Traffic mirroring is a key component of the OOB approach. A mirror (copy) of the incoming traffic is sent to the Wallarm OOB solution, which operates on the copy, rather than the actual traffic.

![!OOB scheme](../../images/waf-installation/oob/wallarm-oob-deployment-scheme.png)

## Advantages and limitations

The OOB approach to the Wallarm deployment offers several advantages over other deployment methods, such as [in-line](../load-balancing/overview.md) deployments:

* It does not introduce latency or other performance issues that can occur when the security solution operates in-line with the primary data path. 
* It provides flexibility and ease of deployment, as the solution can be added or removed from the network without affecting the primary data path.

Despite the OOB deployment approach safety, it has some limitations:

* Wallarm does not instantly block malicious requests since traffic analysis proceeds irrespective of actual traffic flow.

    Wallarm only observes attacks and provides you with the [details in Wallarm Console](../..//user-guides/events/analyze-attack.md).
* Most of the Wallarm capabilities for vulnerability discovery do not work as server responses required for vulnerability identification are not mirrored. This limitation relates to the following features:

    * [Passive detection](../../about-wallarm/detecting-vulnerabilities.md#passive-detection)
    * [Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)
    * [Active Threat Verification](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)
* The [Wallarm API Discovery](../../about-wallarm/api-discovery.md) does not explore API inventory based on your traffic as server responses required for the module operation are not mirrored.

## Use cases

The Wallarm OOB is an effective way to implement web application and API security for organizations with less stringent real-time protection requirements.

The OOB solution is suitable for the following use cases:

* Get knowledge about all the potential threats web applications and APIs may encounter, without affecting the application performance.
* Train the Wallarm solution on the traffic copy before running the module [in-line](../load-balancing/overview.md).
* Capture security logs for auditing purposes. Wallarm provides [native integrations](../../user-guides/settings/integrations/integrations-intro.md) with many SIEM systems, messengers, etc.

## Supported deployment options

Wallarm offers the Out-of-Band (OOB) deployment options for traffic mirorred by various means, including cloud platforms and web servers.

**Traffic mirroring by a cloud platform service**

Cloud platforms typically offer native traffic mirroring capabilities, with [AWS VPC Traffic Mirroring](https://docs.aws.amazon.com/vpc/latest/mirroring/what-is-traffic-mirroring.html) being a prime example.

For those who deploy their services on AWS from the Terraform-compatible environment, Wallarm offers the Terraform module. It enables agentless Wallarm deployment with the required VPC mirroring configuration.

With this solution, traffic flow looks as follows:

![!OOB scheme for VPC mirroring](../../images/waf-installation/oob/terraform-module-for-aws-vpc-mirroring.png)

[Guide on deploying Wallarm OOB for AWS VPC Mirroring with the Terraform module](terraform-module/aws-vpc-mirroring.md)

**Traffic mirroring by a web server**

Traffic mirroring can be implemented by configuring a web server to copy incoming traffic to the Wallarm services for analysis. With this approach, traffic flow looks as follows:

![!OOB scheme for traffic mirrored by web server](../../images/waf-installation/oob/oob-for-traffic-mirrored-by-server.png)

For those who prefer a web server to mirror traffic, Wallarm offers the following artifacts for OOB deployment:

* [Terraform module for deployment on AWS](terraform-module/mirroring-by-web-server.md) - works with traffic mirrored by any web server (NGINX, Envoy, Traefik, Istio, etc.)
* [DEB/RPM packages](packages/nginx-stable.md) - works only with traffic mirrored by NGINX
* [AWS AMI](aws-ami.md) - works only with traffic mirrored by NGINX
* [GCP Image](gcp-image.md) - works only with traffic mirrored by NGINX
* [Docker image](docker-image) - works only with traffic mirrored by NGINX

<!-- 
открыть задачи на тестирование и дополнение инструкций для OOB + на следующие инструкции:
    * AWS ECS - делаем но несрочно
    * Azure Container Instances service - делаем но несрочно
    * Alibaba ECS - делаем но несрочно
 -->
