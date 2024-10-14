[api-spec-enforcement-docs]:             ../../api-specification-enforcement/overview.md
[ip-list-docs]:                          ../../user-guides/ip-lists/overview.md

# Deploying the Native Node with All-in-One Installer

The [Wallarm native node](../nginx-native-node-internals.md), which operates independently of NGINX, is designed for Wallarm connector self-hosted deployment and TCP traffic mirror analysis. You can run the native node on a virtual machine with a Linux OS using the Wallarm all-in-one installer.

## Use cases

Deploy the native node with the all-in-one installer in the following cases:

* When you deploy a Wallarm connector for [MuleSoft](../connectors/mulesoft.md), [Cloudflare](../connectors/cloudflare.md) or [Amazon CloudFront](../connectors/aws-lambda.md) and require the node to be self-hosted.
* When you need a security solution for [TCP traffic mirror analysis](../oob/tcp-traffic-mirror/deployment.md).

## Requirements

The machine intended for running the native node with the all-in-one installer must meet the following criteria:

* Linux OS
* x86_64/ARM64 architecture
* Executing all commands as a superuser (e.g. `root`).
* Outbound access to:

    * `https://meganode.wallarm.com` to download the Wallarm installer
    * `https://us1.api.wallarm.com` or `https://api.wallarm.com` for US/EU Wallarm Cloud
    * IP addresses below for downloading updates to attack detection rules and [API specifications][api-spec-enforcement-docs], as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-list-docs] countries, regions, or data centers

        === "US Cloud"
            ```
            34.96.64.17
            34.110.183.149
            35.235.66.155
            ```
        === "EU Cloud"
            ```
            34.160.38.183
            34.144.227.90
            34.90.110.226
            ```

## Installation

To download the native node all-in-one installer, run the following command:

=== "x86_64 version"
    ```bash
    curl -O https://meganode.wallarm.com/next/aionext-0.5.2.x86_64.sh
    ```
=== "ARM64 version"
    ```bash
    curl -O https://meganode.wallarm.com/next/aionext-0.5.2.aarch64.sh
    ```

The native node all-in-one installer can be run in two **modes**, depending on your use case. Refer to the relevant instructions for running the node:

* `connector-server` mode for running the Wallarm connector for one of the following platforms:

    * [MuleSoft](../connectors/mulesoft.md)
    * [Cloudflare](../connectors/cloudflare.md)
    * [Amazon CloudFront](../connectors/aws-lambda.md)
* `tcp-capture` mode for [TCP traffic mirror analysis](../oob/tcp-traffic-mirror/deployment.md)
