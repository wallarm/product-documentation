# Description of Example Terraform Code

The Terraform code should be pretty self-explanatory. Only parts performing the [deployment](#configuration-of-wallarm-waf-node-deployment) and [autoscaling](#configuration-of-wallarm-waf-node-autoscaling) of Wallarm WAF nodes are provided below.

## Configuration of Wallarm WAF Node Deployment

Deployment settings are performed in the `wallarm_launch_config` object of the `main.tf` file. In the current example the code performs the following operations on a freshly started WAF node:

1. Create local files `/etc/nginx/key.pem` and `/etc/nginx/cert.pem` holding a self-signed SSL certificate and its private key. In production use, the files should be replaced with real SSL certificate and private key data.
2. Create local file `/etc/nginx/sites-available/default` with the configuration of web resources to be protected. In this example the system will define for the following properties:

  * HTTP and HTTPS server configuration blocks as the default proxy servers for all incoming requests,
  * a health check endpoint defined as `/healthcheck` and it always returns an HTTP status code 200,
  * proxy all incoming HTTP and HTTPS requests to the DNS name of the Wordpress ELB instance as defined in Terraform variable `${aws_elb.wp_elb.dns_name}`.

3. Run a set of commands to configure the WAF node (described in the `runcmd` block):

  * add the new node to the Wallarm cloud,  
  * test the configuration and start a local NGINX instance.

## Configuration of Wallarm WAF Node Autoscaling

Autoscaling settings are performed in the following object of the `main.tf` file:

```
resource "aws_autoscaling_group" "wallarm_waf_asg" {
  lifecycle { create_before_destroy = true }

  name                 = "tf-wallarm-demo-waf-asg-${aws_launch_configuration.wallarm_launch_config.name}"
  launch_configuration = "${aws_launch_configuration.wallarm_launch_config.name}"
  min_size             = "2"
  max_size             = "5"
  min_elb_capacity     = "2"
  availability_zones   = [var.az_a]
  vpc_zone_identifier  = ["${aws_subnet.public_a.id}"]
  target_group_arns = [ "${aws_lb_target_group.wallarm_asg_target_http.arn}", "${aws_lb_target_group.wallarm_asg_target_https.arn}"
  ]

  enabled_metrics = [
    "GroupMinSize",
    "GroupMaxSize",
    "GroupDesiredCapacity",
    "GroupInServiceInstances",
    "GroupTotalInstances"
  ]
  metrics_granularity = "1Minute"

  tag {
      key                 = "Name"
      value               = "tf-wallarm-demo-waf-node"
      propagate_at_launch = true
    }
}
```

* Enabled CloudWatch metrics (`enabled_metrics` statement) are required for automatic scaling of the ASG size depending on CPU load. You can omit this part if you plan to use a fixed amount of WAF nodes in the ASG.

* Autoscaling policies `wallarm_policy_up` and `wallarm_policy_down` (and associated CloudWatch metric alarms) are defining CPU usage thresholds and periods which will trigger ASG up or down scaling activities. 
* Configuration statement `lifecycle { create_before_destroy = true }` defines that should there be a need to introduce a change in the WAF cluster's configuration Terraform will first create a new set of Launch Configuration and ASG objects, verify that new WAF nodes have been recognized by the associated load balancer as healthy (statement `min_elb_capacity`), and only after that remove old Launch Configuration and ASG resources. The approach guarantees that new WAF configuration changes can be rollout out with no interruption to the traffic flow.