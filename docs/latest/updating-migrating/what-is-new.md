# What is new in Wallarm node 4.0

The new major version of the Wallarm node has been released! Wallarm node 4.0 has new features making attack mitigation even more powerful and usable.

## Breaking change: Changes in system requirements for the filtering node installation

Starting with version 4.0, the filtering node uploads data to the Cloud using the `api.wallarm.com:443` (EU Cloud) and `us1.api.wallarm.com:443` (US Cloud) API endpoints instead of `api.wallarm.com:444` and `us1.api.wallarm.com:444`.

If your server with the deployed node has a limited access to the external resources and the access is granted to each resource separately, after upgrade to version 4.0 the synchronization between the filtering node and the Cloud will stop. The upgraded node needs to be granted access to the API endpoint with the new port.

## Unified registration of nodes in the Wallarm Cloud by tokens

The release 4.0 enables you to register the Wallarm node in the Wallarm Cloud by the **token** on [any supported platform](../admin-en/supported-platforms.md). Wallarm nodes of previous versions required the "email-password" user credentials on some platforms.

Unified registration of nodes by tokens makes the connection to the Wallarm Cloud more secure and faster, e.g.:

* Dedicated user accounts of the **Deploy** role allowing only to install the node are no longer required.
* Users' data remains securely stored in the Wallarm Cloud.
* Two-factor authentication enabled for the user accounts does not prevent nodes from being registered in the Wallarm Cloud.
* The initial traffic processing and request postanalytics modules deployed to separate servers can be registered in the Cloud by one node token.

Changes in node registration methods result in some updates in node types:

* The node supporting the unified registration by token has the **Wallarm node** type. The script to be run on the server to register the node is named `register-node`.

    In versions 3.6 and lower, the Wallarm node was named [**cloud node**](/3.6/user-guides/nodes/cloud-node/). It also supported registration by the token but with the different script named `addcloudnode`.

    The cloud node is not required to be migrated to the new node type.
* The [**regular node**](/3.6/user-guides/nodes/regular-node/) supporting the registration by "email-password" passed to the `addnode` script is deprecated.

    Starting from version 4.0, registration of the node deployed as the NGINX, NGINX Plus, Kong module or the Docker container looks as follows:

    1. Create the **Wallarm node** in Wallarm Console and copy the generated token.
    1. Run the `register-node` script with the node token passed or run the Docker container with the `WALLARM_API_TOKEN` variable defined.

    !!! info "Regular node support"
        The regular node type is deprecated in release 4.0 and will be removed in future releases.

        It is recommended to replace the regular node with the **Wallarm node** before the regular type is removed. You will find the appropriate instructions in the node upgrade guides.

## New method for the serverless Wallarm node deployment

The new deployment method lets you configure the Wallarm CDN node outside your infrastructure in 15 minutes. You need to just point to the domain to be protected and add the Wallarm CNAME record to the domain's DNS records.

[Instructions on the CDN node deployment](../waf-installation/cdn-node.md)

The [Quickstart guide](../quickstart.md) now covers the CDN node deployment as the quickest way to deploy the Wallarm filtering node.

## Terraform module to deploy Wallarm on AWS

