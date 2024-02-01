# What is new in Wallarm node 4.10

The new version of the Wallarm node has been released! This update introduces an advanced feature for credential stuffing detection, further enhancing the security of your APIs.

!!! info "Selected artifacts enhanced in release 4.10"
    Only few artifacts, including the all-in-one installer, NGINX Ingress Controller, the NGINX-based Docker image and cloud images (AMI, GCP Image) have been released as part of version 4.10, featuring support for the newly introduced capabilities.

## Credential stuffing detection <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Beginning with release 4.10, Wallarm introduces real-time detection and notifications for credential stuffing attempts. Credential stuffing, the automated submission of stolen or weak username/email and password pairs into website login forms to illegitimately access user accounts, is now closely monitored. This feature allows you to identify accounts with compromised credentials and take action to secure them, such as notifying account owners and temporarily suspending account access.

[Learn how to configure Credential Stuffing Detection](../about-wallarm/credential-stuffing.md)

![Attacks - credential stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-attacks.png)

<!--

## API Policy Enforcement

In this latest update, we introduce API Policy Enforcement feature. This filters incoming traffic, permitting only requests that comply with your API specifications. Using the Wallarm node, which sits between clients and your applications, it compares endpoint descriptions in your specifications with actual API requests. Discrepancies, such as undefined endpoint requests or those with unauthorized parameters, are either blocked or monitored as configured.

This strengthens security by preventing potential attack attempts and also optimizes API performance by avoiding overloading and misuse.

Additionally, this update introduces new parameters for some deployment options, enabling technical control over the feature's operation:

* For all-in-one installer: the [`wallarm_enable_apifw`](../admin-en/configure-parameters-en.md#wallarm_enable_apifw) NGINX directive.
* For NGINX Ingress Controller: the [`controller.wallarm.apifirewall`](../admin-en/configure-kubernetes-en.md#controllerwallarmapifirewall) values group.
* For NGINX-based Docker image: the environment variable `WALLARM_APIFW_ENABLE`.

[Learn how to configure API Policy Enforcement](../api-policy-enforcement/setup.md)

![Specification - use for API policy enforcement](../images/api-policies-enforcement/api-policies-enforcement-events.png)

-->

## Optimized and more secure NGINX-based Docker image

The [Docker image of Wallarm's NGINX-based filtering node](../admin-en/installation-docker-en.md) has been revamped for enhanced security and optimization. Key updates include:

* The Docker image is now built on Alpine Linux, replacing Debian, to provide a more secure and lightweight artifact. Please note that the `auth-pam` and `subs-filter` NGINX modules, previously included, are no longer packaged with the Docker image.
* Updated to the latest stable version of NGINX, 1.24.0, replacing the previous 1.14.x version. Although most vulnerabilities in 1.14.x were patched by the Debian team (the prior image was based on Debian 10.x), upgrading to 1.24.0 addresses remaining vulnerabilities for improved security.

      The NGINX upgrade, along with the switch to Alpine Linux, resolves the HTTP/2 Rapid Reset Vulnerability (CVE-2023-44487), due to the Alpine-specific patch implemented in NGINX 1.24.0.

* Support for processors with ARM64 architecture, which is automatically identified during the installation process.
* Inside the Docker container, operations now utilize the non-root user `wallarm`, a change from the previous `root` user setup.
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

      * Log file directory: `/var/log/wallarm` → `/opt/wallarm/var/log/wallarm`.
      * Directory with files containing credentials for the Wallarm node to connect to the Cloud: `/etc/wallarm` → `/opt/wallarm/etc/wallarm`.
      * The path to the `/usr/share` directory → `/opt/wallarm/usr/share`.
      
          This introduces the new path to the [sample blocking page](../admin-en/configuration-guides/configure-block-page-and-code.md), located at `/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html`, and to the diagnostic script, found at `/opt/wallarm/usr/share/wallarm-common/collect-info.sh`.
      
      * The `/etc/nginx/conf.d/wallarm.conf` file with the global Wallarm filtering node settings has been removed.

The newly released product features are also supported by the cloud images of the new format.

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
