[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Azion Edge Firewall with Wallarm Functions

[Azion Edge Functions](https://www.azion.com/en/products/edge-functions/) enable the execution of custom code at the network edge, allowing for the implementation of customer rules to handle requests. By incorporating Wallarm custom code, incoming traffic can be proxied to the Wallarm node for analysis and filtering. This setup enhances the security measures already provided by [Azion Edge Firewall](https://www.azion.com/en/products/edge-firewall/). This guide provides instructions on how to integrate the Wallarm node with Azion Edge to protect services running on Azion Edge.

## Use cases

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this solution is the recommended one for the following use cases:

* Securing APIs or traffic running on Azion Edge.
* Requiring a security solution that offers comprehensive attack observation, reporting, and instant blocking of malicious requests.

## Limitations

The solution has certain limitations as it only works with incoming requests:

* Most of  capabilities for vulnerability discovery do not function properly, as the solution lacks access to the server responses necessary for identifying vulnerabilities. This limitation affects the following features:

    * [Passive detection](../../about-wallarm/detecting-vulnerabilities.md#passive-detection)
    * [Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)
    * [Active Threat Verification](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)
* The [Wallarm API Discovery](../../about-wallarm/api-discovery.md) cannot explore API inventory based on your traffic, as the solution lacks access to the server responses required for its operation.

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of Azion Edge technologies
* APIs or traffic running on Azion Edge.

## Deployment

To secure APIs on Azion Edge with Wallarm, follow these steps:

1. Deploy a Wallarm node using one of the available deployment options.
1. Obtain the Wallarm code for Edge Functions and run it on Azion.

### 1. Deploy a Wallarm node

When utilizing Wallarm on Azion Edge, the traffic flow is in-line. Therefore, choose one of the supported Wallarm node deployment solutions or artifacts for in-line deployment and follow the provided deployment instructions.

* Docker images:
    * [NGINX-based](../../admin-en/installation-docker-en.md)
    * [Envoy-based](../../admin-en/installation-guides/envoy/envoy-docker.md)
* Linux packages:
    * [Individual packages for NGINX stable](../nginx/dynamic-module.md)
    * [Individual packages for NGINX Plus](../nginx-plus.md)
    * [Individual packages for Distribution-Provided NGINX](../nginx/dynamic-module-from-distr.md)
    * [All‑in‑One Installer](../nginx/all-in-one.md)
* Public clouds:
    * [AWS AMI](../packages/aws-ami.md)
    * Terraform Module for AWS:
        * [Proxy in AWS VPC](../cloud-platforms/aws/terraform-module/proxy-in-aws-vpc.md)
        * [Proxy for Amazon API Gateway](../cloud-platforms/aws/terraform-module/proxy-for-aws-api-gateway.md)
    * [GCP Machine Image](../packages/gcp-machine-image.md)
    * [Google Compute Engine (GCE)](../cloud-platforms/gcp/docker-container.md)
    * [Microsoft Azure Container Instances](../cloud-platforms/azure/docker-container.md)
    * [Alibaba Elastic Compute Service (ECS)](../cloud-platforms/alibaba-cloud/docker-container.md)
* Kubernetes:
    * [NGINX Ingress Controller](../../admin-en/installation-kubernetes-en.md)
    * [Kong Ingress Controller](../kubernetes/kong-ingress-controller/deployment.md)
    * [Sidecar proxy](../kubernetes/sidecar-proxy/deployment.md)

Configure the deployed node using the following template:

```
server {
    listen 80;

    server_name _;

	access_log off;
	wallarm_mode off;

	location / {
		proxy_set_header Host $http_x_forwarded_host;
		proxy_pass http://127.0.0.1:18080;
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
		proxy_pass http://127.0.0.1:18080;
	}
}


server {
	listen 127.0.0.1:18080;
	
	server_name _;
	
	wallarm_mode monitoring;
	#wallarm_mode block;

	real_ip_header X-EDGEWRK-REAL-IP;
	set_real_ip_from 127.0.0.1;

	location / {
		echo_read_request_body;
	}
}
```

Please ensure to pay attention to the following configurations:

* TLS/SSL certificates for HTTPS traffic: To enable the Wallarm node to handle secure HTTPS traffic, configure the TLS/SSL certificates accordingly. The specific configuration will depend on the chosen deployment method. For example, if you are using NGINX, you can refer to [its article](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/) for guidance.
* [Wallarm operation mode](../../admin-en/configure-wallarm-mode.md) configuration.

Once the deployment is complete, make a note of the node instance IP as you will need it later to set the address for incoming request forwarding.

### 2. Obtain the Wallarm code for Edge Functions and run it on Azion

To acquire and run the Wallarm code for Azion Edge Functions, follow these steps:

1. Contact [support@wallarm.com](mailto:support@wallarm.com) to obtain the Wallarm code.
1. On Azion Edge, go to **Billing & Subscriptions** and activate subscription on **Application Acceleration** and **Edge Functions**.
1. Create a new **Edge Application** and save it.
1. Open the created application → **Main Settings** and enable **Application Acceleration** and **Edge Functions**.
1. Navigate to **Domains** and click **Add Domain**.
1. Navigate to **Edge Functions**, click **Add Function** and choose the `Edge Firewall` type.
1. Paste the Wallarm source code replacing `wallarm.node.tld` with the address of [previously deployed Wallarm node](#1-deploy-a-wallarm-node).
1. Go to **Edge Firewall** → **Add Rule Set** → type **Name** → select **Domains** and turn on **Edge Functions**.
1. Switch to the **Functions** tab, click **Add Function** and select the previously created function.
1. Switch to the **Rules Engine** tab → **New Rule** and set the criteria for traffic to be filtered by Wallarm:

    * To analyze and filter all request, select `If Request URI starts with /`.
    * In **Behaviors**, choose `Then Run Function` and select the previously created function.

## Testing

To test the functionality of the deployed policy, follow these steps:

1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to your API:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Open Wallarm Console → **Events** section in the [US Cloud](https://us1.my.wallarm.com/search) or [EU Cloud](https://my.wallarm.com/search) and make sure the attack is displayed in the list.
    
    ![!Attacks in the interface][attacks-in-ui-image]

    If the Wallarm node mode is set to blocking, the request will also be blocked.

## Need assistance?

If you encounter any issues or require assistance with the described deployment of Wallarm in conjunction with Azion Edge, you can reach out to the [Wallarm support](mailto:support@wallarm.com) team. They are available to provide guidance and help resolve any problems you may face during the implementation process.