Starting from release 4.0, you can easily deploy Wallarm to [AWS](https://aws.amazon.com/) from the Infrastructure as Code (IaC)-based environment using the [Wallarm Terraform module](https://registry.terraform.io/modules/wallarm/wallarm/aws/).

The Wallarm Terraform module is the scalable solution meeting the best industry standards of security and failover ensuring. During its deployment, you can choose either the **proxy** or **mirror** deployment option based on your requirements for the traffic flow.

We have also prepared the usage examples for both deployment options involving basic deployment configurations as well as advanced ones compatible with such solutions as AWS VPC Traffic Mirroring.

[Documentation on the Wallarm Terraform module for AWS](../waf-installation/cloud-platforms/aws/terraform-module/overview.md)

## Wallarm AWS image distributed with the ready-to-use `cloud-init.py` script

If following the Infrastructure as Code (IaC) approach, you may need to use the [`cloud-init`](https://cloudinit.readthedocs.io/en/latest/index.html) script to deploy the Wallarm node to AWS. Starting from release 4.0, Wallarm distributes its AWS cloud image with the ready‑to‑use `cloud-init.py` script.

[Specification of the Wallarm `cloud-init` script](../waf-installation/cloud-platforms/cloud-init.md)

## Simplified multi-tenant node configuration

For the [multi-tenant nodes](../waf-installation/multi-tenant/overview.md), tenants and applications are now defined each with its own directive:

* The [`wallarm_partner_client_uuid`](../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) NGINX directive and [`partner_client_uuid`](../admin-en/configuration-guides/envoy/fine-tuning.md#partner_client_id_param) Envoy parameter have been added to configure the unique identifier of a tenant.
* The [`wallarm_application`](../admin-en/configure-parameters-en.md#wallarm_application) NGINX directive and [`application`](../admin-en/configuration-guides/envoy/fine-tuning.md#application_param) Envoy parameter behavior has been changed. Now it is **only** used to configure an application ID.

[Instructions on the multi-tenant node upgrade](multi-tenant.md)

## Renamed parameters, files and metrics

* The following NGINX directives and Envoy parameters have been renamed:

    * NGINX: `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)
    * Envoy: `tsets` section → `rulesets`, and correspondingly the `tsN` entries in this section → `rsN`
    * Envoy: `ts_request_memory_limit` → [`general_ruleset_memory_limit`](../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * Envoy: `ts` → [`ruleset`](../admin-en/configuration-guides/envoy/fine-tuning.md#ruleset_param)

    Parameters with previous names are deprecated and will be removed in future releases. The parameter logic has not changed.
* The private key file `/etc/wallarm/license.key` has been renamed to `/etc/wallarm/private.key`. Starting from the node version 4.0 the new name is used by default.

## Increasing the performance by omitting attack search in requests from blacklisted IPs

The new [`wallarm_acl_access_phase`](../admin-en/configure-parameters-en.md#wallarm_acl_access_phase) directive enables you to increase the Wallarm node performance by omitting the attack search stage during the analysis of requests from [blacklisted](../user-guides/ip-lists/blacklist.md) IPs. This configuration option is useful if there are many blacklisted IPs (e.g. the whole countries) producing high traffic that heavily loads the working machine CPU.

## Improved attack detection

The [libdetection library](../about-wallarm-waf/protecting-against-attacks.md#library-libdetection) is upgraded. This provides the better attack detection.

## New variables to configure the node logging format

The following [node logging variables](../admin-en/configure-logging.md#filter-node-variables) have been changed:

* `wallarm_request_time` has been renamed to `wallarm_request_cpu_time`

    This variable means time in seconds the CPU spent processing the request.

    The variable with the previous name is deprecated and will be removed in future releases. The variable logic has not changed.
* `wallarm_request_mono_time` has been added

    This variable means time in seconds the CPU spent processing the request + time in the queue.

## The rule enabling the `overlimit_res` attack detection fine-tuning

We have introduced the new [rule allowing the `overlimit_res` attack detection fine-tuning](../user-guides/rules/configure-overlimit-res-detection.md).

The `overlimit_res` attack detection fine-tuning via the NGINX and Envoy configuration files is considered to be the deprecated way:

* The rule allows setting up a single request processing time limit as the `wallarm_process_time_limit` NGINX directive and `process_time_limit` Envoy parameter did before.
* The rule allows to block or pass the `overlimit_res` attacks in accordance with the [node filtration mode](../admin-en/configure-wallarm-mode.md) instead of the `wallarm_process_time_limit_block` NGINX directive and `process_time_limit_block` Envoy parameter configuration.

The listed directives and parameters have been deprecated and will be deleted in future releases. It is recommended to transfer the `overlimit_res` attack detection configuration from directives to the rule before. Relevant instructions are provided for each [node deployment option](general-recommendations.md#update-process).

If the listed parameters are explicitly specified in the configuration files and the rule is not created yet, the node processes requests as set in the configuration files.

## When upgrading node 3.4

If upgrading Wallarm node 3.4, in addition to the above, there are the following changes:

* Wallarm Ingress controller based on the latest version of Community Ingress NGINX Controller, 1.3.0.

    [Instructions on migrating to the latest Wallarm Ingress controller →](ingress-controller.md)
* Added support for AlmaLinux, Rocky Linux and Oracle Linux 8.x instead of the [deprecated](https://www.centos.org/centos-linux-eol/) CentOS 8.x.

    Wallarm node packages for the alternative operating systems will be stored in the CentOS 8.x repository. 
* New layout and customization options of the blocking page `/usr/share/nginx/html/wallarm_blocked.html`. In the new node version, you can customize the logo and support email displayed on the page.
    
    The sample blocking page with the new layout looks as follows:

    ![!Wallarm sample blocking page](../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

    [More details on the blocking page setup →](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)
* The following NGINX directives and Envoy parameters have been renamed:

    * NGINX: `wallarm_instance` → [`wallarm_application`](../admin-en/configure-parameters-en.md#wallarm_application)
    * NGINX: `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * NGINX: `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * Envoy: `lom` → [`custom_ruleset`](../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * Envoy: `instance` → [`application`](../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)

    Parameters with previous names are deprecated and will be removed in future releases. The parameter logic has not changed.
* The Ingress [annotation](../admin-en/configure-kubernetes-en.md#ingress-annotations) `nginx.ingress.kubernetes.io/wallarm-instance` has been renamed to `nginx.ingress.kubernetes.io/wallarm-application`.

    The annotation with the previous name is deprecated and will be removed in future releases. The annotation logic has not changed.
* The file with the custom ruleset build `/etc/wallarm/lom` has been renamed to `/etc/wallarm/custom_ruleset`. In the file system of new node versions, there is only the file with the new name.

    Default values of the NGINX directive [`wallarm_custom_ruleset_path`](../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path) and Envoy parameter [`custom_ruleset`](../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings) have been changed appropriately. New default value is `/etc/wallarm/custom_ruleset`.
* The following node statistics parameters have been renamed:

    * `lom_apply_time` → `custom_ruleset_apply_time`
    * `lom_id` → `custom_ruleset_id`

    In new node versions, the `http://127.0.0.8/wallarm-status` endpoint temporarily returns both the deprecated and new parameters. The deprecated parameters will be removed from the service output in future releases.

    [More details on the statistics service →](../admin-en/configure-statistics-service.md)
* The collectd metric `gauge-lom_id` has been renamed to `gauge-custom_ruleset_id`.

    In new node versions, the collectd service collects both the deprecated and new metrics. The deprecated metric collection will be stopped in future releases.

    [All collectd metrics →](../admin-en/monitoring/available-metrics.md#nginx-metrics-and-nginx-wallarm-module-metrics)
* New environment variable `NGINX_PORT` to be passed to the Wallarm NGINX‑based Docker container.

    This variable sets a port that NGINX will use inside the Docker container. This allows avoiding port collision when using this Docker container as a [sidecar container](../admin-en/installation-guides/kubernetes/wallarm-sidecar-container.md) within a pod of Kubernetes cluster.

    [Instructions on deploying the Wallarm NGINX‑based Docker container →](../admin-en/installation-docker-en.md)

## When upgrading node 2.18

If upgrading Wallarm node 2.18 or lower, learn all changes from the [separate list](older-versions/what-is-new.md).

## Which Wallarm nodes are recommended to be upgraded?

* Client and multi-tenant Wallarm nodes of version 3.x to stay up to date with Wallarm releases and prevent [installed module deprecation](versioning-policy.md#version-support).
* Client and multi-tenant Wallarm nodes of the [unsupported](versioning-policy.md#version-list) versions (2.18 and lower). Changes available in Wallarm node 4.0 simplifies the node configuration and improves traffic filtration. Please note that some settings of node 4.0 are **incompatible** with the nodes of older versions.

## Upgrade process

1. Review [recommendations for the modules upgrade](general-recommendations.md).
2. Upgrade installed modules following the instructions for your Wallarm node deployment option:

      * [Module for NGINX, NGINX Plus or Kong](nginx-modules.md)
      * [Docker container with the modules for NGINX or Envoy](docker-container.md)
      * [NGINX Ingress controller with integrated Wallarm modules](ingress-controller.md)
      * [Cloud node image](cloud-image.md)
      * [Multi-tenant node](multi-tenant.md)

----------

[Other updates in Wallarm products and components →](https://changelog.wallarm.com/)
