# Discovering API structure

The **API Discovery** module of Wallarm API Security identifies your application API structure based on the actual API usage. The module continuously analyzes the structure and intensity of requests from the real traffic and builds the API structure based on the analysis results.

API Discovery may help with the following issues:

* **API inventory**

    Complex systems may use several APIs, each of which has a different number of endpoints and is maintained by a particular team using different approaches. It can take a significant amount of resources to compile a list of all APIs and identify the structure of each API. API Discovery does it automatically based on the real application traffic allowing you to significantly reduce the cost of preparation for API inventory.

    Since API Discovery uses the real traffic as a data source, it also builds a more accurate and complete API structure. For example, API Discovery automatically identifies shadow APIs used in your system. Shadow APIs may be hidden from security tools and even from most parts of your team but handle requests. An attacker can gain unauthorized access to the system by making calls to shadow API that does not require request authentication and is vulnerable to attacks. The most reliable way to identify shadow APIs is to see what APIs are actually used based on the traffic and verify that they are protected from security threats.

* **Get up-to-date API structure**

    OpenAPI or another format of API structure description may miss some endpoints and quickly become outdated. The structure of some APIs can be undescribed at all. API Discovery helps to avoid the irrelevance and incompleteness of the API structure by using the real traffic as a source for API structure discovery.

By default, the API Discovery module is [disabled](#enabling-and-configuring-api-discovery).

## How API Discovery works?

API Discovery continuously unloads incoming requests data from the postanalytics module and analyzes the requests structure, intensity, and API behavior. Rare or single requests are determined as noise and not included in the API structure. The analysis results in the statistics calculated for the structure, types, and intensity of requests from the real traffic.

The API Discovery module uploads the calculated statistics to the Wallarm Cloud that generates the API structure based on received statistics and [visualizes](#api-structure-visualization) it in the Wallarm Console.

The API structure includes the following elements:

* API endpoints
* Request types (GET, POST, and others)
* Required and optional GET, POST, and header parameters

API discovery is a continuous process that is why the time required for complete API structure discovery depends on the traffic variety and intensity. If you update the API and the traffic structure is adjusted, API Discovery updates the built API structure.

## Security of data uploaded to the Wallarm Cloud

Before uploading the statistics to the Wallarm Cloud, the API Discovery module hashes the values of request parameters using the [SHA-256](https://en.wikipedia.org/wiki/SHA-2) algorithm. On the Cloud side, hashed data is used for statistical analysis (for example, when quantifying requests with identical parameters).

Other data is not hashed before uploading to the Wallarm Cloud since it does not pose a threat to your system and is required to visualize the API structure.

## Enabling and configuring API Discovery

The API Discovery package `wallarm-appstructure` is delivered with all forms of the [Wallarm node 3.0 and later](../admin-en/supported-platforms.md). The API Discovery module is installed from the `wallarm-appstructure` package automatically during the filtering node deployment process. By default, the module does not analyze the traffic.

To run API Discovery correctly:

1. If one or more Wallarm nodes filter the traffic of several applications or environments in your infrastructure, please ensure that each application or environment is assigned with the unique value of the [`wallarm_instance`](../admin-en/configure-parameters-en.md#wallarm_instance) directive.

    API Discovery uses the `wallarm_instance` value to identify the application the traffic is flowing to and build a separate API structure for each application. If the `wallarm_instance` directive is not configured, structures of all APIs are grouped in one tree.
2. Send a request to enable traffic analysis with API Discovery to the [Wallarm technical support](mailto:support@wallarm.com). The request should include the following data:

    * Name or ID of your company account registered in the Wallarm Console.
    * Name of the used [Wallarm Cloud](overview.md#cloud).
    * IDs of applications that should be discovered by API Discovery. Application ID is the value of `wallarm_instance`. To enable API Discovery for all applications, you do not need to send IDs of each application.

        Wallarm technical support will duplicate the applications records in the Wallarm Console → **Settings** → **Applications**. Each duplicate record will have the prefix `[API Discovery]`, application name, and a unique ID. For example, if enabling API Discovery for all applications, the list of applications in the Wallarm Console will look as follows:

        ![!Applications for API Discovery](../images/about-wallarm-waf/api-discovery/apps-for-api-discovery.png)

        Duplicate applications are used to split the API structure tree by applications and separate the API structure and custom ruleset trees in the **Profile & Rules** section.

Once the API Discovery module is enabled, it will start the traffic analysis and API structure building. The API structure will be displayed in the **Profile & Rules** section of the Wallarm Console.

## API structure visualization

The structure of each application API is displayed as a separate tree in the **Profile & Rules** section of the Wallarm Console.

In the title of each tree, the record name duplicating the application that uses the presented API structure is displayed. The name of the duplicating record has the format of `[API Discovery] <YOUR_APP_NAME>`. The API structure tree includes the following elements:

* The set of API endpoints discovered by API Discovery
* Types of requests processed at API endpoints

![!Endpoints discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

By clicking the endpoint, you can also find the set of required and optional parameters that can be sent in a particular request part.

![!Request parameters discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-request-params.png)

A [custom ruleset](../user-guides/rules/intro.md) created in the **Profile & Rules** section is displayed as a separate tree. The rules and API structure are not linked to each other.

## API Discovery debugging

To get and analyze the API Discovery logs, you can use the standard utility **journalctl** inside the instance with the installed Wallarm node:

```bash
journalctl -u wallarm-appstructure
```