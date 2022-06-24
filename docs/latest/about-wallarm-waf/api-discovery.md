# Discovering API structure

The **API Discovery** module of Wallarm API Security identifies your application API structure based on the actual API usage. The module continuously analyzes the structure and intensity of real traffic requests and builds the API structure based on the analysis results.

By default, the API Discovery module is [disabled](#enabling-and-configuring-api-discovery).

## Issues addressed by API Discovery

**Building an actual and complete API structure** is the main issue the API Discovery module is addressing.

Complex systems may use several APIs each maintained by a particular team using different approaches. Tools for some approaches automatically generate API structure based on the API code (for example, tools analyzing code annotations). In some approaches, no tools allow automated API structure generation, which is why teams build API structure manually.

In both cases, the built API structure may be outdated or incomplete, e.g. if a part of endpoints was not annotated or a part of API code was not manually processed.

Since the API Discovery module uses the real traffic as a data source, it helps to avoid the irrelevance and incompleteness of the API structure by including all endpoints actually processing the requests to the API structure.

**As you have your API structure discovered by Wallarm, you can**:

* Check [the list of parameters](../user-guides/api-discovery-ug.md#params) that are sent for the selected endpoint, including the following information:
    * Type of data sent in each parameter.
    * Date and time when parameter information was last updated.
* [Download](../user-guides/api-discovery-ug.md#download-openapi-specification-oas-for-your-api-structure) the discovered structure as `swagger.json` file in the OpenAPI v3 format and compare it with your own API structure description. You can discover:
    * The list of endpoints discovered by Wallarm, but absent in your specification (missing endpoints, also known as "Shadow API").
    * The list of endpoints presented in your specification but not discovered by Wallarm (endpoints that are not in use, also known as "Zombie API").
* Quickly [create a new rule](../user-guides/api-discovery-ug.md#api-structure-and-rules) for any discovered endpoint of API structure.
* See events related to some endpoint in one click.
* Copy URLs of the discovered endpoints.

## How API Discovery works?

API Discovery continuously unloads incoming requests data from the postanalytics module and analyzes the requests structure, intensity, and API responses. Rare or single requests are determined as noise and not included in the API structure. The analysis results in the statistics calculated for the structure, methods, and intensity of real traffic requests.

The API Discovery module uploads the calculated statistics to the Wallarm Cloud that generates the API structure based on received statistics and [visualizes](../user-guides/api-discovery-ug.md#api-structure-visualization) it in Wallarm Console.

The API structure includes the following elements:

* API endpoints
* Request methods (GET, POST, and others)
* Required and optional GET, POST, and header parameters including:
    * Type of data sent in each parameter

        This includes sensitive data of the following types:
        
        * Technical data like IP and MAC addresses
        * Login credentials like secret keys and passwords
        * Financial data like bank card numbers
        * Personally identifiable information (PII) like full name, passport number or SSN
    
    * Date and time when parameter information was last updated

Before purchasing the API Discovery subscription plan, you can preview sample data. To do so, in the **API Discovery** section, click **Explore in a playground**.

![!API Discovery – Sample Data](../images/about-wallarm-waf/api-discovery/api-discovery-sample-data.png)

API discovery is a continuous process therefore so the time required for complete API structure discovery depends on the traffic diversity and intensity. If you update the API and the traffic structure is adjusted, API Discovery updates the built API structure.

## Using built API structure

The API Discovery section provides many options for the build API structure usage.

![!Endpoints discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

These options are:

* Familiar format of API representation in a **Swagger-like manner**.
* Search and filters.
* Viewing endpoint parameters.
* Quick navigation to attacks and incidents related to some endpoint.
* Custom rule creation for the specific endpoint.
* [Downloading](../user-guides/api-discovery-ug.md#download-openapi-specification-oas-for-your-api-structure) OpenAPI specification (OAS) for your API structure as `swagger.json` file).

Learn more about available options from the [User guide](../user-guides/api-discovery-ug.md).

## Variability in paths of endpoints

URLs can include alternating elements, such as ID of user, like:

* `/api/articles/author/author-a-0001`
* `/api/articles/author/author-a-1401`
* `/api/articles/author/author-b-1401`

Based on the statistics, the **API Discovery** module unifies such addresses into the `{parameter_X}` format in the endpoint paths, so for the example above you will not have 3 endpoints, but instead there will be one:

* `/api/articles/author/{parameter_X}`

Click the endpoint to expand its parameters and view which type of pattern was found for this part of the address.

![!API Discovery - Variability in path](../images/about-wallarm-waf/api-discovery/api-discovery-variability-in-path.png)

Note that the algorithm analyzes the statistics continuously. If at some moment you see addresses, that contain the pattern but they are not unified yet, give it a time. As soon as more data arrives, the system will unify endpoints matching the newly found pattern with the appropriate amount on matching addresses.

## Security of data uploaded to the Wallarm Cloud

Before uploading the statistics to the Wallarm Cloud, the API Discovery module hashes the values of request parameters using the [SHA-256](https://en.wikipedia.org/wiki/SHA-2) algorithm. On the Cloud side, hashed data is used for statistical analysis (for example, when quantifying requests with identical parameters).

Other data (endpoint values, request methods, and parameter names) is not hashed before being uploaded to the Wallarm Cloud.

## Enabling and configuring API Discovery

The API Discovery package `wallarm-appstructure` is delivered with all forms of the [Wallarm node 3.0 and later](../admin-en/supported-platforms.md) including the CDN node but except for CloudLinux OS 6.x and Debian 11.x. The API Discovery module is installed from the `wallarm-appstructure` package automatically during the filtering node deployment process. By default, the module does not analyze the traffic.

To run API Discovery correctly:

1. Add the subscription plan for the **API Discovery** [module](../about-wallarm-waf/subscription-plans.md#modules). To add the subscription plan, please send a request to [sales@wallarm.com](mailto:sales@wallarm.com).
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
