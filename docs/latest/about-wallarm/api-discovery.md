# Discovering API inventory <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

The **API Discovery** module of the Wallarm platform [builds](#enabling-and-configuring-api-discovery) your application REST API inventory based on the actual API usage. The module continuously analyzes the real traffic requests and builds the API inventory based on the analysis results. This article gives an overview of **API Discovery**: issues addressed by it, its purpose and main possibilities.

For information on how to use the **API Discovery** module, refer to its [user guide](../user-guides/api-discovery.md).

## Issues addressed by API Discovery

**Building an actual and complete API inventory** is the main issue the API Discovery module is addressing.

Keeping API inventory up-to-date is a difficult task. There are multiple teams that use different APIs and it is a common case that different tools and processes are used to produce the API documentation. As a result, companies struggle in both understanding what APIs they have, what data they expose and having up-to-date API documentation.

Since the API Discovery module uses the real traffic as a data source, it helps to get up-to-date and complete API documentation by including to the API inventory all endpoints that are actually processing the requests.

**As you have your API inventory discovered by Wallarm, you can**:

* Have a full visibility into the whole API estate including the list of [external and internal](#external-and-internal-apis) APIs.
* See what data is [going into the APIs](../user-guides/api-discovery.md#params).
* Understand which endpoints are [most likely](#endpoint-risk-score) to be an attack target.
* View most attacked APIs for the last 7 days.
* Filter out only attacked APIs, sort them by number of hits.
* Filter APIs that consume and carry sensitive data.
* Find [shadow and orphan APIs](#shadow-and-orphan-apis).
* [Download](../user-guides/api-discovery.md#download-openapi-specification-oas-of-your-api-inventory) discovered endpoints as specification in the OpenAPI v3 format and compare with your own API specifications to find endpoints presented in your specifications but not discovered by Wallarm (endpoints that are not in use, also known as "Zombie API").
* [Track changes](#tracking-changes-in-api) in API that took place within the selected period of time.
* Quickly [create rules](../user-guides/api-discovery.md#api-inventory-and-rules) per any given API endpoint.
* Get a full list of the malicious requests per any given API endpoint.
* Provide your developers with access to the built API inventory reviewing and downloading.

## How API Discovery works?

API Discovery relies on request statistics and uses sophisticated algorithms to generate up-to-date API specs based on the actual API usage.

### Hybrid approach

API Discovery uses a hybrid approach to conduct analysis locally and in the Cloud. This approach enables a [privacy-first process](#security-of-data-uploaded-to-the-wallarm-cloud) where request data and sensitive data are kept locally while using the power of the Cloud for the statistics analysis:

1. API Discovery analyzes legitimate traffic locally. Wallarm analyzes the endpoints to which requests are made and what parameters are passed.
1. According to this data, statistics are made and sent to the Сloud.
1. Wallarm Cloud aggregates the received statistics and builds an [API description](../user-guides/api-discovery.md) on its basis.

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

### API inventory elements

The API inventory includes the following elements:

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

Before purchasing the [subscription plan](subscription-plans.md#subscription-plans) with API Discovery, you can preview sample data. To do so, in the **API Discovery** section, click **Explore in a playground**.

![!API Discovery – Sample Data](../images/about-wallarm-waf/api-discovery/api-discovery-sample-data.png)

## Using built API inventory

The **API Discovery** section provides many options for the build API inventory usage.

![!Endpoints discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

These options are:

* Search and filters.
* Ability to list internal and external APIs separately.
* Viewing endpoint parameters.
* Tracking changes in API.
* Quick navigation to attacks related to some endpoint.
* Custom rule creation for the specific endpoint.
* Downloading OpenAPI specification (OAS) for individual API endpoints and an entire API as `swagger.json` file.

Learn more about available options from the [User guide](../user-guides/api-discovery.md).

## Endpoint risk score

API Discovery automatically calculates a **risk score** for each endpoint in your API inventory. The risk score allows you to understand which endpoints are most likely to be an attack target and therefore should be the focus of your security efforts.

The risk score is made up of various factors, including:

* Presence of [**active vulnerabilities**](detecting-vulnerabilities.md) that may result in unauthorized data access or corruption.
* Ability to **upload files to the server** - endpoints are frequently targeted by [Remote Code Execution (RCE)](../attacks-vulns-list.md#remote-code-execution-rce) attacks, where files with malicious code are uploaded to a server. To secure these endpoints, uploaded file extensions and contents should be properly validated as recommended by the [OWASP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html).
* Presence of the [**variable path parts**](#variability-in-endpoints), such as user IDs, e.g. `/api/articles/author/{parameter_X}`. Attackers can manipulate object IDs and, in case of insufficient request authentication, either read or modify the object sensitive data ([**BOLA attacks**](../admin-en/configuration-guides/protecting-against-bola.md)).
* Presence of the parameters with [**sensitive data**](#api-inventory-elements) - rather than directly attacking APIs, attackers can steal sensitive data and use it to seamlessly reach your resources.
* A **large number of parameters** increasing the number of attack directions.
* **XML or JSON objects** passed in the endpoint request may be used by the attackers to transfer malicious XML external entities and injections to the server.

!!! info "Configuring risk score calculation"
    To adapt risk score estimation under your understanding of importance of factors, you can [configure](../user-guides/api-discovery.md#customizing-risk-score-calculation) the weight of each factor in risk score calculation and calculation method.

[Learn how to work with the risk score →](../user-guides/api-discovery.md#working-with-risk-score)

## Tracking changes in API

 If you update the API and the traffic structure is adjusted, API Discovery updates the built API inventory.

The company may have several teams, disparate programming languages, and a variety of language frameworks. Thus changes can come to API at any time from different sources which make them difficult to control. For security officers it is important to detect changes as soon as possible and analyze them. If missed, such changes may hold some risks, for example:

* The development team can start using a third-party library with a separate API and they do not notify the security specialists about that. This way the company gets endpoints that are not monitored and not checked for vulnerabilities. They can be potential attack directions.
* The PII data begin to be transferred to the endpoint. An unplanned transfer of PII can lead to a violation of compliance with the requirements of regulators, as well as lead to reputational risks.
* Important for the business logic endpoint (for example, `/login`, `/order/{order_id}/payment/`) is no longer called.
* Other parameters that should not be transferred, for example `is_admin` (someone accesses the endpoint and tries to do it with administrator rights) begin to be transferred to the endpoint.

With the **API Discovery** module of Wallarm you can:

* Track changes and check that they do not disrupt current business processes.
* Make sure that no unknown endpoints have appeared in the infrastructure that could be a potential threat vector.
* Make sure PII and other unexpected parameters did not start being transferred to the endpoints.
* Configure notifications about changes in your API via [triggers](../user-guides/triggers/trigger-examples.md#new-endpoints-in-your-api-inventory) with the **Changes in API** condition.

Learn how to work with the track changes feature in [User guide](../user-guides/api-discovery.md#tracking-changes-in-api).

## External and internal APIs

The endpoints accessible from the external network are the main attack directions. Thus, it is important to see what is available from the outside and pay attention to these endpoints in the first place.

Wallarm automatically splits discovered APIs to external and internal. The host with all its endpoints is considered to be internal if it is located on:

* A private IP or local IP address
* A generic top-level domain (for example: localhost, dashboard, etc.)

In the remaining cases the hosts are considered to be external.

By default, a list with all API hosts (external and internal) is displayed. In the built API inventory, you can view your internal and external APIs separately. To do this, click **External** or **Internal**.

## Variability in endpoints

URLs can include diverse elements, such as ID of user, like:

* `/api/articles/author/author-a-0001`
* `/api/articles/author/author-a-1401`
* `/api/articles/author/author-b-1401`

The **API Discovery** module unifies such elements into the `{parameter_X}` format in the endpoint paths, so for the example above you will not have 3 endpoints, but instead there will be one:

* `/api/articles/author/{parameter_X}`

Click the endpoint to expand its parameters and view which type was automatically detected for the diverse parameter.

![!API Discovery - Variability in path](../images/about-wallarm-waf/api-discovery/api-discovery-variability-in-path.png)

Note that the algorithm analyzes the new traffic. If at some moment you see addresses, that should be unified but this did not happen yet, give it a time. As soon as more data arrives, the system will unify endpoints matching the newly found pattern with the appropriate amount of matching addresses.

## Automatic BOLA protection

Behavioral attacks such as [Broken Object Level Authorization (BOLA)](../attacks-vulns-list.md#broken-object-level-authorization-bola) exploit the vulnerability of the same name. This vulnerability allows an attacker to access an object by its identifier via an API request and either read or modify its data bypassing an authorization mechanism.

Potential targets of the BOLA attacks are endpoints with variability. Wallarm can automatically discover and protect such endpoints among the ones explored by the **API Discovery** module.

To enable automatic BOLA protection, proceed to [Wallarm Console → **BOLA protection**](../user-guides/bola-protection.md) and turn the switch to the enabled state:

![!BOLA trigger](../images/user-guides/bola-protection/trigger-enabled-state.png)

Each protected API endpoint will be highlighted with the corresponding icon in the API inventory, e.g.:

![!BOLA trigger](../images/about-wallarm-waf/api-discovery/endpoints-protected-against-bola.png)

You can filter API endpoints by the BOLA auto protection state. The corresponding parameter is available under the **Others** filter.

## Shadow and orphan APIs

A **shadow API** refers to an undocumented API that exists within an organization's infrastructure without proper authorization or oversight. They put businesses at risk, as attackers can exploit them to gain access to critical systems, steal valuable data, or disrupt operations, further compounded by the fact that APIs often act as gatekeepers to critical data and that a range of OWASP API vulnerabilities can be exploited to bypass API security.

As you find shadow APIs with Wallarm, you can update your specifications to include missing endpoints and further perform monitoring and security activities towards your API inventory in its full view.

An **orphan API** refers to a documented API that does not receive traffic. The presence of orphan APIs can be a reason for a verification process. This involves:

* Inspecting the Wallarm traffic checking settings to understand whether the traffic is truly not being received, or if it is simply not visible to the Wallarm nodes because they were deployed in such a way that not all traffic passes through them (this may be incorrect traffic routing, or another Web Gateway is presented that was forgotten to put the node on, and so on).
* Determining whether certain applications should not receive any traffic at these specific endpoints or it is some kind of misconfiguration.
* Making decision on obsolete endpoints: used in previous application versions and not used in the current - should they be deleted from the specification to reduce security check effort.

The API Discovery module automatically uncovers shadow and orphan APIs by comparing the discovered API inventory with customers' provided specifications. You upload your API specifications in the [**API Specifications**](../user-guides/api-specifications.md) section and the module automatically highlights shadow and orphan endpoints.

![!API Discovery - highlighting and filtering shadow API](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-shadow-orphan.png)

* [Learn how to upload specifications for comparison to find shadow and orphan APIs →](../user-guides/api-specifications.md#revealing-shadow-and-orphan-api)
* [Learn how to display found shadow and orphan API in the API Discovery section →](../user-guides/api-discovery.md#displaying-shadow-api)

## Security of data uploaded to the Wallarm Cloud

API Discovery analyzes most of the traffic locally. The module sends to the Wallarm Cloud only the discovered endpoints, parameter names and various statistical data (time of arrival, their number, etc.) All data is transmitted via a secure channel: before uploading the statistics to the Wallarm Cloud, the API Discovery module hashes the values of request parameters using the [SHA-256](https://en.wikipedia.org/wiki/SHA-2) algorithm.

On the Cloud side, hashed data is used for statistical analysis (for example, when quantifying requests with identical parameters).

Other data (endpoint values, request methods, and parameter names) is not hashed before being uploaded to the Wallarm Cloud, because hashes cannot be restored to their original state which would make building API inventory impossible.

!!! warning "Important"
    Wallarm does not send the values that are specified in the parameters to the Cloud. Only the endpoint, parameter names and statistics on them are sent.

## Enabling and configuring API Discovery

The `wallarm-appstructure` package is included in all [forms](../installation/supported-deployment-options.md) of the Wallarm node except for the Debian 11.x and Ubuntu 22.04 packages. During node deployment, it installs the API Discovery module but keeps it disabled by default.

To enable and run API Discovery correctly:

1. Make sure your Wallarm node is of the [supported version](../updating-migrating/versioning-policy.md#version-list).

    To ensure that you always have access to the full range of the API Discovery features, it is recommended to check for updates to the `wallarm-appstructure` package on a regular basis as follows:


    === "Debian Linux"
        ```bash
        sudo apt update
        sudo apt install wallarm-appstructure
        ```
    === "RedHat Linux"
        ```bash
        sudo yum update
        sudo yum install wallarm-appstructure
        ```
1. Make sure your [subscription plan](subscription-plans.md#subscription-plans) includes **API Discovery**. To change the subscription plan, please send a request to [sales@wallarm.com](mailto:sales@wallarm.com).
1. If you want to enable API Discovery only for the selected applications, ensure that the applications are added as described in the [Setting up applications](../user-guides/settings/applications.md) article.

    If the applications are not configured, structures of all APIs are grouped in one tree.

1. Enable API Discovery for the required applications in Wallarm Console → **API Discovery** → **Configure API Discovery**.

    ![!API Discovery – Settings](../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

    !!! info "Access to API Discovery settings"
        Only administrators of your company Wallarm account can access the API Discovery settings. Contact your administrator if you do not have this access.

Once the API Discovery module is enabled, it will start the traffic analysis and API inventory building. The API inventory will be displayed in the **API Discovery** section of Wallarm Console.

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
