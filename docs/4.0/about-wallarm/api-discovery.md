# Discovering API structure

The **API Discovery** module of Wallarm platform identifies your application REST API structure based on the actual API usage. The module continuously analyzes the real traffic requests and builds the API structure based on the analysis results.

By default, the API Discovery module is [disabled](#enabling-and-configuring-api-discovery).

## Issues addressed by API Discovery

**Building an actual and complete API structure** is the main issue the API Discovery module is addressing.

Keeping API inventory up-to-date is a difficult task. There are multiple teams that use different APIs and it is a common case that different tools and processes are used to produce the API documentation. As a result, companies struggle in both understanding what APIs they have, what data they expose and having an up-to-date API documentation.

Since the API Discovery module uses the real traffic as a data source, it helps to get up-to-date and complete API documentation by including to the API structure all endpoints that actually processing the requests.

**As you have your API structure discovered by Wallarm, you can**:

* Have a full visibility into the whole API estate including the list of [external and internal](#external-and-internal-apis) APIs.
* Understand what data is [going into the APIs](../user-guides/api-discovery.md#params).
* Filter APIs that consume and carry sensitive data.
* Have an up-to-data API structure with the option to [export it](../user-guides/api-discovery.md#download-openapi-specification-oas-for-your-api-structure) into the OpenAPI v3 to compare it with your own API structure description. You can discover:
    * The list of endpoints discovered by Wallarm, but absent in your specification (missing endpoints, also known as "Shadow API").
    * The list of endpoints presented in your specification but not discovered by Wallarm (endpoints that are not in use, also known as "Zombie API").
* [Track changes](#tracking-changes-in-api-structure) in API structure that took place within the selected period of time.
* Quickly [create rules](../user-guides/api-discovery.md#api-structure-and-rules) per any given API endpoint.
* Get full list of the malicious requests per any given API endpoint.
* Provide your developers with access to the build API structure reviewing and downloading.

## How API Discovery works?

API Discovery relies on request statistics and uses sophisticated algorithms to generate up-to-date API specs based on the actual API usage.

### Hybrid approach

API Discovery uses a hybrid approach to conduct analysis locally and in the Cloud. This approach enables a [privacy-first process](#security-of-data-uploaded-to-the-wallarm-cloud) where request data and sensitive data are kept locally while using the power of the Cloud for the statistics analysis:

1. API Discovery analyzes a legitimate traffic locally. Wallarm analyzes the endpoints to which requests are made and what parameters are passed.
1. According to this data, statistics are made and sent to the Сloud.
1. Wallarm Cloud aggregates the received statistics and builds an [API description](../user-guides/api-discovery.md#api-structure-visualization) on its basis.

    !!! info "Noise detection"
        Rare or single requests are [determined as noise](#noise-detection) and not included in the API structure.

### Noise detection

The API Discovery module bases noise detection on the two major traffic parameters:

* Endpoint stability - at least 5 requests must be recorded within 5 minutes from the moment of the first request to the endpoint.
* Parameter stability - the occurrence of the parameter in requests to the endpoint must be more than 1 percent.

The API structure will display the endpoints and parameters that exceeded these limits. The time required to build the complete API structure depends on the traffic diversity and intensity. 

Also, the API Discovery performs filtering of requests relying on the other criteria:

* Only those requests to which the server responded in the 2xx range are processed.
* Standard fields such as `Сontent-Type`, `Accept` and alike are discarded.

### API structure elements

The API structure includes the following elements:

* API endpoints
* Request methods (GET, POST, and others)
* Required and optional GET, POST, and header parameters including:
    * [Type/format](#parameter-types-and-formats) of data sent in each parameter
    * Presence and type of sensitive data (PII) transmitted by the parameter:
        
        * Technical data like IP and MAC addresses
        * Login credentials like secret keys and passwords
        * Financial data like bank card numbers
        * Medical data like medical license number
        * Personally identifiable information (PII) like full name, passport number or SSN
    
    * Date and time when parameter information was last updated

### Parameter types and formats

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

### Sample preview

Before purchasing the API Discovery subscription plan, you can preview sample data. To do so, in the **API Discovery** section, click **Explore in a playground**.

![!API Discovery – Sample Data](../images/about-wallarm-waf/api-discovery/api-discovery-sample-data.png)

## Using built API structure

The API Discovery section provides many options for the build API structure usage.

![!Endpoints discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

These options are:

* Familiar format of API representation in a **Swagger-like manner**.
* Search and filters.
* Ability to list internal and external APIs separately.
* Viewing endpoint parameters.
* Tracking changes in API structure.
* Quick navigation to attacks and incidents related to some endpoint.
* Custom rule creation for the specific endpoint.
* Downloading OpenAPI specification (OAS) for your API structure as `swagger.json` file.

Learn more about available options from the [User guide](../user-guides/api-discovery.md).

## Tracking changes in API structure

 If you update the API and the traffic structure is adjusted, API Discovery updates the built API structure.

The company may have several teams, disparate programming languages, and variety of language frameworks. Thus changes can come to API structure at any time from different sources which make them difficult to control. For security officers it is important to detect changes as soon as possible and analyze them. If missed, such changes may hold some risks, for example:

* The development team can start using a third-party library with a separate API and the do not notify the security specialists about that. This way the company gets endpoints that are not monitored and not checked for vulnerabilities. They can be potential attack directions.
* The PII data begin to be transferred to the endpoint. An unplanned transfer of PII can lead to a violation of compliance with the requirements of regulators, as well as lead to reputational risks.
* Important for the business logic endpoint (for example, `/login`, `/order/{order_id}/payment/`) is no longer called.
* Other parameters that should not be transferred, for example `is_admin` (someone accesses the endpoint and tries to do it with administrator rights) begin to be transferred to the endpoint.

With the **API Discovery** module of Wallarm you can:

* Track changes and check that they do not disrupt current business processes.
* Make sure that no unknown endpoints have appeared in the infrastructure that could be a potential threat vectors.
* Make sure PII and other unexpected parameters did not start being transferred to the endpoints.

Learn how to work with the track changes feature in [User guide](../user-guides/api-discovery.md#tracking-changes-in-api-structure).

## External and internal APIs

The endpoints accessible from the external network are the main attack directions. Thus, it is important to see what is available from the outside and pay attention to these endpoints in the first place.

Wallarm automatically splits discovered APIs to external and internal. The host with all its endpoints is considered to be internal if it is located on:

* A private IP or local IP address
* A generic top-level domain (for example: localhost, dashboard, etc.)

In the remaining cases the hosts are considered to be external.

By default, a list with all API hosts (external and internal) is displayed. In the built API structure, you can view your internal and external APIs separately. To do this, click **External** or **Internal**.

## Variability in endpoints

URLs can include alternating elements, such as ID of user, like:

* `/api/articles/author/author-a-0001`
* `/api/articles/author/author-a-1401`
* `/api/articles/author/author-b-1401`

The **API Discovery** module unifies such elements into the `{parameter_X}` format in the endpoint paths, so for the example above you will not have 3 endpoints, but instead there will be one:

* `/api/articles/author/{parameter_X}`

Click the endpoint to expand its parameters and view which type was automatically detected for the alternating parameter.

![!API Discovery - Variability in path](../images/about-wallarm-waf/api-discovery/api-discovery-variability-in-path.png)

Note that the algorithm analyzes the new traffic. If at some moment you see addresses, that should be unified but this did not happen yet, give it a time. As soon as more data arrives, the system will unify endpoints matching the newly found pattern with the appropriate amount on matching addresses.

## Security of data uploaded to the Wallarm Cloud

API Discovery analyzes most of the traffic locally. The module sends to the Wallarm Cloud only the discovered endpoints, parameter names and various statistical data (time of arrival, their number, etc.) All data is transmitted via a secure channel: before uploading the statistics to the Wallarm Cloud, the API Discovery module hashes the values of request parameters using the [SHA-256](https://en.wikipedia.org/wiki/SHA-2) algorithm.

On the Cloud side, hashed data is used for statistical analysis (for example, when quantifying requests with identical parameters).

Other data (endpoint values, request methods, and parameter names) is not hashed before being uploaded to the Wallarm Cloud, because hashes cannot be restored to their original state which would make building API structure impossible.

!!! warning "Important"
    Wallarm does not send the values that are specified in the parameters to the Cloud. Only the endpoint, parameter names and statistics on them are sent.

## Enabling and configuring API Discovery

The API Discovery package `wallarm-appstructure` is delivered with all forms of the [Wallarm node 3.2 and later](../admin-en/supported-platforms.md) including the CDN node but except for CloudLinux 6.x and Debian 11.x. The API Discovery module is installed from the `wallarm-appstructure` package automatically during the filtering node deployment process. By default, the module does not analyze the traffic.

To run API Discovery correctly:

1. Add the subscription plan for the **API Discovery** [module](../about-wallarm/subscription-plans.md#modules). To add the subscription plan, please send a request to [sales@wallarm.com](mailto:sales@wallarm.com).
1. If you want to enable API Discovery only for the selected applications, ensure that the applications are added as described in the [Setting up applications](../user-guides/settings/applications.md) article.

    If the applications are not configured, structures of all APIs are grouped in one tree.

1. Enable API Discovery for the required applications in Wallarm Console → **Settings** → **API Discovery** (also accessible by clicking **Configure API Discovery** at the built structure page).

    ![!API Discovery – Settings](../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

    !!! info "Access to API Discovery settings"
        Only administrators of your company Wallarm account can access the API Discovery settings. Contact your administrator if you do not have this access.

Once the API Discovery module is enabled, it will start the traffic analysis and API structure building. The API structure will be displayed in the **API Discovery** section of Wallarm Console.

## API Discovery debugging

To get and analyze the API Discovery logs, you can use the following methods:

* If the Wallarm node is installed from source packages: run the standard utility **journalctl** or **systemctl** inside the instance.

    === "journalctl"
        ```bash
        journalctl -u wallarm-appstructure
        ```
    === "systemctl"
        ```bash
        systemctl status wallarm-appstructure
        ```
* If the Wallarm node is deployed from the Docker container: read the log file `/var/log/wallarm/appstructure.log` inside the container.
* If the Wallarm node is deployed as the Kubernetes Ingress controller: check the status of the pod running the Tarantool and `wallarm-appstructure` containers. The pod status must be **Running**.

    ```bash
    kubectl get po -l app=nginx-ingress,component=controller-wallarm-tarantool
    ```

    Read the logs of the `wallarm-appstructure` container:

    ```bash
    kubectl logs -l app=nginx-ingress,component=controller-wallarm-tarantool -c wallarm-appstructure
    ```
