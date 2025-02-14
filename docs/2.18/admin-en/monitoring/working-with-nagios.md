[img-nagios-service-status]:            ../../images/monitoring/nagios-service-status.png
[img-nagios-service-details]:           ../../images/monitoring/nagios-service-details-1.png
[img-nagios-service-perfdata-updated]:  ../../images/monitoring/nagios-service-details-2.png

[link-PNP4Nagios]:                      http://www.pnp4nagios.org/doku.php?id=pnp-0.4:start

#   Working with the Filter Node Metrics in Nagios

Verify that Nagios is successfully monitoring the status of the previously created service:
1.  Log in to the Nagios web interface.
2.  Go to the services page by clicking on the “Services” link.
3.  Make sure that the `wallarm_nginx_attacks` service is displayed and has the “OK” status:

    ![Service status][img-nagios-service-status]

    
    !!! info "Forcing service check"
        If the service does not have the “OK” status, you can force a check of the service to confirm its status.
        
        To do this, click on the service name in the “Service” column, and then run the check by selecting “Reschedule the next check of this service” in the “Service Commands” list and entering the necessary parameters.    
    

4.  View detailed information about the service by clicking on the link with its name in the “Status” column:

    ![Detailed information about service][img-nagios-service-details]

    Make sure that the metric value displayed in Nagios (the “Performance Data” row) matches the `wallarm-status` output on the filter node:

    --8<-- "../include/monitoring/wallarm-status-check.md"
 
5.  Perform a test attack on an application protected by the filter node. To do this, you can send a malicious request to the application either with the curl utility or a browser.

    --8<-- "../include/monitoring/sample-malicious-request-for-deprecated.md"
    
6.  Ensure that the “Performance Data” value in Nagios has increased and matches the value displayed by `wallarm-status` on the filter node:

    --8<-- "../include/monitoring/wallarm-status-output.md"

    ![Updated Performance Data value][img-nagios-service-perfdata-updated]

Now the values of the `wallarm_nginx/gauge-attacks` metric of the filter node are displayed in the service state information in Nagios.

!!! info "Nagios data visualization"
    By default, Nagios Core only supports tracking service status (`OK`, `WARNING`, `CRITICAL`). To store and visualize metric values contained in “Performance Data,” you can use third-party utilities, for example, [PNP4Nagios][link-PNP4Nagios].
