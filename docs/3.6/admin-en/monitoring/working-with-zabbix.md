[img-zabbix-hosts]:           ../../images/monitoring/zabbix-hosts.png
[img-zabbix-items]:           ../../images/monitoring/zabbix-items.png
[img-zabbix-widget]:          ../../images/monitoring/zabbix-widget.png
[img-global-view-0]:          ../../images/monitoring/global-view-0-value.png
[img-global-view-16]:         ../../images/monitoring/global-view-16-value.png

[doc-zabbix-parameters]:      collectd-zabbix.md#4-add-custom-parameters-to-the-zabbix-agent-configuration-file-on-the-filter-node-host-to-get-the-metrics-you-need

#   Working with the Filter Node Metrics in Zabbix

Go to `http://10.0.30.30` to access the Zabbix web interface login page. Log in to the web interface using the standard login (`Admin`) and password (`zabbix`). 

To monitor the metrics of the `node.example.local` filter node, perform the following actions:

1.  Create a new host by performing the following steps:
    1.  Go to the *Configuration → Hosts* tab and click the *Create host* button.
    2.  Fill the fully qualified domain name of the filter node host in the *Host name* field (`node.example.local`).
    3.  Select the group you want to place the host into from the *Groups* field (for example, you can use the predefined “Linux servers” group, or create a dedicated group).
    4.  Fill the IP address of the filter node host (`10.0.30.5`) in the *Agent interfaces* parameter group. Leave the default port value (`10050`) unchanged.
      
        
        !!! info "Connecting using a domain name"
            If necessary, you can set up a domain name to connect to the Zabbix agent. To do this, change the appropriate settings accordingly.
        
      
    5.  Configure other settings, if necessary.
    6.  Make sure that the *Enabled* checkbox is checked.
    7.  Complete the host creation process by clicking the *Add* button.
    
    ![Configuring a Zabbix host][img-zabbix-hosts]
   
2.  Add metrics that should be monitored for the filter node host. To add a single metric, follow the steps below:
    1.  Click the name of the created host `node.example.local` in the list of hosts on the *Configuration → Hosts* tab.
    2.  A page with the host data will open. Switch to the *Items* tab and click the *Create item* button. 
    3.  Fill a metric name in the *Name* field (for example, `Wallarm NGINX Attacks`).
    4.  Leave the *Type*, *Host interface*, and *Type of information* parameters unchanged.
    5.  Enter the key name of the metric in the *Key* field (as specified in `UserParameter=` in the [Zabbix agent configuration][doc-zabbix-parameters]; for example, `wallarm_nginx-gauge-abnormal`).
    6.  If necessary, adjust the update frequency of the metric value and other parameters.
    7.  Make sure that the *Enabled* checkbox is checked.
    8.  Complete the process of adding a metric by clicking the *Add* button.
    
    ![Adding a metric][img-zabbix-items]

3.  Configure the visualization of the added metrics:
    1.  Click the Zabbix logo in the upper left corner of the web interface to access the dashboard. 
    2.  Click the *Edit dashboard* button to make changes to the dashboard:
        1.  Add a widget by clicking the *Add widget* button.
        2.  Select the required widget type (for example, “Plain Text”) from the *Type* drop-down list.
        3.  Fill any suitable name in the *Name* field.
        4.  Add the required metric to the *Items* list (e.g., the newly created `Wallarm NGINX Attacks`).
        5. Make sure that the *Show text as HTML* and *Dynamic Items* checkboxes are checked.
        6. Complete the *Add widget* wizard by clicking the *Add* button.
        
        ![Adding widget with the metric][img-zabbix-widget]
      
    3.  Save the changes that you made to the dashboard by clicking the *Save changes* button.

4.  Check the monitoring operation: 
    1.  Make sure that the current number of processed requests in the Zabbix widget matches the output of `wallarm-status` on the filter node.
    
        --8<-- "../include/monitoring/wallarm-status-check-padded-latest.md"

        ![Viewing the metric value][img-global-view-0]

    2.  Perform a test attack on an application protected by the filter node. To do this, you can send a malicious request to the application either with the `curl` utility or a browser.
        
        --8<-- "../include/monitoring/sample-malicious-request-for-deprecated.md"
        
    3.  Make sure that the request counter has increased in both the `wallarm-status` output and the Zabbix widget:
    
        --8<-- "../include/monitoring/wallarm-status-output-padded-latest.md"

        ![Viewing the changed metric value][img-global-view-16]

The Zabbix dashboard now displays the `wallarm_nginx/gauge-abnormal` metric of the `node.example.local` filter node. 