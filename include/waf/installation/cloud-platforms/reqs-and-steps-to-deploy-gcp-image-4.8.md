## Requirements

* A GCP account
* Access to the account with the **Administrator** role and two‑factor authentication disabled in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* Access to `https://us1.api.wallarm.com:444` for working with US Wallarm Cloud or to `https://api.wallarm.com:444` for working with EU Wallarm Cloud. If access can be configured only via the proxy server, then use the [instructions][wallarm-api-via-proxy]
* Executing all commands on a Wallarm instance as a superuser (e.g. `root`)

## 1. Launch a filtering node instance

### Launch the instance via the Google Cloud UI

To launch the filtering node instance via the Google Cloud UI, please open the [Wallarm node image on the Google Cloud Marketplace](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) and click **LAUNCH**.

The instance will launch with a preinstalled filtering node. To see detailed information on launching instances in the Google Cloud, please proceed to the [official Google Cloud Platform documentation][link-launch-instance].

### Launch the instance via Terraform or other tools

When using a tool like Terraform to launch the filtering node instance using Wallarm GCP image, you may need to provide the name of this image in the Terraform configuration.

* Image name has the following format:

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* To launch the instance with the filtering node version 4.8, please use the following image name:

    ```bash
    wallarm-node-195710/wallarm-node-4-8-20231019-221905
    ```

To get the image name, you can also follow these steps:

1. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install).
2. Execute the command [`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list) with the following parameters:

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-8-*'" --no-standard-images
    ```
3. Copy the version value from the name of the latest available image and paste the copied value into the provided image name format. For example, the filtering node version 4.8 image will have the following name:

    ```bash
    wallarm-node-195710/wallarm-node-4-8-20231019-221905
    ```

## 2. Configure the filtering node instance

Perform the following actions to configure the launched filtering node instance:

1.  Navigate to the **VM instances** page in the **Compute Engine** section of the menu.
2.  Select the launched filtering node instance and click the **Edit** button.
3.  Allow the required types of incoming traffic by ticking the corresponding checkboxes in the **Firewalls** setting.
4.  If necessary, you can restrict connecting to the instance with the project SSH keys and use a custom SSH key pair for connecting to this instance. To do this, perform the following actions:
    1.  Tick the **Block project-wide** checkbox in the **SSH Keys** setting.
    2.  Click the **Show and edit** button in the **SSH Keys** setting to expand the field for entering an SSH key.
    3.  Generate a pair of public and private SSH keys. For example, you can use the `ssh-keygen` and `PuTTYgen` utilities.
       
        ![Generating SSH keys using PuTTYgen][img-ssh-key-generation]

    4.  Copy an open key in OpenSSH format from the interface of the used key generator (in the current example, the generated public key should be copied from the **Public key for pasting into OpenSSH authorized_keys file** area of the PuTTYgen interface) and paste it into the field containing the **Enter entire key data** hint.
    5.  Save the private key. It will be required for connecting to the configured instance in the future.
5.  Click the **Save** button at the bottom of the page to apply the changes. 

## 3. Connect to the filtering node instance via SSH

To see detailed information about ways of connecting to instances, proceed to this [link](https://cloud.google.com/compute/docs/instances/connecting-to-instance).

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. Connect the filtering node to the Wallarm Cloud

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"
