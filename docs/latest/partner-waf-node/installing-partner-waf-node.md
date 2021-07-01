[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[dynamic-dns-resolution-nginx]:     ../admin-en/configure-dynamic-dns-resolution-nginx.md
[enable-libdetection-docs]:         ../admin-en/configure-parameters-en.md#wallarm_enable_libdetection

# Installing and configuring a partner WAF node

## Requirements

* [Partner account](creating-partner-account.md) in the Wallarm system and a parther UUID
* [Linked clients](connecting-clients.md) and IDs of the partner-client links
* Execution of commands by the user with the **Global administrator** or **Deploy**/**Administrator** role. The user with the **Deploy**/**Administrator** role must be added to the technical client or partner client account depending on which account the WAF node should be created
* Disabled two‑factor authentication for the user executing the commands
* [Supported platform for the WAF node installation](../admin-en/supported-platforms.md)

## Partner WAF node characteristics

Partner WAF node has the following characteristics:

* Can be installed on the same [platforms](../admin-en/supported-platforms.md) and according to the same instructions as a regular WAF node.
* Can be installed on the **technical client** or **partner client** level. If you want to provide a client with access to the Wallarm Console, the WAF node must be installed at the corresponding partner client level.
* Can be configured according to the same instructions as a regular WAF node, except for:
    * The directive [`wallarm_instance`](../admin-en/configure-parameters-en.md#wallarm_instance) is used to split settings by the client applications.
    * To enable blocking of requests by IP addresses, please send a request to [Wallarm technical support](mailto:support@wallarm.com). After blocking is enabled, to block IP addresses, you need to add them to the blacklist at an appropriate partner client account level.

## Recommendations for a partner WAF node installation

* If the client should access the Wallarm Console, the WAF node should be created within an appropriate partner client account
* Describe the WAF node configuration in the client's NGINX configuration file

## Procedure for a partner WAF node installation

1. Select a WAF node installation form and follow the appropriate instructions:
      * [Module for NGINX `stable` from the NGINX repository](../waf-installation/nginx/dynamic-module.md)
      * [Модуль для NGINX `stable` from the Debian/CentOS repository](../waf-installation/nginx/dynamic-module-from-distr.md)
      * [Module for NGINX Plus](../waf-installation/nginx-plus.md)
      * [Docker container with NGINX modules](../admin-en/installation-docker-en.md)
      * [Docker container with Envoy modules](../admin-en/installation-guides/envoy/envoy-docker.md)
      * [NGINX Ingress controller](../admin-en/installation-kubernetes-en.md)
      * [Sidecar container](../admin-en/installation-guides/kubernetes/wallarm-sidecar-container.md)
      * [AWS image](../admin-en/installation-ami-en.md)
      * [Google Cloud Platform image](../admin-en/installation-gcp-en.md)
      * [Yandex.Cloud image](../admin-en/installation-guides/install-in-yandex-cloud.md)
      * [Module for Kong](../admin-en/installation-kong-en.md)
2. Send a request for switching the WAF node to partner status to the [Wallarm technical support](mailto:support@wallarm.com). Send the following data with the request:

    * Name of the used Wallarm Cloud (EU Cloud or US Cloud)
    * Name of the partner account
    * Partner UUID obtained when [creating a partner account](creating-partner-account.md#step-2-access-the-partner-account-and-get-parameters-for-the-waf-node-configuration)
    * Installed WAF node UUID displayed in the Wallarm Console → section **Nodes**
3. Open the client's NGINX configuration file and specify the partner-client link ID in the `wallarm_instance` directive.

    Example of the client's NGINX configuration file:

    ```bash
    server {
        listen       80;
        server_name  client1.com;
        wallarm_mode block;
        wallarm_instance 13;
        
        location / {
            proxy_pass      http://upstream1:8080;
        }
    }
    
    server {
        listen       80;
        server_name  client2.com;
        wallarm_mode monitoring;
        wallarm_instance 14;
        
        location / {
            proxy_pass      http://upstream2:8080;
        }
    }
    ```

    * On the client side, the DNS A records with the partner IP address are configured
    * On the partner side, proxying of requests to the addresses of clients (`http://upstream1:8080` for the client with the partner-client link ID 13 and `http://upstream2:8080` for the client with the partner-client link ID 14) is configured
    * All incoming requests are processed on the partner address, legitimate requests are sent to `http://upstream1:8080` for the client with the partner-client link ID 13 and to `http://upstream2:8080` for the client with the partner-client link ID 14

## Configuring a partner WAF node

To customize the WAF node settings, use the [available directives](../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options-nginx.md"
