# Exploring API Inventory <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

As soon as the [API Discovery](overview.md) module has built the catalog of your endpoints (your API inventory), you can explore the presented information to understand and manage the security of your API. Learn from this article some things to be considered before exploring as well as how to go through your API inventory with Wallarm Console.

## Things to consider

### Parameter format and data type

Wallarm analyzes the values that are passed in each of the endpoint parameters and tries to determine their format:

* Int32
* Int64
* Float
* Double
* Date
* Datetime
* Email
* IPv4
* IPv6
* UUID
* URI
* Hostname
* Byte
* MAC

If the value in the parameter does not fit a specific data format, then one of the common data types will be specified:

* Integer
* Number
* String
* Boolean

For each parameter, the **Type** column displays:

* Data format
* If format is not defined - data type

This data allows checking that values of the expected format are passed in each parameter. Inconsistencies can be the result of an attack or a scan of your API, for example:

* The `String` values ​​are passed to the field with `IP`
* The `Double` values are passed to the field where there should be a value no more than `Int32`

### Variability in endpoints

URLs can include diverse elements, such as ID of user, like:

* `/api/articles/author/author-a-0001`
* `/api/articles/author/author-a-1401`
* `/api/articles/author/author-b-1401`

The **API Discovery** module unifies such elements into the `{parameter_X}` format in the endpoint paths, so for the example above you will not have 3 endpoints, but instead there will be one:

* `/api/articles/author/{parameter_X}`

Click the endpoint to expand its parameters and view which type was automatically detected for the diverse parameter.

![API Discovery - Variability in path](../images/about-wallarm-waf/api-discovery/api-discovery-variability-in-path.png)

Note that the algorithm analyzes the new traffic. If at some moment you see addresses, that should be unified but this did not happen yet, give it a time. As soon as more data arrives, the system will unify endpoints matching the newly found pattern with the appropriate amount of matching addresses.

## Viewing API inventory

The **API Discovery** section of Wallarm Console enables you to manage your [API inventory](overview.md), as well as to fine-tune its discovery. This guide instructs you on using this section.

