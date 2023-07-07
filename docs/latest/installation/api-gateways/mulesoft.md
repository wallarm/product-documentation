[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Mulesoft with Wallarm Policy

[MuleSoft](https://www.mulesoft.com/) is an integration platform that enables seamless connectivity and data integration between services with an API gateway serving as the entry point for client applications to access APIs. With Wallarm, you can secure APIs on the Mulesoft Anypoint platform using the Wallarm policy. This article explains how to attach and utilize the policy.

The diagram below illustrates the high-level traffic flow when Wallarm policy is attached to APIs on the MuleSoft Anypoint platform, and Wallarm is configured to block malicious activity.

![!Mulesoft with Wallarm policy](../../images/waf-installation/gateways/mulesoft/traffic-flow.png)

## Use cases

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this solution is the recommended one for the following use cases:

* Securing APIs deployed on the MuleSoft Anypoint platform with only one policy.
* Requiring a security solution that offers comprehensive attack observation, reporting, and instant blocking of malicious requests.

## Limitations

The solution has certain limitations as it only works with incoming requests:

* Most of  capabilities for vulnerability discovery do not function properly, as the solution lacks access to the server responses necessary for identifying vulnerabilities. This limitation affects the following features:

    * [Passive detection](../../about-wallarm/detecting-vulnerabilities.md#passive-detection)
    * [Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)
    * [Active Threat Verification](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)
* The [Wallarm API Discovery](../../about-wallarm/api-discovery.md) cannot explore API inventory based on your traffic, as the solution lacks access to the server responses required for its operation.
* The [protection against brute-force attacks and forced browsing](../../admin-en/configuration-guides/protecting-against-bruteforce.md) is not available since it requires response analysis, which is currently not feasible.

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of the Mulesoft platform.
* [Maven (`mvn`)](https://maven.apache.org/install.html) 3.8 or an earlier version is installed. Higher versions of Maven may encounter compatibility issues with the Mule plugin.
* You have been assigned the Mulesoft Exchange contributor's role, enabling you to upload artifacts to your organization's Mulesoft Anypoint Platform account.
* Your [Mulesoft Exchange credentials (username and password)](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange#deploying-a-policy-created-using-the-maven-archetype) are specified in the `<MAVEN_DIRECTORY>/conf/settings.xml` file.
* Your application and API are linked and running on Mulesoft.

## Deployment

To secure APIs on the Mulesoft Anypoint platform using Wallarm policy, follow these steps:

1. Deploy a Wallarm node using one of the available deployment options.
1. Obtain the Wallarm policy and upload it to Mulesoft Exchange.
1. Attach the Wallarm policy to your API.

### 1. Deploy a Wallarm node

When utilizing the Wallarm policy, the traffic flow is in-line. Therefore, choose one of the supported Wallarm node deployment solutions or artifacts for in-line deployment and follow the provided deployment instructions.

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

	real_ip_header X-FORWARDED-FOR;
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

### 2. Obtain and upload the Wallarm policy to Mulesoft Exchange

To acquire and [upload](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange) the Wallarm policy to Mulesoft Exchange, follow these steps:

1. Contact [support@wallarm.com](mailto:support@wallarm.com) to obtain the Wallarm Mulesoft policy.
1. Extract the policy archive once you receive it.
1. Navigate to the policy directory:

    ```
    cd <POLICY_DIRECTORY/wallarm
    ```
1. Within the `pom.xml` file → `groupId` parameter at the top of the file, specify your Mulesoft organization ID.

    You can find your organization ID by navigating to Mulesoft Anypoint Platform → **Access Management** → **Organization** → choose your organization → copy its ID.
1. Deploy the policy to Mulesoft using the following command:

    ```
    mvn clean deploy
    ```

Your custom policy is now available in your Mulesoft Anypoint Platform Exchange.

![!Mulesoft with Wallarm policy](../../images/waf-installation/gateways/mulesoft/wallarm-policy-in-exchange.png)

### 3. Attach the Wallarm policy to your API

You can attach the Wallarm policy to either all APIs or an individual API.

#### Attaching the policy to all APIs

To apply the Wallarm policy to all APIs using [Mulesoft's Automated policy option](https://docs.mulesoft.com/gateway/1.4/policies-automated-applying), follow these steps:

1. In your Anypoint Platform, navigate to **API Manager** → **Automated Policies**.
1. Click **Add automated policy** and select the Wallarm policy from Exchange.
1. Specify `WLRM REPORTING ENDPOINT` which is the IP address on the [Wallarm node instance](#1-deploy-a-wallarm-node) including the `http://` or `https://`.
1. If necessary, modify the maximum time period for Wallarm to process a single request by changing the value of `WALLARM NODE REQUEST TIMEOUT`.
1. Apply the policy.

![!Wallarm policy](../../images/waf-installation/gateways/mulesoft/automated-policy.png)

#### Attaching the policy to an individual API

To secure an individual API with the Wallarm policy, follow these steps:

1. In your Anypoint Platform, navigate to **API Manager** and select the desired API.
1. Navigate to **Policies** → **Add policy** and select the Wallarm policy.
1. Specify `WLRM REPORTING ENDPOINT` which is the IP address on the [Wallarm node instance](#1-deploy-a-wallarm-node) including the `http://` or `https://`.
1. If necessary, modify the maximum time period for Wallarm to process a single request by changing the value of `WALLARM NODE REQUEST TIMEOUT`.
1. Apply the policy.

![!Wallarm policy](../../images/waf-installation/gateways/mulesoft/policy-for-an-api.png)

## Testing

To test the functionality of the deployed policy, follow these steps:

1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to your API:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Open Wallarm Console → **Events** section in the [US Cloud](https://us1.my.wallarm.com/search) or [EU Cloud](https://my.wallarm.com/search) and make sure the attack is displayed in the list.
    
    ![!Attacks in the interface][attacks-in-ui-image]

    If the Wallarm node mode is set to blocking, the request will also be blocked.

If the solution does not perform as expected, refer to the logs of your API by accessing Mulesoft Anypoint Platform → **Runtime Manager** → your application → **Logs**.

You can also verify whether the policy is applied to the API by navigating to your API in the **API Manager** and reviewing the policies applied on the **Policies** tab. For automated policies, you can use the **See covered APIs** option to view the APIs covered and the reasons for any exclusions.

## Updating and uninstalling

To update the deployed Wallarm policy, follow these steps:

1. Remove the currently deployed Wallarm policy using the **Remove policy** option in either the automated policy list or the list of policies applied to an individual API.
1. Add the new policy following the steps 2-3 above.
1. Restart attached applications in the **Runtime Manager** to apply new policy.

To uninstall the policy, simply perform the first step of the update process.

## Need assistance?

If you encounter any issues or require assistance with the described deployment of Wallarm's policy in conjunction with MuleSoft, you can reach out to the [Wallarm support](mailto:support@wallarm.com) team. They are available to provide guidance and help resolve any problems you may face during the implementation process.
