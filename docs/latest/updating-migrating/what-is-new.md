# What is new in Wallarm node 4.10

The new version of the Wallarm node has been released! This update introduces an advanced feature for credential stuffing detection and specification-based security policies, further enhancing the security of your APIs.

!!! info "Selected artifacts enhanced in release 4.10"
    Several artifacts, including individual DEB/RPM packages for NGINX, a Helm chart for the Kong Ingress Controller, and an Envoy-based Docker image, have NOT been released as part of version 4.10 and therefore do not support the newly introduced capabilities.

## Credential stuffing detection <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Beginning with release 4.10, Wallarm introduces real-time detection and notifications for credential stuffing attempts. Credential stuffing, the automated submission of stolen or weak username/email and password pairs into website login forms to illegitimately access user accounts, is now closely monitored. This feature allows you to identify accounts with compromised credentials and take action to secure them, such as notifying account owners and temporarily suspending account access.

[Learn how to configure Credential Stuffing Detection](../about-wallarm/credential-stuffing.md)

![Attacks - credential stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-attacks.png)

## API response discovery (node 4.10.1 and higher)

With the 4.10.1 release, we are enhancing Wallarm API Discovery now giving you in-depth information about your API responses. This functionality will discover your API endpoint response structures, highlighting changes, detecting new and unused parameters, and identifying sensitive data.

![APID responses](../images/about-wallarm-waf/api-discovery/discovered-request-params-4.10.png)

## GraphQL API protection <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm detects regular attacks (SQLi, RCE, [etc.](../attacks-vulns-list.md)) in GraphQL by default. However, some aspects of the protocol allow implementing [GraphQL specific](../attacks-vulns-list.md#graphql-attack) attacks related to excessive information exposure and DoS.

Beginning with release 4.10.4, Wallarm introduces protection from these attacks. Protection is set by configuring your organization's GraphQL policy - a set of limits for the GraphQL requests. Requests exceeding any of set limits the filtering node will handle in accordance with the active filtration mode - will only register policy violations or will register and block such attempts.

To start using the functionality, you need to create at least one [**Detect GraphQL attacks** rule](../api-protection/graphql-rule.md#creating-and-applying-the-rule) in Wallarm Console.

[Learn how to configure GraphQL API Protection](../api-protection/graphql-rule.md)

![GraphQL thresholds](../images/user-guides/rules/graphql-rule.png)

## New requirements for restricted networks for node operation

Starting with release 4.10.2-x, Wallarm node instances require access to the IP addresses below for downloading updates to attack detection rules and [API specifications](../api-specification-enforcement/overview.md), as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted](../user-guides/ip-lists/overview.md) countries, regions, or data centers.

=== "US Cloud"
    ```
    34.96.64.17
    34.110.183.149
    ```
=== "EU Cloud"
    ```
    34.160.38.183
    34.144.227.90
    ```

## API Specification Enforcement

In this latest update, we introduce API Specification Enforcement feature. This filters incoming traffic, permitting only requests that comply with your API specifications. Using the Wallarm node, which sits between clients and your applications, it compares endpoint descriptions in your specifications with actual API requests. Discrepancies, such as undefined endpoint requests or those with unauthorized parameters, are either blocked or monitored as configured.

This strengthens security by preventing potential attack attempts and also optimizes API performance by avoiding overloading and misuse.

Additionally, this update introduces new parameters for some deployment options, enabling technical control over the feature's operation:

