# Exploring API Inventory <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

As soon as the [API Discovery](overview.md) module has built the catalog of your endpoints (your API inventory), you can explore it in the **API Discovery** section of Wallarm Console. Learn from this article how to go through the discovered data.

## Endpoints

Explore your discovered API inventory using the **API Discovery** section in the [US](https://us1.my.wallarm.com/api-discovery) or [EU](https://my.wallarm.com/api-discovery) Cloud.

![API Discovery - built API inventory](../images/about-wallarm-waf/api-discovery-2.0/api-discovery-built-inventory.png)

By default, endpoints and operations are sorted by host/endpoint or operation name. Also, **Group by host** is on. With grouping by host disabled, you can sort endpoints by risk.

## Filtering

Among a wide range of API endpoint filters, you can choose the ones corresponding to your analysis purpose, e.g.:

* Find the endpoints characterized with the highest [risk level](risk-score.md) to analyze and mitigate the risks.
* Find endpoints related to specific [application](../user-guides/settings/applications.md).
* Find the endpoints that have been changed or newly discovered in the last week and that process PII data. This kind of request can help you to stay up to date with critical [changes in your APIs](track-changes.md).
* Find the endpoints being used to upload data to your server by the PUT or POST calls (REST) or mutations (GraphQL) (**API protocols** filter with methods for REST and operation types for Graph QL). Since such endpoints are a frequent attack target, they should be well secured. Using this kind of request you can check that endpoints are known to the team and are well secured from attacks.
* Find the endpoints processing sensitive data to ensure they are properly secured.
* Find the endpoints of a deprecated API version (e.g. by searching `/v1`) and make sure that they are not used by clients.

## REST endpoint details

<a name="params"></a>By clicking the REST endpoint, you can find its details, including  transferred sensitive data, risk score and what contributes to it, headers and parameters of requests and responses:

![API Discovery - REST endpoint details](../images/about-wallarm-waf/api-discovery-2.0/api-discovery-endpoint-details-REST.png)

Each request/response parameter information includes:

* Parameter name and the part of request/response this parameter belongs to
* Path: the hierarchical location of a parameter within a REST query structure
* Information about parameter changes (new, unused)
* Presence and type of sensitive data transmitted by this parameter, including:

    * Personally identifiable information (PII) like full name, passport number or SSN
    * Login credentials like secret keys and passwords
    * Financial data like bank card numbers
    * Medical data like medical license number
    * Technical data like IP and MAC addresses

* [Type/format](#data_format_rest) of data sent in this parameter
* Date and time when parameter value was last transferred by requests

### Format and data type

In REST endpoint details, in the **Type** column for parameters of request and responses, Wallarm indicates the data format identified through traffic analysis or, if not specific, a general data type.

For REST endpoints, Wallarm attempts to detect various data formats such as `Int32`, `Int64`, `Float`, `Double`, `Datetime`, `IPv4`/`IPv6`, among others. If a value does not conform to any recognized data format, Wallarm classifies it under a general data type, such as `Integer`, `Number`, `String`, or `Boolean`.

This data allows checking that values of the expected format are passed in each parameter. Inconsistencies can be the result of an attack or a scan of your API, for example:

* The `String` values ​​are passed to the field with `IP`
* The `Double` values are passed to the field where there should be a value no more than `Int32`

### Variability

URLs can include diverse elements, such as ID of user, like:

* `/api/articles/author/author-a-0001`
* `/api/articles/author/author-a-1401`
* `/api/articles/author/author-b-1401`

The **API Discovery** module unifies such elements into the `{parameter_X}` format in the endpoint paths, so for the example above you will not have 3 endpoints, but instead there will be one:

* `/api/articles/author/{parameter_1}`

Click the endpoint to expand its parameters and view which type was automatically detected for the diverse parameter.

<!--![API Discovery - variability in path](../images/TBD)-->

## GraphQL operation details

By clicking the GraphQL operation, you can find its details, including transferred sensitive data, risk score and what contributes to it, schema, parameters and headers of requests and responses:

![API Discovery - GraphQL operation details](../images/about-wallarm-waf/api-discovery-2.0/api-discovery-endpoint-details-GQL.png)

Each request/response parameter information includes:

* Parameter name and the part of request/response this parameter belongs to
* Path: the hierarchical location of a parameter within a GraphQL query structure
* Information about parameter changes (new, unused)
* Presence and type of sensitive data transmitted by this parameter, including:
* Date and time when parameter value was last transferred by requests

<a name="data_format_graphql"></a>**Format and data type**

In GraphQL operation details, in the **Type** column for parameters and headers, Wallarm indicates the data format identified through traffic analysis.

For GraphQL operations, data formats are detected in accordance with the [scalar types](https://graphql.org/learn/schema/#scalar-types) specification:

* `Int`: A signed 32‐bit integer.
* `Float`: A signed double-precision floating-point value.
* `String`: A UTF‐8 character sequence.
* `Boolean`: true or false.

## Endpoint activities

The number of requests related to the endpoint is displayed in the **Requests** column. Click this number to open the [**API Sessions**](../api-sessions/overview.md) section with the list of user sessions for the last week with these requests.

Within each found session, only requests to your endpoint will be initially displayed - in session, remove filter by endpoint to see all requests for context.

A structured view of session activity helps in understanding your endpoint place in malicious and legitimate activities, its relation to sensitive business flows and required protection measures.

<!--## Creating rules for API endpoints

You can quickly create a new [custom rule](../user-guides/rules/rules.md) from any endpoint of API inventory: 

1. In this endpoint menu select **Create rule**. The create rule window is displayed. The endpoint address is parsed into the window automatically.
1. In the create rule window, specify rule information and then click **Create**.

![Create rule from endpoint](../images/about-wallarm-waf/api-discovery/endpoint-create-rule.png)

## Exporting API inventory data

The API Discovery UI provides you with an option to export the current filtered list of endpoints as the [OpenAPI v3](https://spec.openapis.org/oas/v3.0.0) specification or CSV file.

To export, in Wallarm Console → **API Discovery**, use the **OAS/CSV** option. Consider the following:

* For **OAS**, Wallarm returns the `swagger.json` with filtered endpoints. You can also use the **Download OAS** button in an individual endpoint menu

    By utilizing the downloaded specification with other applications like Postman, you can conduct endpoints' vulnerability and other tests. In addition, it allows for a closer examination of the endpoints' capabilities to uncover the processing of sensitive data and the presence of undocumented parameters.

* For **CSV**, Wallarm returns filtered endpoints data in a simple text comma-separated format, making it easy to export it into other programs.

!!! warning "API host information in downloaded Swagger file"
    If a discovered API inventory contains several API hosts, endpoints from all API hosts will be included in the downloaded file. Currently, the API host information is not included in the file.
-->