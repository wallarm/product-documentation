# Mulesoft with Automated Wallarm Policy

[MuleSoft](https://www.mulesoft.com/) is an integration platform that enables seamless connectivity and data integration between systems, applications, and services. With Wallarm, you can secure APIs on the Mulesoft Anypoint platform using the Wallarm's policy. This article explains how to attach and utilize the policy.

The following scheme demonstrates the high-level traffic flow with Wallarm policy attached to APIs on the Mulesoft Anypoint platform when Wallarm is set to blocking malicious activity:

![!Mulesoft with Wallarm policy](../../images/waf-installation/gateways/mulesoft/traffic-flow.png)

## Use cases

Among all supported [Wallarm deployment options], this solution is the recommended one for the following use cases:

* You need to secure APIs deployed on the Mulesoft Anypoint platform.
* You need a security solution that provides comprehensive attack observation and reporting and at the same time provided the ability of instant blocking of malicious requests.

## Limitations

As the solution works only with incoming requests and , the solution has some limitations:

* Most of the Wallarm capabilities for vulnerability discovery do not work as the solution does not have access to server responses required for vulnerability identification. This limitation relates to the following features:

    * [Passive detection](../../../about-wallarm/detecting-vulnerabilities.md#passive-detection)
    * [Vulnerability Scanner](../../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)
    * [Active Threat Verification](../../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)
* The [Wallarm API Discovery](../../../about-wallarm/api-discovery.md) does not explore API inventory based on your traffic as the solution does not have access to server responses required for the module operation.

## Requirements

* [Maven (`mvn`)](https://maven.apache.org/install.html) 3.8 or earlier installed

    Maven of higher versions has compatibility issues with the Mule plugin.
* Mulesoft Exchange contributor's role assigned to you to upload artifacts to Mulesoft exchange in your organization's Mulesoft Anypoint Platform account
* Your [username and password](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange#deploying-a-policy-created-using-the-maven-archetype) of the Mulesoft Exchange credentials specified in `<MAVEN_DIRECTORY>/conf/settings.xml` file 
* Application and API linked and running on Mulesoft

## Deployment

To secure APIs on the Mulesoft Anypoint platform using the Wallarm's policy:

1. Deploy Wallarm node by one of the available deployment options.
1. Get the Wallarm's policy and upload it to Mulesoft Exchange.
1. Attach the Wallarm's policy to your API.

### 1. Deploying a Wallarm node

With the Wallarm policy, traffic flow is in-line. Since that, please choose one of the supported Wallarm node deployment solution/artifact for in-line deployment and follow the instructions on its deployment:

* Docker Images:
    * NGINX-based: admin-en/installation-docker-en.md
    * Envoy-based: admin-en/installation-guides/envoy/envoy-docker.md
* Linux Packages:
    * Individual packages for NGINX stable: installation/nginx/dynamic-module.md
    * Individual packages for NGINX Plus: installation/nginx-plus.md
    * Individual packages for Distribution-Provided NGINX: installation/nginx/dynamic-module-from-distr.md
    * All‑in‑One Installer: installation/nginx/all-in-one.md
* Cloud Images:
    * AWS AMI: installation/packages/aws-ami.md
    * GCP Machine Image: installation/packages/gcp-machine-image.md
* Terraform Module for AWS:
            - Proxy in AWS VPC: installation/cloud-platforms/aws/terraform-module/proxy-in-aws-vpc.md
            - Proxy for Amazon API Gateway: installation/cloud-platforms/aws/terraform-module/proxy-for-aws-api-gateway.md
        - Google Cloud:
          - GCE: installation/cloud-platforms/gcp/docker-container.md
        - Microsoft Azure:
          - Azure Container Instances: installation/cloud-platforms/azure/docker-container.md
        - Alibaba Cloud:
          - ECS: installation/cloud-platforms/alibaba-cloud/docker-container.md
* Kubernetes:

    * NGINX Ingress controller
    * Kong Ingress controller
    * Sidecar proxy
    ???

If you need the Wallarm node accept HTTPS traffic, configure it on the node side

Specify server_name yourdomain-for-wallarm-node.tld;

Once the deployment is done, copy the node instance IP. You will need it later to set the address for incoming request forwarding.


specify proxy_pass

### 2. Get the Wallarm's policy and upload it to Mulesoft Exchange

To get and [upload](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange) the Wallarm's policy to Mulesoft Exchange:

1. Contact support@wallarm.com to get the Wallarm's Mulesoft policy.
1. Once you get the policy archive, extract it.
1. Proceed to the policy directory:

    ```
    cd <POLICY_DIRECTORY/wallarm
    ```
1. Within the `pom.xml` file → `groupId` parameter at the top of the file, specify with your Mulesoft's organization ID.

    You can find your organization ID by navigating to Mulesoft Anypoint Platform → Access Management → Organization choose your organization → copy its ID.
1. Deploy the policy to Mulesoft Exchange by using the following command:

    ```
    mvn clean deploy
    ```

The custom policy is now available in your Mulesoft Anypoint Platform Exchange.

![!Mulesoft with Wallarm policy](images/waf-installation/gateways/mulesoft/wallarm-policy-in-exchange.png)

### 3. Attach the Wallarm's policy to your API

You can attach the policy to either all APIs or to an individual API.

#### Attaching the policy to all APIs

You can apply the Wallarm's policy to all the APIs by using [Mulesoft's Automated policy](https://docs.mulesoft.com/gateway/1.4/policies-automated-applying) option:

1. In your Anypoint Platform, navigate to **API Manager** → **Automated Policies**.
1. Click **Add automated policy** and select the Wallarm's policy from Exchange.
1. Specify `WLRM REPORTING ENDPOINT` which is the IP address on the [Wallarm node instance] including the `http://` or `https://`.
1. If necessary, change the maximum time period for Wallarm to process one request in `WALLARM NODE REQUEST TIMEOUT`.
1. Apply the policy.

![!Automated Wallarm policy](images/waf-installation/gateways/mulesoft/automated-policy.png)

#### Attaching the policy to an individual API

To secure an individual API, you can apply the Wallarm's policy only to it:

1. In your Anypoint Platform, navigate to **API Manager** and choose the API you want to apply the Wallarm policy.
1. Navigate to **Policies** → **Add policy** and select the Wallarm's policy.
1. Specify `WLRM REPORTING ENDPOINT` which is the IP address on the [Wallarm node instance] including the `http://` or `https://`.
1. If necessary, change the maximum time period for Wallarm to process one request in `WALLARM NODE REQUEST TIMEOUT`.
1. Apply the policy.

![!Automated Wallarm policy](images/waf-installation/gateways/mulesoft/policy-for-an-api.png)

## Testing

To test how the deployed policy operates:

1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to your API:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Open Wallarm Console → **Events** section in the [US Cloud](https://us1.my.wallarm.com/search) or [EU Cloud](https://my.wallarm.com/search) and make sure the attack is displayed in the list.
    
    ![!Attacks in the interface][attacks-in-ui-image]

    If the Wallarm node mode is set to blocking, the request is also blocked.

If the solution does not work as expected, refer to the logs of your API by navigating to Mulesoft Anypoint Platform → **Runtime Manager** → your application → **Logs**.

Yopu can also check whether the policy is applied to API or not by navigating to your API in **API Manager** and checking policies applied on the **Policies** tab. As for automated policy, you can use the **See covered APIs** option next to it and view what APIs are covered and reasons why they are not.

## Updating and uninstalling

To update the deployed Wallarm's policy:

1. Remove the deployed Wallarm's policy by using the **Remove policy** option in its menu in either the automated policy list or in the list of policies applied to an individual API.
1. [Add] the new policy.
1. Restart attached applications in the Runtime Manager to apply new policy.

To uninstall the policy, just perform the 1st step.





it links to gateway??













inline and out of band??