The section is only available to the users of the following [roles](../user-guides/settings/users.md#user-roles):

* **Administrator** and **Analyst** can view and manage the data discovered by the API Discovery module, and access the API Discovery configuration part.

    **Global Administrator** and **Global Analyst** in the accounts with the multitenancy feature have the same rights.
* **API Developer** can view and download the data discovered by the API Discovery module. This role allows distinguishing users whose tasks only require using Wallarm to get actual data on company APIs. These users do not have access to any Wallarm Console sections except for **API Discovery** and **Settings → Profile**.

![Endpoints discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

!!! info "Default view: time period, sorting and grouping"

    **Time period**

    Each time you open the **API Discovery** section:
    
    * You see actual inventory of your APIs (all discovered endpoints)
    * The **Changes since** filter goes to the `Lask week` state, which means:

        * From the presented endpoints, the `New` and `Changed` within this period will obtain corresponding [marks](#tracking-changes-in-api)
        * Additionally, endpoints `Unused` within this period will be displayed

    See [this example](track-changes.md#example) to understand what API Discovery displays by default.

    You can manually select other time periods to be covered.

    **Sorting and grouping**

    By default, endpoints are sorted by host/endpoint names (and grouped by hosts). If you sort by **Hits** or **Risk**, grouping goes away - to get back to the default, click hosts/endpoint column again.

### Distinguish external and internal APIs

The endpoints accessible from the external network are the main attack directions. Thus, it is important to see what is available from the outside and pay attention to these endpoints in the first place.

Wallarm automatically splits discovered APIs to external and internal. The host with all its endpoints is considered to be internal if it is located on:

* A private IP or local IP address
* A generic top-level domain (for example: localhost, dashboard, etc.)

In the remaining cases the hosts are considered to be external.

By default, a list with all API hosts (external and internal) is displayed. In the built API inventory, you can view your internal and external APIs separately. To do this, click **External** or **Internal**.

### Filtering endpoints

Among a wide range of API endpoint filters, you can choose the ones corresponding to your analysis purpose, e.g.:

* Only attacked endpoints that you can sort by the number of hits.
* Find the most vulnerable endpoints characterized by processing sensitive data and active vulnerabilities of the high risk level. Exploiting vulnerabilities of a high risk level allows attackers to perform many malicious actions with the system including stealing sensitive data that the endpoint processes/stores.
* Find [rogue endpoints](rogue-api.md): shadow, orphan and zombie.
* Find the endpoints that have been changed or newly discovered in the last week and that process PII data. This kind of request can help you to stay up to date with critical changes in your APIs.
* Find the endpoints being used to upload data to your server by the PUT or POST calls. Since such endpoints are a frequent attack target, they should be well secured. Using this kind of request you can check that endpoints are known to the team and are well secured from attacks.
* Find the endpoints processing customers' bank card data. With this request, you can check that sensitive data is processed only by secured endpoints.
* Find the endpoints of a deprecated API version (e.g. by searching `/v1`) and make sure that they are not used by clients.

All filtered data can be exported in the OpenAPI v3 for additional analysis.

### Viewing endpoint parameters

<a name="params"></a>By clicking the endpoint, you can also find the endpoint details, including request statistics, required and optional parameters with the relevant data types:

![Request parameters discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-request-params.png)

Each parameter information includes:

* Parameter name and the part of request this parameter belongs to
* Information about parameter changes (new, unused)
* Presence and type of sensitive data transmitted by this parameter, including:

    * Technical data like IP and MAC addresses
    * Login credentials like secret keys and passwords
    * Financial data like bank card numbers
    * Medical data like medical license number
    * Personally identifiable information (PII) like full name, passport number or SSN

* [Type/format](#parameter-format-and-data-type) of data sent in this parameter
* Date and time when parameter information was last updated

### Monitoring attacks on API endpoints

Number of attacks on API endpoints for the last 7 days are displayed in the **Hits** column.

You can:

* Request displaying only attacked endpoints by selecting in filters: **Others** → **Attacked endpoints**.
* Sort by the **Hits** column.

To see attacks to some endpoint, click number in the **Hits** column:

![API endpoint - open events](../images/about-wallarm-waf/api-discovery/endpoint-open-events.png)

The **Events** section will be displayed with the [filter applied](../user-guides/search-and-filters/use-search.md):

```
attacks last 7 days endpoint_id:<YOUR_ENDPOINT_ID>
```

You can also copy some endpoint URL to the clipboard and use it to search for the events. To do this, in this endpoint menu select **Copy URL**.

### Create rules for API endpoints

You can quickly create a new [custom rule](../user-guides/rules/intro.md) from any endpoint of API inventory: 

1. In this endpoint menu select **Create rule**. The create rule window is displayed. The endpoint address is parsed into the window automatically.
1. In the create rule window, specify rule information and then click **Create**.

![Create rule from endpoint](../images/about-wallarm-waf/api-discovery/endpoint-create-rule.png)

### Download OpenAPI specification (OAS) of your API inventory

The API Discovery UI provides you with an option to download the [OpenAPI v3](https://spec.openapis.org/oas/v3.0.0) specification of either an individual API endpoint or an entire API discovered by Wallarm.

* The **Download OAS** button on the API inventory page returns `swagger.json` for the entire inventory or only the filtered data if any filters were applied before downloading.

    With the downloaded data, you can test endpoints on your side, for example, upload them to the Postman.

    !!! warning "API host information in downloaded Swagger file"
        If a discovered API inventory contains several API hosts, endpoints from all API hosts will be included in the downloaded Swagger file. Currently, the API host information is not included in the file.

* The **Download OAS** button in an individual endpoint menu returns `swagger.json` for the selected endpoint.

    By utilizing the downloaded specification with other applications like Postman, you can conduct endpoint vulnerability and other tests. In addition, it allows for a closer examination of the endpoint's capabilities to uncover the processing of sensitive data and the presence of undocumented parameters.

