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

1. Ensure that the unique value of the [`wallarm_instance`](../admin-en/configure-parameters-en.md#wallarm_instance) directive is assigned to each application or environment for which you want to build the API structure.

    For example, to enable the API Discovery module for `example.com` and `test.com`, the `wallarm_istance` directives should be added in the appropriate `server` blocks of NGINX configuration:

    ```bash
    server {
        listen       80;
        server_name  example.com;
        wallarm_mode block;
        wallarm_instance 13;
        
        ...
    }
    
    server {
        listen       80;
        server_name  test.com;
        wallarm_mode monitoring;
        wallarm_instance 14;
        
        ...
    }
    ```
    API Discovery uses the `wallarm_instance` value to identify the application the traffic is flowing to and build a separate API structure for each application. If the `wallarm_instance` directive is not configured, structures of all APIs are grouped in one tree.
2. Send a request to enable traffic analysis with API Discovery to the [Wallarm technical support](mailto:support@wallarm.com). The request should include the following data:

    * Name of your company account registered in Wallarm Console.
    * Name of the [Wallarm Cloud](overview.md#cloud) being used.

Once the API Discovery module is enabled, it will start the traffic analysis and API structure building. The API structure will be displayed in the **API Discovery** section of Wallarm Console.

## API structure visualization

The structure of each application API is displayed as a separate tree in the **API Discovery** section of Wallarm Console. Each application tree is organized like follows:

* `Application name`
    * `Domain 01`
    * ...
    * `Domain XX`

The API structure includes the following elements (grouped by domain):

* The set of API endpoints discovered by API Discovery
* Methods of requests processed at API endpoints

![!Endpoints discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

By clicking the endpoint, you can also find the set of required and optional parameters that can be sent in a particular request part.

![!Request parameters discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-request-params.png)

You can filter the discovered API structure:

* Type in the search string.
* Use **Application**, **Domain** and **Method** filters.
* In the **Domain** list, click application or domain.

If you need some endpoint URL, in this endpoint string, click down arrow and then from the menu select **Copy URL**.

## API structure and rules

Currently API structure tree and a [custom ruleset](../user-guides/rules/intro.md) tree created in the **Rules** section are not linked to each other.

You can create new rule from any endpoint of API structure: 

1. In the endpoint string, click down arrow and then from the menu select **Create rule**. The create rule dialog is displayed. The endpoint address is parsed into the dialog automatically.
1. In the create rule dialog, specify rule information and then click **Create**.

## Download OpenAPI Specification (OAS) for your API structure

Click **Download OAS** to get a `swagger.json` file with your API structure description. The description will be in the OpenAPI v3 format.

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
