[link-docs-gcp-autoscaling]:        autoscaling-overview.md
[link-docs-gcp-node-setup]:         ../../../installation/cloud-platforms/gcp/machine-image.md
[link-cloud-connect-guide]:         ../../../installation/cloud-platforms/gcp/machine-image.md#5-connect-the-filtering-node-to-the-wallarm-cloud
[link-docs-reverse-proxy-setup]:    ../../../installation/cloud-platforms/gcp/machine-image.md#6-configure-sending-traffic-to-the-wallarm-instance
[link-docs-check-operation]:        ../../installation-check-operation-en.md

[img-vm-instance-poweroff]:     ../../../images/installation-gcp/auto-scaling/common/create-image/vm-poweroff.png
[img-create-image]:             ../../../images/installation-gcp/auto-scaling/common/create-image/create-image.png
[img-check-image]:              ../../../images/installation-gcp/auto-scaling/common/create-image/image-list.png

[anchor-node]:  #1-creating-and-configuring-the-filtering-node-instance-on-the-google-cloud-platform
[anchor-gcp]:   #2-creating-a-virtual-machine-image

#   Creating an image with the Wallarm filtering node on the Google Cloud Platform

To set up auto scaling of the Wallarm filtering nodes deployed on the Google Cloud Platform (GCP) you first need virtual machine images. This document describes the procedure for preparing an image of the virtual machine with the Wallarm filtering node installed. For detailed information about setting up auto scaling, proceed to this [link][link-docs-gcp-autoscaling].

To create an image with the Wallarm filtering node on GCP, perform the following procedures:
1.  [Creating and configuring the filtering node instance on the Google Cloud Platform][anchor-node].
2.  [Creating a virtual machine image on the basis of the configured filtering node instance][anchor-gcp].

##  1.  Creating and configuring the filtering node instance on the Google Cloud Platform

Before creating an image, you need to perform an initial configuration of a single Wallarm filtering node. To configure a filtering node, do the following:
1.  [Create and configure][link-docs-gcp-node-setup] a filtering node instance on GCP.

    !!! warning "Provide the filtering node with an internet connection"
        The filtering node requires access to a Wallarm API server for proper operation. The choice of Wallarm API server depends on the Wallarm Cloud you are using:
        
        * If you are using the US Cloud, your node needs to be granted access to `https://us1.api.wallarm.com`.
        * If you are using the EU Cloud, your node needs to be granted access to `https://api.wallarm.com`.
    
    --8<-- "../include/gcp-autoscaling-connect-ssh.md"

2.  [Connect][link-cloud-connect-guide] the filtering node to the Wallarm Cloud.

    !!! warning "Use a token to connect to the Wallarm Cloud"
        Please note that you need to connect the filtering node to the Wallarm cloud using a token. Multiple filtering nodes are allowed to connect to the Wallarm cloud using the same token.
       
        Thus, you will not need to manually connect each of the filtering nodes to the Wallarm Cloud when they auto-scale. 

3.  [Configure][link-docs-reverse-proxy-setup] the filtering node to act as a reverse proxy for your web application.

4.  [Make sure][link-docs-check-operation] that the filtering node is configured correctly and protects your web application against malicious requests.

After you have finished configuring the filtering node, turn the virtual machine off by completing the following actions:
1.  Navigate to the **VM Instances** page in the **Compute Engine** section of the menu.
2.  Open the drop-down menu by clicking the menu button on the right of the **Connect** column.
3.  Select **Stop** in the drop-down menu.

![Turning the virtual machine off][img-vm-instance-poweroff]

!!! info "Turning off using the `poweroff` command"
    You may also turn the virtual machine off by connecting to it via the SSH protocol and running the following command:
    
    ``` bash
 	poweroff
 	```

##  2.  Creating a virtual machine image

You can now create a virtual machine image based on the configured filtering node instance. To create an image, perform the following steps:
1.  Navigate to the **Images** page in the **Compute Engine** section of the menu and click the **Create image** button.
2.  Enter the image name into the **Name** field.
3.  Select **Disk** from the **Source** drop-down list.
4.  Select the name of the [previously created][anchor-node] virtual machine instance from the **Source disk** drop-down list.

    ![Creating an image][img-create-image]

5.  Click the **Create** button to launch the virtual machine image creation process.

Once the image creation process is finished, you will be directed to a page that contains the list of available images. Make sure that the image was successfully created and is present in the list.

![Images list][img-check-image]

Now you can [set up the auto scaling][link-docs-gcp-autoscaling] of Wallarm filtering nodes on the Google Cloud Platform using the prepared image.