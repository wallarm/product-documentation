[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# Apigee Edge with Wallarm Proxy Bundle

[Apigee Edge](https://docs.apigee.com/api-platform/get-started/what-apigee-edge) is an API management platform with an API gateway serving as the entry point for client applications to access APIs. To enhance API security in Apigee, you can integrate Wallarm's API proxy bundle as detailed in this article.

The solution involves deploying the Wallarm node externally and injecting custom code or policies into the specific platform. This enables traffic to be directed to the external Wallarm node for analysis and protection against potential threats. Referred to as Wallarm's connectors, they serve as the essential link between platforms like Azion Edge, Akamai Edge, MuleSoft, Apigee, and AWS Lambda, and the external Wallarm node. This approach ensures seamless integration, secure traffic analysis, risk mitigation, and overall platform security.

## Use cases

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this solution is the recommended one for the following use cases:

* Securing APIs deployed on the Apigee platform with only one API proxy.
* Requiring a security solution that offers comprehensive attack observation, reporting, and instant blocking of malicious requests.

## Limitations

The solution has certain limitations as it only works with incoming requests:

* Vulnerability discovery using the [passive detection](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) method does not function properly. The solution determines if an API is vulnerable or not based on server responses to malicious requests that are typical for the vulnerabilities it tests.
* The [Wallarm API Discovery](../../api-discovery/overview.md) cannot explore API inventory based on your traffic, as the solution relies on response analysis.
* The [protection against forced browsing](../../admin-en/configuration-guides/protecting-against-bruteforce.md) is not available since it requires response code analysis.

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of the Apigee platform.
* Your APIs are running on Apigee.

## Deployment

To secure APIs on the Apigee platform with, follow these steps:

1. Deploy a Wallarm node on the GCP instance.
1. Obtain the Wallarm proxy bundle and upload it to Apigee.

### 1. Deploy a Wallarm node

When using the Wallarm proxy on Apigee, the traffic flow operates [in-line](../inline/overview.md). Therefore, choose one of the supported Wallarm node deployment artifacts for in-line deployment on Google Cloud Platform:

* [GCP Machine Image](../cloud-platforms/gcp/machine-image.md)
* [Google Compute Engine (GCE)](../cloud-platforms/gcp/docker-container.md)

Configure the deployed node using the following template:

```
server {
	listen 80 default_server;
	listen [::]:80 default_server;

	server_name _;

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
	
	wallarm_mode block;
	real_ip_header X-LAMBDA-REAL-IP;
	set_real_ip_from unix:;

	location / {
		echo_read_request_body;
	}
}
```

After the deployment is finished, take note of the IP address of the node instance as it will be necessary for configuring incoming request forwarding. Please note that the IP can be internal; there is no requirement for it to be external.

### 2. Obtain the Wallarm proxy bundle and upload it to Apigee

The integration involves creating an API proxy on Apigee that will route legitimate traffic to your APIs. To accomplish this, Wallarm provides a custom configuration bundle. Follow these steps to acquire and [use](https://docs.apigee.com/api-platform/fundamentals/build-simple-api-proxy) the Wallarm bundle for the API proxy on Apigee:

1. Contact [support@wallarm.com](mailto:support@wallarm.com) to obtain the Wallarm proxy bundle for Apigee.
1. In the Apigee Edge UI, navigate to **Develop** → **API Proxies** → **+Proxy** → **Upload proxy bundle**.
1. Upload the bundle provided by the Wallarm support team.
1. Open the imported configuration file and specify the [IP address of the Wallarm node instance](#1-deploy-a-wallarm-node) in `prewall.js` and `postwall.js`.
1. Save and deploy the configuration.

## Testing

To test the functionality of the deployed policy, follow these steps:

1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to your API:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.
    
    ![Attacks in the interface][attacks-in-ui-image]

    If the Wallarm node mode is set to blocking, the request will also be blocked.

## Need assistance?

If you encounter any issues or require assistance with the described deployment of Wallarm in conjunction with Apigee, you can reach out to the [Wallarm support](mailto:support@wallarm.com) team. They are available to provide guidance and help resolve any problems you may face during the implementation process.
