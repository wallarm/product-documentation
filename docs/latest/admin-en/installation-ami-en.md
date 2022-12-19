[link-ssh-keys]:            https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-key-pair
[link-sg]:                  https://docs.aws.amazon.com/en_us/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-base-security-group
[link-launch-instance]:     https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance

[anchor1]:      #3-create-a-security-group
[anchor2]:      #2-create-a-pair-of-ssh-keys

[img-create-sg]:                ../images/installation-ami/common/create_sg.png
[versioning-policy]:            ../updating-migrating/versioning-policy.md#version-list
[installation-instr-latest]:    /admin-en/installation-ami-en/
[img-wl-console-users]:         ../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     supported-platforms.md

# Deploying as an Amazon Machine Image (AMI)

To deploy an Amazon Machine Image with a filtering node, perform the following steps:

1. Log in to your Amazon Web Services account.
2. Create a pair of SSH keys.
3. Create a security group.
4. Launch a filtering node instance.
5. Connect to the filtering node instance via SSH.
6. Connect the filtering node to the Wallarm Cloud.
7. Set up the filtering node for using a proxy server.
8. Set up filtering and proxying rules.
9. Allocate instance memory for the Wallarm node.
10. Configure logging.
11. Restart NGINX.

## 1. Log in to your Amazon Web Services account

Log in to [aws.amazon.com](https://aws.amazon.com/).

## 2. Create a pair of SSH keys

During the deploying process, you will need to connect to the virtual machine via SSH. Amazon EC2 allows creating a named pair of public and private SSH keys that can be used to connect to the instance.

To create a key pair, do the following:

1.  Navigate to the **Key pairs** tab on the Amazon EC2 dashboard.
2.  Click the **Create Key Pair** button.
3.  Enter a key pair name and click the **Create** button.

A private SSH key in PEM format will automatically start to download. Save the key to connect to the created instance in the future.

!!! info "Creating SSH keys"
    To see detailed information about creating SSH keys, proceed to this [link][link-ssh-keys].

## 3. Create a Security Group

A Security Group defines allowed and forbidden incoming and outgoing connections for virtual machines. The final list of connections depends on the protected application (e.g., allowing all of the incoming connections to the TCP/80 and TCP/443 ports).

!!! warning "Rules for outgoing connections from the security group"
    When creating a security group, all of the outgoing connections are allowed by default. If you restrict outgoing connections from the filtering node, make sure that it is granted access to a Wallarm API server. The choice of a Wallarm API server depends on the Wallarm Cloud you are using:

    *   If you are using the US Cloud, your node needs to be granted access to `us1.api.wallarm.com`.
    *   If you are using the EU Cloud, your node needs to be granted access to `api.wallarm.com`.
    
    The filtering node requires access to a Wallarm API server for proper operation.

Create a security group for the filtering node. To do this, proceed with the following steps:

1.  Navigate to the **Security Groups** tab on the Amazon EC2 dashboard and click the **Create Security Group** button.
2.  Enter a security group name and an optional description into the dialog window that appears.
3.  Select the required VPC.
4.  Configure incoming and outgoing connections rules on the **Inbound** and **Outbound** tabs.
5.  Click the **Create** button to create the security group.

![!Creating a security group][img-create-sg]

To see detailed information about creating a security group, proceed to this [link][link-sg].

## 4. Launch a filtering node instance

--8<-- "../include/waf/installation/already-deployed-cloud-instance.md"

To launch an instance with the filtering node, proceed to this [link](https://aws.amazon.com/marketplace/pp/B073VRFXSD) and subscribe to the filtering node 4.4.

When creating an instance, you need to specify the [previously created][anchor1] security group. To do this, perform the following actions:

1.  While working with the Launch Instance Wizard, proceed to the **6. Configure Security Group** instance launch step by clicking the corresponding tab.
2.  Choose the **Select an existing security group** option in the **Assign a security group** setting.
3.  Select the security group from the list that appears.

After specifying all of the required instance settings, click the **Review and Launch** button, make sure that instance is configured correctly, and click the **Launch** button.

In the window that appears, specify the [previously created][anchor2] key pair by performing the following actions:

1.  In the first drop-down list, select the **Choose an existing key pair** option.
2.  In the second drop-down list, select the name of the key pair.
3.  Make sure you have access to the private key in PEM format from the key pair you specified in the second drop-down list and tick the checkbox to confirm this.
4.  Click the **Launch Instances** button.

The instance will launch with the preinstalled filtering node.

To see detailed information about launching instances in AWS, proceed to this [link][link-launch-instance].

## 5. Connect to the filtering node instance via SSH

You need to use the `admin` username to connect to the instance.

!!! info "Using the key to connect via SSH"
    Use the private key in PEM format that you [created earlier][anchor2] to connect to the instance via SSH. This must be the private key from the SSH key pair that you specified when creating an instance.

To see detailed information about ways to connect to an instance, proceed to this [link](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html).

## 6. Connect the filtering node to the Wallarm Cloud

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.0-only-with-postanalytics.md"

## 7. Set up the filtering node for using a proxy server

--8<-- "../include/setup-proxy.md"

## 8. Set up filtering and proxying rules

--8<-- "../include/setup-filter-nginx-en-latest.md"

## 9. Instance memory allocation for the Wallarm node

Filtering node uses the in-memory storage Tarantool.

By default, the amount of RAM allocated to Tarantool is 40% of the total instance memory. 

You can change the amount of RAM allocated for Tarantool. To allocate the instance RAM to Tarantool:

1. Open the Tarantool configuration file:

    ```
    sudo vim /etc/default/wallarm-tarantool
    ```

2. Set the amount of allocated RAM in the `SLAB_ALLOC_ARENA` in GB. The value can be an integer or a float (a dot `.` is a decimal separator).

    For production environments, the recommended amount of RAM allocated for the postanalytics module is 75% of the total server memory. If testing the Wallarm node or having a small instance size, the lower amount can be enough (e.g. 25% of the total memory).

    For example:
    
    === "If testing the node"
        ```bash
        SLAB_ALLOC_ARENA=0.5
        ```
    === "If deploying the node to the production environment"
        ```bash
        SLAB_ALLOC_ARENA=24
        ```
3. To apply changes, restart the Tarantool daemon:

    ```
    sudo systemctl restart wallarm-tarantool
    ```

## 10. Configure logging

--8<-- "../include/installation-step-logging.md"

## 11. Restart NGINX

Restart NGINX by running the following command:

``` bash
sudo systemctl restart nginx
```    
    
## The installation is complete

The installation is now complete.

--8<-- "../include/check-setup-installation-en.md"

--8<-- "../include/filter-node-defaults.md"

--8<-- "../include/installation-extra-steps.md"