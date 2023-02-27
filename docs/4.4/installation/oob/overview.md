# Wallarm Out-of-Band deployment

Wallarm can be deployed as an Out-of-Band (OOB) security solution inspecting requests via a mirror of the traffic. This article explains the approach in detail.

The OOB approach involves placing the Wallarm solution on a separate network segment, where it can inspect incoming traffic without affecting the primary data path and, as a result, the application performance. All incoming requests reach the servers they are addressed.

## Traffic flow

Traffic mirroring is a key component of the OOB approach. A mirror (copy) of the incoming traffic is sent to the Wallarm OOB solution, which operates on the copy, rather than the actual traffic.

![!OOB scheme](../../images/deployment-options/wallarm-oob-deployment-scheme.png)

## Advantages and limitations

The OOB approach to the Wallarm deployment offers several advantages over other deployment methods, such as [in-line](../load-balancing/overview.md) deployments:

* It does not introduce latency or other performance issues that can occur when the security solution operates in-line with the primary data path. 
* It provides flexibility and ease of deployment, as the solution can be added or removed from the network without affecting the primary data path.

Despite the OOB deployment approach safety, it has some limitations:

* Wallarm does not instantly block malicious requests since traffic analysis proceeds irrespective of actual traffic flow. Wallarm only observes attacks and provides you with the details in Wallarm Console.

    ??? what attacks can be found? (e.g. brute force cannot be)
* Wallarm does not detect application and API [vulnerabilities](../../about-wallarm/detecting-vulnerabilities.md) since it only has copies of incoming requests, and server responses cannot be mirrored.
* API Discovery?
* API Abuse Prevention?
* Integrations?

## Use cases

The Wallarm OOB is an effective way to implement web application and API security for organizations with less stringent real-time protection requirements.

The OOB solution is suitable for the following use cases:

* Get knowledge about all the potential threats web applications and APIs may encounter, without affecting the application performance.
* Train the Wallarm solution on the traffic copy before running the module on the production system.
* Depending on how API DIscovry and API AP work in this approach, add some items (e.g. security logging, tracking sensitive data?

## Supported deployment options

Wallarm offers the following Out-of-Band (OOB) deployment options:

* [eBPF](ebpf.md) - TBD
* Terraform module for AWS:

    * [Wallarm OOB for traffic mirrored by a web server](terraform-modeule/mirrored-traffic.md) (NGINX, Envoy, Istio, Traefik, etc)
    * [Wallarm OOB for Amazon VPC mirroring](terraform-module/vpc-mirroring.md)
* NGINX module deployed from (?):

    * DEB/RPM packages
    * Docker container
    * AWS AMI image
    * GCP cloud image
    * AWS ECS
    * GCE
    * Azure Container Instances service
    * Alibaba ECS


<!-- The type of monitoring scenario, out-of-band or inline, effects the placement of monitoring equipment, the type of equipment used, and the monitoring activities you can conduct as part of your visibility architecture. -->

<!-- 

1. should we use the term "in-band"???? against the "out of band" term?
1. нужна помощь с терминами synchronous и asynchronous -- что нам подходит в контексте OOB??
1. вот у нас есть mirror solution в примерах деплоя terraform module for aws. это не ведь тоже OOB?
1. везде пишут, что OOB это agentless. у нас ebpf ведь с agent? а вот OOB для VPC traffic mirroring - agentless?
1. надо ли как-то отражать просто сами артефакты в структуре/док-ии? Docker containers, packages, helm charts
1. то есть внутри OOB тоже настроена наша нода на анализ зеркалированного трафика, а как при этом настраивается сам сервер, чтобы предоставлять зеркало трафика-то? какой-то прямо компонент внутри OOb решения есть получается???? речь про ebpf -->
