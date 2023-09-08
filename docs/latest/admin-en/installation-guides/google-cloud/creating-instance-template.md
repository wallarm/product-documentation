#  Creating a filtering node instance template on GCP

[img-creating-template]:                ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-instance-template.png
[img-selecting-image]:                  ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/select-image.png

[link-creating-image]:                  create-image.md
[link-creating-instance-group]:         creating-autoscaling-group.md

A filtering node instance template will be used later as the base when creating a managed instance group. To create a filtering node instance template, perform the following:

1.  Navigate to the **Instance templates** page in the **Compute Engine** section of the menu and click the **Create instance template** button.
    
    ![Creating an instance template][img-creating-template]
    
2.  Enter the template name into the **Name** field.
3.  Select the virtual machine type to be used to launch a virtual machine with the filtering node on from the **Machine type** field. 

    !!! warning "Select the proper instance type"
        Select the same instance type that you used when you initially configured the filtering node (or a more powerful one).
        
        Using a less powerful instance type may lead to issues in filtering node operation.

4.  Click the **Change** button in the **Boot disk** setting. In the window that appears, navigate to the **Custom images** tab and select the name of the project where you created your virtual machine image from the **Show images from** drop-down list. Select the [previously created image][link-creating-image] from the list of available images of the project and click the **Select** button.

    ![Selecting an image][img-selecting-image]
    
5.  For the instances based on the template to be identical to the basic instance, configure all of the remaining parameters in the same way as you configured the parameters when [creating your base instance][link-creating-image].
    
    !!! info "Configuring the firewall"
        Make sure that the firewall does not block HTTP traffic to the created template. To enable HTTP traffic, select the **Allow HTTP traffic** checkbox.
    
    --8<-- "../include/gcp-autoscaling-connect-ssh.md"

6.  Click the **Create** button and wait until the template creation process is finished. 

After creating the instance template, you can proceed with the [creation of a managed instance group][link-creating-instance-group] with enabled auto scaling.
