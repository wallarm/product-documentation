# Security model of shared responsibility for clients' data

Wallarm relies on a shared responsibility security model. In this model, all parties (Wallarm and its clients) have different areas of responsibilities when it comes to the security of clients' data, including any Personally Identifiable Information (PII) and Cardholder Data.

Wallarm is a hybrid solution (part software and part SaaS) with two major components in different areas of responsibilities:

* **Wallarm filtering node** software, deployed in your infrastructure and managed by you. The Wallarm node component is responsible for filtering end user requests, sending safe requests to your application and blocking malicious requests. The Wallarm node passes the traffic and makes the decision locally whether a request is malicious or not. The traffic IS NOT mirrored to the Wallarm Cloud for analysis.
* **Wallarm Cloud**, a cloud component managed by Wallarm, is responsible for receiving meta-information about processed requests and detected attacks from the filtering nodes; as well as generating application-specific filtration rules and making them available for the nodes to download. Wallarm Console and public API provide you with the ability to see security reports and individual events; manage traffic filtration rules, Wallarm Console users, external integrations, etc.

![Responsibilities scheme](../images/shared-responsibility.png)

## Wallarm responsibilities

Wallarm is responsible for the following points:

* The security and availability of Wallarm cloud environments, the security of Wallarm filtering node code and internal Wallarm systems.

    This includes, but is not limited to: server-level patching, operating the necessary services to deliver Wallarm cloud service, vulnerability testing, security event logging and monitoring, incident management, operational monitoring and 24/7 support. Wallarm is also responsible for managing server and perimeter firewall configurations (security groups) of Wallarm cloud environments.

* Updating the Wallarm filtering node component on a periodic basis. Please note that the application of these updates is the responsibility of the client.

* Providing you with a copy of the latest Wallarm SOC 2 Type II audit report if requested.

## Client responsibilities

Wallarm clients are responsible for the following points:

* Implementing sound and consistent internal controls regarding general IT system access and system usage appropriateness for all internal components associated with Wallarm, including Wallarm filtering node and Wallarm Cloud.

* Practicing removal of user accounts for any users who have been terminated and were previously involved in any material functions or activities associated with Wallarm’s services.

* Configuring proper [data masking rules](../user-guides/rules/sensitive-data-rule.md) for any sensitive data which may leave the client’s security perimeter and is sent to the Wallarm Cloud as a part of reporting of detected malicious requests.

* Ensuring that transactions for client organizations relating to Wallarm’s services are appropriately authorized, and transactions are secure, timely, and complete.

* Notifying Wallarm in a timely manner of any changes to personnel directly involved with services performed by Wallarm. This personnel may be involved in financial, technical, or ancillary administrative functions directly associated with services provided by Wallarm.

* Updating filtering nodes with new software updates released by Wallarm in a timely manner.

* Developing, and if necessary, implementing a business continuity and disaster recovery plan (BCDRP) that will aid in the continuation of services provided by Wallarm.

## Masking of sensitive data

As with any third-party service, it’s important for a Wallarm client to understand what client data is sent to Wallarm, and be assured that sensitive data will never reach Wallarm Cloud. Wallarm clients with PCI DSS, GDPR and other requirements are recommended to mask sensitive data using special rules.

The only data transmitted from filtering nodes to the Wallarm Cloud that may include any sensitive details is information about detected malicious requests. It’s highly unlikely that a malicious request would contain any sensitive data. However, the recommended approach is mask HTTP request fields which may contain PII or credit card details, such as `token`, `password`, `api_key`, `email`, `cc_number`, etc. Using this approach will guarantee that specified information fields will never leave your security perimeter.

You can apply a special rule called **Mask sensitive data** to specify what fields (in the request URI, headers or body) should be omitted when sending attack information from a filtering node to the Wallarm Cloud. For additional information about masking the data, please see the [document](../user-guides/rules/sensitive-data-rule.md) or contact [Wallarm support team](mailto:request@wallarm.com).