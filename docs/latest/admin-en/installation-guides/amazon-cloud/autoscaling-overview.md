[link-doc-aws-as]:          https://docs.aws.amazon.com/autoscaling/plans/userguide/what-is-aws-auto-scaling.html
[link-doc-ec2-as]:          https://docs.aws.amazon.com/autoscaling/ec2/userguide/GettingStartedTutorial.html
[link-doc-as-faq]:          https://aws.amazon.com/autoscaling/faqs/

[link-doc-ami-creation]:    create-image.md
[link-doc-asg-guide]:       autoscaling-group-guide.md
[link-doc-lb-guide]:        load-balancing-guide.md
[link-doc-create-template]: autoscaling-group-guide.md#1-creating-a-launch-template
[link-doc-create-asg]:      autoscaling-group-guide.md#2-creating-an-auto-scaling-group
[link-doc-create-lb]:       load-balancing-guide.md#1-creating-a-load-balancer
[link-doc-set-up-asg]:      load-balancing-guide.md#2-setting-up-an-auto-scaling-group-for-using-the-created-balancer


# Overview of the filtering node Auto Scaling Configuration on AWS

You can set up Wallarm filter node auto scaling to make sure that filter nodes are capable of handling traffic fluctuations, if there are any. Enabling auto scaling allows processing the incoming requests to the application using the filter nodes even when traffic soars significantly.

The Amazon cloud supports the following auto scaling methods:
*   AWS Autoscaling:
    The new auto scaling technology on the basis of the metrics that are collected by AWS.
    
    To see detailed information about AWS Auto Scaling, proceed to this [link][link-doc-aws-as]. 

*   EC2 Autoscaling:
    The legacy auto scaling technology that allows creating custom variables for defining the scaling rules.
    
    To see detailed information about EC2 Auto Scaling, proceed to this [link][link-doc-ec2-as]. 
    
!!! info "Information about auto scaling methods"
    To see a detailed FAQ about auto scaling methods provided by Amazon, proceed to this [link][link-doc-as-faq]. 

This guide explains how to configure auto scaling of the filter nodes using EC2 Auto Scaling, but you can also use AWS Auto Scaling if needed.

!!! warning "Prerequisites"
    A virtual machine image (Amazon Machine Image, AMI) with the Wallarm filter node is required for setting up auto scaling.
    
    To see detailed information about creating an AMI with the filter node, proceed with this [link][link-doc-ami-creation].

!!! info "Private SSH key"
    Make sure you have access to the private SSH key (stored in PEM format) that you created earlier to connect to the filter node.

To enable filter node auto scaling in the Amazon cloud, do the following steps:
1.  [Set up filter node auto scaling][link-doc-asg-guide]
    1.  [Create a Launch Template][link-doc-create-template]
    2.  [Create an Auto Scaling Group][link-doc-create-asg]
2.  [Set up incoming requests balancing][link-doc-lb-guide]
    1.  [Create a load balancer][link-doc-create-lb]
    2.  [Set up an Auto Scaling Group for using the created balancer][link-doc-set-up-asg]