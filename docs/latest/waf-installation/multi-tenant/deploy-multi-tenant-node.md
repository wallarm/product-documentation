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

    ![!Partner node scheme](../../images/partner-waf-node/partner-traffic-processing-4.0.png)

    * One Wallarm node processes the traffic of several tenants (Tenant 1, Tenant 2).

        --8<-- "../include/waf/features/multi-tenancy/partner-client-term.md"
        
    * The Wallarm node identifies the tenant that receives the traffic by the unique identifier of a tenant ([`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) or [`partner_client_uuid`](../../admin-en/configuration-guides/envoy/fine-tuning.md#configuration-options-for-the-envoy‑based-wallarm-node) in Envoy installation).
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
* The directive [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) is used to split traffic by the tenants.
* The directive [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) is used to split settings by the applications.

## Deployment requirements

* [Configured tenant accounts](configure-accounts.md)
* Execution of further commands by the user with the **Global administrator** role added under the [technical tenant account](configure-accounts.md#tenant-account-structure)
* [Supported platform for the filtering node installation](../../admin-en/supported-platforms.md)

## Recommendations for a multi-tenant node deployment

* If it is required for the tenant to access Wallarm Console, create the filtering node within an appropriate tenant account.
* Configure the filtering node via the tenant's NGINX configuration file.

## Procedure for a multi-tenant node deployment

1. In the Wallarm Console → **Nodes** section, click **Create node** and select **Wallarm node**.
1. Select the **Multi-tenant node** option.
1. Set node name and click **Create**.
1. Copy the created token.
1. Depending on a filtering node deployment form, perform steps from the [appropriate instructions](../../admin-en/supported-platforms.md).
1. Open the tenant's NGINX configuration file and specify the unique identifier of a tenant using the [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) directive.

    Example of the NGINX configuration file for the filtering node processing the traffic of two clients:

    ```
    server {
        listen       80;
        server_name  tenant1.com;
        wallarm_mode block;
        wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
        
        location / {
            proxy_pass      http://upstream1:8080;
        }
    }
    
    server {
        listen       80;
        server_name  tenant2.com;
        wallarm_mode monitoring;
        wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222;
        
        location / {
            proxy_pass      http://upstream2:8080;
        }
    }
    ```

    * On the tenant side, the DNS A records with the partner IP address are configured
    * On the partner side, proxying of requests to the addresses of tenants (`http://upstream1:8080` for the tenant with the `wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111` and `http://upstream2:8080` for the tenant with the `wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222`) is configured
    * All incoming requests are processed on the partner address, legitimate requests are proxied to `http://upstream1:8080` for the tenant with the `wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111` and to `http://upstream2:8080` for the tenant with the `wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222`

1. If necessary, specify IDs of tenant's applications using the [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) directive.

    Example:

    ```
    server {
        listen       80;
        server_name  tenant1.com;
        wallarm_mode block;
        wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
        
        location / {
            proxy_pass      http://upstream1:8080;
        }

        location /login {
            wallarm_application 21;
        }
        location /users {
            wallarm_application 22;
        }
    }
    ```

    * On the tenant side, the DNS A records with the partner IP address are configured
    * On the partner side, proxying of requests to the addresses of tenants (`http://upstream1:8080` for the tenant with the `wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111` and `http://upstream2:8080` for the tenant with the `wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222`) is configured
    * All incoming requests are processed on the partner address, legitimate requests are proxied to `http://upstream1:8080` for the tenant with the `wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111` and to `http://upstream2:8080` for the tenant with the `wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222`

## Configuring a multi-tenant node

To customize the filtering node settings, use the [available directives](../../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options-nginx.md"
