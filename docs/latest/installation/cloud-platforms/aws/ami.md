[link-ssh-keys]:            https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-key-pair
[link-sg]:                  https://docs.aws.amazon.com/en_us/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-base-security-group
[link-launch-instance]:     https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance

[anchor1]:      #3-create-a-security-group
[anchor2]:      #2-create-a-pair-of-ssh-keys

[img-create-sg]:                ../../../../images/installation-ami/common/create_sg.png
[versioning-policy]:            ../../../updating-migrating/versioning-policy.md#version-list
[img-wl-console-users]:         ../../../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../../admin-en/supported-platforms.md

[node-token]:                       ../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../user-guides/settings/api-tokens.md
[platform]:                         ../../../admin-en/supported-platforms.md
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../../images/admin-guides/test-attacks-quickstart.png

# Deploying Wallarm Amazon Machine Image <a href="../../../load-balancing/overview/"><img src="../../../../images/in-line-tag.svg" style="border: none;"></a> <a href="../../../oob/overview/"><img src="../../../../images/oob-tag.svg" style="border: none;"></a>

This article instructs you on deploying Wallarm on AWS from the [official Amazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD). The deployed solution only analyzes traffic mirrored by NGINX stable.

<!-- ???
say that all regions are supported -->

## Prerequisites

* An AWS account
* Understanding of AWS EC2, Security Groups
* Access to the account with the **Administrator** role and two‑factor authentication disabled in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* Access to `https://us1.api.wallarm.com:444` for working with US Wallarm Cloud or to `https://api.wallarm.com:444` for working with EU Wallarm Cloud. If access can be configured only via the proxy server, then use the [instructions](../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md)
* Executing all commands on the Wallarm instance as a superuser (e.g. `root`)

## 1. Choose the approach for Wallarm deployment

Before deploying Wallarm, choose how it should analyze the traffic:

* As the [reverse proxy](../../load-balancing/overview.md) solution analyzing origin of your traffic
* As the [Out-of-Band (OOB)](../../oob/overview.md) solution analyzing a mirror of your traffic

If you choose to deploy Wallarm as the OOB solution, configure your web server to mirror incoming traffic to Wallarm nodes. Inside the [link](../../oob/mirroring-by-web-servers.md), you will find the example configuration for the most popular of web servers (NGINX, Traefik, Envoy, Istio).

## 2. Create a pair of SSH keys in AWS

During the deploying process, you will need to connect to the virtual machine via SSH. Amazon EC2 allows creating a named pair of public and private SSH keys that can be used to connect to the instance.

To create a key pair:

1.  Navigate to the **Key pairs** tab on the Amazon EC2 dashboard.
2.  Click the **Create Key Pair** button.
3.  Enter a key pair name and click the **Create** button.

A private SSH key in PEM format will automatically start to download. Save the key to connect to the created instance in the future.

To see detailed information about creating SSH keys, proceed to the [AWS documentation][link-ssh-keys].

## 3. Create a Security Group

A Security Group defines allowed and forbidden incoming and outgoing connections for virtual machines. The final list of connections depends on the protected application (e.g., allowing all of the incoming connections to the TCP/80 and TCP/443 ports).

To create a security group for the filtering node:

1.  Navigate to the **Security Groups** tab on the Amazon EC2 dashboard and click the **Create Security Group** button.
2.  Enter a security group name and an optional description into the dialog window that appears.
3.  Select the required VPC.
4.  Configure incoming and outgoing connections rules on the **Inbound** and **Outbound** tabs.
5.  Click the **Create** button to create the security group.

![!Creating a security group][img-create-sg]

!!! warning "Rules for outgoing connections from the security group"
    When creating a security group, all of the outgoing connections are allowed by default. If you restrict outgoing connections from the filtering node, make sure that it is granted access to a Wallarm API server. The choice of a Wallarm API server depends on the Wallarm Cloud you are using:

    *   If you are using the US Cloud, your node needs to be granted access to `us1.api.wallarm.com`.
    *   If you are using the EU Cloud, your node needs to be granted access to `api.wallarm.com`.
    
    The filtering node requires access to a Wallarm API server for proper operation.

To see detailed information about creating a security group, proceed to the [AWS documentation]([link-sg]).

## 4. Launch a Wallarm node instance

To launch an instance with the Wallarm filtering node, proceed to this [link](https://aws.amazon.com/marketplace/pp/B073VRFXSD) and subscribe to the filtering node 4.6.

When creating an instance, you need to specify the [previously created][anchor1] security group as follows:

1. While working with the Launch Instance Wizard, proceed to the **6. Configure Security Group** instance launch step by clicking the corresponding tab.
2. Choose the **Select an existing security group** option in the **Assign a security group** setting.
3. Select the security group from the list that appears.

After specifying all of the required instance settings, click the **Review and Launch** button, make sure that instance is configured correctly, and click the **Launch** button.

In the window that appears, specify the [previously created][anchor2] key pair by performing the following actions:

1. In the first drop-down list, select the **Choose an existing key pair** option.
2. In the second drop-down list, select the name of the key pair.
3. Make sure you have access to the private key in PEM format from the key pair you specified in the second drop-down list and tick the checkbox to confirm this.
4. Click the **Launch Instances** button.

The instance will launch with the preinstalled filtering node.

To see detailed information about launching instances in AWS, proceed to the [AWS documentation][link-launch-instance].

## 5. Connect to the filtering node instance via SSH

To see detailed information about ways to connect to an instance via SSH, proceed to the [AWS documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html).

You need to use the `admin` username to connect to the instance.

!!! info "Using the key to connect via SSH"
    Use the private key in PEM format that you [created earlier][anchor2] to connect to the instance via SSH. This must be the private key from the SSH key pair that you specified when creating an instance.

## 6. Connect the filtering node to the Wallarm Cloud

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
