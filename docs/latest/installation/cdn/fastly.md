# Fastly

[Fastly](https://www.fastly.com/) is a cloud platform providing content delivery networks (CDNs) to efficiently transfer the application content to users by caching it on servers located around the world. With Wallarm, you can secure APIs of the applications delivered with Fastly. For this purpose, the specific Fastly configuration is used. This article explains how to attach Wallarm to Fastly.

The diagram below illustrates (TBD) the high-level traffic flow when Fastly is configured to work with the Wallarm node.

![Fastly with Wallarm connected](../../images/waf-installation/gateways/mulesoft/traffic-flow.png)

The solution involves deploying the Wallarm [OOB](../../installation/oob/overview.md) node externally and configuring Fastly to connect the node. This enables traffic mirroring to the external Wallarm node for analysis and notification about potential threats.

## Use case

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this solution is the recommended in case the application to be secured is delivered to users using the Fastly CDN service.

## Limitation

The solution can be used only for monitoring purposes.

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of the Fastly platform.
* Active Fastly service for delivering your application content to users.

## Deployment

To secure APIs on the Fastly platform using Wallarm, follow these steps:

1. Deploy a Wallarm node using one of the available deployment options.
1. Configure Fastly to mirror traffic to the Wallarm node for analysis.

--edit point TBD--

### 1. Deploy a Wallarm node

When connecting Wallarm with Fastly, the traffic flow is [out-of-band](../oob/overview.md) (traffic is mirrored).

1. Choose one of the [supported Wallarm node deployment solutions or artifacts](../supported-deployment-options.md#out-of-band) for out-of-band deployment and follow the provided deployment instructions.
1. Configure the deployed node using the following template (TBD):

    ```
    server {
        listen 80;

        server_name _;

        access_log off;
        wallarm_mode off;

        location / {
            proxy_set_header Host $http_x_forwarded_host;
            proxy_pass http://unix:/tmp/wallarm-nginx.sock;
        }
    }

    server {
        listen 443 ssl;

        server_name yourdomain-for-wallarm-node.tld;

        ### SSL configuration here

        access_log off;
        wallarm_mode off;

        location / {
            proxy_set_header Host $http_x_forwarded_host;
            proxy_pass http://unix:/tmp/wallarm-nginx.sock;
        }
    }


    server {
        listen unix:/tmp/wallarm-nginx.sock;
        
        server_name _;
        
        wallarm_mode monitoring;
        #wallarm_mode block;

        real_ip_header X-REAL-IP;
        set_real_ip_from unix:;

        location / {
            echo_read_request_body;
        }
    }
    ```

    Please ensure to pay attention to the following configurations:

    * TBD.
    * [Wallarm operation mode](../../admin-en/configure-wallarm-mode.md) configuration.

1. Once the deployment is complete, make a note of the node instance IP as you will need it later to set the address for incoming request forwarding.

### 2. Configure Fastly to mirror traffic to Wallarm node for analysis

To configure TBD, follow these steps:

1. TBD

Your custom policy is now available in your Mulesoft Anypoint Platform Exchange.

![Fastly with TBD](../../images/TBD/TBD.png)

### 3. Attach the Wallarm policy to your API

You can mirror all APIs or an individual API.

#### Mirroring all APIs

To mirror all APIs, follow these steps:

1. TBD.

#### Mirroring individual API

To secure an individual API with Wallarm, follow these steps:

1. TBD.

## Testing

To test the functionality of the Wallarm connected to Fastly, follow these steps:

1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to your API:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Open Wallarm Console → **Events** section in the [US Cloud](https://us1.my.wallarm.com/search) or [EU Cloud](https://my.wallarm.com/search) and make sure the attack is displayed in the list.
    
    ![Attacks in the interface][attacks-in-ui-image]

If the solution does not perform as expected, refer to the logs of your API by TBD.

## Need assistance?

If you encounter any issues or require assistance with the described deployment of Wallarm node in conjunction with Fastly, you can reach out to the [Wallarm support](mailto:support@wallarm.com) team. They are available to provide guidance and help resolve any problems you may face during the implementation process.
