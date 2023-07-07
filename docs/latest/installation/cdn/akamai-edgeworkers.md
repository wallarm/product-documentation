[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Akamai EdgeWorkers with Wallarm Code Bundle

[Akamai EdgeWorkers](https://techdocs.akamai.com/edgeworkers/docs) is a powerful edge computing platform that allows for the execution of custom logic and the deployment of lightweight JavaScript functions at the edge of the platform. For customers who have their APIs and traffic running on Akamai EdgeWorkers, Wallarm provides a code bundle that can be deployed on Akamai EdgeWorkers to secure their infrastructure.

The solution involves deploying the Wallarm node externally and injecting custom code or policies into the specific platform. This enables traffic to be directed to the external Wallarm node for analysis and protection against potential threats. Referred to as Wallarm's connectors, they serve as the essential link between platforms like Azion Edge, Akamai Edge, Mulesoft, Apigee, and AWS Lambda, and the external Wallarm node. This approach ensures seamless integration, secure traffic analysis, risk mitigation, and overall platform security.

## Use cases

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this solution is the recommended one for the following use cases:

* Securing APIs or traffic running on Akamai EdgeWorkers.
* Requiring a security solution that offers comprehensive attack observation, reporting, and instant blocking of malicious requests.

## Limitations

The solution has certain limitations as it only works with incoming requests:

* Most of  capabilities for vulnerability discovery do not function properly, as the solution lacks access to the server responses necessary for identifying vulnerabilities. This limitation affects the following features:

    * [Passive detection](../../about-wallarm/detecting-vulnerabilities.md#passive-detection)
    * [Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)
    * [Active Threat Verification](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)
* The [Wallarm API Discovery](../../about-wallarm/api-discovery.md) cannot explore API inventory based on your traffic, as the solution lacks access to the server responses required for its operation.

There are also limitations caused by [EdgeWorkers product limitations](https://techdocs.akamai.com/edgeworkers/docs/limitations) and [http-request](https://techdocs.akamai.com/edgeworkers/docs/http-request):

* The only supported traffic delivery method is enhanced TLS.
* Maximum response header size is 8000 bytes.
* Maximum body size is 1 MB.
* Unsupported HTTP methods: `CONNECT`, `TRACE`, `OPTIONS` (supported methods: `GET`, `POST`, `HEAD`, `PUT`, `PATCH`, `DELETE`).
* Unsupported headers: `connection`, `keep-alive`, `proxy-authenticate`, `proxy-authorization`, `te`, `trailers`, `transfer-encoding`, `host`, `content-length`, `vary`, `accept-encoding`, `content-encoding`, `upgrade`.

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of Akamai EdgeWorkers technologies
* APIs or traffic running through Akamai EdgeWorkers.

## Deployment

To secure APIs on Akamai EdgeWorkers with Wallarm, follow these steps:

1. Deploy a Wallarm node using one of the available deployment options.
1. Obtain the Wallarm code bundle and run it on Akamai EdgeWorkers.

### 1. Deploy a Wallarm node

When utilizing Wallarm on Akami EdgeWorkers, the traffic flow is in-line. Therefore, choose one of the supported Wallarm node deployment solutions or artifacts for in-line deployment and follow the provided deployment instructions.

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
    * [Amazon Elastic Container Service (ECS)](../cloud-platforms/aws/docker-container.md)
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

### 2. Obtain the Wallarm code bundle and run it on Akamai EdgeWorkers

To acquire and [run](https://techdocs.akamai.com/edgeworkers/docs/deploy-hello-world-1) the Wallarm code bundle on Akamai EdgeWorkers, follow these steps:

1. Contact [support@wallarm.com](mailto:support@wallarm.com) to obtain the Wallarm code bundle.
1. [Add](https://techdocs.akamai.com/edgeworkers/docs/add-edgeworkers-to-contract) EdgeWorkers to your contract on Akamai.
1. [Create](https://techdocs.akamai.com/edgeworkers/docs/create-an-edgeworker-id) an EdgeWorker ID.
1. Open the created ID, press **Create Version** and [upload](https://techdocs.akamai.com/edgeworkers/docs/deploy-hello-world-1) the Wallarm code bundle.
1. **Activate** the created version, initially in the staging environment.
1. After confirming everything is working correctly, repeat the version publication in the production environment.
1. In **Akamai Property Manager**, choose or create a new property where you want install Wallarm.
1. [Create](https://techdocs.akamai.com/edgeworkers/docs/add-the-edgeworker-behavior-1) new behavior with newly created EdgeWorker, call it for example **Wallarm Edge** and add the following criteria:

    ```
    If 
    Request Header 
    X-EDGEWRK-REAL-IP 
    does not exist
    ```
1. Create another behavior **Wallarm Node** with **Origin Server** pointing to [previously deployed node](#1-deploy-a-wallarm-node). Switch **Forward Host Header** to **Origin Hostname** and add the following criteria:

    ```
    If 
    Request Header 
    X-EDGEWRK-REAL-IP 
    exist
    ```
1. Add new property variable `PMUSER_WALLARM_MODE` with [value](../../admin-en/configure-wallarm-mode.md) `monitoring` (default) or `block`. 
    
    Choose **Hidden** for Security settings.
1. Save the new version and deploy it initially to the staging environment, and [then](https://techdocs.akamai.com/api-acceleration/docs/test-stage) to production.

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

If you encounter any issues or require assistance with the described deployment of Wallarm in conjunction with Akamai EdgeWorkers, you can reach out to the [Wallarm support](mailto:support@wallarm.com) team. They are available to provide guidance and help resolve any problems you may face during the implementation process.
