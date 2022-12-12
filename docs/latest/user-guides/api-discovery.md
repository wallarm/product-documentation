# API Discovery

This section describes how to use the API structure built by the [API Discovery](../about-wallarm/api-discovery.md) module.

The built API structure is presented in the **API Discovery** section. The section is only available to the users of the following [roles](../user-guides/settings/users.md#user-roles):

* **Administrator** and **Analyst** can view and manage the data discovered by the API Discovery module.

    **Global Administrator** and **Global Analyst** in the accounts with the multitenancy feature have the same rights.
* **API Developer** can view and download the data discovered by the API Discovery module. This role allows distinguishing users whose tasks only require using Wallarm to get actual data on company APIs. These users do not have access to any Wallarm Console sections except for **API Discovery** and **Settings → Profile**.

The API structure includes the following elements:

* Customer applications with discovered API hosts.
* Discovered endpoints grouped by API hosts. For each endpoint, the HTTP method is displayed.

![!Endpoints discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

!!! info "Default period"
    Each time you open the **API Discovery** section:
    
    * You see actual structure of your API (all discovered endpoints)
    * The **Changes since** filter goes to the `Lask week` state, which means:

        * From the presented endpoints, the `New` and `Changed` within this period will obtain corresponding [marks](#tracking-changes-in-api-structure)
        * Additionally, endpoints `Deleted` within this period will be displayed

    See [this example](#example) to understand what API Discovery displays by default.

    You can manually select other time periods to be covered.

## Filtering endpoints

Among a wide range of API endpoint filters, you can choose the ones corresponding to your analysis purpose, e.g.:

* Only attacked endpoints that you can sort by the number of hits.
* Find the endpoints that have been changed or newly discovered in the last week and that process PII data. This kind of request can help you to stay up to date with critical changes in your APIs.
* Find the endpoints being used to upload data to your server by the PUT or POST calls. Since such endpoints are a frequent attack target, they should be well secured. Using this kind of request you can check that endpoints are known to the team and are well secured from attacks.
* Find the endpoints processing customers' bank card data. With this request, you can check that sensitive data is processed only by secured endpoints.
* Find the endpoints of a deprecated API version (e.g. by searching `/v1`) and make sure that they are not used by clients.

All filtered data can be exported in the OpenAPI v3 for additional analysis.

## Viewing endpoint parameters

<a name="params"></a>By clicking the endpoint, you can also find the endpoint details, including required and optional parameters with the relevant data types:

![!Request parameters discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-request-params.png)

Each parameter information includes:

* Parameter name and the part of request this parameter belongs to
* Information about parameter changes (new, removed)
* Presence and type of sensitive data (PII) transmitted by this parameter, including:

    * Technical data like IP and MAC addresses
    * Login credentials like secret keys and passwords
    * Financial data like bank card numbers
    * Medical data like medical license number
    * Personally identifiable information (PII) like full name, passport number or SSN

* [Type/format](../about-wallarm/api-discovery.md#parameter-types-and-formats) of data sent in this parameter
* Date and time when parameter information was last updated

## Tracking changes in API structure

You can check what [changes occurred](../about-wallarm/api-discovery.md#tracking-changes-in-api-structure) in API structure within the specified period of time. To do that, from the **Changes since** filter, select the appropriate period or date. The following marks will be displayed in the endpoint list:

* **New** for the endpoints added to the list within the period.
* **Changed** for the endpoints that have new or removed parameters. In the details of the endpoint such parameters will have a corresponding mark.
* **Removed** for the endpoints that did not receive any traffic within the period. For each endpoint this period will be different - calculated based on the statistics of accessing each of the endpoint. If later the "removed" endpoint is discovered as having some traffic again it will be marked as "new".

Note that whatever period is selected, if nothing is highlighted with the **New**, **Changed** or **Removed** mark, this means there are no changes in API for that period.

![!API Discovery - track changes](../images/about-wallarm-waf/api-discovery/api-discovery-track-changes.png)

!!! info "Default period"
    Each time you open the **API Discovery** section, the **Changes since** filter goes to the `Last week` state, which means only the changes occurred within the last week are highlighted.

Using the **Changes since** filter only highlights the endpoints changed within the selected period, but does not filter out endpoints without changes.

The **Changes in API structure** filter works differently and shows **only** endpoints changed within the selected period and filters out all the rest.

<a name="example"></a>Let us consider the example: say your API today has 10 endpoints (there were 12, but 3 of them were removed 10 days ago). 1 of this 10 was added yesterday, 2 have changes in their parameters occurred 5 days ago for one and 10 days ago for another:

* Each time you open the **API Discovery** section today, the **Changes since** filter will go to the `Last week` state; page will display 10 endpoints, in the **Changes** column 1 of them will have the **New** mark, and 1 - the **Changed** mark.
* Switch **Changes since** to `Last 2 weeks` - 13 endpoints will be displayed, in the **Changes** column 1 of them will have the **New** mark, 2 - the **Changed** mark, and 3 - the **Removed** mark.
* Set **Changes in API structure** to `Removed endpoints` - 3 endpoints will be displayed, all with the **Removed** mark.
* Change **Changes in API structure** to `New endpoints + Removed endpoints` - 4 endpoints will be displayed, 3 with the **Removed** mark, and 1 with the **New** mark.
* Switch **Changes since** back to `Last week` - 1 endpoint will be displayed, it will have the **New** mark.

## Working with risk score

The [automatically calculated](../about-wallarm/api-discovery.md#endpoint-risk-score) **risk score** allows you to understand which endpoints are most likely to be an attack target and therefore should be the focus of your security efforts.

Risk score may be from `1` (lowest) to `10` (highest):

| Value | Risk level | Color |
| --------- | ----------- | --------- |
| 1 to 3 | Low | Grey |
| 4 to 7 | Medium | Orange |
| 8 to 10 | High | Red |

* `1` means no risk factors for this endpoint.
* Risk score is not displayed (`N/A`) for the removed endpoints.

To understand what caused the risk score for the endpoint and how to reduce the risk, go to the endpoint details. The details of the endpoint indicate all the factors that are applicable to the endpoint. In the **Risk score** section, expand the corresponding risk factor to get additional description, such as list of active vulnerabilities etc., and links to the solution recommendations.

![!API Discovery - Risk score](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

## Monitoring attacks on API endpoints

Number of attacks on API endpoints are displayed in the **Hits** column. These are the attacks occurred since the endpoints were found by API Discovery.

To see attacks to some endpoint, click number in the **Hits** column:

![!API endpoint - open events](../images/about-wallarm-waf/api-discovery/endpoint-open-events.png)

The **Events** section will be displayed with the [filter applied](../user-guides/search-and-filters/use-search.md):

```
attacks >= <START_DATE_TIME> endpoint_id:<YOUR_ENDPOINT_ID>
```

Note that only attacks since <START_DATE_TIME> date and time are displayed. The date is taken from the **Changes since** filter of API Discovery.

You can also copy some endpoint URL to the clipboard and use it to search for the events. To do this, in this endpoint menu select **Copy URL**.

## API structure and rules

You can quickly create a new [custom rule](../user-guides/rules/intro.md) from any endpoint of API structure: 

1. In this endpoint menu select **Create rule**. The create rule window is displayed. The endpoint address is parsed into the window automatically.
1. In the create rule window, specify rule information and then click **Create**.

![!Create rule from endpoint](../images/about-wallarm-waf/api-discovery/endpoint-create-rule.png)

## Download OpenAPI specification (OAS) for your API structure

Click **Download OAS** to get a `swagger.json` file with the description of the API structure discovered by Wallarm. The description will be in the [OpenAPI v3 format](https://spec.openapis.org/oas/v3.0.0).

!!! info "Filtered download"
    When downloading the description of the API structure, applied filters are taken into account. Only filtered data is downloaded.
    
!!! warning "API host information in downloaded Swagger file"
    If a discovered API structure contains several API hosts, endpoints from all API hosts will be included in the downloaded Swagger file. Currently, the API host information is not included in the file.

Using the downloaded data, you can discover:

* The list of endpoints discovered by Wallarm, but absent in your specification (missing endpoints, also known as "Shadow API").
* The list of endpoints presented in your specification but not discovered by Wallarm (endpoints that are not in use, also known as "Zombie API").

## Automatic BOLA protection

Wallarm can [automatically discover and protect endpoints that are vulnerable to the BOLA attacks](../admin-en/configuration-guides/protecting-against-bola.md#automatic-bola-protection-for-endpoints-discovered-by-api-discovery) among the ones explored by the **API Discovery** module. If the option is enabled, protected endpoints are highlighted with the corresponding icon in the API structure, e.g.:

![!BOLA trigger](../images/about-wallarm-waf/api-discovery/endpoints-protected-against-bola.png)

You can filter API endpoints by the BOLA auto protection state. The corresponding parameter is available under the **Others** filter.
