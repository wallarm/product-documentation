[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Broadcom Layer7 API Gateways

Broadcom's [Layer7 API Gateways](https://www.broadcom.com/products/software/api-management/layer7-api-gateways) is a robust solution to control and secure organization's API traffic. With Wallarm, you can additionally secure APIs controlled by Layer7 API Gateways. This article explains how to integrate Layer7 API Gateways with Wallarm by deploying the Wallarm policy.

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
        listen 443 ssl;

        ### SSL configuration here    
        
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

    Please ensure to pay attention to the following configurations:

    * TLS/SSL certificates for HTTPS traffic: To enable the Wallarm node to handle secure HTTPS traffic, configure the TLS/SSL certificates accordingly. The specific configuration will depend on the chosen deployment method. For example, if you are using NGINX, you can refer to [its article](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/) for guidance.

1. Once the deployment is complete, make a note of the node instance IP as you will need it later to set the address for incoming request forwarding.

### 2. TLS configuration (if needed)

This step is only needed if the node is deployed externally (for example, Cloud node). If the node is deployed inside your own infrastructure, you may just use HTTP (depending on your own security policies).

1. Access Layer7 API Gateways UI.
1. Go to **Tasks** → **Certificates**, **Keys and Secrets** → **Manage Certificates**.
1. To retrieve the certificate from the node, use the **Retrieve via SSL** option with the node URI.
1. If you use a self-signed certificate, access the certificate options and select **Certificate is a Trust Anchor**.

### 3. Create Wallarm policy

1. Access Layer7 API Gateways UI.
1. For the corresponding server, select **Create policy** from the menu.
1. Set **Policy Type** to **Included Policy Fragment**. Name it `wallarm-mirror`.

    ![Layer7 API Gateways Wallarm included policy fragment](../../images/waf-installation/gateways/layer7/layer7-policy-fragment-included.png)

1. Create the following XML file and import its content into the included policy fragment using the **Import Policy** button:

    ??? info "`wallarm-mirror-failsafe.xml`"
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
                    <wsp:OneOrMore wsp:Usage="Required">
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
                        <L7p:TrueAssertion/>
                    </wsp:OneOrMore>
                </wsp:All>
            </wsp:Policy>
        </exp:Export>
        ```

1. Select **Create policy** for your server once again.
1. Set **Policy Type** to **Global Policy Fragment**.
1. Set **Policy Tag** to **message-completed**.

    !!! warning "Using `message-completed` tag"
        It is important to use the `message-completed` tag instead of the `message-received` to avoid putting the added headers into the actual user request. The `message-completed` is called after it was already processed, but the response was not sent to the client yet. 

1. Name global policy fragment `message-completed`.

    ![Layer7 API Gateways Wallarm global policy fragment](../../images/waf-installation/gateways/layer7/layer7-policy-fragment-global.png)

1. For the created global policy fragment, use **Set Context Variable**, set **Variable Name** to `wallarm_node_addr`, and **Expression** to the URL of the Wallarm node.
1. Use **Include Policy Fragment** to include the previously created `wallarm-mirror` included policy fragment into your global policy fragment.

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
