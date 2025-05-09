# API Discovery Overview <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm's **API Discovery** builds your application **REST** and **GraphQL** API inventory based on the actual API usage. The module continuously analyzes the real traffic requests and builds the API inventory based on the analysis results.

Requires NGINX Node 6.1.0 or Native Node TBD or higher.

The built API inventory includes the following elements:

* For all protocols:

    * API hosts and their endpoints
    * Required and optional parameters and headers of requests and responses including:

        * [Type/format](./exploring.md#format-and-data-type) of data sent in each parameter    
        * Date and time when parameter information was last updated

* For REST:

    * Request methods (GET, POST, and others)

* For GraphQL:

    * Operations (queries, mutations, subscriptions)
    * GraphQL schema

![API Discovery - built API inventory](../images/about-wallarm-waf/api-discovery-2.0/api-discovery-built-inventory.png)


## Issues addressed by API Discovery

**Building an actual and complete API inventory** is the main issue the API Discovery module is addressing.

Keeping API inventory up-to-date is a difficult task. There are multiple teams that use different APIs and it is a common case that different tools and processes are used to produce the API documentation. As a result, companies struggle in both understanding what APIs they have, what data they expose and having up-to-date API documentation.

Since the API Discovery module uses the real traffic as a data source, it helps to get up-to-date and complete API documentation by including to the API inventory all endpoints that are actually processing the requests.

**As you have your API inventory discovered by Wallarm, you can**:

* Have a full visibility into the whole API estate.
* See what data ([REST](exploring.md#rest-endpoint-details), [GraphQL](exploring.md#graphql-operation-details)) is going into and out of the APIs.
* Get a list of endpoints with the open vulnerabilities.
* Get a list of the threats that occurred over the past 7 days per any given API endpoint.
* Filter APIs that consume and carry [sensitive data](#sensitive-data-detection).
* Understand which endpoints are [most likely](risk-score.md) to be an attack target.
* [Track changes](track-changes.md) in API that took place within the selected period of time.
* Provide your developers with [access](../user-guides/settings/users.md#user-roles) to the built API inventory reviewing and downloading.

## How does API Discovery work?

API Discovery relies on request statistics and uses sophisticated algorithms to generate up-to-date API specs based on the actual API usage.

### Traffic processing

API Discovery uses a hybrid approach to conduct analysis locally and in the Cloud. This approach enables a [privacy-first process](#security-of-data-uploaded-to-the-wallarm-cloud) where request data and sensitive data are kept locally while using the power of the Cloud for the statistics analysis:

1. API Discovery analyzes legitimate traffic locally. Wallarm analyzes the endpoints to which requests are made and what parameters are passed and returned.
1. According to this data, statistics are made and sent to the Cloud.
1. Wallarm Cloud aggregates the received statistics and builds an [API description](exploring.md) on its basis.

    !!! info "Noise detection"
        Rare or single requests are [determined as noise](#noise-detection) and not included in the API inventory.

### Noise detection

The API Discovery module bases noise detection on the two major traffic parameters:

* Endpoint stability - at least 5 requests must be recorded within 5 minutes from the moment of the first request to the endpoint.
* Parameter stability - the occurrence of the parameter in requests to the endpoint must be more than 1 percent.

The API inventory will display the endpoints and parameters that exceeded these limits. The time required to build the complete API inventory depends on the traffic diversity and intensity. 

Also, the API Discovery performs filtering of requests relying on the other criteria:

* Only those requests to which the server responded in the 2xx range are processed.
* Requests that do not conform to the design principles of the REST or GraphQL API are not processed.
    
    For REST, this is done by controlling the `Content-Type` header of responses: if it does not contain `application/json` (like `Content-Type: application/json;charset=utf-8`), the request is considered to be a non-REST API and is not analyzed. If the header does not exist, API Discovery analyzes the request.

* Standard fields such as `Accept` and alike are discarded.

### Sensitive data detection

API Discovery [detects and highlights](sensitive-data.md) sensitive data consumed and carried by your APIs:

* Technical data like IP and MAC addresses
* Login credentials like secret keys and passwords
* Financial data like bank card numbers
* Medical data like medical license number
* Personally identifiable information (PII) like full name, passport number or SSN

### Sensitive business flows

With the [sensitive business flow](sbf.md) capability, API Discovery can automatically identify endpoints that are critical to specific business flows and functions, such as authentication, account management, billing, and similar critical capabilities.

In addition to automatic identification, you can manually adjust the assigned sensitive business flow tags and manually set tags for the endpoints of your choice.

Once endpoints are assigned with the sensitive business flow tags, it becomes possible to filter all discovered endpoint by a specific business flow which makes it easier on protecting the most critical business capabilities.

![API Discovery - Filtering by sensitive business flows](../images/about-wallarm-waf/api-discovery-2.0/api-discovery-sbf-filter.png)

### Security of data uploaded to the Wallarm Cloud

API Discovery analyzes most of the traffic locally. The module sends to the Wallarm Cloud only the discovered endpoints, parameter names and various statistical data (time of arrival, their number, etc.) All data is transmitted via a secure channel: before uploading the statistics to the Wallarm Cloud, the API Discovery module hashes the values of request parameters using the [SHA-256](https://en.wikipedia.org/wiki/SHA-2) algorithm.

On the Cloud side, hashed data is used for statistical analysis (for example, when quantifying requests with identical parameters).

Other data (endpoint values, request methods, and parameter names) is not hashed before being uploaded to the Wallarm Cloud, because hashes cannot be restored to their original state which would make building API inventory impossible.

!!! warning "Important"
    Wallarm does not send the values that are specified in the parameters to the Cloud. Only the endpoint, parameter names and statistics on them are sent.

## Enabling API Discovery

To start using API Discovery, enable it as described in [API Discovery Setup](setup.md).
