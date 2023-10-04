# Discovering API inventory <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

The **API Discovery** module of the Wallarm platform [builds](api-discovery-setup.md#enable) your application REST API inventory based on the actual API usage. The module continuously analyzes the real traffic requests and builds the API inventory based on the analysis results. This article gives an overview of **API Discovery**: issues addressed by it, its purpose and main possibilities.

## Issues addressed by API Discovery

**Building an actual and complete API inventory** is the main issue the API Discovery module is addressing.

Keeping API inventory up-to-date is a difficult task. There are multiple teams that use different APIs and it is a common case that different tools and processes are used to produce the API documentation. As a result, companies struggle in both understanding what APIs they have, what data they expose and having up-to-date API documentation.

Since the API Discovery module uses the real traffic as a data source, it helps to get up-to-date and complete API documentation by including to the API inventory all endpoints that are actually processing the requests.

**As you have your API inventory discovered by Wallarm, you can**:

* Have a full visibility into the whole API estate including the list of [external and internal](api-discovery-use.md#distinguish-external-and-internal-apis) APIs.
* See what data is [going into the APIs](api-discovery-use.md#viewing-endpoint-parameters).
* Get a full list of the malicious requests per any given API endpoint.
* Filter out only attacked APIs, sort them by number of hits.
* Filter APIs that consume and carry [sensitive data](#sensitive-data-detection).
* View visualized summary on your API inventory structure and problems on a handy [dashboard](api-discovery-dashboard.md).
* Understand which endpoints are [most likely](api-discovery-risk-score.md) to be an attack target.
* Find [shadow, orphan and zombie APIs](api-discovery-rogue.md).
* [Track changes](api-discovery-track-changes.md) in API that took place within the selected period of time.
* Provide your developers with access to the built API inventory reviewing and downloading.

## How does API Discovery work?

API Discovery relies on request statistics and uses sophisticated algorithms to generate up-to-date API specs based on the actual API usage.

### Traffic processing

API Discovery uses a hybrid approach to conduct analysis locally and in the Cloud. This approach enables a [privacy-first process](#security-of-data-uploaded-to-the-wallarm-cloud) where request data and sensitive data are kept locally while using the power of the Cloud for the statistics analysis:

1. API Discovery analyzes legitimate traffic locally. Wallarm analyzes the endpoints to which requests are made and what parameters are passed.
1. According to this data, statistics are made and sent to the Сloud.
1. Wallarm Cloud aggregates the received statistics and builds an [API description](api-discovery-use.md) on its basis.

    !!! info "Noise detection"
        Rare or single requests are [determined as noise](#noise-detection) and not included in the API inventory.

### Noise detection

The API Discovery module bases noise detection on the two major traffic parameters:

* Endpoint stability - at least 5 requests must be recorded within 5 minutes from the moment of the first request to the endpoint.
* Parameter stability - the occurrence of the parameter in requests to the endpoint must be more than 1 percent.

The API inventory will display the endpoints and parameters that exceeded these limits. The time required to build the complete API inventory depends on the traffic diversity and intensity. 

Also, the API Discovery performs filtering of requests relying on the other criteria:

* Only those requests to which the server responded in the 2xx range are processed.
* Requests that do not conform to the design principles of the REST API are not processed. This is done by controlling the `Content-Type` header parameter of responses: if the `Content-Type` parameter does not contain `application` as a type and `json` as a subtype, such request is considered to be non-REST API and is filtered out. Example of REST API response:  `Content-Type: application/json;charset=utf-8`. If the parameter does not exist, API Discovery analyzes the request.
* Standard fields such as `Accept` and alike are discarded.

### Sensitive data detection

API Discovery detects and highlights sensitive data (PII) consumed and carried by your APIs:

* Technical data like IP and MAC addresses
* Login credentials like secret keys and passwords
* Financial data like bank card numbers
* Medical data like medical license number
* Personally identifiable information (PII) like full name, passport number or SSN

### API inventory elements

The API inventory includes the following elements:

* API endpoints
* Request methods (GET, POST, and others)
* Required and optional GET, POST, and header parameters including:
    * [Type/format](#parameter-types-and-formats) of data sent in each parameter    
    * Date and time when parameter information was last updated

### Defining the format and data type in parameters

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

## Security of data uploaded to the Wallarm Cloud

API Discovery analyzes most of the traffic locally. The module sends to the Wallarm Cloud only the discovered endpoints, parameter names and various statistical data (time of arrival, their number, etc.) All data is transmitted via a secure channel: before uploading the statistics to the Wallarm Cloud, the API Discovery module hashes the values of request parameters using the [SHA-256](https://en.wikipedia.org/wiki/SHA-2) algorithm.

On the Cloud side, hashed data is used for statistical analysis (for example, when quantifying requests with identical parameters).

Other data (endpoint values, request methods, and parameter names) is not hashed before being uploaded to the Wallarm Cloud, because hashes cannot be restored to their original state which would make building API inventory impossible.

!!! warning "Important"
    Wallarm does not send the values that are specified in the parameters to the Cloud. Only the endpoint, parameter names and statistics on them are sent.

## Check API Discovery in playground

Before purchasing the [subscription plan](../about-wallarm/subscription-plans.md#subscription-plans) with API Discovery, you can preview sample data. To do so, in the **API Discovery** section, click **Explore in a playground**.

![API Discovery – Sample Data](../images/about-wallarm-waf/api-discovery/api-discovery-sample-data.png)
