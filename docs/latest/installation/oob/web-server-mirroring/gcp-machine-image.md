[link-launch-instance]:     https://cloud.google.com/deep-learning-vm/docs/quickstart-marketplace

[img-ssh-key-generation]:       ../../../images/installation-gcp/common/ssh-key-generation.png
[versioning-policy]:            ../../../updating-migrating/versioning-policy.md#version-list
[img-wl-console-users]:         ../../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../../installation/supported-deployment-options.md
[node-token]:                       ../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../installation/supported-deployment-options.md
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../images/admin-guides/test-attacks-quickstart.png
[wallarm-nginx-directives]:         ../../../admin-en/configure-parameters-en.md
[autoscaling-docs]:                 ../../../admin-en/installation-guides/google-cloud/autoscaling-overview.md
[real-ip-docs]:                     ../../../admin-en/using-proxy-or-balancer-en.md
[allocate-memory-docs]:             ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[limiting-request-processing]:      ../../../user-guides/rules/configure-overlimit-res-detection.md
[logs-docs]:                        ../../../admin-en/configure-logging.md
[oob-advantages-limitations]:       ../overview.md#advantages-and-limitations
[wallarm-mode]:                     ../../../admin-en/configure-wallarm-mode.md
[wallarm-api-via-proxy]:            ../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[img-grouped-nodes]:                ../../../images/user-guides/nodes/grouped-nodes.png
[cloud-init-spec]:                  ../../cloud-platforms/cloud-init.md
[wallarm_force_directive]:          ../../../admin-en/configure-parameters-en.md#wallarm_force
[web-server-mirroring-examples]:    overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[ip-lists-docs]:                    ../../../user-guides/ip-lists/overview.md

# Deploying Wallarm OOB from GCP Machine Image

This article provides instructions for deploying [Wallarm OOB](overview.md) on Google Cloud Platform using the [official Machine Image](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node). The solution described here is designed to analyze traffic mirrored by a web or proxy server.

## Use cases

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. Connect the filtering node to the Wallarm Cloud

The cloud instance's node connects to the Cloud via the [cloud-init.py][cloud-init-spec] script. This script registers the node with the Wallarm Cloud using a provided token, globally sets it to the monitoring [mode][wallarm-mode], and sets the [`wallarm_force`][wallarm_force_directive] directives in NGINX's `location /` block to only analyze mirrored traffic copies. Restarting NGINX finalizes the setup.

Run the `cloud-init.py` script on the instance created from the cloud image as follows:

=== "US Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror -H us1.api.wallarm.com
    ```
=== "EU Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror
    ```

* `WALLARM_LABELS='group=<GROUP>'` sets a node group name (existing, or, if does not exist, it will be created). It is only applied if using an API token.
* `<TOKEN>` is the copied value of the token.

## 6. Configure your web or proxy server to mirror traffic to the Wallarm node

1. Configure your web or proxy server (e.g. NGINX, Envoy) to mirror incoming traffic to the Wallarm node. For configuration details, we recommend to refer to your web or proxy server documentation.

    Inside the [link][web-server-mirroring-examples], you will find the example configuration for the most popular of web and proxy servers (NGINX, Traefik, Envoy).
1. Set the following configuration in the `/etc/nginx/sites-enabled/default` file on the instance with the node:

    ```
    location / {
        include /etc/nginx/presets.d/mirror.conf;
        
        # Change 222.222.222.22 to the address of the mirroring server
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
    }
    ```

    The `set_real_ip_from` and `real_ip_header` directives are required to have Wallarm Console [display the IP addresses of the attackers][real-ip-docs].

## 7. Test the Wallarm operation

--8<-- "../include/waf/installation/cloud-platforms/test-operation-oob.md"

## 8. Fine-tune the deployed solution

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"