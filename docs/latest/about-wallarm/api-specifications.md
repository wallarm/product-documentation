# API Specifications

With the Wallarm's **API Specifications** you can upload your own API specifications to Wallarm. This article gives an overview of **API Specifications**: addressed issues, purpose and main possibilities.

For information on how to use the **API Specifications** functionality, refer to its [user guide](../user-guides/api-specifications.md).

The **API Specifications** functionality: 

* Requires [API Discovery](api-discovery.md)
* Is included into all [subscriptions](../about-wallarm/subscription-plans.md)
* Disabled by default - contact the [Wallarm support team](mailto:support@wallarm.com) to enable it

## Finding shadow API

You can use **API Specifications** together with [**API Discovery**](api-discovery.md) to find the endpoints discovered by Wallarm, but absent in your specification (missing endpoints, also known as "Shadow API").

Shadow APIs put businesses at risk, as attackers can exploit them to gain access to critical systems, steal valuable data, or disrupt operations, further compounded by the fact that APIs often act as gatekeepers to critical data and that a range of OWASP API vulnerabilities can be exploited to bypass API security.

![!API Discovery - API Specifications](../images/about-wallarm-waf/api-discovery/api-discovery-specifications.png)

[See how to work with API Specifications to find shadow API →](../user-guides/api-specifications.md#use-with-api-discovery-to-find-shadow-api)
