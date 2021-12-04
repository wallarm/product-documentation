[link-doc-image-creation]:              create-image.md
[link-doc-template-creation]:           creating-instance-template.md
[link-doc-managed-autoscaling-group]:   creating-autoscaling-group.md
[link-doc-lb-guide]:                    load-balancing-guide.md

#   Setting up filtering node auto scaling on the Google Cloud Platform: Overview

You can set up Wallarm filtering node auto scaling on the Google Cloud Platform (GCP) to make sure that filtering nodes are capable of handling traffic fluctuations (if there are any). Enabling auto scaling allows the processing of incoming requests to the application using the filtering nodes even when traffic soars significantly.

!!! warning "Prerequisites"
    Setting up auto scaling requires the image of the virtual machine with the Wallarm filtering node.
    
    For detailed information about creating an image of the virtual machine with the Wallarm filtering node on GCP, proceed to this [link][link-doc-image-creation].

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

To auto scale filtering nodes on the Google Cloud Platform, perform the following steps:
1.  Set up filtering node auto scaling:
    1.  [Create a filtering node instance template][link-doc-template-creation];
    2.  [Create a managed instance group with auto scaling enabled][link-doc-managed-autoscaling-group];
2.  [Set up incoming requests balancing][link-doc-lb-guide].

!!! info "Required rights"
    Before setting up auto scaling, make sure that your GCP account has the `Compute Admin` role.