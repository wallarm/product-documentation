[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Layer7 API Gateways

[Layer7 API Gateways](https://www.broadcom.com/products/software/api-management/layer7-api-gateways) is a robust solution to control and secure organization's API traffic. With Wallarm, you can additionally secure APIs controlled by Layer7 API Gateways. This article explains how to integrate Layer7 API Gateways with Wallarm by deploying the Wallarm policy.

The Wallarm policy for Layer7 API Gateways supports the [out-of-band](../oob/overview.md) mode. Diagram below shows the traffic flow for APIs on the Layer7 API Gateways with Wallarm policy applied.

![Layer7 API Gateways with Wallarm image](../../images/waf-installation/gateways/layer7/traffic-flow-oob.png)

## Use cases

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this solution is the recommended one for the following use cases:

* Managing your APIs with the Layer7 API Gateways.

## Limitations

The Layer7 API Gateways integration supports only the out-of-band traffic analysis, be aware that this method has certain limitations, which also apply to the policy. More details can be found at the provided [link](../oob/overview.md#advantages-and-limitations).

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of the Layer7 API Gateways product.
* Your application and API are linked and running on Layer7 API Gateways.

## Deployment

To secure APIs on the Layer7 API Gateways using Wallarm, follow these steps:

1. Deploy a Wallarm node using one of the available deployment options.
1. Retrieve certificate.
1. Create Wallarm policy.

### 1. Deploy a Wallarm node

1. Choose one of the supported Wallarm node deployment solutions or artifacts for the [out-of-band deployment](../supported-deployment-options.md#out-of-band) and follow the provided deployment instructions.
1. Configure the deployed node using the following template:

    ```
    server {
        listen 80;
        wallarm_mode monitoring;

        real_ip_header $http_x_wallarm_real_ip;
        set_real_ip_from <gateway address>;
        proxy_set_header Host $http_x_wallarm_forwarded_host;

        location / {
            proxy_pass http://localhost:8080;
        }
    }

    server {
        listen 8080;
        location / {
            return 200;
        }
    }
    ```

1. Once the deployment is complete, make a note of the node instance IP as you will need it later to set the address for incoming request forwarding.

### 2. Retrieve certificate

1. Access Layer7 API Gateways UI.
1. Go to **Tasks** → **Certificates**, **Keys and Secrets** → **Manage Certificates**.
1. To retrieve the certificate from the node, use the **Retrieve via SSL** option with the node URI.
1. Access the certificate options and select **Certificate is a Trust Anchor**.

### 3. Create Wallarm policy

1. Access Layer7 API Gateways UI.
1. For the corresponding server, select **Create policy** from the menu.
1. Set **Policy Type** to **Included Policy Fragment**. Name it, for example, `wallarm-mirror`.
1. Create the following XML file and import its content into the policy:

    ??? info "`wallarm-mirror.xml`"
        ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <exp:Export Version="3.0"
            xmlns:L7p="http://www.layer7tech.com/ws/policy"
            xmlns:exp="http://www.layer7tech.com/ws/policy/export" xmlns:wsp="http://schemas.xmlsoap.org/ws/2002/12/policy">
            <exp:References/>
            <wsp:Policy xmlns:L7p="http://www.layer7tech.com/ws/policy" xmlns:wsp="http://schemas.xmlsoap.org/ws/2002/12/policy">
                <wsp:All wsp:Usage="Required">
                    <L7p:CommentAssertion>
                        <L7p:Comment stringValue="Policy Fragment: wallarm-mirror"/>
                    </L7p:CommentAssertion>
                    <L7p:AddHeader>
                        <L7p:HeaderName stringValue="x-wallarm-forwarded-host"/>
                        <L7p:HeaderValue stringValue="${cluster.hostname}"/>
                        <L7p:RemoveExisting booleanValue="true"/>
                    </L7p:AddHeader>
                    <L7p:AddHeader>
                        <L7p:HeaderName stringValue="x-wallarm-real-ip"/>
                        <L7p:HeaderValue stringValue="${request.tcp.remoteAddress}"/>
                        <L7p:RemoveExisting booleanValue="true"/>
                    </L7p:AddHeader>
                    <L7p:AddHeader>
                        <L7p:HeaderName stringValue="x-wallarm-response-code"/>
                        <L7p:HeaderValue stringValue="${response.http.status}"/>
                        <L7p:RemoveExisting booleanValue="true"/>
                    </L7p:AddHeader>
                    <L7p:HttpRoutingAssertion>
                        <L7p:FailOnErrorStatus booleanValue="false"/>
                        <L7p:ForceIncludeRequestBody booleanValue="true"/>
                        <L7p:ProtectedServiceUrl stringValue="${wallarm_node_addr}/${request.url.path}?${request.url.query}"/>
                        <L7p:ProxyPassword stringValueNull="null"/>
                        <L7p:ProxyUsername stringValueNull="null"/>
                        <L7p:RequestHeaderRules httpPassthroughRuleSet="included">
                            <L7p:ForwardAll booleanValue="true"/>
                            <L7p:Rules httpPassthroughRules="included">
                                <L7p:item httpPassthroughRule="included">
                                    <L7p:Name stringValue="Cookie"/>
                                </L7p:item>
                                <L7p:item httpPassthroughRule="included">
                                    <L7p:Name stringValue="SOAPAction"/>
                                </L7p:item>
                            </L7p:Rules>
                        </L7p:RequestHeaderRules>
                        <L7p:RequestParamRules httpPassthroughRuleSet="included">
                            <L7p:ForwardAll booleanValue="true"/>
                            <L7p:Rules httpPassthroughRules="included"/>
                        </L7p:RequestParamRules>
                        <L7p:ResponseHeaderRules httpPassthroughRuleSet="included">
                            <L7p:ForwardAll booleanValue="true"/>
                            <L7p:Rules httpPassthroughRules="included">
                                <L7p:item httpPassthroughRule="included">
                                    <L7p:Name stringValue="Set-Cookie"/>
                                </L7p:item>
                            </L7p:Rules>
                        </L7p:ResponseHeaderRules>
                        <L7p:ResponseMsgDest stringValue="wallarm_response"/>
                        <L7p:SamlAssertionVersion intValue="2"/>
                    </L7p:HttpRoutingAssertion>
                </wsp:All>
            </wsp:Policy>
        </exp:Export>
        ```

1. Select **Create policy** once again.
1. Set **Policy Type** to **Global Policy Fragment**. Name it, for example, `message-completed`.
1. For the policy, set the `wallarm_node_addr` variable to the URL of the Wallarm node.
1. Include the previously created `wallarm-mirror` policy fragment.

    ![Layer7 API Gateways Wallarm policy](../../images/waf-installation/gateways/layer7/layer7-policy.png)

1. Save and activate the policy.

## Testing

To test the functionality of the deployed policy, follow these steps:

1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to your API:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.
    
    ![Attacks in the interface][attacks-in-ui-image]

## Need assistance?

If you encounter any issues or require assistance with the described deployment of Wallarm's policy in conjunction with Layer7 API Gateways, you can reach out to the [Wallarm support](mailto:support@wallarm.com) team. They are available to provide guidance and help resolve any problems you may face during the implementation process.
