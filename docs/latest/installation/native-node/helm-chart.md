[api-spec-enforcement-docs]:             ../../api-specification-enforcement/overview.md
[ip-list-docs]:                          ../../user-guides/ip-lists/overview.md

# Deploying the Native Node with Helm Chart

The [Wallarm native node](../nginx-native-node-internals.md), which operates independently of NGINX, is designed for certain deployment use cases. You can run the native node on as a separate service or as a load balancer in your Kubernetes cluster using the Helm chart.

## Use cases

Deploy the native node with Helm chart in the following cases:

* When you deploy a Wallarm connector for [MuleSoft](../connectors/mulesoft.md), [Cloudflare](../connectors/cloudflare.md) or [Amazon CloudFront](../connectors/aws-lambda.md) and require the node to be self-hosted.
* When you deploy a Wallarm connector for [Kong API Gateway](../connectors/kong-api-gateway.md) or [Istio](../connectors/istio.md).

## Requirements

The Kubernetes cluster for deploying the native node with the Helm chart must meet the following criteria:

* [Helm v3](https://helm.sh/) package manager installed
* Outbound access to:

    * `https://meganode.wallarm.com` to download the Wallarm installer
    * `https://us1.api.wallarm.com` or `https://api.wallarm.com` for US/EU Wallarm Cloud
    * IP addresses below for downloading updates to attack detection rules and [API specifications][api-spec-enforcement-docs], as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-list-docs] countries, regions, or data centers

        --8<-- "../include/wallarm-cloud-ips.md"

## Installation

Refer to the relevant instructions for running the node:

* Wallarm connector for [MuleSoft](../connectors/mulesoft.md)
* Wallarm connector for [Cloudflare](../connectors/cloudflare.md)
* Wallarm connector for [Amazon CloudFront](../connectors/aws-lambda.md)
* Wallarm connector for [Kong API Gateway](../connectors/kong-api-gateway.md)
* Wallarm connector for [Istio](../connectors/istio.md)
