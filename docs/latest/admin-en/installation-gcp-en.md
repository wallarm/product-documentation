[link-launch-instance]:     https://cloud.google.com/deep-learning-vm/docs/quickstart-marketplace

[img-ssh-key-generation]:       ../images/installation-gcp/common/ssh-key-generation.png
[versioning-policy]:            ../updating-migrating/versioning-policy.md#version-list
[installation-instr-latest]:    /admin-en/installation-gcp-en/
[img-wl-console-users]:         ../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     supported-platforms.md
[platform]:                         ../admin-en/supported-platforms.md

# Deploying Wallarm from Google Cloud Platform Image <a href="../installation/load-balancing/overview/"><img src="../../images/in-line-tag.svg" style="border: none;"></a> <a href="../installation/oob/overview/"><img src="../../images/oob-tag.svg" style="border: none;"></a>

## 1. Choose the approach for Wallarm deployment

Before deploying Wallarm, choose how it should analyze the traffic:

* As the [reverse proxy](../../load-balancing/overview.md) solution analyzing origin of your traffic
* As the [Out-of-Band (OOB)](../../oob/overview.md) solution analyzing a mirror of your traffic

If you choose to deploy Wallarm as the OOB solution, configure your web server to mirror incoming traffic to Wallarm nodes. Inside the [link](../../oob/mirroring-by-web-servers.md), you will find the example configuration for the most popular of web servers (NGINX, Traefik, Envoy, Istio).

## 1. Log in to your Google Cloud Platform account

Log in to [console.cloud.google.com](https://console.cloud.google.com/).

## 2. Launch a filtering node instance

### Launch the instance via the Google Cloud UI

To launch the filtering node instance via the Google Cloud UI, please open the [Wallarm node image on the Google Cloud Marketplace](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) and click **LAUNCH**.

The instance will launch with a preinstalled filtering node. To see detailed information on launching instances in the Google Cloud, please proceed to the [official Google Cloud Platform documentation][link-launch-instance].

### Launch the instance via Terraform or other tools

When using a tool like Terraform to launch the filtering node instance using Wallarm GCP image, you may need to provide the name of this image in the Terraform configuration.

* Image name has the following format:

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* To launch the instance with the filtering node version 4.6, please use the following image name:

    ```bash
    wallarm-node-195710/wallarm-node-4-6-20230324-114215
    ```

To get the image name, you can also follow these steps:

1. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install).
2. Execute the command [`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list) with the following parameters:

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-6-*'" --no-standard-images
    ```
3. Copy the version value from the name of the latest available image and paste the copied value into the provided image name format. For example, the filtering node version 4.6 image will have the following name:

    ```bash
    wallarm-node-195710/wallarm-node-4-6-20230324-114215
    ```

## 3. Configure the filtering node instance

Perform the following actions to configure the launched filtering node instance:

1.  Navigate to the **VM instances** page in the **Compute Engine** section of the menu.
2.  Select the launched filtering node instance and click the **Edit** button.
3.  Allow the required types of incoming traffic by ticking the corresponding checkboxes in the **Firewalls** setting.
4.  If necessary, you can restrict connecting to the instance with the project SSH keys and use a custom SSH key pair for connecting to this instance. To do this, perform the following actions:
    1.  Tick the **Block project-wide** checkbox in the **SSH Keys** setting.
    2.  Click the **Show and edit** button in the **SSH Keys** setting to expand the field for entering an SSH key.
    3.  Generate a pair of public and private SSH keys. For example, you can use the `ssh-keygen` and `PuTTYgen` utilities.
       
        ![!Generating SSH keys using PuTTYgen][img-ssh-key-generation]

    4.  Copy an open key in OpenSSH format from the interface of the used key generator (in the current example, the generated public key should be copied from the **Public key for pasting into OpenSSH authorized_keys file** area of the PuTTYgen interface) and paste it into the field containing the **Enter entire key data** hint.
    5.  Save the private key. It will be required for connecting to the configured instance in the future.
5.  Click the **Save** button at the bottom of the page to apply the changes. 

## 4. Connect to the filtering node instance via SSH

To see detailed information about ways of connecting to instances, proceed to this [link](https://cloud.google.com/compute/docs/instances/connecting-to-instance).

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 5. Connect the filtering node to the Wallarm Cloud

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"

## 7. Enable Wallarm to analyze the traffic

By default, the deployed Wallarm node does not analyze incoming traffic. To start traffic analisys, add the `wallarm_mode` directive in the `/etc/nginx/sites-enabled/default` file:

```
server {
    listen 80;
    listen [::]:80 ipv6only=on;
    wallarm_mode monitoring;

    ...
}
```

The monitoring mode is the recommended one for the first deployment and solution testing. Wallarm provides safe blocking and blocking modes as well, [read more](../../../admin-en/configure-wallarm-mode.md).

If you deploy Wallarm as the OOB solution, the monitoring mode is the only supported mode.

## 8. Enable Wallarm to either proxy traffic or analyze its mirror

--8<-- "../include/setup-filter-nginx-en-latest.md"

## 9. Restart NGINX

To apply the settings, restart NGINX:

``` bash
sudo systemctl restart nginx
```

Each configuration file change requires NGINX to be restarted to apply it.

## 10. Test the Wallarm operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Further fine-tuning

--8<-- "../include/installation-extra-steps.md"
