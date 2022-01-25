# Discovering API structure

The **API Discovery** module of Wallarm API Security identifies your application API structure based on the actual API usage. The module continuously analyzes the structure and intensity of real traffic requests and builds the API structure based on the analysis results.

By default, the API Discovery module is [disabled](#enabling-and-configuring-api-discovery).

## Issues addressed by API Discovery

**Building an actual and complete API structure** is the main issue the API Discovery module is addressing.

Complex systems may use several APIs each maintained by a particular team using different approaches. Tools for some approaches automatically generate API structure based on the API code (for example, tools analyzing code annotations). In some approaches, no tools allow automated API structure generation, which is why teams build API structure manually.

In both cases, the built API structure may be outdated or incomplete, e.g. if a part of endpoints was not annotated or a part of API code was not manually processed.

Since the API Discovery module uses the real traffic as a data source, it helps to avoid the irrelevance and incompleteness of the API structure by including all endpoints actually processing the requests to the API structure.

## How API Discovery works?

API Discovery continuously unloads incoming requests data from the postanalytics module and analyzes the requests structure, intensity, and API responses. Rare or single requests are determined as noise and not included in the API structure. The analysis results in the statistics calculated for the structure, methods, and intensity of real traffic requests.

The API Discovery module uploads the calculated statistics to the Wallarm Cloud that generates the API structure based on received statistics and [visualizes](#api-structure-visualization) it in Wallarm Console.

The API structure includes the following elements:

* API endpoints
* Request methods (GET, POST, and others)
* Required and optional GET, POST, and header parameters

API discovery is a continuous process therefore so the time required for complete API structure discovery depends on the traffic diversity and intensity. If you update the API and the traffic structure is adjusted, API Discovery updates the built API structure.

## Security of data uploaded to the Wallarm Cloud

Before uploading the statistics to the Wallarm Cloud, the API Discovery module hashes the values of request parameters using the [SHA-256](https://en.wikipedia.org/wiki/SHA-2) algorithm. On the Cloud side, hashed data is used for statistical analysis (for example, when quantifying requests with identical parameters).

Other data (endpoint values, request methods, and parameter names) is not hashed before being uploaded to the Wallarm Cloud.

## Enabling and configuring API Discovery

The API Discovery package `wallarm-appstructure` is delivered with all forms of the [Wallarm node 3.0 and later](../admin-en/supported-platforms.md) except for CloudLinux OS 6.x. The API Discovery module is installed from the `wallarm-appstructure` package automatically during the filtering node deployment process. By default, the module does not analyze the traffic.

To run API Discovery correctly:

1. If you want to enable API Discovery only for the selected applications, ensure that the applications are added as described in the [Setting up applications](../user-guides/settings/applications.md) article.

    If the applications are not configured, structures of all APIs are grouped in one tree.

2. Send a request to enable traffic analysis with API Discovery to the [Wallarm technical support](mailto:support@wallarm.com). You may request enabling API Discovery for all applications or only for selected applications. The request should include the following data:

    * Name of your company account registered in Wallarm Console.
    * Name of the [Wallarm Cloud](overview.md#cloud) being used.
    * If you want to enable API Discovery only for the selected applications, mention that requirement and list IDs of applications to be discovered. Application ID is displayed in the **Settings** → **[Applications](../user-guides/settings/applications.md)** section of Wallarm Console and it is the value of `wallarm_instance` at the same time.

Once the API Discovery module is enabled, it will start the traffic analysis and API structure building. The API structure will be displayed in the **API Discovery** section of Wallarm Console.

## API structure visualization

To provide users with familiar format of API representation, Wallarm visualizes the discovered API structure in a **swagger-like manner**.

The API structure includes the following elements (grouped by application and domain):

* The set of API endpoints discovered by API Discovery
* Methods of requests processed at API endpoints

![!Endpoints discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

You can filter the discovered API structure:

* Type in the search string for endpoint search.
* Use **Application**, **Domain** and **Method** filters.
* In the **Domains** panel, click application or domain.

By clicking the endpoint, you can also find the set of required and optional parameters that can be sent in a particular request part.

![!Request parameters discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-request-params.png)

If you need some endpoint URL, in this endpoint menu select **Copy URL**. You can use copied URL to use in filters in the **[Events](../user-guides/events/check-attack.md)** section of Wallarm Console.

## API structure and rules

You can quickly create a new [custom rule](../user-guides/rules/intro.md) from any endpoint of API structure: 

1. In this endpoint menu select **Create rule**. The create rule window is displayed. The endpoint address is parsed into the window automatically.
1. In the create rule window, specify rule information and then click **Create**.

![!Create rule from endpoint](../images/about-wallarm-waf/api-discovery/endpoint-create-rule.png)

## Download OpenAPI Specification (OAS) for your API structure

Click **Download OAS** to get a `swagger.json` file with the description of the API structure discovered by Wallarm. The description will be in the [OpenAPI v3 format](https://spec.openapis.org/oas/v3.0.0).

!!! info "Domain information in downloaded swagger file"
    If a discovered API structure contains several domains, endpoints from all domains will be included in the downloaded swagger file. Currently, the domain information is not included in the file.


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
