# API Discovery Overview <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm's multi-protocol API Discovery continuously analyzes the real traffic requests and builds the API inventory (full picture of your active APIs) based on the analysis results.

## Supported protocols

API Discovery is capable of finding and representing hosts and endpoints utilizing different protocols. The following protocols are supported:

| Protocol | Core entity | Required [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) version | Required [Native Node](../installation/nginx-native-node-internals.md#native-node) version |
| --- | --- | --- | --- |
| **REST** | Endpoint | Any | Any |
| **GraphQL** | Operation (query, mutation, subscription) | 6.1.0 | NA |
| **SOAP** | Operation | 6.3.0 | NA |

## Your API inventory

API inventory is a picture of your active APIs automatically built by Wallarm's API Discovery based on traffic going through Wallarm nodes. It includes:

* API hosts and their endpoints
* Required and optional parameters and headers of requests and responses including:

    * Type and format of data sent in each parameter    
    * Date and time when parameter information was last updated

* Request methods (GET, POST, and others) for REST
* GraphQL operations (queries, mutations, subscriptions)
* GraphQL schema
* SOAP operations

![API Discovery - built API inventory](../images/about-wallarm-waf/api-discovery-2.0/api-discovery-built-inventory.png)

## Issues addressed by API Discovery

**Building an actual and complete API inventory** is the main issue the API Discovery module is addressing.

Keeping API inventory up-to-date is a difficult task. There is a high chance that one API is used by multiple teams and clients and it is a common case that different tools and processes are used to produce the API documentation. As a result, companies struggle in both understanding what APIs they have, what data they expose and having up-to-date API documentation.

Since the API Discovery module uses the real traffic as a data source, it helps to get up-to-date and complete API documentation by including to the API inventory all endpoints that are actually processing the requests.

**As you have your API inventory discovered by Wallarm, you can**:

* Have a full visibility into the whole API estate.
* See what data ([REST](exploring.md#rest-endpoint-details), [GraphQL](exploring.md#graphql-operation-details), [SOAP](exploring.md#soap-operation-details)) is going into and out of the APIs.
* Filter APIs that consume and carry [sensitive data](#sensitive-data-detection).
* Understand which endpoints are [most likely](risk-score.md) to be an attack target.
* [Track changes](track-changes.md) in API that took place within the selected period of time.
* Provide your developers with [access](../user-guides/settings/users.md#user-roles) to the built API inventory reviewing and downloading.
<!--* Get a list of the threats that occurred over the past 7 days per any given API endpoint.-->

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

* **Endpoint stability** - at least specific **number of requests** should be registered for the endpoint for it to be displayed by API Discovery AND and at least one of them must be outside the **timeframe**.

    This settings aim to avoid showing API entries, that had no traffic or had a traffic for a short timeframe only - they are considered unstable. Even if the specific endpoint was requested huge amount of times, but just within a short timeframe, there’s no need to consider this one-time spike as stable API endpoint.

    ![API Discovery - endpoint stability](../images/about-wallarm-waf/api-discovery/api-discovery-endpoint-stability.png)

* **Parameter stability** - the occurrence of the parameter in requests to the endpoint must be more than 1 percent.

Also, the API Discovery performs filtering of requests relying on the other criteria, described in the sections below. Note that the time required to build the complete API inventory depends on the traffic diversity and intensity.

#### Core filtering criteria

1. **HTTP status code validation** - only requests with server responses in the `2xx` range (`200`-`299`) are processed.
1. **HTTP method validation** - requests must use valid HTTP methods. The following is not processed: empty method, `OPTIONS`, `HEAD`.
1. **Host validation** - requests must not target localhost or loopback addresses. The following is not processed: `localhost`, `127.0.0.1`, IPv6 loopback addresses (`::1`, `0:0:0:0:0:0:0:1`, etc.)
1. **Path validation** - request paths must conform to valid patterns: `^[\w{}\s\-]+(?:[.@][\w{}\s\-]+)*$`. The following is not processed: paths containing CJK characters (Unicode range 0x3000-0x303F).
1. **File extension filtering** - requests with file extensions are filtered based on content type validation: when a path has an extension, the `Content-type` header validation becomes mandatory.
1. **Content-type header validation** - the `Content-type` header of response must be valid:

    * `text/xml`
    * `application/*json` (any JSON variant)
    * `application/octet-stream`
    * `application/*xml` (any XML variant)

    This type of validation is only performed if enabled (see [how to check](setup.md#general-api-discovery-settings)) by the Wallarm support team, except cases when presence of file extension in the path makes it mandatory. The necessity of this validation in noise reduction depends on the peculiarities of your traffic.

1. **Security filtering** - the following is not processed:

    * Requests with [attack types](../attacks-vulns-list.md)
    * Requests from DirBuster and similar scanners

#### Protocol-specific criteria

##### GraphQL

**Detection method**: analyzes request payload structure for GraphQL-specific patterns.
**Key indicators**:

* GraphQL structure in any HTTP valid request type (`GET`, `POST`)
* Operation types: `query`, `mutation`, `subscription`

**Response pattern**: only JSON object with structure `{"data":{}}`.

##### SOAP

**Detection method**: analyzes XML structure for SOAP envelope patterns.
**Key indicators**:

* XML structure with SOAP envelope
* Must contain proper SOAP namespace structure

**Requirements**:

* Must have SOAP envelope with proper namespace
* Must contain SOAP Body element
* Must have a method name as the final element

##### REST

**Detection method**: default fallback for requests that don't match other patterns.
**Key indicators**:

* Does not match GraphQL, SOAP
* Uses standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`, etc.)

#### Additional filtering criteria

1. **Multipart request filtering** - multipart requests with header parts are not processed.
1. **Base64 content filtering** - request points ending with "base64" are excluded.
1. **Empty value filtering** - request points with empty values are excluded in most contexts.

### Sensitive data detection

API Discovery [detects and highlights](sensitive-data.md) sensitive data consumed and carried by your APIs:

* Personally identifiable information (PII) like full name, passport number or SSN
* Login credentials like secret keys and passwords
* Financial data like bank card numbers
* Medical data like medical license number
* Technical data like IP and MAC addresses

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
    API Discovery does not send the parameter values to the Cloud. Only the endpoint, parameter names and statistics on them are sent.

## Checking API Discovery in playground

To try the module even before signing up and deploying the node to your environment, explore [API Discovery in Wallarm Playground](https://playground.wallarm.com/api-discovery/?utm_source=wallarm_docs_apid).

In Playground, you can access the API Discovery view like it is filled with real data and thus learn and try out how the module works, and get some useful examples of its usage in the read-only mode.

![API Discovery – Sample Data](../images/about-wallarm-waf/api-discovery/api-discovery-sample-data.png)

## Enabling API Discovery

To start using API Discovery, enable it as described in [API Discovery Setup](setup.md).
