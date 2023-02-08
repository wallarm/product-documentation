# API Discovery <a href="../../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

This section describes how to use the API inventory built by the [API Discovery](../about-wallarm/api-discovery.md) module.

The built API inventory is presented in the **API Discovery** section. The section is only available to the users of the following [roles](../user-guides/settings/users.md#user-roles):

* **Administrator** and **Analyst** can view and manage the data discovered by the API Discovery module.

    **Global Administrator** and **Global Analyst** in the accounts with the multitenancy feature have the same rights.
* **API Developer** can view and download the data discovered by the API Discovery module. This role allows distinguishing users whose tasks only require using Wallarm to get actual data on company APIs. These users do not have access to any Wallarm Console sections except for **API Discovery** and **Settings → Profile**.

To provide users with familiar format of API representation, Wallarm provides list of discovered APIs and details on them in a **Swagger-like** interface.

The API inventory includes the following elements:

* Customer applications with discovered API hosts.
* Discovered endpoints grouped by API hosts. For each endpoint, the HTTP method is displayed.

![!Endpoints discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

## Filtering endpoints

Among a wide range of API endpoint filters, you can choose the ones corresponding to your analysis purpose, e.g.:

* Find the endpoints that have been changed or newly discovered in the last week and that process PII data. This kind of request can help you to stay up to date with critical changes in your APIs.
* Find the endpoints being used to upload data to your server by the PUT or POST calls. Since such endpoints are a frequent attack target, they should be well secured. Using this kind of request you can check that endpoints are known to the team and are well secured from attacks.
* Find the endpoints processing customers' bank card data. With this request, you can check that sensitive data is processed only by secured endpoints.
* Find the endpoints of a deprecated API version (e.g. by searching `/v1`) and make sure that they are not used by clients.
* Find the most vulnerable endpoints characterized by processing sensitive data and active vulnerabilities of the high risk level. Exploiting vulnerabilities of a high risk level allows attackers to perform many malicious actions with the system including stealing sensitive data that the endpoint processes/stores.

All filtered data can be exported in the OpenAPI v3 for additional analysis.

## Viewing endpoint parameters

<a name="params"></a>By clicking the endpoint, you can also find the set of required and optional parameters with the relevant data types:

![!Request parameters discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-request-params.png)

To sort, click the name of the column. To change the sorting order, click again.

Each parameter information includes:

* Parameter name and the part of request this parameter belongs to
* Presence and type of sensitive data (PII) transmitted by this parameter, including:

    * Technical data like IP and MAC addresses
    * Login credentials like secret keys and passwords
    * Financial data like bank card numbers
    * Medical data like medical license number
    * Personally identifiable information (PII) like full name, passport number or SSN

* Date and time when parameter information was last updated
* [Type/format](../about-wallarm/api-discovery.md#parameter-types-and-formats) of data sent in this parameter

## Tracking changes in API

You can check what [changes occurred](../about-wallarm/api-discovery.md#tracking-changes-in-api) in API within the specified period of time. To do that, from the **Changes since** filter, select the appropriate period or date. The following markers will be displayed in the endpoint list:

* **New** for the endpoints added to the list within the period.
* **Changed** for the endpoints that have new or removed parameters. In the details of the endpoint such parameters will have a corresponding mark.
* **Removed** for the endpoints that did not receive any traffic within the period. For each endpoint this period will be different - calculated based on the statistics of accessing each of the endpoint. If later the "removed" endpoint is discovered as having some traffic again it will be marked as "new".

![!API Discovery - track changes](../images/about-wallarm-waf/api-discovery/api-discovery-track-changes.png)

Using the **Changes since** filter only highlights the changed endpoints among the others. If you want to see only changes, additionally use the **Changes in API** filter where you can select one or several types of changes:

* New endpoints
* Changed endpoints
* Removed endpoints

Selecting values from this filter will show only the endpoints correspondingly changed within the specified period.

## Monitoring attacks on API endpoints

Number of attacks on API endpoints for the last 7 days are displayed in the **Hits** column.

To see attacks to some endpoint, click number in the **Hits** column:

![!API endpoint - open events](../images/about-wallarm-waf/api-discovery/endpoint-open-events.png)

The **Events** section will be displayed with the [filter applied](../user-guides/search-and-filters/use-search.md):

```
attacks last 7 days endpoint_id:<YOUR_ENDPOINT_ID>
```

You can also copy some endpoint URL to the clipboard and use it to search for the events. To do this, in this endpoint menu select **Copy URL**.

## API inventory and rules

You can quickly create a new [custom rule](../user-guides/rules/intro.md) from any endpoint of API inventory: 

1. In this endpoint menu select **Create rule**. The create rule window is displayed. The endpoint address is parsed into the window automatically.
1. In the create rule window, specify rule information and then click **Create**.

![!Create rule from endpoint](../images/about-wallarm-waf/api-discovery/endpoint-create-rule.png)

## Download OpenAPI specification (OAS) of your API inventory

Click **Download OAS** to get a `swagger.json` file with the API inventory discovered by Wallarm. The description will be in the [OpenAPI v3 format](https://spec.openapis.org/oas/v3.0.0).

!!! warning "Filtered download"
    When downloading the API inventory, applied filters are taken into account. Only filtered data is downloaded.
    
!!! info "API host information in downloaded Swagger file"
    If a discovered API inventory contains several API hosts, endpoints from all API hosts will be included in the downloaded Swagger file. Currently, the API host information is not included in the file.

Using the downloaded data, you can discover:

* The list of endpoints discovered by Wallarm, but absent in your specification (missing endpoints, also known as "Shadow API").
* The list of endpoints presented in your specification but not discovered by Wallarm (endpoints that are not in use, also known as "Zombie API").