* For all-in-one installer: the [`wallarm_enable_apifw`](../admin-en/configure-parameters-en.md#wallarm_enable_apifw) NGINX directive.
* For NGINX Ingress Controller: the [`controller.wallarm.apifirewall`](../admin-en/configure-kubernetes-en.md#controllerwallarmapifirewall) values group.
* For NGINX-based Docker image: the environment variable `WALLARM_APIFW_ENABLE`.

!!! info "Required configuration"
    You need [additional configuration](../api-specification-enforcement/setup.md#step-3-configure-specific-cases-or-disable) when using API Specification Enforcement with the NGINX-based Wallarm nodes installed with:

      * [All-in-one installer](../installation/nginx/all-in-one.md)
      * [Docker image](../admin-en/installation-docker-en.md) - only when you [mount](../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file) your own custom configuration file

[Learn how to configure API Specification Enforcement](../api-specification-enforcement/setup.md)

![Specification - use for applying security policies](../images/api-specification-enforcement/api-specification-enforcement-events.png)

## Optimized and more secure NGINX-based Docker image

The [Docker image of Wallarm's NGINX-based filtering node](../admin-en/installation-docker-en.md) has been revamped for enhanced security and optimization. Key updates include:

* The Docker image is now built on Alpine Linux, replacing Debian, to provide a more secure and lightweight artifact. Please note that the `auth-pam` and `subs-filter` NGINX modules, previously included, are no longer packaged with the Docker image.
* Updated to the latest stable version of NGINX, 1.24.0, replacing the previous 1.14.x version. Although most vulnerabilities in 1.14.x were patched by the Debian team (the prior image was based on Debian 10.x), upgrading to 1.24.0 addresses remaining vulnerabilities for improved security.

      The NGINX upgrade, along with the switch to Alpine Linux, resolves the HTTP/2 Rapid Reset Vulnerability (CVE-2023-44487), due to the Alpine-specific patch implemented in NGINX 1.24.0.

* Support for processors with ARM64 architecture, which is automatically identified during the installation process.
* Inside the Docker container, all operations now utilize the non-root user `wallarm`, a change from the previous `root` user setup. It affects the NGINX process as well.
* The [`/wallarm-status`](../admin-en/configure-statistics-service.md) endpoint has been updated to export metrics in the Prometheus format, instead of JSON. This applies specifically when accessing the endpoint from outside the Docker container. Note that the [`WALLARM_STATUS_ALLOW`](../admin-en/installation-docker-en.md#wallarm-status-allow-env-var) environment variable must be set appropriately for this functionality.
* The Docker image is now built using the [all-in-one installer](../installation/nginx/all-in-one.md), which changes its internal directory structure:

      * Log file directory: `/var/log/wallarm` → `/opt/wallarm/var/log/wallarm`.
      * Directory with files containing credentials for the Wallarm node to connect to the Cloud: `/etc/wallarm` → `/opt/wallarm/etc/wallarm`.
      * The path to the `/usr/share` directory → `/opt/wallarm/usr/share`.
      
          This introduces the new path to the [sample blocking page](../admin-en/configuration-guides/configure-block-page-and-code.md), located at `/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html`, and to the diagnostic script, found at `/opt/wallarm/usr/share/wallarm-common/collect-info.sh`.

The newly released product features are also supported by the new NGINX-based Docker image of the new format.

## Optimized cloud images

The [Amazon Machine Image (AMI)](../installation/cloud-platforms/aws/ami.md) and [Google Cloud Machine Image](../installation/cloud-platforms/gcp/machine-image.md) have been optimized. Key updates include:

* The cloud images now use Debian 12.x (bookworm), the latest stable release, replacing the deprecated Debian 10.x (buster) for enhanced security.
* Updated to the newer version of NGINX, 1.22.0, replacing the previous 1.14.x version.
* Support for processors with ARM64 architecture, which is automatically identified during the installation process.
* The cloud images are now built using the [all-in-one installer](../installation/nginx/all-in-one.md), which changes its internal directory structure:

      * Node registration script: `/usr/share/wallarm-common/register-node` → `/opt/wallarm/usr/share/wallarm-common/cloud-init.py`.
      * Log file directory: `/var/log/wallarm` → `/opt/wallarm/var/log/wallarm`.
      * Directory with files containing credentials for the Wallarm node to connect to the Cloud: `/etc/wallarm` → `/opt/wallarm/etc/wallarm`.
      * The path to the `/usr/share` directory → `/opt/wallarm/usr/share`.
      
          This introduces the new path to the [sample blocking page](../admin-en/configuration-guides/configure-block-page-and-code.md), located at `/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html`, and to the diagnostic script, found at `/opt/wallarm/usr/share/wallarm-common/collect-info.sh`.
      
      * The `/etc/nginx/conf.d/wallarm.conf` file with the global Wallarm filtering node settings has been removed.

The newly released product features are also supported by the cloud images of the new format.

## Addressed vulnerabilities

The 4.10.1 release addresses multiple high and critical severity vulnerabilities in Wallarm deployment artifacts, enhancing the software's security posture by replacing previously vulnerable components.

Among the vulnerabilities addressed are those identified by [CVE-2020-36327](https://nvd.nist.gov/vuln/detail/CVE-2020-36327), [CVE-2023-37920](https://nvd.nist.gov/vuln/detail/CVE-2023-37920), and several others. A full list of resolved vulnerabilities, along with their corresponding CVEs specific to each node deployment artifact, can be found within the [inventory of node artifact versions](node-artifact-versions.md).

## HTTP/2 stream length control directive (node 4.10.6 and higher)

Starting from the release 4.10.6, the [`wallarm_http_v2_stream_max_len`](../admin-en/configure-parameters-en.md#wallarm_http_v2_stream_max_len) directive to control the maximum length of HTTP/2 streams has been introduced. It helps in preventing excessive memory consumption in long-lived gRPC connections.

To use this variable in a [Docker container](../admin-en/installation-docker-en.md), specify it in your NGINX configuration file and mount the file into the container.

## Distinct search tags for Account Takeover, Scraping and Security Crawlers (node 4.10.6 and higher)

Starting from the release 4.10.6, distinct [search tags](../user-guides/search-and-filters/use-search.md) for the `account_takeover`, `scraping`, and `security_crawlers` attack types have been introduced, improving specificity over the previous general `api_abuse` tag.

## When upgrading node 3.6 and lower

If upgrading from the version 3.6 or lower, learn all changes from the [separate list](older-versions/what-is-new.md).

## Which Wallarm nodes are recommended to be upgraded?

* Client and multi-tenant Wallarm nodes of version 4.6 and 4.8 to stay up to date with Wallarm releases and prevent [installed module deprecation](versioning-policy.md#version-support).
* Client and multi-tenant Wallarm nodes of the [unsupported](versioning-policy.md#version-list) versions (4.4 and lower). Changes available in Wallarm node 4.10 simplify the node configuration and improve traffic filtration. Please note that some settings of node 4.10 are **incompatible** with the nodes of older versions.

## Upgrade process

1. Review [recommendations for the module upgrade](general-recommendations.md).
2. Upgrade installed modules following the instructions for your Wallarm node deployment option:

      * [All-in-one installer](all-in-one.md)
      * [Docker container with the modules for NGINX](docker-container.md)
      * [NGINX Ingress controller with integrated Wallarm modules](ingress-controller.md)
      * [Cloud node image](cloud-image.md)
      * [Multi-tenant node](multi-tenant.md)

----------

[Other updates in Wallarm products and components →](https://changelog.wallarm.com/)
