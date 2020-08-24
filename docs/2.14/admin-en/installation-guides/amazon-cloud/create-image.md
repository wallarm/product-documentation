[link-docs-aws-autoscaling]:        autoscaling-overview.md
[link-docs-aws-node-setup]:         ../../installation-ami-en.md
[link-ssh-keys-guide]:              ../../installation-ami-en.md#2-create-a-pair-of-ssh-keys
[link-security-group-guide]:        ../../installation-ami-en.md#3-create-a-security-group
[link-cloud-connect-guide]:         ../../installation-ami-en.md#6-connect-the-filter-node-to-the-wallarm-cloud
[link-docs-reverse-proxy-setup]:    ../../../quickstart-en/qs-setup-proxy-en.md
[link-docs-check-operation]:        ../../installation-check-operation-en.md

[img-launch-ami-wizard]:        ../../../images/installation-ami/auto-scaling/common/create-image/launch-ami-wizard.png 
[img-config-ami-wizard]:        ../../../images/installation-ami/auto-scaling/common/create-image/config-ami-wizard.png  
[img-explore-created-ami]:      ../../../images/installation-ami/auto-scaling/common/create-image/explore-ami.png

[anchor-node]:  #1-creating-and-configuring-the-wallarm-filter-node-instance-in-the-amazon-cloud
[anchor-ami]:   #2-creating-an-amazon-machine-image

#   Creating an AMI with the Wallarm Filter Node

You can set up auto scaling for the Wallarm filter nodes deployed on the Amazon cloud. This function requires preliminarily prepared virtual machine images.

This document describes the procedure of preparing an Amazon Machine Image (AMI) with the Wallarm filter node installed. AMI is required for the filter node auto scaling setup. To see detailed information about setting up auto scaling, proceed to this [link][link-docs-aws-autoscaling].

To create an AMI with the Wallarm filter node, perform the following procedures:
1.  [Creating and configuring the filter node instance in the Amazon cloud][anchor-node];
2.  [Creating an AMI on the basis of the configured filter node instance][anchor-ami].


##  1.  Creating and Configuring the Wallarm Filter Node Instance in the Amazon Cloud

Before creating an AMI you need to perform an initial configuration of a single Wallarm filter node. To configure a filter node, do the following:
1.  [Create][link-docs-aws-node-setup] a filter node instance in the Amazon cloud.
    
    !!! warning "Private SSH key"
        Make sure you have access to the private SSH key (stored in PEM format) that you [created][link-ssh-keys-guide] earlier to connect to the filter node.

    !!! warning "Provide the filter node with an internet connection"
        The filter node requires access to the Wallarm API server for proper operation. The choice of the Wallarm API server depends on the Wallarm Cloud you are using:
        
        *   If you are using the EU cloud, your node needs to be granted access to `https://api.wallarm.com:444`.
        *   If you are using the US cloud, your node needs to be granted access to `https://us1.api.wallarm.com:444`.
        
    Make sure that you choose the correct VPC and subnets and [configure a security group][link-security-group-guide] in a way that does not prevent the filter node from accessing Wallarm API servers.

2.  [Connect][link-cloud-connect-guide] the filter node to the Wallarm cloud.

    !!! warning "Use a token to connect to the Wallarm cloud"
        Please note that you need to connect the filter node to the Wallarm cloud using a token. Multiple filter nodes are allowed to connect to the Wallarm cloud using the same token. 
        
        Thus, upon filter nodes’ auto scaling, you will not need to manually connect each of the filter nodes to the Wallarm cloud.

3.  [Configure][link-docs-reverse-proxy-setup] the filter node to act as a reverse proxy for your web application.

4.  [Make sure][link-docs-check-operation] that the filter node is configured correctly and protects your web application against malicious requests.

After you have finished configuring the filter node, turn the virtual machine off by completing the following actions:
1.  Navigate to the *Instances* tab on the Amazon EC2 dashboard.
2.  Select your configured filter node instance.
3.  Select “Instance State” and then “Stop” in the *Actions* drop-down menu.

!!! info "Turning off with the `poweroff` command"
    You may also turn the virtual machine off by connecting to it via the SSH protocol and running the following command:
    
    ``` bash
    poweroff
    ```

##  2.  Creating an Amazon Machine Image

You can now create a virtual machine image based on the configured filter node instance. To create an image, perform the following steps:
1.  Proceed to the *Instances* tab on the Amazon EC2 dashboard.
2.  Select your configured filter node instance.
3.  Launch the image creation wizard by selecting “Image” and then “Create Image” in the *Actions* drop-down menu.

    ![!Launching the AMI creation wizard][img-launch-ami-wizard]
    
4.  The *Create Image* form will appear. Enter the image name into the *Image name* field. You can leave the remaining fields unaltered.

    ![!Configuring parameters in the AMI creation wizard][img-config-ami-wizard]
    
5.  Click the *Create Image* button to launch the virtual machine image creation process.
    
    When the image creation process is finished, the corresponding message is displayed. Navigate to the “AMIs” tab on the Amazon EC2 dashboard to make sure that the image was successfully created and has the “Available” status.
    
    ![!Exploring the created AMI][img-explore-created-ami]

!!! info "Image visibility"
    Because the prepared image contains settings that are specific to your application and the Wallarm token, it is not recommended to change the image visibility setting and make it public (by default, AMIs are created with the “Private” visibility setting).

Now you can [set up][link-docs-aws-autoscaling] the auto scaling of Wallarm filter nodes in the Amazon cloud using the prepared image.