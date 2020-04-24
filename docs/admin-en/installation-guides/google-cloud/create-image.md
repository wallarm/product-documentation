[link-docs-gcp-autoscaling]:        autoscaling-overview.md
[link-docs-gcp-node-setup]:         ../../installation-gcp-en.md
[link-cloud-connect-guide]:         ../../installation-gcp-en.md#5-connect-the-filter-node-to-the-wallarm-cloud
[link-docs-reverse-proxy-setup]:    ../../../quickstart-en/qs-setup-proxy-en.md
[link-docs-check-operation]:        ../../installation-check-operation-en.md

[img-vm-instance-poweroff]:     ../../../images/installation-gcp/auto-scaling/common/create-image/vm-poweroff.png
[img-create-image]:             ../../../images/installation-gcp/auto-scaling/common/create-image/create-image.png
[img-check-image]:              ../../../images/installation-gcp/auto-scaling/common/create-image/image-list.png

[anchor-node]:  #1-creating-and-configuring-the-filter-node-instance-on-the-google-cloud-platform
[anchor-gcp]:   #2-creating-a-virtual-machine-image

#   Creating an Image with the Wallarm Filter Node on the Google Cloud Platform

To set up auto-scaling of the Wallarm filter nodes deployed on the Google Cloud Platform (GCP) you first need virtual machine images. This document describes the procedure for preparing an image of the virtual machine with the Wallarm filter node installed. For detailed information about setting up auto-scaling, proceed to this [link][link-docs-gcp-autoscaling].

To create an image with the Wallarm filter node on GCP, perform the following procedures:
1.  [Creating and configuring the filter node instance on the Google Cloud Platform][anchor-node].
2.  [Creating a virtual machine image on the basis of the configured filter node instance][anchor-gcp].

##  1.  Creating and Configuring the Filter Node Instance on the Google Cloud Platform

Before creating an image, you need to perform an initial configuration of a single Wallarm filter node. To configure a filter node, do the following:
1.  [Create and configure][link-docs-gcp-node-setup] a filter node instance on GCP.

    !!! warning "Provide the filter node with an internet connection"
        The filter node requires access to a Wallarm API server for proper operation. The choice of Wallarm API server depends on the Wallarm Cloud you are using:
        
        * If you are using the EU cloud, your node needs to be granted access to `https://api.wallarm.com:444`.
        * If you are using the US cloud, your node needs to be granted access to `https://us1.api.wallarm.com:444`.
    
    --8<-- "../include/gcp-autoscaling-connect-ssh.md"

2.  [Connect][link-cloud-connect-guide] the filter node to the Wallarm cloud.

    !!! warning "Use a token to connect to the Wallarm cloud"
        Please note that you need to connect the filter node to the Wallarm cloud using a token. Multiple filter nodes are allowed to connect to the Wallarm cloud using the same token.
       
        Thus, you will not need to manually connect each of the filter nodes to the Wallarm cloud when they auto-scale. 

3.  [Configure][link-docs-reverse-proxy-setup] the filter node to act as a reverse proxy for your web application.

4.  [Make sure][link-docs-check-operation] that the filter node is configured correctly and protects your web application against malicious requests.

After you have finished configuring the filter node, turn the virtual machine off by completing the following actions:
1.  Navigate to the *VM Instances* page in the *Compute Engine* section of the menu.
2.  Open the drop-down menu by clicking the menu button on the right of the *Connect* column.
3.  Select “Stop” in the drop-down menu.

![!Turning the virtual machine off][img-vm-instance-poweroff]

!!! info "Turning off using the `poweroff` command"
    You may also turn the virtual machine off by connecting to it via the SSH protocol and running the following command:
    
    ``` bash
 	poweroff
 	```

##  2.  Creating a Virtual Machine Image

You can now create a virtual machine image based on the configured filter node instance. To create an image, perform the following steps:
1.  Navigate to the *Images* page in the *Compute Engine* section of the menu and click the *Create image* button.
2.  Enter the image name into the *Name* field.
3.  Select “Disk” from the *Source* drop-down list.
4.  Select the name of the [previously created][anchor-node] virtual machine instance from the *Source disk* drop-down list.

    ![!Creating an image][img-create-image]

5.  Click the *Create* button to launch the virtual machine image creation process.

Once the image creation process is finished, you will be directed to a page that contains the list of available images. Make sure that the image was successfully created and is present in the list.

![!Images list][img-check-image]

Now you can [set up the auto-scaling][link-docs-gcp-autoscaling] of Wallarm filter nodes on the Google Cloud Platform using the prepared image.