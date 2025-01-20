[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# Broadcom Layer7 API Gateways

Broadcom's [Layer7 API Gateways](https://www.broadcom.com/products/software/api-management/layer7-api-gateways) provide a robust solution for controlling and securing an organization's API traffic. Wallarm can function as a connector to enhance the security of APIs managed through Broadcom Layer7 API Gateways.

To use Wallarm as a connector for Broadcom Layer7 API Gateway, you need to **deploy the Wallarm Node externally** and **configure Wallarm policies on the gateway** to route traffic to the Wallarm Node for analysis.

The Broadcom connector supports only [in-line](../inline/overview.md) traffic flow.

<!-- The Wallarm policy for Layer7 API Gateways supports the [out-of-band](../oob/overview.md) mode. Diagram below shows the traffic flow for APIs on the Layer7 API Gateways with Wallarm policy applied.

![Layer7 API Gateways with Wallarm image](../../images/waf-installation/gateways/layer7/traffic-flow-oob.png) -->

## Use cases

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this solution is recommended in case when you manage your APIs with the Layer7 API Gateways.

## Limitations

* [Rate limiting](../../user-guides/rules/rate-limiting.md) by the Wallarm rule is not supported.
* [Multitenancy](../multi-tenant/overview.md) is not supported yet.

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of the Broadcom Layer7 API Gateways product.
* Your application and API are linked and running on Broadcom Layer7 API Gateways.
* Broadcom Policy Manager is installed and connected to the Broadcom Gateway.

## Deployment

### 1. Deploy a Wallarm Node

The Wallarm Node is a core component of the Wallarm platform that you need to deploy. It inspects incoming traffic, detects malicious activities, and can be configured to mitigate threats.

You need to deploy it in your own infrastructure as a separate service using one of the following artifacts:

* [All-in-one installer](../native-node/all-in-one.md) for Linux infrastructures on bare metal or VMs
* [Docker image](../native-node/docker-image.md) for environments that use containerized deployments
* [Helm chart](../native-node/helm-chart.md) for infrastructures utilizing Kubernetes

### 2. Add the Node's SSL/TLS certificate to the Policy Manager

To enable the Broadcom Gateway to route traffic to the Wallarm Node over HTTPS, add the Node's SSL/TLS certificate to the Policy Manager:

1. Open Broadcom Policy Manager → **Tasks** → **Certificates, Keys and Secrets** → **Manage Certificates**.
1. Click **Add** → **Retrieve via SSL** and specify the [Wallarm Node's address](#1-deploy-a-wallarm-node).

### 3. Obtain and deploy Wallarm policies

To configure the Broadcom Gateway to route traffic through the Wallarm Node:

1. Contact sales@wallarm.com to get the Wallarm policy code bundles.
1. Open Broadcom Policy Manager → your Broadcom Gateway's menu → **Create Policy** and add 2 policies:

    * **Request forwarding policy**: Assign the `Global Policy Fragment` type and `message-received` tag.

        ![](../../images/waf-installation/gateways/layer7/request-policy.png)
    
    * **Response forwarding policy**: Assign the `Global Policy Fragment` type and `message-completed` tag.
    
        ![](../../images/waf-installation/gateways/layer7/response-policy.png)
1. <a name="import-new-broadcom-policies"></a>For the request forwarding policy (`forward-requests-to-wallarm` in this example):

    1. Import the `wallarm-request-blocking.xml` file.
    1. Specify the [Wallarm Node instance](#1-deploy-a-wallarm-node) address in the `wlrm-node-addr` parameter.
    1. **Save and Active** the policy.

    ![](../../images/waf-installation/gateways/layer7/request-policy-assertion.png)
1. For the response forwarding policy (`forward-responses-to-wallarm` in this example):

    1. Import the `wallarm-response.xml` file.
    1. **Save and Active** the policy.

## Testing

To test the functionality of the deployed policy, follow these steps:

1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to your Gateway address:

    ```
    curl http://<YOUR_GATEWAY_ADDRESS>/etc/passwd
    ```
1. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.
    
    ![Attacks in the interface][attacks-in-ui-image]

    If the Wallarm Node mode is set to [blocking](../../admin-en/configure-wallarm-mode.md), the request will also be blocked.

## Upgrading the Wallarm policies

To upgrade the Wallarm policies deployed on Broadcom to a [newer version](code-bundle-inventory.md#broadcom-layer7-api-gateway):

1. Contact sales@wallarm.com to get the updated code bundle.
1. Import the updated policy files into the existing policy instances in Policy Manager as described in the [deployment steps](#import-new-broadcom-policies).
1. Configure the policy parameters with the correct values.
1. **Save and Activate** the updated policies.

Policy upgrades may require a Wallarm Node upgrade, especially for major version updates. See the [Wallarm Native Node changelog](../../updating-migrating/native-node/node-artifact-versions.md) for release updates and upgrade instructions. Regular node updates are recommended to avoid deprecation and simplify future upgrades.



<!-- в статьях по установке нейтив ноды из aio, докера и тд в части finish installation не все платформы перечислены как будто -->
<!-- обновить надо еще в конфлюенсе документ -->
<!-- starting from 0.8.0 -->
<!-- в SE еще не все указаны платформы -->