# Shared Responsibility for Clients' Data

Wallarm relies on a shared responsibility security model. In this model, all parties (Wallarm and its clients) have different areas of responsibilities when it comes to the security of clients' data, including any personally identifiable information (PII) and cardholder data.

## Overview

Wallarm has two main components: **Wallarm filtering node** and **Wallarm Cloud**. See their general descriptions [here](../about-wallarm/overview.md#how-wallarm-works). These components can be deployed in one of three forms for which Wallarm and client's responsibilities are shared differently:

* **Security Edge**: complete cloud-based deployment. Both Wallarm filtering nodes and Wallarm Cloud components are managed by Wallarm.
* **Hybrid**: Wallarm clients deploy and manage the Wallarm filtering nodes, and Wallarm manages the Wallarm Cloud component.
* **On-Premise**: both Wallarm filtering node and Wallarm Cloud components are hosted and managed by the client.

![Responsibilities scheme](../images/shared-responsibility-variants.png)

## Security Edge

In this deployment form, both Wallarm filtering nodes and Wallarm Cloud components are managed by Wallarm and thus most responsibilities go to Wallarm side.

**Wallarm responsibilities**

* The security and availability of Wallarm cloud environments, the security of Wallarm filtering node code and internal Wallarm systems.

    This includes, but is not limited to: server-level patching, operating the necessary services to deliver Wallarm cloud service, vulnerability testing, security event logging and monitoring, incident management, operational monitoring and 24/7 support. Wallarm is also responsible for managing server and perimeter firewall configurations (security groups) of Wallarm cloud environments.

* Updating the Wallarm filtering node component on a periodic basis.
* Providing you with a copy of the latest Wallarm SOC 2 Type II audit report if requested.
* Developing, and if necessary, implementing a business continuity and disaster recovery plan (BCDRP) that will aid in the continuation of services provided by Wallarm.

**Client responsibilities**

* Practicing removal of user accounts for any users who have been terminated and were previously involved in any material functions or activities associated with Wallarm’s services.
* Configuring proper [data masking rules](../user-guides/rules/sensitive-data-rule.md) for any sensitive data which may leave the client’s security perimeter and is sent to the Wallarm Cloud as a part of reporting of detected malicious requests.
* Notifying Wallarm in a timely manner of any changes to personnel directly involved with services performed by Wallarm. This personnel may be involved in financial, technical, or ancillary administrative functions directly associated with services provided by Wallarm.

## Hybrid

In this deployment form, Wallarm clients deploy and manage the Wallarm filtering nodes, and Wallarm manages the Wallarm Cloud component and thus responsibilities are shared equally.

**Wallarm responsibilities**

* The security and availability of Wallarm cloud environments, the security of Wallarm filtering node code and internal Wallarm systems.
* Updating the Wallarm filtering node component on a periodic basis. Please note that the application of these updates is the responsibility of the client.
* Providing you with a copy of the latest Wallarm SOC 2 Type II audit report if requested.

**Client responsibilities**

Wallarm clients are responsible for the following points:

* Implementing sound and consistent internal controls regarding general IT system access and system usage appropriateness for all internal components associated with Wallarm, including Wallarm filtering node and Wallarm Cloud.

* Practicing removal of user accounts for any users who have been terminated and were previously involved in any material functions or activities associated with Wallarm’s services.

* Configuring proper [data masking rules](../user-guides/rules/sensitive-data-rule.md) for any sensitive data which may leave the client’s security perimeter and is sent to the Wallarm Cloud as a part of reporting of detected malicious requests.

* Ensuring that transactions for client organizations relating to Wallarm’s services are appropriately authorized, and transactions are secure, timely, and complete.

* Notifying Wallarm in a timely manner of any changes to personnel directly involved with services performed by Wallarm. This personnel may be involved in financial, technical, or ancillary administrative functions directly associated with services provided by Wallarm.

* Updating filtering nodes with new software updates released by Wallarm in a timely manner.

* Developing, and if necessary, implementing a business continuity and disaster recovery plan (BCDRP) that will aid in the continuation of services provided by Wallarm.

## On-Premise

In this deployment form, both Wallarm filtering node and Wallarm Cloud components are hosted and managed by the client and thus most responsibilities (along with control) go to client side.

**Wallarm responsibilities**

* The security of Wallarm filtering node and Cloud code.
* Updating the Wallarm filtering node and Cloud components on a periodic basis. Please note that the application of these updates is the responsibility of the client.

**Client responsibilities**

* Providing the security and availability of environments used for Wallarm filtering nodes and Cloud deployment.
* Updating filtering nodes and Cloud with new software updates released by Wallarm in a timely manner.
* Implementing sound and consistent internal controls regarding general IT system access and system usage appropriateness for all internal components associated with Wallarm, including Wallarm filtering node and Wallarm Cloud.
* Practicing removal of user accounts for any users who have been terminated and were previously involved in any material functions or activities associated with Wallarm’s services.
* Configuring proper [data masking rules](../user-guides/rules/sensitive-data-rule.md) for any sensitive data which may leave the client’s security perimeter and is sent to the Wallarm Cloud as a part of reporting of detected malicious requests.
* Ensuring that transactions for client organizations relating to Wallarm’s services are appropriately authorized, and transactions are secure, timely, and complete.
* Developing, and if necessary, implementing a business continuity and disaster recovery plan (BCDRP) that will aid in the continuation of services provided by Wallarm.

## Masking of sensitive data

This measure is recommended for all deployment forms.

As with any third-party service, it’s important for a Wallarm client to understand what client data is sent to Wallarm, and be assured that sensitive data will never reach Wallarm Cloud. Wallarm clients with PCI DSS, GDPR and other requirements are recommended to mask sensitive data using special rules.

The only data transmitted from filtering nodes to the Wallarm Cloud that may include any sensitive details is information about detected malicious requests. It’s highly unlikely that a malicious request would contain any sensitive data. However, the recommended approach is mask HTTP request fields which may contain PII or credit card details, such as `token`, `password`, `api_key`, `email`, `cc_number`, etc. Using this approach will guarantee that specified information fields will never leave your security perimeter.

You can apply a special rule called **Mask sensitive data** to specify what fields (in the request URI, headers or body) should be omitted when sending attack information from a filtering node to the Wallarm Cloud. For additional information about masking the data, please see the [document](../user-guides/rules/sensitive-data-rule.md) or contact [Wallarm support team](mailto:request@wallarm.com).