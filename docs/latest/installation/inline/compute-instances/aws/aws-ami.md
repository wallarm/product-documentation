# Deploying the NGINX Node with AWS AMI

This article provides instructions for deploying the Wallarm [NGINX node][nginx-native-node] on AWS [in-line][inline-docs] using the [official Amazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD).

The image is based on Debian and the NGINX version provided by Debian. Currently, the latest image uses Debian 12, which includes NGINX stable 1.22.1.

Deploying the Wallarm Node from the AMI on AWS typically takes around 10 minutes.

![!][aws-ami-traffic-flow]

!!! info "Security note"
    This solution is designed to follow AWS security best practices. We recommend avoiding the use of the AWS root account for deployment. Instead, use IAM users or roles with only the necessary permissions.

    The deployment process assumes the principle of least privilege, granting only the minimal access required to provision and operate Wallarm components.

For guidance on estimating AWS infrastructure costs for this deployment, see the [Cost Guidance for Deploying Wallarm in AWS][aws-costs] page.

## Use cases

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami-latest.md"

### 4. Connect the instance to the Wallarm Cloud

The instance's node connects to the Wallarm Cloud via the [cloud-init.py][cloud-init-spec] script. This script registers the node with the Wallarm Cloud using a provided token, globally sets it to the monitoring [mode][wallarm-mode], and sets up the node to forward legitimate traffic based on the `--proxy-pass` flag.

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
* `<PROXY_ADDRESS>` is the address the Wallarm node proxies legitimate traffic to. It can be the IP of an application instance, a load balancer, or a DNS name (depending on your architecture), with the specified `http` or `https` protocol, e.g., `http://example.com` or `https://192.0.2.1`. [See more information on the proxy address format](https://nginx.org/en/docs/http/ngx_http_proxy_module.html?&_ga=2.23729850.1231698478.1756133814-1504295816.1756133814#proxy_pass).

### 5. Configure sending traffic to the Wallarm instance

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

### 6. Test the Wallarm operation

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## Verifying the node operation using logs and metrics

To verify the node is detecting traffic, you can check the metrics and logs as follows:

* Check Prometheus metrics exposed by the node:

    ```
    curl http://127.0.0.1:9001/metrics
    ```

* Review NGINX logs to inspect incoming requests and errors:

    * Access logs: `/var/log/nginx/access.log`
    * Error logs: `/var/log/nginx/error.log`

* Review [Wallarm-specific logs][wallarm-logs], which include details such as data sent to the Wallarm Cloud, detected attacks, and more. These logs are located in the `/opt/wallarm/var/log/wallarm` directory.

## Fine-tune the deployed solution

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"
