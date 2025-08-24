[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md

# Deploying and Configuring Multi-tenant Node

The [multi-tenant](overview.md) node protects several independent company infrastructures or isolated environments simultaneously.

## Multi-tenant node deployment options

Choose the multi-tenant node deployment option based on your infrastructure and the addressed issue:

* Deploy one Wallarm node to filter traffic of all clients or isolated environments as follows:

    ![Partner node scheme](../../images/partner-waf-node/partner-traffic-processing-4.0.png)

    * One Wallarm node processes the traffic of several tenants (Tenant 1, Tenant 2).

        --8<-- "../include/waf/features/multi-tenancy/partner-client-term.md"
        
    * The Wallarm node identifies the tenant that receives the traffic by the unique identifier of a tenant ([`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid)).
    * For the domains `https://tenant1.com` and `https://tenant2.com`, the DNS A records with the partner or client IP address `225.130.128.241` are configured. This setting is shown as an example, a different setting can be used on the partner and tenant side.
    * On the partner's side, proxying of legitimate requests to the addresses of tenant Tenant 1 (`http://upstream1:8080`) and Tenant 2 (`http://upstream2:8080`) is configured. This setting is shown as an example, a different setting can be used on the partner and tenant side.

* Deploy several Wallarm nodes each filtering the traffic of a particular tenant as follows:

    ![Client several nodes scheme](../../images/partner-waf-node/client-several-nodes.png)

    * Several Wallarm nodes each filtering the traffic of a particular tenant (Tenant 1, Tenant 2).
    * For the domain https://tenant1.com, the DNS record with the client IP address 225.130.128.241 is configured.
    * For the domain https://tenant2.com, the DNS record with the client IP address 225.130.128.242 is configured.
    * Each node is proxying the legitimate requests to the addresses of its tenant:
        * Node 1 to Tenant 1 (http://upstream1:8080).
        * Node 2 to Tenant 2 (http://upstream2:8080).

## Multi-tenant node characteristics

Multi-tenant node:

* Can be installed on the same [platforms](../../installation/supported-deployment-options.md) and according to the same instructions as a regular filtering node, **except for**:

    * MuleSoft Mule and Flex Gateway connectors
    * Amazon CloudFront connector
    * Cloudflare connector
    * Broadcom Layer7 API Gateway connector
    * Fastly connector
    * Kong API Gateway connector
    * Istio connector
* Can be installed on the **technical tenant** or **tenant** level. If you want to provide a tenant with access to Wallarm Console, the filtering node must be installed at the corresponding tenant level.
* Can be configured according to the same instructions as a regular filtering node.
* The directive [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) is used to split traffic by the tenants.
* The directive [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) is used to split settings by the applications.

## Deployment requirements

* [Configured tenant accounts](configure-accounts.md)
* Execution of further commands by the user with the **Global administrator** role added under the [technical tenant account](overview.md#tenant-accounts)
* [Supported platform for the filtering node installation](../../installation/supported-deployment-options.md)

## Recommendations for a multi-tenant node deployment

* If it is required for the tenant to access Wallarm Console, create the filtering node within an appropriate tenant account.
* Configure the filtering node via the tenant's NGINX configuration file.

## Procedure for a multi-tenant node deployment

1. In Wallarm Console → **Nodes**, click **Create node** and select **Wallarm node**.

    !!! info "Switching an existing Wallarm node to the multi-tenant mode"
        If you want to switch an existing Wallarm node to the multi-tenant mode, use the **Make it multi-tenant** option from the required node menu in the **Nodes** section.

        Once switched and confirmed, proceed to the 4th step.
1. Select the **Multi-tenant node** option.

    ![Multi-tenant node creation](../../images/user-guides/nodes/create-multi-tenant-node.png)
1. Set node name and click **Create**.
1. Copy the filtering node token.
1. Depending on a filtering node deployment form, perform steps from the [appropriate instructions](../../installation/supported-deployment-options.md).
1. Split traffic between tenants using their unique identifiers.

    === "NGINX and NGINX Plus"
        Open the tenant's NGINX configuration file and split traffic between tenants using the [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) directive. See example below.
    === "NGINX Ingress Controller"
        Use Ingress [annotation](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `nginx.ingress.kubernetes.io/wallarm-partner-client-uuid` to set tenant UUID for each Ingress resource. One resource is related to one tenant:

        ```
        kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-partner-client-uuid=VALUE
        ```
    === "Docker NGINX‑based image"
        1. Open the NGINX configuration file and split traffic between tenants using the [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) directive. See example below.
        1. Run the docker container [mounting the configuration file](../../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file).
    === "Kubernetes Sidecar"
        1. Open the NGINX configuration file and split traffic between tenants using the [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) directive.
        1. Mount an NGINX configuration file to the [Wallarm sidecar container](../../installation/kubernetes/sidecar-proxy/customization.md#using-custom-nginx-configuration).

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
    * On the partner side, proxying of requests to the addresses of tenants (`http://upstream1:8080` for the tenant with `wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111` and `http://upstream2:8080` for the tenant with `wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222`) is configured
    * All incoming requests are processed on the partner address, legitimate requests are proxied to `http://upstream1:8080` for the tenant with `wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111` and to `http://upstream2:8080` for the tenant with `wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222`

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
            ...
        }
        location /users {
            wallarm_application 22;
            ...
        }
    }
    ```

    Two applications belong to the tenant `11111111-1111-1111-1111-111111111111`:
    
    * `tenant1.com/login` is the application `21`
    * `tenant1.com/users` is the application `22`

## Configuring a multi-tenant node

To customize the filtering node settings, use the [available directives](../../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options-nginx-4.4.md"
