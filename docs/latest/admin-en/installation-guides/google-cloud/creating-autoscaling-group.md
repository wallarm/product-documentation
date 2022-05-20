[img-creating-instance-group]:          ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-instance-group.png
[img-create-instance-group-example]:    ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-scalable-instance-group.png
[img-checking-nodes-operation]:         ../../../images/cloud-node-status.png

[link-cpu-usage-policy]:                            https://cloud.google.com/compute/docs/autoscaler/scaling-cpu-load-balancing
[link-http-load-balancing-policy]:                  https://cloud.google.com/compute/docs/autoscaler/scaling-cpu-load-balancing#scaling_based_on_https_load_balancing_serving_capacity
[link-stackdriver-monitoring-metric-policy]:        https://cloud.google.com/compute/docs/autoscaler/scaling-stackdriver-monitoring-metrics
[link-multiple-metrics-policy]:                     https://cloud.google.com/compute/docs/autoscaler/multiple-policies
[link-creating-load-balancer]:                      load-balancing-guide.md

#  Creating a managed instance group with enabled auto scaling

To create a managed instance group and configure its auto scaling, perform the following steps:

1.  Navigate to the **Instance groups** page in the **Compute Engine** section of the menu and click the **Create instance group** button.

    ![!Creating an instance group][img-creating-instance-group]

2.  Enter the instance group name into the **Name** field.

3.  Select **Managed instance group** in the **Group type** setting.

4.  Enable auto scaling for the instance group by selecting the **On** option from the **Autoscaling** drop-down list.

5.  Select the required scaling policy from the **Autoscaling policy** drop-down list. 
    
    Scaling policies contain rules for increasing and decreasing the size of the instance group. The system determines when it should add or remove an instance from the group to keep the metric on which the policy is based at the target level defined by the user.
    
    You can select one of the following policies:
    
    1.  CPU Usage: The size of the group is controlled to keep the average processor load of the virtual machines in the group at the required level ([CPU usage policy documentation][link-cpu-usage-policy]).
    2.  HTTP Load Balancing Usage: The size of the group is controlled to keep the load of the HTTP traffic balancer at the required level ([HTTP load balancing usage policy documentation][link-http-load-balancing-policy]).
    3.  Stackdriver Monitoring Metric: The size of the group is controlled to keep the selected metric from the Stackdriver Monitoring instrument at the required level ([Stackdriver Monitoring Metric policy documentation][link-stackdriver-monitoring-metric-policy]).
    4.  Multiple Metrics: The decision to change the size of the group is made on the basis of multiple metrics ([multiple metrics policy documentation][link-multiple-metrics-policy]). 
    
    This guide uses the **CPU usage** policy to demonstrate the principles of working with the auto scaling mechanism.
    
    To apply this policy, specify the required average processors' load level in the **Target CPU usage** field (in percentages).
    
    !!! info "Example"
        The following configuration describes the control of the instance group size to keep the average virtual machine processors' load at the 60 percent level.
        ![!Example: creating an instance group][img-create-instance-group-example]

6.  Specify the minimum instance group size in the **Minimum number of instances** field (e.g., two instances).

7.  Specify the maximum instance group size in the **Maximum number of instances** field (e.g., 10 instances).

8.  Specify the period of time during which the metric values should not be recorded from the newly added instance in the **Cool down period** field (e.g., 60 seconds). This may be necessary if you see resource consumption leaps after adding a new instance. 

    !!! info "Cooldown period requirements"
        The cooldown period must be longer than the time required for instance initialization.

9.  Make sure all of the parameters of the instance group are configured correctly and then click the **Create** button.

The specified number of instances will automatically launch upon the successful creation of the auto scaling group.

You can check that the auto scaling group was created correctly by viewing the number of launched instances in the group and comparing this data point with the number of filtering nodes connected to the Wallarm Cloud.

You can do this using Wallarm Console. For example, if two instances with filtering nodes are concurrently operating, Wallarm Console will display this number for the corresponding Wallarm node in the **Nodes** section.

![!The **Nodes** nodes tab on the Wallarm web interface][img-checking-nodes-operation]

You can now proceed with the [creation and configuration of a load balancer][link-creating-load-balancer].