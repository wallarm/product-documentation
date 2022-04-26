[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[enable-libdetection-docs]:         ../../admin-en/configure-parameters-en.md#wallarm_enable_libdetection

# Deploying and configuring multi-tenant node

The [multi-tenant](overview.md) node protects several independent company infrastructures or isolated environments simultaneously.

## Multi-tenant node deployment options

Choose the multi-tenant node deployment option based on your infrastructure and the addressed issue:

* Deploy one Wallarm node to filter traffic of all clients or isolated environments as follows:

    ![!Partner node scheme](../../images/partner-waf-node/partner-traffic-processing-3.6.png)

    * One Wallarm node processes the traffic of several tenants (Tenant 1, Tenant 2).

        --8<-- "../include/waf/features/multi-tenancy/partner-client-term.md"
        
    * The Wallarm node identifies the tenant that receives the traffic by the "tenant-application" link ID (`wallarm_application`).
    * For the domains `https://tenant1.com` and `https://tenant2.com`, the DNS A records with the partner or client IP address `225.130.128.241` are configured. This setting is shown as an example, a different setting can be used on the partner and tenant side.
    * On the partner's side, proxying of legitimate requests to the addresses of tenant Tenant 1 (`http://upstream1:8080`) and Tenant 2 (`http://upstream2:8080`) is configured. This setting is shown as an example, a different setting can be used on the partner and tenant side.

    !!! warning "If the Wallarm node is of the CDN type"
        Since the `wallarm_application` configuration is not supported by the [Wallarm CDN node](../cdn-node.md), this deployment option is not supported by the CDN node type too. If the node type being used is CDN, please deploy several nodes each filtering the traffic of a particular tenant.
* Deploy several Wallarm nodes each filtering the traffic of a particular tenant.

    Tenant traffic will be processed similarly to the option above but on several servers of a partner or tenants.

## Multi-tenant node characteristics

Multi-tenant node:

* Can be installed on the same [platforms](../../admin-en/supported-platforms.md) and according to the same instructions as a regular filtering node.
* Can be installed on the **technical tenant** or **tenant** level. If you want to provide a tenant with access to Wallarm Console, the filtering node must be installed at the corresponding tenant level.
* Can be configured according to the same instructions as a regular filtering node.
* The directive [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) is used to split settings by the tenant applications. There can be several applications.

## Deployment requirements

* [Configured tenant accounts](configure-accounts.md)
* Execution of further commands by the user with the **Global administrator** or **Deploy**/**Administrator** role

    The user with the **Deploy**/**Administrator** role must be added to the technical tenant or tenant account depending on the account the filtering node should be created.
* Disabled two‑factor authentication for the user executing the commands
* [Supported platform for the filtering node installation](../../admin-en/supported-platforms.md)

## Recommendations for a multi-tenant node deployment

* If it is required for the tenant to access Wallarm Console, create the filtering node within an appropriate tenant account.
* Configure the filtering node via the tenant's NGINX configuration file.

## Procedure for a multi-tenant node deployment

1. Select a filtering node deployment form and follow the appropriate instructions:
      * [Module for NGINX `stable` from the NGINX repository](../nginx/dynamic-module.md)
      * [Module for NGINX `stable` from the Debian/CentOS repository](../nginx/dynamic-module-from-distr.md)
      * [Module for NGINX Plus](../nginx-plus.md)
      * [Docker container with NGINX modules](../../admin-en/installation-docker-en.md)
      * [Docker container with Envoy modules](../../admin-en/installation-guides/envoy/envoy-docker.md)
      * [NGINX Ingress controller](../../admin-en/installation-kubernetes-en.md)
      * [Sidecar container](../../admin-en/installation-guides/kubernetes/wallarm-sidecar-container.md)
      * [AWS image](../../admin-en/installation-ami-en.md)
      * [Google Cloud Platform image](../../admin-en/installation-gcp-en.md)
      * [Module for Kong](../../admin-en/installation-kong-en.md)
2. If one Wallarm node filters the traffic of several clients or isolated environments, send a request for switching the node to the multi-tenant status to the [Wallarm technical support](mailto:support@wallarm.com).

    Send the following data with the request:

    * Name of the Wallarm Cloud being used (EU Cloud or US Cloud)
    * Name of the [global account](configure-accounts.md#tenant-account-structure)
    * Main tenant UUID obtained when [creating a global account](configure-accounts.md#step-2-get-access-to-the-tenant-account-creation)
    * Filtering node UUID displayed in Wallarm Console → **Nodes**
3. Open the tenant's NGINX configuration file and specify the application IDs using the [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) directive.

    Example of the NGINX configuration file for the filtering node processing the traffic of two clients:

    ```bash
    server {
        listen       80;
        server_name  tenant1.com;
        wallarm_mode block;
        wallarm_application 13;
        
        location / {
            proxy_pass      http://upstream1:8080;
        }
    }
    
    server {
        listen       80;
        server_name  tenant2.com;
        wallarm_mode monitoring;
        wallarm_application 14;
        
        location / {
            proxy_pass      http://upstream2:8080;
        }
    }
    ```

    * On the tenant side, the DNS A records with the partner IP address are configured
    * On the partner side, proxying of requests to the addresses of tenants (`http://upstream1:8080` for the tenant with the application ID 13 and `http://upstream2:8080` for the tenant with the application ID 14) is configured
    * All incoming requests are processed on the partner address, legitimate requests are proxied to `http://upstream1:8080` for the tenant with the application ID 13 and to `http://upstream2:8080` for the tenant with the application ID 14

## Configuring a multi-tenant node

To customize the filtering node settings, use the [available directives](../../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options-nginx.md"
