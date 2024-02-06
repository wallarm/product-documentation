## Requirements

* An AWS account
* Understanding of AWS EC2, Security Groups
* Any AWS region of your choice, there are no specific restrictions on the region for the Wallarm node deployment
* Access to the account with the **Administrator** role and two‑factor authentication disabled in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* Access to `https://us1.api.wallarm.com:444` for working with US Wallarm Cloud or to `https://api.wallarm.com:444` for working with EU Wallarm Cloud. If access can be configured only via the proxy server, then use the [instructions][wallarm-api-via-proxy]
* Executing all commands on a Wallarm instance as a superuser (e.g. `root`)

## 1. Create a pair of SSH keys in AWS

During the deploying process, you will need to connect to the virtual machine via SSH. Amazon EC2 allows creating a named pair of public and private SSH keys that can be used to connect to the instance.

To create a key pair:

1.  Navigate to the **Key pairs** tab on the Amazon EC2 dashboard.
2.  Click the **Create Key Pair** button.
3.  Enter a key pair name and click the **Create** button.

A private SSH key in PEM format will automatically start to download. Save the key to connect to the created instance in the future.

To see detailed information about creating SSH keys, proceed to the [AWS documentation][link-ssh-keys].

## 2. Create a Security Group

A Security Group defines allowed and forbidden incoming and outgoing connections for virtual machines. The final list of connections depends on the protected application (e.g., allowing all of the incoming connections to the TCP/80 and TCP/443 ports).

To create a security group for the filtering node:

1.  Navigate to the **Security Groups** tab on the Amazon EC2 dashboard and click the **Create Security Group** button.
2.  Enter a security group name and an optional description into the dialog window that appears.
3.  Select the required VPC.
4.  Configure incoming and outgoing connections rules on the **Inbound** and **Outbound** tabs.
5.  Click the **Create** button to create the security group.

![Creating a security group][img-create-sg]

!!! warning "Rules for outgoing connections from the security group"
    When creating a security group, all of the outgoing connections are allowed by default. If you restrict outgoing connections from the filtering node, make sure that it is granted access to a Wallarm API server. The choice of a Wallarm API server depends on the Wallarm Cloud you are using:

    *   If you are using the US Cloud, your node needs to be granted access to `us1.api.wallarm.com`.
    *   If you are using the EU Cloud, your node needs to be granted access to `api.wallarm.com`.
    
    The filtering node requires access to a Wallarm API server for proper operation.

To see detailed information about creating a security group, proceed to the [AWS documentation][link-sg].

## 3. Launch a Wallarm node instance

To launch an instance with the Wallarm filtering node, proceed to this [link](https://aws.amazon.com/marketplace/pp/B073VRFXSD) and subscribe to the filtering node.

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

## 4. Connect to the filtering node instance via SSH

To see detailed information about ways to connect to an instance via SSH, proceed to the [AWS documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html).

You need to use the `admin` username to connect to the instance.

!!! info "Using the key to connect via SSH"
    Use the private key in PEM format that you [created earlier][anchor2] to connect to the instance via SSH. This must be the private key from the SSH key pair that you specified when creating an instance.

## 5. Generate a token to connect an instance to the Wallarm Cloud

The local Wallarm filtering node needs to connect with the Wallarm Cloud using a Wallarm token of the [appropriate type][wallarm-token-types]. An API token allows you to create a node group in the Wallarm Console UI, which helps in organizing your node instances effectively.

![Grouped nodes][img-grouped-nodes]

Generate a token as follows:

=== "API token"

    1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
    1. Find or create API token with the `Deploy` source role.
    1. Copy this token.
=== "Node token"

    1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes).
    1. Do one of the following: 
        * Create the node of the **Wallarm node** type and copy the generated token.
        * Use existing node group - copy token using node's menu → **Copy token**.
