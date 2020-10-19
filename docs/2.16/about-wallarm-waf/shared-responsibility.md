# Security Model of Shared Responsibility for Customer Data

Wallarm WAF relies on a shared responsibility security model. In this model, all parties (Wallarm and its clients) have different areas of responsibilities when it comes to the security of clients' data, including any Personally Identifiable Information (PII) and Cardholder Data.

Wallarm WAF is a hybrid solution (part software and part SaaS) with two major components in different areas of responsibilities:

* **Wallarm WAF filter node** software, deployed in your infrastructure and managed by you. The WAF node component is responsible for filtering end user requests, sending safe requests to your application and blocking malicious requests. The WAF node passes the traffic and makes the decision locally whether a request is malicious or not. The traffic IS NOT mirrored to the Wallarm cloud for analysis.
* **Wallarm cloud**, a cloud component managed by Wallarm, is responsible for receiving meta-information about processed requests and detected attacks from the WAF nodes; as well as generating application-specific WAF rules and making them available for the nodes to download. The console UI and public API provide you with the ability to see security reports and individual events; manage WAF rules, console users, external integrations, etc.

![!Responsibilities scheme](../images/shared-responsibility.png)

## Wallarm Responsibilities

Wallarm is responsible for the following points:

* The security and availability of Wallarm cloud environments, the security of Wallarm WAF node code and internal Wallarm systems.

    This includes, but is not limited to: server-level patching, operating the necessary services to deliver Wallarm cloud service, vulnerability testing, security event logging and monitoring, incident management, operational monitoring and 24/7 support. Wallarm is also responsible for managing server and perimeter firewall configurations (security groups) of Wallarm cloud environments.

* Updating the Wallarm WAF node component on a periodic basis. Please note that the application of these updates is the responsibility of the client.

* Providing you with a copy of the latest Wallarm SOC 2 Type II audit report if requested.

## Client Responsibilities

Wallarm clients are responsible for the following points:

* Implementing sound and consistent internal controls regarding general IT system access and system usage appropriateness for all internal components associated with Wallarm, including Wallarm WAF node and Wallarm cloud.

* Practicing removal of user accounts for any users who have been terminated and were previously involved in any material functions or activities associated with Wallarm’s services.

* Configuring proper WAF [data masking rules](../user-guides/rules/sensitive-data-rule.md) for any sensitive data which may leave the client’s security perimeter and is sent to the Wallarm cloud as a part of reporting of detected malicious requests.

* Ensuring that transactions for client organizations relating to Wallarm’s services are appropriately authorized, and transactions are secure, timely, and complete.

* Notifying Wallarm in a timely manner of any changes to personnel directly involved with services performed by Wallarm. This personnel may be involved in financial, technical, or ancillary administrative functions directly associated with services provided by Wallarm.

* Updating WAF nodes with new software updates released by Wallarm in a timely manner.

* Developing, and if necessary, implementing a business continuity and disaster recovery plan (BCDRP) that will aid in the continuation of services provided by Wallarm.

## Masking of Sensitive Data

As with any third-party service, it’s important for a Wallarm client to understand what client data is sent to Wallarm, and be assured that sensitive data will never reach Wallarm Cloud. Wallarm clients with PCI DSS, GDPR and other requirements are recommended to mask sensitive data using special WAF rules.

The only data transmitted from WAF nodes to the Wallarm Cloud that may include any sensitive details is information about detected malicious requests. It’s highly unlikely that a malicious request would contain any sensitive data. However, the recommended approach is mask HTTP request fields which may contain PII or credit card details, such as `token`, `password`, `api_key`, `email`, `cc_number`, etc. Using this approach will guarantee that specified information fields will never leave your security perimeter.

You can apply a special WAF rule called **Mark as sensitive data** to specify what fields (in the request URI, headers or body) should be omitted when sending attack information from a WAF node to the Wallarm Cloud. For additional information about masking the data, please see the [document](../user-guides/rules/sensitive-data-rule.md) or contact [Wallarm support team](mailto:request@wallarm.com).