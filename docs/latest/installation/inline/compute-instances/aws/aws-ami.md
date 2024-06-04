[link-ssh-keys]:            https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-key-pair
[link-sg]:                  https://docs.aws.amazon.com/en_us/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-base-security-group
[link-launch-instance]:     https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance

[anchor1]:      #2-create-a-security-group
[anchor2]:      #1-create-a-pair-of-ssh-keys-in-aws

[img-create-sg]:                ../../../../images/installation-ami/common/create_sg.png
[versioning-policy]:            ../../../../updating-migrating/versioning-policy.md#version-list
[img-wl-console-users]:         ../../../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../../../installation/supported-deployment-options.md
[node-token]:                       ../../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../../installation/supported-deployment-options.md
[ptrav-attack-docs]:                ../../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../../images/admin-guides/test-attacks-quickstart.png
[wallarm-nginx-directives]:         ../../../../admin-en/configure-parameters-en.md
[autoscaling-docs]:                 ../../../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md
[real-ip-docs]:                     ../../../../admin-en/using-proxy-or-balancer-en.md
[allocate-memory-docs]:             ../../../../admin-en/configuration-guides/allocate-resources-for-node.md
[limiting-request-processing]:      ../../../../user-guides/rules/configure-overlimit-res-detection.md
[logs-docs]:                        ../../../../admin-en/configure-logging.md
[wallarm-mode]:                     ../../../../admin-en/configure-wallarm-mode.md
[wallarm-api-via-proxy]:            ../../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png
[cloud-init-spec]:                  ../../../cloud-platforms/cloud-init.md
[wallarm_force_directive]:          ../../../../admin-en/configure-parameters-en.md#wallarm_force
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../../../../api-specification-enforcement/overview.md

# Deploying Wallarm from Amazon Machine Image

This article provides instructions for deploying Wallarm on AWS in-line using the [official Amazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD).

## Use cases

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami-latest.md"

## 6. Connect the instance to the Wallarm Cloud

The cloud instance's node connects to the Cloud via the [cloud-init.py][cloud-init-spec] script. This script registers the node with the Wallarm Cloud using a provided token, globally sets it to the monitoring [mode][wallarm-mode], and sets up the node to forward legitimate traffic based on the `--proxy-pass` flag. Restarting NGINX finalizes the setup.

Run the `cloud-init.py` script on the instance created from the cloud image as follows:

=== "US Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS> -H us1.api.wallarm.com
    ```
=== "EU Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS>
    ```

* `WALLARM_LABELS='group=<GROUP>'` sets a node group name (existing, or, if does not exist, it will be created). It is only applied if using an API token.
* `<TOKEN>` is the copied value of the token.
* `<PROXY_ADDRESS>` is an address for Wallarm node to proxy legitimate traffic to. It can be an IP of an application instance, load balancer, or DNS name, etc., depending on your architecture.

## 7. Configure sending traffic to the Wallarm instance

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## 8. Test the Wallarm operation

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. Fine-tune the deployed solution

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"
