[link-ssh-keys]:            https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-key-pair
[link-sg]:                  https://docs.aws.amazon.com/en_us/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-base-security-group
[link-launch-instance]:     https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance

[anchor1]:      #3-create-a-security-group
[anchor2]:      #2-create-a-pair-of-ssh-keys

[img-create-sg]:                ../../../../images/installation-ami/common/create_sg.png
[versioning-policy]:            ../../../updating-migrating/versioning-policy.md#version-list
[img-wl-console-users]:         ../../../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../../admin-en/supported-platforms.md

[node-token]:                       ../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../user-guides/settings/api-tokens.md
[platform]:                         ../../../admin-en/supported-platforms.md
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../../images/admin-guides/test-attacks-quickstart.png

# Deploying Wallarm OOB from Amazon Machine Image

This article instructs you on deploying Wallarm [OOB](overview.md) on AWS from the [official Amazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD). The described solution is intended to analyze a traffic mirror produced by a web server.

<!-- ???
say that all regions are supported -->

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami.md"

## 6. Enable Wallarm to analyze the mirrored traffic

By default, the deployed Wallarm node does not analyze incoming traffic.

To start traffic analysis, change the `/etc/nginx/sites-enabled/default` file as follows:

1. For the Wallarm node to accept mirrored traffic, set the following configuration:

    ```
    wallarm_force server_addr $http_x_server_addr;
    wallarm_force server_port $http_x_server_port;
    #Change 222.222.222.22 to the address of the mirroring server
    set_real_ip_from  222.222.222.22;
    real_ip_header    X-Forwarded-For;
    real_ip_recursive on;
    wallarm_force response_status 0;
    wallarm_force response_time 0;
    wallarm_force response_size 0;
    ```

    * The `set_real_ip_from` and `real_ip_header` directives are required to have Wallarm Console [display the IP addresses of the attackers](../../../admin-en/using-proxy-or-balancer-en.md).
    * The `wallarm_force_response_*` directives are required to disable analysis of all requests except for copies received from the mirrored traffic.
1. For the Wallarm node to analyze the mirrored traffic, se the `wallarm_mode` directive to `monitoring`:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    Since malicious requests [cannot] be blocked, the only [mode] Wallarm analyzes traffic is monitoring. For in-line deployment, there are also safe blocking and blocking modes but even if you set the `wallarm_mode` directive to a value different from monitoring, the node continues to monitor traffic and only record malicious traffic (aside from the mode set to off).

## 7. Restart NGINX

To apply the settings, restart NGINX:

``` bash
sudo systemctl restart nginx
```

Each configuration file change requires NGINX to be restarted to apply it.

## 8. Test the Wallarm operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 9. Configure your web server to produce a traffic mirror

Configure your web server to mirror incoming traffic to the Wallarm node. For configuration details, we recommend to refer to your web server documentation.

Inside the [link](overview.md#examples-of-web-server-configuration-for-traffic-mirroring), you will find the example configuration for the most popular of web servers (NGINX, Traefik, Envoy, Istio).

## Further fine-tuning

--8<-- "../include/installation-extra-steps.md"
