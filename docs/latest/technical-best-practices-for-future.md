# Wallarm solution deployment and maintenance best practices

This article formulates best practices for deployment and maintenance of the Wallarm solution.


## Deploy the filtering nodes not just in the production environment but also in testing and staging - технические бест практисы

The majority of Wallarm service contracts do not limit the number of Wallarm nodes deployed by the customer, so there is no reason to not deploy the filtering nodes across all your environments, including development, testing, staging, etc.

By deploying and using the filtering nodes in all stages of your software development and/or service operation activities you have a better chance of properly testing the whole data flow and minimizing the risk of any unexpected situations in your critical production environment.

## Configure proper reporting of end-user IP addresses - технические бест практисы,плюс ссылка на это должна быть в каждой инструкции по деплою

For Wallarm filtering nodes located behind a load balancer or CDN please make sure to configure your filtering nodes to properly report end-user IP addresses (otherwise the [IP list functionality](user-guides/ip-lists/overview.md), [Threat Replay Testing](detecting-vulnerabilities.md#threat-replay-testing-trt), and some other features will not work):

* [Instructions for NGINX-based Wallarm nodes](../admin-en/using-proxy-or-balancer-en.md) (including AWS / GCP images and Docker node container)
* [Instructions for the filtering nodes deployed as the Wallarm Kubernetes Ingress controller](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## Enable proper monitoring of the filtering nodes - перенести как в инструкцию по мониторингу,так и в технические бест практисы

It is highly recommended to enable proper monitoring of Wallarm filtering nodes. The method for setting up the filtering node monitoring depends on its deployment option:

* [Instructions for the filtering nodes deployed as the Wallarm Kubernetes Ingress controller](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)
* [Instructions for the NGINX-based Docker image](../admin-en/installation-docker-en.md#monitoring-configuration)

## Implement proper redundancy and automatic failover functionality

Like with every other critical component in your production environment, Wallarm nodes should be architected, deployed, and operated with the proper level of redundancy and automatic failover. You should have **at least two active Wallarm filtering nodes** handling critical end-user requests. The following articles provide relevant information about the topic:

* [Instructions for NGINX-based Wallarm nodes](../admin-en/configure-backup-en.md) (including AWS / GCP images, Docker node container, and Kubernetes sidecars)
* [Instructions for the filtering nodes deployed as the Wallarm Kubernetes Ingress controller](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)
