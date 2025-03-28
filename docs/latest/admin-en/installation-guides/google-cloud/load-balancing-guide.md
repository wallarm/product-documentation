[link-doc-asg-guide]:               creating-autoscaling-group.md  
[link-docs-check-operation]:        ../../../admin-en/uat-checklist-en.md
[link-lb-comparison]:               https://cloud.google.com/load-balancing/docs/load-balancing-overview
[link-creating-instance-group]:     creating-autoscaling-group.md
[link-backup-resource]:             https://cloud.google.com/load-balancing/docs/target-pools#backupPool
[link-health-check]:                https://cloud.google.com/load-balancing/docs/health-checks
[link-session-affinity]:            https://cloud.google.com/load-balancing/docs/target-pools#sessionaffinity
[link-test-attack]:                 ../../../admin-en/uat-checklist-en.md#node-registers-attacks
[link-network-service-tier]:        https://cloud.google.com/network-tiers/docs/

[img-backend-configuration]:        ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/backend-configuration.png
[img-creating-lb]:                  ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/creating-load-balancer.png
[img-creating-tcp-lb]:              ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/creating-tcp-load-balancer.png
[img-new-frontend-ip-and-port]:     ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/frontend-configuration.png
[img-checking-attacks]:             ../../../images/admin-guides/test-attacks-quickstart.png


#   Setting up incoming request balancing on GCP

Now that you have a [configured][link-doc-asg-guide] managed instance group with enabled auto scaling, you need to create and configure a Load Balancer that distributes incoming HTTP and HTTPS connections between several filtering nodes from the instance group.

You can configure the following types of Load Balancers on the Google Cloud Platform:
*   HTTP(S) Load Balancer
*   TCP Load Balancer
*   UDP Load Balancer

!!! info "The differences between Load Balancers"
    For detailed information about the differences between Load Balancers, proceed to this [link][link-lb-comparison]. 

This document demonstrates how to configure and use the TCP Load Balancer that distributes traffic at the transport level of the OSI/ISO network model.

Create a TCP Load Balancer for your instance group by completing the following actions: 

1.  Navigate to the **Load balancing** page in the **Network services** section of the menu and click the **Create load balancer** button.

2.  Click the **Start configuration** button on the **TCP load balancing** card.

3.  Select the required options in the following settings:

    1.  Select the **From Internet to my VMs** option in the **Internet facing or internal only** setting so that the load balancer will control incoming requests from clients to your server.
    
    2.  Select the **Single region only** option in the **Multiple regions or single region** setting.
    
        !!! info "Traffic balancing for resources located in different regions"
            This guide describes the configuration of the load balancer for one instance group located in a single region.
            
            In the case of balancing traffic for several resources located in multiple regions, select the **Multiple regions (or not sure yet)** option.

    ![Creating a load balancer][img-creating-lb]

    Click the **Continue** button.

4.  Enter the load balancer name into the **Name** field.

5.  Click the **Backend configuration** to use the [created instance group][link-creating-instance-group] as the backend to which the load balancer will route the incoming requests.

6.  Fill in the form with the following data:

    1.  Select the region where the instance group is located from the **Region** drop-down list.
    
    2.  Navigate to the **Select existing instance groups** tab in the **Backends** setting and select the name of the instance group from the **Add an instance group** drop-down list.
    
    3.  If necessary, specify the backup pool by selecting the **Create a backup pool** option from the **Backup Pool** drop-down list. 
    
        !!! info "Using a backup pool"
            A backup pool processes the requests if the instance group selected in the previous setting is unavailable. For detailed information about configuring a backup pool, proceed to this [link][link-backup-resource].
            
            This document does not describe the backup pool configuration.
    
    4.  If necessary, configure the group instances availability checkup by selecting the **Create a health check** option in the **Health check** drop-down list. For detailed information about the machine availability checkup, proceed to this [link][link-health-check].
    
        !!! info "The availability checkup"
            The availability checkup is not configured in the scope of this document. Thus, here the **No health check** option is selected in the **Health check** drop-down list.
    
    5.  If necessary, configure the method of choosing an instance for request processing by selecting the corresponding option in the **Session affinity** drop-down list. Detailed information about selecting an instance for request processing is available at this [link][link-session-affinity].
    
        !!! info "Configuring a method of choosing an instance"
            The method of choosing an instance for request processing is not in the scope of this document. Thus, here the **None** option is selected in the **Session affinity** drop-down list.
    
        ![Configuring a backend][img-backend-configuration]

7.  Click the **Frontend configuration** button to specify the IP addresses and ports to which clients will send their requests.

8.  Fill in the form for new IP addresses and ports creation with the required data:

    1.  If necessary, enter the new IP address and port pair's name into the **Name** field.
    
    2.  Select the required network service tier in the **Network Service Tier** setting. For detailed information about network service tiers, proceed to this [link][link-network-service-tier];
    
    3.  Select the IP address where the load balancer will receive requests from the **IP** drop-down list.
    
        1.  Select the **Ephemeral** option if you want the load balancer to obtain a new IP address upon each virtual machine startup.
        
        2.  Select the **Create IP address** option to generate a static IP address for your load balancer. 
        
        In the form that appears, enter the name of the new IP address into the **Name** field and click the **Reserve** button.
            
    4.  Enter the port where the load balancer will receive requests in the **Port** field. 
    
        !!! info "Choosing the port"
            In this document, port `80` is specified for receiving requests via the HTTP protocol.
    
    ![New frontend IP and port creation form][img-new-frontend-ip-and-port]
    
    Click the **Done** button to create the configured IP address and port pair.
    
    !!! info "Required frontend ports"
        In this document, the balancer is configured for receiving requests via the HTTP protocol. If your instance group receives requests via the HTTPS protocol, create another IP address and port pair that specifies port `443`.

9.  Click the **Create** button to create the configured load balancer.

    ![Creating a TCP load balancer][img-creating-tcp-lb]
    
Wait until the load balancer creation process is finished and the load balancer connects to the instance group that you created earlier.

Because the created TCP balancer uses the Backend service (which works together with the backend created for your instance group), the instance group requires no configuration modifications for the balancer to connect to it.

Now the dynamically scaling set of the Wallarm filtering nodes will process the incoming traffic to your application.

To check the deployed filtering nodes operation, perform the following steps:
1.  Make sure that your application is accessible through the load balancer and the Wallarm filtering nodes by referring to the balancer IP address or domain name using your browser.
2.  Make sure that the Wallarm services protect your application by [performing a test attack][link-test-attack].

![The «Events» tab on the Wallarm web interface][img-checking-attacks]